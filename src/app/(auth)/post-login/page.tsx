import { redirect } from 'next/navigation'
import { createServerClient } from '@/shared/lib/supabase/server'
import { getHomePath, type Role } from '@/dashboard/lib/auth/routes'

// Landing spot right after sign-in. Deliberately server-side, not a
// client-side profile lookup in login/page.tsx: signInWithPassword()
// resolving doesn't guarantee the very next request from the same client
// is already authenticated (supabase-js's session propagation/lock can lag
// by a beat), which was intermittently bouncing fresh logins to
// /unauthorized. A fresh request here reads cookies already committed by
// the sign-in response, same as requireAdmin()/etc. do reliably.
export default async function PostLoginPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.is_active) redirect('/unauthorized')

  redirect(getHomePath(profile.role as Role))
}
