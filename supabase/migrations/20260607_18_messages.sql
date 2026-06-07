-- Migration 18: messages
-- Thread-based messaging per project between clients and the team/admin.

CREATE TABLE messages (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sender_id   UUID        NOT NULL REFERENCES profiles(id),
  body        TEXT        NOT NULL CHECK (char_length(trim(body)) > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_project_id ON messages(project_id, created_at DESC);
CREATE INDEX idx_messages_sender_id  ON messages(sender_id);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Admin: full access
CREATE POLICY "messages: admin all"
  ON messages FOR ALL
  USING (is_admin());

-- Team member: read/write on assigned projects
CREATE POLICY "messages: team member select"
  ON messages FOR SELECT
  USING (get_user_role() = 'team_member' AND is_assigned_to_project(project_id));

CREATE POLICY "messages: team member insert"
  ON messages FOR INSERT
  WITH CHECK (
    get_user_role() = 'team_member'
    AND is_assigned_to_project(project_id)
    AND sender_id = auth.uid()
  );

-- Client: read/write own project messages
CREATE POLICY "messages: client select"
  ON messages FOR SELECT
  USING (get_user_role() = 'client' AND is_project_client(project_id));

CREATE POLICY "messages: client insert"
  ON messages FOR INSERT
  WITH CHECK (
    get_user_role() = 'client'
    AND is_project_client(project_id)
    AND sender_id = auth.uid()
  );
