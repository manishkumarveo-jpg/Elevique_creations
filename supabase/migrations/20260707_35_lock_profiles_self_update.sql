-- Security hardening: the live "profiles update" policy (a consolidated
-- admin-all + self-update policy — the tracked migrations directory still
-- shows the pre-consolidation "profiles: user update own safe fields" name,
-- confirmed drifted by querying pg_policies directly) only pinned `role` on
-- the self-update branch, leaving is_active/email/created_by/
-- assigned_team_member_id updatable by the row owner via a direct PostgREST
-- call. Pin those too so only full_name/company_name/phone/avatar_url (and
-- the user's own reporting-schedule prefs) remain genuinely self-editable.
-- Admins keep full update access via the is_admin() branch, unchanged.
DROP POLICY IF EXISTS "profiles update" ON profiles;
DROP POLICY IF EXISTS "profiles: user update own safe fields" ON profiles;

CREATE POLICY "profiles update"
  ON profiles FOR UPDATE
  USING (is_admin() OR auth.uid() = id)
  WITH CHECK (
    is_admin()
    OR (
      auth.uid() = id
      AND role = (SELECT role FROM profiles WHERE id = auth.uid())
      AND is_active = (SELECT is_active FROM profiles WHERE id = auth.uid())
      AND email = (SELECT email FROM profiles WHERE id = auth.uid())
      AND created_by IS NOT DISTINCT FROM (SELECT created_by FROM profiles WHERE id = auth.uid())
      AND assigned_team_member_id IS NOT DISTINCT FROM (SELECT assigned_team_member_id FROM profiles WHERE id = auth.uid())
    )
  );
