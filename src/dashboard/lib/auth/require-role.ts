import { cache } from 'react'
import { createServerClient } from '@/shared/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

// cache() dedupes this across every call within the same request (requireX()
// plus each layout's own lookup), so we only hit Supabase Auth + profiles once.
const getUserAndProfile = cache(async () => {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { user: null, profile: null }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role, is_active, full_name, email, company_name, notify_self')
    .eq('id', user.id)
    .single()

  // Fail closed (profile stays null, every requireX() below still denies
  // access) but LOUDLY — a swallowed query error here previously looked
  // identical to "no profile exists," which made every account intermittently
  // "wrong role" whenever the profiles select referenced a column that didn't
  // exist yet (e.g. a merged migration not applied to this database).
  if (error) {
    console.error('[getUserAndProfile] profiles query failed for user', user.id, ':', error.message)
  }

  return { user, profile }
})

export const getCurrentUserAndProfile = getUserAndProfile

export async function requireAdmin(): Promise<User> {
  const { user, profile } = await getUserAndProfile()
  if (!user) redirect('/login')
  if (!profile || !profile.is_active || profile.role !== 'admin') {
    redirect('/unauthorized')
  }
  return user
}

export async function requireTeamMember(): Promise<User> {
  const { user, profile } = await getUserAndProfile()
  if (!user) redirect('/login')
  if (!profile || !profile.is_active || profile.role !== 'team_member') {
    redirect('/unauthorized')
  }
  return user
}

export async function requireClient(): Promise<User> {
  const { user, profile } = await getUserAndProfile()
  if (!user) redirect('/login')
  if (!profile || !profile.is_active || profile.role !== 'client') {
    redirect('/unauthorized')
  }
  return user
}

export async function requireAnyAuth(): Promise<User> {
  const { user, profile } = await getUserAndProfile()
  if (!user) redirect('/login')
  if (!profile || !profile.is_active) redirect('/unauthorized')
  return user
}
