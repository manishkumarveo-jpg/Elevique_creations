-- Spec 31: Insert "Video Editing" as phase 4, pushing "Final Delivery" to phase 5.
-- Applies to new projects (via seed_new_project) and backfills existing projects.

CREATE OR REPLACE FUNCTION seed_new_project()
RETURNS TRIGGER AS $$
BEGIN
  -- 5 default milestones
  INSERT INTO milestones (project_id, phase_number, phase_name) VALUES
    (NEW.id, 1, 'Briefing & Asset Intake'),
    (NEW.id, 2, 'Scripting & Approval'),
    (NEW.id, 3, 'AI Generation + Editing'),
    (NEW.id, 4, 'Video Editing'),
    (NEW.id, 5, 'Final Delivery');

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

-- Backfill: shift existing "Final Delivery" milestones from phase 4 to phase 5,
-- then insert the new "Video Editing" phase 4 (pending) for those projects.
UPDATE milestones
SET phase_number = 5
WHERE phase_number = 4 AND phase_name = 'Final Delivery';

INSERT INTO milestones (project_id, phase_number, phase_name, status)
SELECT project_id, 4, 'Video Editing', 'pending'
FROM milestones
WHERE phase_number = 5 AND phase_name = 'Final Delivery';
