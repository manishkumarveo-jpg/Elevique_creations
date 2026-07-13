-- Team notifications: in-app bell + browser push.
-- notifications is the in-app feed (read via Realtime + on-load queries);
-- push_subscriptions stores each browser's Web Push registration so a
-- server action can send an OS-level notification even when the tab is
-- closed. Both follow the activity_log idiom: service-role inserts only,
-- recipient-scoped reads via RLS.

CREATE TABLE notifications (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id  UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  actor_id      UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  type          TEXT        NOT NULL,
  title         TEXT        NOT NULL,
  body          TEXT        NOT NULL,
  link          TEXT,
  project_id    UUID        REFERENCES projects(id) ON DELETE CASCADE,
  entity_type   TEXT,
  entity_id     UUID,
  read_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, created_at DESC);
CREATE INDEX idx_notifications_unread    ON notifications(recipient_id) WHERE read_at IS NULL;

CREATE TABLE push_subscriptions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint    TEXT        NOT NULL UNIQUE,
  p256dh      TEXT        NOT NULL,
  auth        TEXT        NOT NULL,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_push_subscriptions_user ON push_subscriptions(user_id);

-- RLS
ALTER TABLE notifications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Notifications: no authenticated INSERT policy — rows are only ever
-- written by notify.ts via createAdminClient(), same as activity_log.
-- Recipient UPDATE is needed so "mark as read" can run through the normal
-- RLS-scoped client instead of the admin client.
--
-- Deliberately no "admin all" policy: is_admin() only scopes which rows an
-- admin's *browser* session can touch — the server-side writes (notify.ts,
-- subscribe/unsubscribe routes) already go through createAdminClient(),
-- which bypasses RLS entirely and doesn't need a policy here. A blanket
-- FOR ALL USING (is_admin()) would let any admin's browser session read,
-- rewrite, or delete every user's notifications directly, and — worse, on
-- push_subscriptions below — INSERT a push_subscriptions row for *any*
-- user_id with an unvalidated endpoint, bypassing the subscribe route's own
-- checks entirely. Add a scoped admin policy later only if an actual
-- browser-side admin UI needs it.
CREATE POLICY "notifications: recipient select own" ON notifications FOR SELECT
  USING (auth.uid() = recipient_id);

CREATE POLICY "notifications: recipient update own" ON notifications FOR UPDATE
  USING (auth.uid() = recipient_id) WITH CHECK (auth.uid() = recipient_id);

-- RLS USING/WITH CHECK only scope which rows a recipient can touch, not which
-- columns — without this, a recipient could rewrite their own notification's
-- title/body/link/actor_id through the same "mark as read" update path. Pin
-- every column but read_at back to its prior value for non-admin actors.
CREATE OR REPLACE FUNCTION enforce_notification_update_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT is_admin() THEN
    NEW.recipient_id := OLD.recipient_id;
    NEW.actor_id     := OLD.actor_id;
    NEW.type         := OLD.type;
    NEW.title        := OLD.title;
    NEW.body         := OLD.body;
    NEW.link         := OLD.link;
    NEW.project_id   := OLD.project_id;
    NEW.entity_type  := OLD.entity_type;
    NEW.entity_id    := OLD.entity_id;
    NEW.created_at   := OLD.created_at;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_catalog, pg_temp;

CREATE TRIGGER notifications_enforce_update_columns
  BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION enforce_notification_update_columns();

-- Push Subscriptions: the subscribe/unsubscribe route handlers run as the
-- logged-in user, so self-service is granted directly (not via admin client).
-- No "admin all" policy here either — see the notifications policy comment
-- above; it applies doubly here since it would also let an admin insert a
-- subscription row for another user's id with an endpoint the subscribe
-- route's Zod/allowlist validation never saw.
CREATE POLICY "push_subscriptions: self all" ON push_subscriptions FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Realtime: the in-app bell subscribes to inserts filtered to its own user.
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
