-- Spec 25: Production & Video Generation Trackers
-- Replaces the team's spreadsheet tracking with fully automated tables:
-- rows are created/updated by triggers off project_assignments, projects,
-- and files — no manual data entry required for standard tracking.

-- 1. Enum types
CREATE TYPE tracker_status   AS ENUM ('pending', 'in_progress', 'revision_pending', 'completed', 'paused');
CREATE TYPE tracker_priority AS ENUM ('P1', 'P2', 'P3');

-- 2. Tables
CREATE TABLE production_deliverables (
  id               UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id       UUID            NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  brand_name       TEXT            NOT NULL,
  deliverable_type TEXT            NOT NULL,
  details          TEXT,
  assets_location  TEXT,
  status           tracker_status  NOT NULL DEFAULT 'pending',
  comments         TEXT,
  pending_with_id  UUID            REFERENCES profiles(id),
  delivery_date    DATE,
  priority         tracker_priority NOT NULL DEFAULT 'P3',
  completed_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  UNIQUE (project_id)
);

CREATE TABLE video_generation_tasks (
  id               UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id       UUID            NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  brand_name       TEXT            NOT NULL,
  content_type     TEXT            NOT NULL,
  script_number    SMALLINT        NOT NULL DEFAULT 1,
  assigned_to_id   UUID            REFERENCES profiles(id),
  assigned_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  completed_at     TIMESTAMPTZ,
  status           tracker_status  NOT NULL DEFAULT 'in_progress',
  checks_performed TEXT[]          NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE TRIGGER production_deliverables_updated_at
  BEFORE UPDATE ON production_deliverables
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER video_generation_tasks_updated_at
  BEFORE UPDATE ON video_generation_tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 3. Helper functions

-- Counts occurrences like "13 images" / "2 videos" in free-text package/description.
CREATE OR REPLACE FUNCTION extract_unit_count(p_text TEXT, p_unit_pattern TEXT)
RETURNS INT AS $$
DECLARE
  m TEXT[];
BEGIN
  IF p_text IS NULL OR p_text = '' THEN RETURN 0; END IF;
  m := regexp_match(p_text, '(\d+)\s*' || p_unit_pattern, 'i');
  IF m IS NULL THEN RETURN 0; END IF;
  RETURN m[1]::INT;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION build_deliverable_details(p_package TEXT, p_description TEXT)
RETURNS TEXT AS $$
DECLARE
  src    TEXT := COALESCE(p_package, '') || ' ' || COALESCE(p_description, '');
  images INT  := extract_unit_count(src, 'images?');
  videos INT  := extract_unit_count(src, 'videos?');
  parts  TEXT[] := '{}';
BEGIN
  IF images > 0 THEN parts := array_append(parts, images || ' images'); END IF;
  IF videos > 0 THEN parts := array_append(parts, videos || ' videos'); END IF;
  IF array_length(parts, 1) IS NULL THEN
    RETURN COALESCE(p_package, 'Deliverables TBD');
  END IF;
  RETURN array_to_string(parts, ', ');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- <3 days -> P1, 3-7 days -> P2, >7 days (or no deadline) -> P3
CREATE OR REPLACE FUNCTION recalculate_priority(p_deadline DATE)
RETURNS tracker_priority AS $$
DECLARE
  days_left INT;
BEGIN
  IF p_deadline IS NULL THEN RETURN 'P3'; END IF;
  days_left := p_deadline - CURRENT_DATE;
  IF days_left < 3 THEN RETURN 'P1'; END IF;
  IF days_left <= 7 THEN RETURN 'P2'; END IF;
  RETURN 'P3';
END;
$$ LANGUAGE plpgsql STABLE;

-- 4. Automation triggers

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

CREATE TRIGGER on_project_assignment_created
  AFTER INSERT ON project_assignments
  FOR EACH ROW EXECUTE FUNCTION auto_create_tracker_items();

CREATE OR REPLACE FUNCTION sync_trackers_on_project_updates()
RETURNS TRIGGER AS $$
DECLARE
  v_delivery_date DATE;
BEGIN
  IF NEW.name IS DISTINCT FROM OLD.name THEN
    UPDATE production_deliverables SET brand_name = NEW.name WHERE project_id = NEW.id;
    UPDATE video_generation_tasks  SET brand_name = NEW.name WHERE project_id = NEW.id;
  END IF;

  IF NEW.internal_deadline IS DISTINCT FROM OLD.internal_deadline
     OR NEW.client_deadline IS DISTINCT FROM OLD.client_deadline THEN
    v_delivery_date := COALESCE(NEW.internal_deadline::date, NEW.client_deadline);
    UPDATE production_deliverables
    SET delivery_date = v_delivery_date, priority = recalculate_priority(v_delivery_date)
    WHERE project_id = NEW.id;
  END IF;

  IF NEW.package IS DISTINCT FROM OLD.package OR NEW.description IS DISTINCT FROM OLD.description THEN
    UPDATE production_deliverables
    SET details = build_deliverable_details(NEW.package, NEW.description)
    WHERE project_id = NEW.id;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'completed' THEN
      UPDATE production_deliverables SET status = 'completed', completed_at = NOW() WHERE project_id = NEW.id;
      UPDATE video_generation_tasks  SET status = 'completed', completed_at = NOW() WHERE project_id = NEW.id;
    ELSIF NEW.status = 'paused' THEN
      UPDATE production_deliverables SET status = 'paused' WHERE project_id = NEW.id;
      UPDATE video_generation_tasks  SET status = 'paused' WHERE project_id = NEW.id;
    ELSIF OLD.status IN ('completed', 'paused') THEN
      UPDATE production_deliverables SET status = 'in_progress', completed_at = NULL WHERE project_id = NEW.id;
      UPDATE video_generation_tasks  SET status = 'in_progress', completed_at = NULL WHERE project_id = NEW.id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_project_updated_sync_trackers
  AFTER UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION sync_trackers_on_project_updates();

CREATE OR REPLACE FUNCTION sync_assets_on_file_uploads()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE production_deliverables
  SET assets_location = CASE
    WHEN assets_location IS NULL OR assets_location = '' THEN NEW.file_url
    ELSE assets_location || ', ' || NEW.file_url
  END
  WHERE project_id = NEW.project_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_file_uploaded_sync_assets
  AFTER INSERT ON files
  FOR EACH ROW EXECUTE FUNCTION sync_assets_on_file_uploads();

-- 5. RLS
ALTER TABLE production_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_generation_tasks  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "production_deliverables: admin all"
  ON production_deliverables FOR ALL
  USING (is_admin());

CREATE POLICY "production_deliverables: team select all"
  ON production_deliverables FOR SELECT
  USING (get_user_role() = 'team_member');

CREATE POLICY "production_deliverables: team update own"
  ON production_deliverables FOR UPDATE
  USING (get_user_role() = 'team_member' AND pending_with_id = auth.uid())
  WITH CHECK (get_user_role() = 'team_member' AND pending_with_id = auth.uid());

CREATE POLICY "video_generation_tasks: admin all"
  ON video_generation_tasks FOR ALL
  USING (is_admin());

CREATE POLICY "video_generation_tasks: team select all"
  ON video_generation_tasks FOR SELECT
  USING (get_user_role() = 'team_member');

CREATE POLICY "video_generation_tasks: team update own"
  ON video_generation_tasks FOR UPDATE
  USING (get_user_role() = 'team_member' AND assigned_to_id = auth.uid())
  WITH CHECK (get_user_role() = 'team_member' AND assigned_to_id = auth.uid());

-- 6. Indexes
CREATE INDEX idx_production_deliverables_project ON production_deliverables(project_id);
CREATE INDEX idx_production_deliverables_pending  ON production_deliverables(pending_with_id);
CREATE INDEX idx_production_deliverables_status   ON production_deliverables(status);

CREATE INDEX idx_video_generation_tasks_project  ON video_generation_tasks(project_id);
CREATE INDEX idx_video_generation_tasks_assignee ON video_generation_tasks(assigned_to_id);
CREATE INDEX idx_video_generation_tasks_status   ON video_generation_tasks(status);
