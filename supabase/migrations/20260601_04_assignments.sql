-- Step 5: Project Assignments Table
CREATE TABLE project_assignments (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id       UUID        NOT NULL REFERENCES projects(id)  ON DELETE CASCADE,
  user_id          UUID        NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  role_on_project  TEXT        NOT NULL DEFAULT 'contributor',
  assigned_by      UUID        NOT NULL REFERENCES profiles(id),
  assigned_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, user_id)
);

CREATE INDEX idx_assignments_user    ON project_assignments(user_id);
CREATE INDEX idx_assignments_project ON project_assignments(project_id);
