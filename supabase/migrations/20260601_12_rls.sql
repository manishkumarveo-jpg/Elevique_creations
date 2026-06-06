-- Enable RLS on all tables
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones        ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders           ENABLE ROW LEVEL SECURITY;
ALTER TABLE files             ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables      ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_checklist   ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log      ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "profiles: read own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: admin read all"
  ON profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "profiles: admin update all"
  ON profiles FOR UPDATE
  USING (is_admin());

CREATE POLICY "profiles: user update own safe fields"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

-- Projects Policies
CREATE POLICY "projects: admin all"
  ON projects FOR ALL
  USING (is_admin());

CREATE POLICY "projects: team member select assigned"
  ON projects FOR SELECT
  USING (
    get_user_role() = 'team_member'
    AND is_assigned_to_project(id)
  );

CREATE POLICY "projects: client select own"
  ON projects FOR SELECT
  USING (
    get_user_role() = 'client'
    AND client_id = auth.uid()
  );

-- Project Assignments Policies
CREATE POLICY "assignments: admin all"
  ON project_assignments FOR ALL
  USING (is_admin());

CREATE POLICY "assignments: team member select own"
  ON project_assignments FOR SELECT
  USING (
    get_user_role() = 'team_member'
    AND user_id = auth.uid()
  );

-- Milestones Policies
CREATE POLICY "milestones: admin all"
  ON milestones FOR ALL
  USING (is_admin());

CREATE POLICY "milestones: team member select assigned"
  ON milestones FOR SELECT
  USING (
    get_user_role() = 'team_member'
    AND is_assigned_to_project(project_id)
  );

CREATE POLICY "milestones: team member update assigned"
  ON milestones FOR UPDATE
  USING (
    get_user_role() = 'team_member'
    AND is_assigned_to_project(project_id)
  )
  WITH CHECK (
    get_user_role() = 'team_member'
    AND is_assigned_to_project(project_id)
  );

CREATE POLICY "milestones: client select own"
  ON milestones FOR SELECT
  USING (
    get_user_role() = 'client'
    AND is_project_client(project_id)
  );

-- Folders Policies
CREATE POLICY "folders: admin all"
  ON folders FOR ALL
  USING (is_admin());

CREATE POLICY "folders: team member select assigned"
  ON folders FOR SELECT
  USING (
    get_user_role() = 'team_member'
    AND is_assigned_to_project(project_id)
  );

CREATE POLICY "folders: client select own"
  ON folders FOR SELECT
  USING (
    get_user_role() = 'client'
    AND is_project_client(project_id)
  );

-- Files Policies
CREATE POLICY "files: admin all"
  ON files FOR ALL
  USING (is_admin());

CREATE POLICY "files: team member select assigned"
  ON files FOR SELECT
  USING (
    get_user_role() = 'team_member'
    AND is_assigned_to_project(project_id)
    AND is_deleted = FALSE
  );

CREATE POLICY "files: team member insert assigned"
  ON files FOR INSERT
  WITH CHECK (
    get_user_role() = 'team_member'
    AND is_assigned_to_project(project_id)
  );

CREATE POLICY "files: client select own"
  ON files FOR SELECT
  USING (
    get_user_role() = 'client'
    AND is_project_client(project_id)
    AND is_deleted = FALSE
  );

CREATE POLICY "files: client insert allowed folders"
  ON files FOR INSERT
  WITH CHECK (
    get_user_role() = 'client'
    AND is_project_client(project_id)
    AND EXISTS (
      SELECT 1 FROM folders
      WHERE id = folder_id
      AND 'client' = ANY(upload_roles)
    )
  );

-- Deliverables Policies
CREATE POLICY "deliverables: admin all"
  ON deliverables FOR ALL
  USING (is_admin());

CREATE POLICY "deliverables: team member select assigned"
  ON deliverables FOR SELECT
  USING (
    get_user_role() = 'team_member'
    AND is_assigned_to_project(project_id)
  );

CREATE POLICY "deliverables: team member write assigned"
  ON deliverables FOR INSERT
  WITH CHECK (
    get_user_role() = 'team_member'
    AND is_assigned_to_project(project_id)
  );

CREATE POLICY "deliverables: client select own"
  ON deliverables FOR SELECT
  USING (
    get_user_role() = 'client'
    AND is_project_client(project_id)
  );

CREATE POLICY "deliverables: client approve own"
  ON deliverables FOR UPDATE
  USING (
    get_user_role() = 'client'
    AND is_project_client(project_id)
  )
  WITH CHECK (
    get_user_role() = 'client'
    AND is_project_client(project_id)
    AND status = 'approved'
    AND approved_by = auth.uid()
  );

-- Asset Checklist Policies
CREATE POLICY "checklist: admin all"
  ON asset_checklist FOR ALL
  USING (is_admin());

CREATE POLICY "checklist: team member all assigned"
  ON asset_checklist FOR ALL
  USING (
    get_user_role() = 'team_member'
    AND is_assigned_to_project(project_id)
  );

CREATE POLICY "checklist: client all own"
  ON asset_checklist FOR ALL
  USING (
    get_user_role() = 'client'
    AND is_project_client(project_id)
  );

-- Activity Log Policies
CREATE POLICY "activity: admin all"
  ON activity_log FOR ALL
  USING (is_admin());

CREATE POLICY "activity: team member select assigned"
  ON activity_log FOR SELECT
  USING (
    get_user_role() = 'team_member'
    AND (
      project_id IS NULL
      OR is_assigned_to_project(project_id)
    )
  );

CREATE POLICY "activity: client select own"
  ON activity_log FOR SELECT
  USING (
    get_user_role() = 'client'
    AND project_id IS NOT NULL
    AND is_project_client(project_id)
  );
