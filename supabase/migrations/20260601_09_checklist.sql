-- Step 10: Asset Checklist Table
CREATE TABLE asset_checklist (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  item_label    TEXT        NOT NULL,
  is_completed  BOOLEAN     NOT NULL DEFAULT FALSE,
  completed_by  UUID        REFERENCES profiles(id),
  completed_at  TIMESTAMPTZ,
  sort_order    SMALLINT    NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_checklist_project ON asset_checklist(project_id);
