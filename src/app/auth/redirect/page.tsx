import { redirect } from 'next/navigation'
import { requireAnyAuth } from '@/lib/auth/require-role'
import { createServerClient } from '@/lib/supabase/server'

const ROLE_DASHBOARDS: Record<string, string> = {
  admin: '/admin/dashboard',
  team_member: '/team/dashboard',
  client: '/portal/dashboard',
}

export default async function AuthRedirectPage() {
  const user = await requireAnyAuth()
  const supabase = await createServerClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const dashboard = (profile?.role && ROLE_DASHBOARDS[profile.role]) ?? '/login'
  redirect(dashboard)
}
