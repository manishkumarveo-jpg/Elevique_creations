-- Spec 30: Production Deliverable Assignees
-- production_deliverables has UNIQUE(project_id), so the auto-create trigger
-- only ever created the deliverable once and bound it to the first assigned
-- team member (pending_with_id). Subsequent project_assignments for the same
-- project were silently dropped from the tracker. This adds a join table so
-- a single deliverable can carry every assigned team member, and backfills
-- the assignees that were lost for already-assigned projects.

CREATE TABLE production_deliverable_assignees (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  deliverable_id UUID        NOT NULL REFERENCES production_deliverables(id) ON DELETE CASCADE,
  user_id        UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (deliverable_id, user_id)
);

CREATE INDEX idx_pda_deliverable ON production_deliverable_assignees(deliverable_id);
CREATE INDEX idx_pda_user        ON production_deliverable_assignees(user_id);

-- Backfill: every team member currently assigned to a project becomes an
-- assignee on that project's existing production deliverable.
INSERT INTO production_deliverable_assignees (deliverable_id, user_id)
SELECT pd.id, pa.user_id
FROM production_deliverables pd
JOIN project_assignments pa ON pa.project_id = pd.project_id
ON CONFLICT (deliverable_id, user_id) DO NOTHING;

-- Re-create the auto-create trigger function so every project_assignments
-- insert (not just the first) adds the assigned user to the deliverable.
CREATE OR REPLACE FUNCTION auto_create_tracker_items()
RETURNS TRIGGER AS $$
DECLARE
  v_project      projects%ROWTYPE;
  v_src          TEXT;
  v_images       INT;
  v_videos       INT;
  v_deliverable_type TEXT;
  v_delivery_date DATE;
  i              INT;
BEGIN
  SELECT * INTO v_project FROM projects WHERE id = NEW.project_id;

  v_delivery_date := COALESCE(v_project.internal_deadline::date, v_project.client_deadline);
  v_src    := COALESCE(v_project.package, '') || ' ' || COALESCE(v_project.description, '');
  v_images := extract_unit_count(v_src, 'images?');
  v_videos := extract_unit_count(v_src, 'videos?');
  v_deliverable_type := CASE
    WHEN v_videos > 0 AND v_images > 0 THEN 'Mixed'
    WHEN v_videos > 0 THEN 'Video'
    WHEN v_images > 0 THEN 'Image'
    ELSE 'General'
  END;

  INSERT INTO production_deliverables (
    project_id, brand_name, deliverable_type, details, status, pending_with_id, delivery_date, priority
  )
  VALUES (
    v_project.id, v_project.name, v_deliverable_type,
    build_deliverable_details(v_project.package, v_project.description),
    'pending', NEW.user_id, v_delivery_date, recalculate_priority(v_delivery_date)
  )
  ON CONFLICT (project_id) DO NOTHING;

  INSERT INTO production_deliverable_assignees (deliverable_id, user_id)
  SELECT id, NEW.user_id FROM production_deliverables WHERE project_id = NEW.project_id
  ON CONFLICT (deliverable_id, user_id) DO NOTHING;

  IF v_videos > 0 THEN
    FOR i IN 1..v_videos LOOP
      INSERT INTO video_generation_tasks (
        project_id, brand_name, content_type, script_number, assigned_to_id, status
      )
      VALUES (v_project.id, v_project.name, 'Video', i, NEW.user_id, 'in_progress');
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Team members can update a deliverable if they're any of its assignees,
-- not just the original pending_with_id.
DROP POLICY "production_deliverables: team update own" ON production_deliverables;

CREATE POLICY "production_deliverables: team update own"
  ON production_deliverables FOR UPDATE
  USING (
    get_user_role() = 'team_member'
    AND EXISTS (
      SELECT 1 FROM production_deliverable_assignees pda
      WHERE pda.deliverable_id = production_deliverables.id AND pda.user_id = auth.uid()
    )
  )
  WITH CHECK (
    get_user_role() = 'team_member'
    AND EXISTS (
      SELECT 1 FROM production_deliverable_assignees pda
      WHERE pda.deliverable_id = production_deliverables.id AND pda.user_id = auth.uid()
    )
  );

ALTER TABLE production_deliverable_assignees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "production_deliverable_assignees: admin all"
  ON production_deliverable_assignees FOR ALL
  USING (is_admin());

CREATE POLICY "production_deliverable_assignees: team select all"
  ON production_deliverable_assignees FOR SELECT
  USING (get_user_role() = 'team_member');
