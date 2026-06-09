# 06 — Row Level Security (RLS)
> Elevique Client Portal · Every Policy for Every Table
> Run AFTER the schema from 05_DATABASE_SCHEMA.md is applied.

---

## Enable RLS on All Tables

```sql
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones        ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders           ENABLE ROW LEVEL SECURITY;
ALTER TABLE files             ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables      ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_checklist   ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log      ENABLE ROW LEVEL SECURITY;
```

---

## Profiles Policies

```sql
-- Everyone can read their own profile
CREATE POLICY "profiles: own read"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- Admin can read all profiles
CREATE POLICY "profiles: admin read all"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Users can update their own profile
CREATE POLICY "profiles: own update"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Only admin can insert new profiles (via service role in server actions)
CREATE POLICY "profiles: admin insert"
  ON profiles FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );
```

---

## Projects Policies

```sql
-- Admin sees all non-archived projects
CREATE POLICY "projects: admin read"
  ON projects FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Team member sees only assigned projects
CREATE POLICY "projects: team read assigned"
  ON projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_assignments pa
      JOIN profiles p ON p.id = auth.uid()
      WHERE pa.project_id = projects.id
        AND pa.user_id = auth.uid()
        AND p.role = 'team_member'
        AND p.is_active = true
    )
  );

-- Client sees only their own projects
CREATE POLICY "projects: client read own"
  ON projects FOR SELECT
  USING (
    client_id = auth.uid()
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'client' AND is_active = true)
  );

-- Only admin can create, update, or soft-delete projects
CREATE POLICY "projects: admin write"
  ON projects FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

---

## Project Assignments Policies

```sql
-- Admin can read and write assignments
CREATE POLICY "assignments: admin all"
  ON project_assignments FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Team member can read their own assignments
CREATE POLICY "assignments: team read own"
  ON project_assignments FOR SELECT
  USING (user_id = auth.uid());
```

---

## Milestones Policies

```sql
-- Admin sees all milestones
CREATE POLICY "milestones: admin all"
  ON milestones FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Team member sees milestones for assigned projects
CREATE POLICY "milestones: team read assigned"
  ON milestones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_assignments
      WHERE project_id = milestones.project_id AND user_id = auth.uid()
    )
  );

-- Team member can update milestones on assigned projects
CREATE POLICY "milestones: team update assigned"
  ON milestones FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM project_assignments
      WHERE project_id = milestones.project_id AND user_id = auth.uid()
    )
  );

-- Client can read milestones on their own projects
CREATE POLICY "milestones: client read own"
  ON milestones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = milestones.project_id AND client_id = auth.uid()
    )
  );
```

---

## Folders Policies

```sql
-- Admin sees all folders
CREATE POLICY "folders: admin all"
  ON folders FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Team member sees folders for assigned projects
CREATE POLICY "folders: team read assigned"
  ON folders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_assignments
      WHERE project_id = folders.project_id AND user_id = auth.uid()
    )
  );

-- Client sees folders for their own projects
CREATE POLICY "folders: client read own"
  ON folders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = folders.project_id AND client_id = auth.uid()
    )
  );
```

---

## Files Policies

```sql
-- Admin can do everything with files
CREATE POLICY "files: admin all"
  ON files FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Team member can read files on assigned projects
CREATE POLICY "files: team read assigned"
  ON files FOR SELECT
  USING (
    files.is_deleted = false
    AND EXISTS (
      SELECT 1 FROM project_assignments
      WHERE project_id = files.project_id AND user_id = auth.uid()
    )
  );

-- Team member can insert files into folders where upload_roles includes 'team_member'
CREATE POLICY "files: team insert assigned"
  ON files FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_assignments
      WHERE project_id = files.project_id AND user_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM folders
      WHERE id = files.folder_id AND 'team_member' = ANY(upload_roles)
    )
  );

-- Client can read files on their own projects
CREATE POLICY "files: client read own"
  ON files FOR SELECT
  USING (
    files.is_deleted = false
    AND EXISTS (
      SELECT 1 FROM projects
      WHERE id = files.project_id AND client_id = auth.uid()
    )
  );

-- Client can insert files into folders where upload_roles includes 'client'
CREATE POLICY "files: client insert own"
  ON files FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = files.project_id AND client_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM folders
      WHERE id = files.folder_id AND 'client' = ANY(upload_roles)
    )
  );
```

---

## Deliverables Policies

```sql
-- Admin can do everything
CREATE POLICY "deliverables: admin all"
  ON deliverables FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Team member can read and insert deliverables on assigned projects
CREATE POLICY "deliverables: team read assigned"
  ON deliverables FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_assignments
      WHERE project_id = deliverables.project_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "deliverables: team insert assigned"
  ON deliverables FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_assignments
      WHERE project_id = deliverables.project_id AND user_id = auth.uid()
    )
  );

-- Client can read deliverables on their own projects
CREATE POLICY "deliverables: client read own"
  ON deliverables FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = deliverables.project_id AND client_id = auth.uid()
    )
  );

-- Client can approve (update) their own deliverables
CREATE POLICY "deliverables: client approve own"
  ON deliverables FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = deliverables.project_id AND client_id = auth.uid()
    )
  );
```

---

## Asset Checklist Policies

```sql
-- Admin can do everything
CREATE POLICY "checklist: admin all"
  ON asset_checklist FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Team member can read and update checklist on assigned projects
CREATE POLICY "checklist: team read assigned"
  ON asset_checklist FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_assignments
      WHERE project_id = asset_checklist.project_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "checklist: team update assigned"
  ON asset_checklist FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM project_assignments
      WHERE project_id = asset_checklist.project_id AND user_id = auth.uid()
    )
  );

-- Client can read and update checklist on their own projects
CREATE POLICY "checklist: client read own"
  ON asset_checklist FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = asset_checklist.project_id AND client_id = auth.uid()
    )
  );

CREATE POLICY "checklist: client update own"
  ON asset_checklist FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = asset_checklist.project_id AND client_id = auth.uid()
    )
  );
```

---

## Activity Log Policies

```sql
-- Admin can read all activity
CREATE POLICY "activity_log: admin read all"
  ON activity_log FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Team member can read activity on assigned projects
CREATE POLICY "activity_log: team read assigned"
  ON activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_assignments
      WHERE project_id = activity_log.project_id AND user_id = auth.uid()
    )
  );

-- Client can read activity on their own projects
CREATE POLICY "activity_log: client read own"
  ON activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = activity_log.project_id AND client_id = auth.uid()
    )
  );

-- Inserts are service-role only (via createAdminClient in server actions) — no authenticated insert policy needed
```

---

## No Storage Policies Needed

This project uses **no Supabase Storage buckets**. Files are stored as external links (Google Drive etc.) in the `files.file_url` column. The `files` table RLS policies above are sufficient — they control who can read and insert link records.

---

## Verify RLS is Working

Run these checks after applying all policies:

```sql
-- All 9 tables should show rowsecurity = true
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles','projects','project_assignments','milestones',
    'folders','files','deliverables','asset_checklist','activity_log'
  )
ORDER BY tablename;

-- Confirm policies exist for each table
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

All 9 rows should show `rowsecurity = true`. The second query should return at least one policy per table.
