-- Step 9: Deliverables Table
CREATE TABLE deliverables (
  id                UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id        UUID               NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_id           UUID               REFERENCES files(id),
  deliverable_type  deliverable_type   NOT NULL,
  file_name         TEXT               NOT NULL,
  duration          TEXT,
  dimensions        TEXT,
  resolution        TEXT,
  format            TEXT,
  status            deliverable_status NOT NULL DEFAULT 'pending',
  delivered_on      DATE,
  approved_by       UUID               REFERENCES profiles(id),
  approved_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

CREATE TRIGGER deliverables_updated_at
  BEFORE UPDATE ON deliverables
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_deliverables_project ON deliverables(project_id);
