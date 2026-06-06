-- Step 4: Projects Table
CREATE TABLE projects (
  id           UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT           NOT NULL,
  client_id    UUID           NOT NULL REFERENCES profiles(id),
  package      TEXT,
  status       project_status NOT NULL DEFAULT 'briefing',
  deadline     DATE,
  description  TEXT,
  created_by   UUID           NOT NULL REFERENCES profiles(id),
  is_archived  BOOLEAN        NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_projects_client    ON projects(client_id)  WHERE is_archived = FALSE;
CREATE INDEX idx_projects_status    ON projects(status)     WHERE is_archived = FALSE;
CREATE INDEX idx_projects_created   ON projects(created_at DESC);
