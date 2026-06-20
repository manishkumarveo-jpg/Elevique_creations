-- Spec 29: projects.work_started_date is never set anywhere, so the "Started"
-- column on /team/work always shows "--" even for in_progress/completed projects.
-- Project status itself only ever changes automatically (sync_project_status
-- trigger, on milestone completion) -- there is no admin UI to set it manually --
-- so the most reliable "work actually started" signal is the first milestone
-- moving off 'pending'.

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
    UPDATE projects SET status = 'completed' WHERE id = NEW.project_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
