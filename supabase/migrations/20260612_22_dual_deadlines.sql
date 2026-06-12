-- Spec 2: Dual Deadlines (Internal vs Client)
-- Renames deadline → client_deadline, adds internal_deadline,
-- creates deadline_extensions audit table, role-scoped views,
-- and updates the enforce_admin_approval trigger.

-- 1. Rename existing single deadline to client_deadline
ALTER TABLE public.projects RENAME COLUMN deadline TO client_deadline;

-- 2. Add internal/team deadline
ALTER TABLE public.projects ADD COLUMN internal_deadline date;

-- 3. Enforce ordering: internal must be on or before client
ALTER TABLE public.projects
  ADD CONSTRAINT internal_before_client_deadline
  CHECK (internal_deadline IS NULL
      OR client_deadline IS NULL
      OR internal_deadline <= client_deadline);

-- 4. Extension audit table
CREATE TABLE public.deadline_extensions (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  deadline_type text        NOT NULL CHECK (deadline_type IN ('internal', 'client')),
  old_date      date,
  new_date      date        NOT NULL,
  reason        text,
  extended_by   uuid        NOT NULL REFERENCES public.profiles(id),
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.deadline_extensions ENABLE ROW LEVEL SECURITY;

-- Admin sees and manages everything
CREATE POLICY "deadline_extensions: admin all"
  ON public.deadline_extensions FOR ALL
  USING (get_user_role() = 'admin');

-- Team members see only internal-type extensions for their assigned projects
CREATE POLICY "deadline_extensions: team member see internal"
  ON public.deadline_extensions FOR SELECT
  USING (
    get_user_role() = 'team_member'
    AND deadline_type = 'internal'
    AND is_assigned_to_project(project_id)
  );

-- Clients see only client-type extensions for their own projects
CREATE POLICY "deadline_extensions: client see client"
  ON public.deadline_extensions FOR SELECT
  USING (
    get_user_role() = 'client'
    AND deadline_type = 'client'
    AND project_id IN (
      SELECT id FROM public.projects WHERE client_id = auth.uid()
    )
  );

-- 5. Team-facing view: exposes internal_deadline, hides client_deadline
CREATE VIEW public.projects_team AS
  SELECT
    id, name, client_id, package, status, description,
    internal_deadline,
    client_note, created_by, is_archived,
    admin_approved, created_at, updated_at
  FROM public.projects;

ALTER VIEW public.projects_team SET (security_invoker = true);

-- 6. Client-facing view: exposes client_deadline, hides internal_deadline
CREATE VIEW public.projects_client AS
  SELECT
    id, name, client_id, package, status, description,
    client_deadline,
    is_archived, created_at, updated_at
  FROM public.projects;

ALTER VIEW public.projects_client SET (security_invoker = true);

-- 7. Update enforce_admin_approval to also block non-admin deadline changes
CREATE OR REPLACE FUNCTION public.enforce_admin_approval()
RETURNS trigger AS $$
DECLARE actor_role public.user_role;
BEGIN
  SELECT role INTO actor_role FROM public.profiles WHERE id = auth.uid();

  IF actor_role = 'client' THEN
    RAISE EXCEPTION 'Clients cannot modify projects';
  END IF;

  -- Block non-admins from changing either deadline
  IF (NEW.internal_deadline IS DISTINCT FROM OLD.internal_deadline
   OR NEW.client_deadline   IS DISTINCT FROM OLD.client_deadline)
     AND actor_role <> 'admin' THEN
    RAISE EXCEPTION 'Only an admin can set or change deadlines';
  END IF;

  -- Block non-admins from changing approval fields
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
