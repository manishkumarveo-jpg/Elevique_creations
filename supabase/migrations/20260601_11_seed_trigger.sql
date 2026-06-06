-- Helper Functions (defined here because SQL-language functions are validated
-- at creation time in PostgreSQL 14+ and need all referenced tables to exist first)

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

CREATE OR REPLACE FUNCTION is_assigned_to_project(p_project_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM project_assignments
    WHERE project_id = p_project_id AND user_id = auth.uid()
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_project_client(p_project_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM projects
    WHERE id = p_project_id AND client_id = auth.uid()
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Auto-Seed Trigger (runs on every new project)
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

-- Auto-Complete Project Trigger
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
