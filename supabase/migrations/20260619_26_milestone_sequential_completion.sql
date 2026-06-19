-- Spec 26: Milestones must be completed in phase order.
-- Prevents marking a later phase "done" while an earlier phase in the
-- same project is still pending/in_progress (e.g. Final Delivery before
-- Briefing, Scripting, or AI Generation are done).

CREATE OR REPLACE FUNCTION enforce_milestone_sequence()
RETURNS TRIGGER AS $$
DECLARE
  incomplete_count INT;
BEGIN
  IF NEW.status = 'done' AND OLD.status IS DISTINCT FROM 'done' THEN
    SELECT COUNT(*) INTO incomplete_count
    FROM milestones
    WHERE project_id = NEW.project_id
      AND phase_number < NEW.phase_number
      AND status <> 'done';

    IF incomplete_count > 0 THEN
      RAISE EXCEPTION 'Complete earlier phases before marking phase % as done', NEW.phase_number;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_milestone_update_enforce_sequence
  BEFORE UPDATE ON milestones
  FOR EACH ROW EXECUTE FUNCTION enforce_milestone_sequence();
