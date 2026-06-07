-- Migration 17: project_revisions
-- Replaces the single projects.client_note field with an
-- append-only thread of revision requests per project.
-- projects.client_note is intentionally left in place (orphaned).

CREATE TABLE project_revisions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  submitted_by UUID        NOT NULL REFERENCES profiles(id),
  note         TEXT        NOT NULL,
  status       TEXT        NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  resolved_by  UUID        REFERENCES profiles(id),
  resolved_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_project_revisions_project_id
  ON project_revisions(project_id, created_at DESC);

ALTER TABLE project_revisions ENABLE ROW LEVEL SECURITY;

-- Admin: full access (also covered by service_role key in server actions)
CREATE POLICY "revisions: admin all"
  ON project_revisions FOR ALL
  USING (is_admin());

-- Team member: read if assigned to the project
CREATE POLICY "revisions: team member select"
  ON project_revisions FOR SELECT
  USING (get_user_role() = 'team_member' AND is_assigned_to_project(project_id));

-- Client: read own project's revisions
CREATE POLICY "revisions: client select"
  ON project_revisions FOR SELECT
  USING (get_user_role() = 'client' AND is_project_client(project_id));

-- Client: insert only (append-only, no updates/deletes)
CREATE POLICY "revisions: client insert"
  ON project_revisions FOR INSERT
  WITH CHECK (
    get_user_role() = 'client'
    AND is_project_client(project_id)
    AND submitted_by = auth.uid()
  );
