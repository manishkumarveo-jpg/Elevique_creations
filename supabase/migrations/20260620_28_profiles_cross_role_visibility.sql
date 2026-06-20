-- Spec 28: Team members and clients currently cannot read each other's profile
-- rows (RLS only allows is_admin() OR auth.uid() = id), so embedded joins like
-- `client:profiles!projects_client_id_fkey(...)` on the team member's project
-- queries silently come back null -- e.g. "Client" shows "--" on /team/work.

-- Team members can see the client profile for any project they're assigned to
CREATE POLICY "profiles: team member read assigned clients"
  ON profiles FOR SELECT
  USING (
    get_user_role() = 'team_member'
    AND role = 'client'
    AND EXISTS (
      SELECT 1 FROM projects p
      WHERE p.client_id = profiles.id
        AND is_assigned_to_project(p.id)
    )
  );

-- Team members can see other team members assigned to the same project
CREATE POLICY "profiles: team member read project teammates"
  ON profiles FOR SELECT
  USING (
    get_user_role() = 'team_member'
    AND role = 'team_member'
    AND EXISTS (
      SELECT 1 FROM project_assignments pa
      WHERE pa.user_id = profiles.id
        AND is_assigned_to_project(pa.project_id)
    )
  );

-- Clients can see team members assigned to their own projects
CREATE POLICY "profiles: client read assigned team members"
  ON profiles FOR SELECT
  USING (
    get_user_role() = 'client'
    AND role = 'team_member'
    AND EXISTS (
      SELECT 1 FROM project_assignments pa
      JOIN projects p ON p.id = pa.project_id
      WHERE pa.user_id = profiles.id
        AND p.client_id = auth.uid()
    )
  );

-- Any authenticated user can see admin profiles (name only, needed for "approved by" displays)
CREATE POLICY "profiles: authenticated read admin profiles"
  ON profiles FOR SELECT
  USING (auth.uid() IS NOT NULL AND role = 'admin');
