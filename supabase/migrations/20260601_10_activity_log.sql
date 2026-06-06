-- Step 11: Activity Log Table
CREATE TABLE activity_log (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID        REFERENCES projects(id) ON DELETE CASCADE,
  actor_id     UUID        NOT NULL REFERENCES profiles(id),
  actor_role   user_role   NOT NULL,
  action       TEXT        NOT NULL,
  entity_type  TEXT,
  entity_id    UUID,
  entity_name  TEXT,
  metadata     JSONB       NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_project ON activity_log(project_id, created_at DESC);
CREATE INDEX idx_activity_actor   ON activity_log(actor_id,   created_at DESC);
