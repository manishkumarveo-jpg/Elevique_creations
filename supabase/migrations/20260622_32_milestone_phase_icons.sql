-- Spec 32: Give each milestone phase a distinct icon (e.g. Video Editing gets 🎬,
-- distinct from the other phases) so the timeline/pipeline UI can show it.

ALTER TABLE milestones ADD COLUMN icon TEXT;

-- Backfill icons for existing rows by phase name.
UPDATE milestones SET icon = '📋' WHERE phase_name = 'Briefing & Asset Intake';
UPDATE milestones SET icon = '📝' WHERE phase_name = 'Scripting & Approval';
UPDATE milestones SET icon = '🤖' WHERE phase_name = 'AI Generation + Editing';
UPDATE milestones SET icon = '🎬' WHERE phase_name = 'Video Editing';
UPDATE milestones SET icon = '🚀' WHERE phase_name = 'Final Delivery';

-- Seed new projects with icons going forward.
CREATE OR REPLACE FUNCTION seed_new_project()
RETURNS TRIGGER AS $$
BEGIN
  -- 5 default milestones
  INSERT INTO milestones (project_id, phase_number, phase_name, icon) VALUES
    (NEW.id, 1, 'Briefing & Asset Intake',  '📋'),
    (NEW.id, 2, 'Scripting & Approval',     '📝'),
    (NEW.id, 3, 'AI Generation + Editing',  '🤖'),
    (NEW.id, 4, 'Video Editing',            '🎬'),
    (NEW.id, 5, 'Final Delivery',           '🚀');

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
