-- 1. New approval columns
ALTER TABLE public.projects
  ADD COLUMN admin_approved      boolean NOT NULL DEFAULT false,
  ADD COLUMN approved_by_admin   uuid REFERENCES public.profiles(id),
  ADD COLUMN admin_approved_at   timestamptz;

-- 2. Backfill: existing completed projects are treated as pre-approved
UPDATE public.projects SET admin_approved = true WHERE status = 'completed';

-- 3. Hard DB guarantee
ALTER TABLE public.projects
  ADD CONSTRAINT completed_requires_admin_approval
  CHECK (status <> 'completed' OR admin_approved = true);

-- 4. Enforcement trigger
CREATE OR REPLACE FUNCTION public.enforce_admin_approval()
RETURNS trigger AS $$
DECLARE actor_role public.user_role;
BEGIN
  SELECT role INTO actor_role FROM public.profiles WHERE id = auth.uid();

  IF actor_role = 'client' THEN
    RAISE EXCEPTION 'Clients cannot modify projects';
  END IF;

  IF (NEW.admin_approved    IS DISTINCT FROM OLD.admin_approved
   OR NEW.approved_by_admin IS DISTINCT FROM OLD.approved_by_admin
   OR NEW.admin_approved_at IS DISTINCT FROM OLD.admin_approved_at)
     AND actor_role <> 'admin' THEN
    RAISE EXCEPTION 'Only an admin can give or revoke final approval';
  END IF;

  IF NEW.status = 'completed' AND OLD.status <> 'completed'
     AND NEW.admin_approved = false THEN
    RAISE EXCEPTION 'Project cannot be finalized before admin final approval';
  END IF;

  IF NEW.admin_approved = false AND OLD.status = 'completed' THEN
    NEW.status := 'final_review';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_enforce_admin_approval
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.enforce_admin_approval();

-- 5. Fix sync_project_status to advance to final_review (not completed)
CREATE OR REPLACE FUNCTION public.sync_project_status()
RETURNS TRIGGER AS $$
DECLARE
  total_milestones INT;
  done_milestones  INT;
BEGIN
  SELECT COUNT(*) INTO total_milestones FROM milestones WHERE project_id = NEW.project_id;
  SELECT COUNT(*) INTO done_milestones  FROM milestones WHERE project_id = NEW.project_id AND status = 'done';

  IF total_milestones > 0 AND total_milestones = done_milestones THEN
    UPDATE projects
    SET status = 'final_review'
    WHERE id = NEW.project_id AND status NOT IN ('final_review', 'completed', 'paused');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RLS UPDATE policy for team members (trigger enforces column-level rules)
CREATE POLICY "projects: team member update assigned"
  ON public.projects FOR UPDATE
  USING (get_user_role() = 'team_member' AND is_assigned_to_project(id));
