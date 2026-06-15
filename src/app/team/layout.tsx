import { TeamSidebar } from '@/components/team/TeamSidebar'
import { NavigationProgress } from '@/components/shared/NavigationProgress'
import { MobileHeader } from '@/components/shared/MobileHeader'
import { createServerClient } from '@/lib/supabase/server'

function getInitials(name: string) {
  return name
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default async function TeamLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  let userName = 'Team Member'
  let userInitials = 'TM'
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
      <MobileHeader roleLabel="Team Workspace" />
      <div className="p-shell">
        <TeamSidebar userName={userName} userInitials={userInitials} />
        <main className="p-main">{children}</main>
      </div>
    </>
  )
}
