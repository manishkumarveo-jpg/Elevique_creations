-- Spec 29 (auto_set_project_started_date) re-defined sync_project_status() and
-- accidentally reverted the admin-approval gate from spec 21: it sets
-- projects.status directly to 'completed' when all milestones are done,
-- instead of 'final_review'. That direct write trips the
-- enforce_admin_approval trigger ("Project cannot be finalized before admin
-- final approval") whenever a team member finishes the last milestone on a
-- project the admin hasn't pre-approved, surfacing as an unhandled error in
-- updateMilestoneStatusTeam.
--
-- Restore the final_review hop while keeping the work_started_date logic.
CREATE OR REPLACE FUNCTION sync_project_status()
RETURNS TRIGGER AS $$
DECLARE
  total_milestones INT;
  done_milestones  INT;
BEGIN
  IF NEW.status <> 'pending' THEN
    UPDATE projects SET work_started_date = CURRENT_DATE
    WHERE id = NEW.project_id AND work_started_date IS NULL;
  END IF;

  SELECT COUNT(*) INTO total_milestones
  FROM milestones WHERE project_id = NEW.project_id;

  SELECT COUNT(*) INTO done_milestones
  FROM milestones WHERE project_id = NEW.project_id AND status = 'done';

  IF total_milestones > 0 AND total_milestones = done_milestones THEN
    UPDATE projects
    SET status = 'final_review'
    WHERE id = NEW.project_id AND status NOT IN ('final_review', 'completed', 'paused');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
