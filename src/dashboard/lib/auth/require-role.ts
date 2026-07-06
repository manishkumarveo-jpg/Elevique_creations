import { cache } from 'react'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

// cache() dedupes this across every call within the same request (requireX()
// plus each layout's own lookup), so we only hit Supabase Auth + profiles once.
const getUserAndProfile = cache(async () => {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { user: null, profile: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active, full_name, email, company_name')
    .eq('id', user.id)
    .single()

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
