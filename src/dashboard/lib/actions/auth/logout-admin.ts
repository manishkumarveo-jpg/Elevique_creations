'use server'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function logoutAdmin() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function logoutTeam() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function logoutClient() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}
