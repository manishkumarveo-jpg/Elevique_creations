'use server'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function logout(role: 'admin' | 'team_member' | 'client') {
  const supabase = await createServerClient()
  await supabase.auth.signOut()

  redirect('/login')
}
