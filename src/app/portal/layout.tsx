import { ClientSidebar } from '@/components/portal/ClientSidebar'
import { NavigationProgress } from '@/components/shared/NavigationProgress'
import { MobileHeader } from '@/components/shared/MobileHeader'
import { createServerClient } from '@/lib/supabase/server'
import { requireClient } from '@/lib/auth/require-role'

function getInitials(name: string) {
  return name
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  await requireClient()
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  let userName = 'Client'
  let userInitials = 'C'
  let companyName = 'Client Portal'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, company_name')
      .eq('id', user.id)
      .single()
    if (profile?.full_name) {
      userName = profile.full_name
      userInitials = getInitials(profile.full_name)
    } else if (user.email) {
      userName = user.email.split('@')[0]
      userInitials = userName.slice(0, 2).toUpperCase()
    }
    if (profile?.company_name) {
      companyName = profile.company_name
    }
  }

  return (
    <>
      <NavigationProgress />
      <MobileHeader roleLabel="Client Portal" />
      <div className="p-shell">
        <ClientSidebar userName={userName} userInitials={userInitials} companyName={companyName} />
        <main className="p-main">{children}</main>
      </div>
    </>
  )
}
