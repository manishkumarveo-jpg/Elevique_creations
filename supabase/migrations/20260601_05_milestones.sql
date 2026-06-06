-- Step 6: Milestones Table
CREATE TABLE milestones (
  id             UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id     UUID             NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase_number   SMALLINT         NOT NULL,
  phase_name     TEXT             NOT NULL,
  status         milestone_status NOT NULL DEFAULT 'pending',
  scheduled_date DATE,
  completed_date DATE,
  notes          TEXT,
  updated_by     UUID             REFERENCES profiles(id),
  created_at     TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, phase_number)
);

CREATE TRIGGER milestones_updated_at
  BEFORE UPDATE ON milestones
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_milestones_project ON milestones(project_id);
