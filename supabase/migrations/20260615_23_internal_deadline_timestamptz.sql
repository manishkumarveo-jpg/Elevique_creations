-- Change internal_deadline from date to timestamptz so admins can assign
-- a specific time (e.g. 8:00 PM) visible only to team members.

-- 1. Drop dependent views (recreated at the end)
DROP VIEW IF EXISTS public.project_stats;
DROP VIEW IF EXISTS public.projects_team;
DROP VIEW IF EXISTS public.projects_client;

-- 2. Drop the ordering constraint before changing the column type
ALTER TABLE public.projects
  DROP CONSTRAINT IF EXISTS internal_before_client_deadline;

-- 3. Change internal_deadline to timestamptz
ALTER TABLE public.projects
  ALTER COLUMN internal_deadline TYPE timestamptz
  USING internal_deadline::timestamptz;

-- 4. Re-add the ordering constraint comparing the date portion only,
--    so a same-day internal deadline with a specific time still passes.
ALTER TABLE public.projects
  ADD CONSTRAINT internal_before_client_deadline
  CHECK (
    internal_deadline IS NULL
    OR client_deadline IS NULL
    OR internal_deadline::date <= client_deadline
  );

-- 5. Widen deadline_extensions columns so internal-type rows can store
--    the full timestamp.  Client-type date values cast to midnight UTC.
ALTER TABLE public.deadline_extensions
  ALTER COLUMN old_date TYPE timestamptz USING old_date::timestamptz,
  ALTER COLUMN new_date TYPE timestamptz USING new_date::timestamptz;

-- 6. Recreate views
CREATE VIEW public.projects_team AS
  SELECT
    id, name, client_id, package, status, description,
    internal_deadline,
    client_note, created_by, is_archived,
    admin_approved, created_at, updated_at
  FROM public.projects;

ALTER VIEW public.projects_team SET (security_invoker = true);

CREATE VIEW public.projects_client AS
  SELECT
    id, name, client_id, package, status, description,
    client_deadline,
    is_archived, created_at, updated_at
  FROM public.projects;

ALTER VIEW public.projects_client SET (security_invoker = true);

-- Recreate project_stats; internal_deadline is now timestamptz so the date
-- comparisons (< CURRENT_DATE, <= CURRENT_DATE + 3) still work correctly.
CREATE VIEW public.project_stats AS
  SELECT
    p.id AS project_id,
    p.name,
    p.estimated_hours,
    CAST(COALESCE(SUM(tl.duration_minutes)::numeric / 60.0, 0) AS numeric(10,2)) AS actual_hours,
    CAST(GREATEST(p.estimated_hours - COALESCE(SUM(tl.duration_minutes)::numeric / 60.0, 0), 0) AS numeric(10,2)) AS remaining_hours,
    p.progress_percent,
    p.client_deadline,
    p.internal_deadline,
    CASE
      WHEN p.status = 'completed'  THEN 'completed'
      WHEN p.internal_deadline IS NULL THEN 'no_deadline'
      WHEN p.internal_deadline < CURRENT_DATE THEN 'overdue'
      WHEN p.internal_deadline <= CURRENT_DATE + 3 THEN 'at_risk'
      ELSE 'on_track'
    END AS risk_status
  FROM projects p
  LEFT JOIN time_logs tl ON tl.project_id = p.id
  GROUP BY p.id;
