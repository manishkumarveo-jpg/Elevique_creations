-- Per-user preference: whether an admin/team member receives their own
-- browser/in-app notification confirming an action they just performed
-- (see src/dashboard/lib/actions/notifications/notify.ts's notifyOne).
-- Defaults to true, matching current behavior. Self-update is already
-- covered by the existing "profiles: user update own safe fields" policy
-- (20260601_12_rls.sql) — it only pins `role`, so no new RLS policy needed.

ALTER TABLE profiles ADD COLUMN notify_self BOOLEAN NOT NULL DEFAULT true;
