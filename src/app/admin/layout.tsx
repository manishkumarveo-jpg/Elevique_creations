import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { NavigationProgress } from '@/components/shared/NavigationProgress'
import { MobileHeader } from '@/components/shared/MobileHeader'
import { createServerClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/require-role'

function getInitials(name: string) {
  return name
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  let userName = 'Admin'
  let userInitials = 'A'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()
    if (profile?.full_name) {
      userName = profile.full_name
      userInitials = getInitials(profile.full_name)
    } else if (user.email) {
      userName = user.email.split('@')[0]
      userInitials = userName.slice(0, 2).toUpperCase()
    }
  }

  return (
    <>
      <NavigationProgress />
      <MobileHeader roleLabel="Admin Suite" />
      <div className="p-shell">
        <AdminSidebar userName={userName} userInitials={userInitials} />
        <main className="p-main">{children}</main>
      </div>
    </>
  )
}
