-- Step 7: Folders Table
CREATE TABLE folders (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name          TEXT        NOT NULL,
  icon          TEXT,
  description   TEXT,
  sort_order    SMALLINT    NOT NULL DEFAULT 0,
  upload_roles  TEXT[]      NOT NULL DEFAULT ARRAY['admin', 'team_member'],
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_folders_project ON folders(project_id);
