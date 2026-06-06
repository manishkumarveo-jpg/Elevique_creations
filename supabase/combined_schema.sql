-- ==========================================
-- ELEVIQUE DASHBOARD COMBINED DATABASE SCHEMA
-- Run this script in the Supabase SQL Editor
-- ==========================================

-- STEP 1: Custom ENUM Types
CREATE TYPE user_role          AS ENUM ('admin', 'team_member', 'client');
CREATE TYPE project_status     AS ENUM ('briefing', 'in_progress', 'final_review', 'completed', 'paused');
CREATE TYPE milestone_status   AS ENUM ('pending', 'in_progress', 'done');
CREATE TYPE deliverable_type   AS ENUM ('video', 'image');
CREATE TYPE deliverable_status AS ENUM ('pending', 'shared', 'delivered', 'approved');

-- STEP 2: General Helper Functions
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 3: Profiles Table & Autocreation Triggers
CREATE TABLE profiles (
  id            UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT        NOT NULL,
  email         TEXT        NOT NULL UNIQUE,
  role          user_role   NOT NULL DEFAULT 'client',
  company_name  TEXT,
  phone         TEXT,
  avatar_url    TEXT,
  is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
  created_by    UUID        REFERENCES profiles(id),
  last_login    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto-create profile when a new auth user is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Helper Functions accessing profiles (must be created after profiles table)
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- STEP 4: Projects Table
CREATE TABLE projects (
  id           UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT           NOT NULL,
  client_id    UUID           NOT NULL REFERENCES profiles(id),
  package      TEXT,
  status       project_status NOT NULL DEFAULT 'briefing',
  deadline     DATE,
  description  TEXT,
  created_by   UUID           NOT NULL REFERENCES profiles(id),
  is_archived  BOOLEAN        NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_projects_client    ON projects(client_id)  WHERE is_archived = FALSE;
CREATE INDEX idx_projects_status    ON projects(status)     WHERE is_archived = FALSE;
CREATE INDEX idx_projects_created   ON projects(created_at DESC);

-- Helper function checking projects (must be created after projects table)
CREATE OR REPLACE FUNCTION is_project_client(p_project_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM projects
    WHERE id = p_project_id AND client_id = auth.uid()
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- STEP 5: Project Assignments Table
CREATE TABLE project_assignments (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id       UUID        NOT NULL REFERENCES projects(id)  ON DELETE CASCADE,
  user_id          UUID        NOT NULL REFERENCES profiles(id)  ON DELETE CASCADE,
  role_on_project  TEXT        NOT NULL DEFAULT 'contributor',
  assigned_by      UUID        NOT NULL REFERENCES profiles(id),
  assigned_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, user_id)
);

CREATE INDEX idx_assignments_user    ON project_assignments(user_id);
CREATE INDEX idx_assignments_project ON project_assignments(project_id);

-- Helper function checking assignments (must be created after project_assignments table)
CREATE OR REPLACE FUNCTION is_assigned_to_project(p_project_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM project_assignments
    WHERE project_id = p_project_id AND user_id = auth.uid()
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- STEP 6: Milestones Table
CREATE TABLE milestones (
  id             UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id     UUID             NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase_number   SMALLINT         NOT NULL,
  phase_name     TEXT             NOT NULL,
  status         milestone_status NOT NULL DEFAULT 'pending',
  scheduled_date DATE,
  completed_date DATE,
  notes          TEXT,
  updated_by     UUID             REFERENCES profiles(id),
  created_at     TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, phase_number)
);

CREATE TRIGGER milestones_updated_at
  BEFORE UPDATE ON milestones
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_milestones_project ON milestones(project_id);

-- STEP 7: Folders Table
CREATE TABLE folders (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name          TEXT        NOT NULL,
  icon          TEXT,
  description   TEXT,
  sort_order    SMALLINT    NOT NULL DEFAULT 0,
  upload_roles  TEXT[]      NOT NULL DEFAULT ARRAY['admin', 'team_member'],
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_folders_project ON folders(project_id);

-- STEP 8: Files Table
CREATE TABLE files (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id    UUID        NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
  project_id   UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  uploaded_by  UUID        NOT NULL REFERENCES profiles(id),
  file_name    TEXT        NOT NULL,
  file_type    TEXT,
  file_size    TEXT,                    -- optional, human-readable e.g. "24 MB"
  file_url     TEXT        NOT NULL,   -- external link (Google Drive, Dropbox, etc.)
  notes        TEXT,
  is_deleted   BOOLEAN     NOT NULL DEFAULT FALSE,
  deleted_by   UUID        REFERENCES profiles(id),
  deleted_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_files_folder  ON files(folder_id)  WHERE is_deleted = FALSE;
CREATE INDEX idx_files_project ON files(project_id) WHERE is_deleted = FALSE;

-- STEP 9: Deliverables Table
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

-- STEP 10: Asset Checklist Table
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

-- STEP 11: Activity Log Table
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

-- STEP 12: Auto-Seed Trigger (runs on every new project)
CREATE OR REPLACE FUNCTION seed_new_project()
RETURNS TRIGGER AS $$
BEGIN
  -- 4 default milestones
  INSERT INTO milestones (project_id, phase_number, phase_name) VALUES
    (NEW.id, 1, 'Briefing & Asset Intake'),
    (NEW.id, 2, 'Scripting & Approval'),
    (NEW.id, 3, 'AI Generation + Editing'),
    (NEW.id, 4, 'Final Delivery');

  -- 6 default folders with role-based upload permissions
  INSERT INTO folders (project_id, name, icon, sort_order, upload_roles) VALUES
    (NEW.id, 'Agreements',       '📜', 1, ARRAY['admin']),
    (NEW.id, 'Assets',           '📦', 2, ARRAY['admin', 'team_member', 'client']),
    (NEW.id, 'References',       '📑', 3, ARRAY['admin', 'team_member', 'client']),
    (NEW.id, 'Script/Moodboard', '📝', 4, ARRAY['admin', 'team_member']),
    (NEW.id, 'Final Videos',     '🎬', 5, ARRAY['admin', 'team_member']),
    (NEW.id, 'Final Images',     '🖼️', 6, ARRAY['admin', 'team_member']);

  -- 6 default asset checklist items
  INSERT INTO asset_checklist (project_id, item_label, sort_order) VALUES
    (NEW.id, 'Brand logo (high-res PNG/JPEG/PDF)',          1),
    (NEW.id, 'Product photos / raw shots',                  2),
    (NEW.id, 'Brand color palette / hex codes',             3),
    (NEW.id, 'Brand font files (if custom)',                4),
    (NEW.id, 'Existing brand page/website (for reference)', 5),
    (NEW.id, 'Competitor references or inspiration',        6);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_project_created
  AFTER INSERT ON projects
  FOR EACH ROW EXECUTE FUNCTION seed_new_project();

-- STEP 13: Auto-Complete Project Trigger
CREATE OR REPLACE FUNCTION sync_project_status()
RETURNS TRIGGER AS $$
DECLARE
  total_milestones INT;
  done_milestones  INT;
BEGIN
  SELECT COUNT(*) INTO total_milestones
  FROM milestones WHERE project_id = NEW.project_id;

  SELECT COUNT(*) INTO done_milestones
  FROM milestones WHERE project_id = NEW.project_id AND status = 'done';

  IF total_milestones > 0 AND total_milestones = done_milestones THEN
    UPDATE projects SET status = 'completed' WHERE id = NEW.project_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_milestone_updated
  AFTER UPDATE ON milestones
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION sync_project_status();

-- STEP 14: Enable RLS on all tables
ALTER TABLE profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects            ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_assignments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones          ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE files               ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables        ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_checklist     ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log        ENABLE ROW LEVEL SECURITY;

-- STEP 15: Row Level Security (RLS) Policies

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

-- STEP 16: Additional Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_milestones_status ON milestones(status);
