-- Security hardening: never trust a client-supplied role on signup.
-- raw_user_meta_data is caller-controlled (anyone can POST it to the public
-- Auth signup endpoint), so honoring 'admin'/'team_member' here was a
-- privilege-escalation path. Admin/team accounts are created exclusively via
-- service-role actions (src/app/api/setup, createUserAccount) which already
-- overwrite this row's role right after the trigger fires.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'client'::public.user_role,
    true
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user failed for %: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
