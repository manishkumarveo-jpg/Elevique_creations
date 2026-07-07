-- Security hardening: pin `search_path` on every SECURITY DEFINER function in
-- the public schema that doesn't already have one set. Written against the
-- live catalog (pg_proc) rather than a hand-maintained list of function names,
-- since the audit found the migrations directory has drifted from what's
-- actually deployed — this closes the gap regardless of that drift.
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT p.oid, p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef = true
      AND NOT EXISTS (
        SELECT 1 FROM unnest(COALESCE(p.proconfig, ARRAY[]::text[])) cfg
        WHERE cfg LIKE 'search_path=%'
      )
  LOOP
    EXECUTE format(
      'ALTER FUNCTION public.%I(%s) SET search_path = public, pg_catalog, pg_temp',
      r.proname,
      r.args
    );
  END LOOP;
END;
$$;
