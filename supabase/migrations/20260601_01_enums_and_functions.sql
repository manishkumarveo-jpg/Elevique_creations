-- Step 1: Custom ENUM Types
CREATE TYPE user_role          AS ENUM ('admin', 'team_member', 'client');
CREATE TYPE project_status     AS ENUM ('briefing', 'in_progress', 'final_review', 'completed', 'paused');
CREATE TYPE milestone_status   AS ENUM ('pending', 'in_progress', 'done');
CREATE TYPE deliverable_type   AS ENUM ('video', 'image');
CREATE TYPE deliverable_status AS ENUM ('pending', 'shared', 'delivered', 'approved');

-- set_updated_at is PL/pgSQL — safe here (not validated at creation time)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- NOTE: get_user_role, is_admin, is_assigned_to_project, is_project_client
-- are defined in 20260601_11_seed_trigger.sql (after all tables exist)
-- because SQL-language functions are validated at creation time in PostgreSQL 14+
