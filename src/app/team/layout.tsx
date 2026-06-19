import { TeamSidebar } from '@/components/team/TeamSidebar'
import { NavigationProgress } from '@/components/shared/NavigationProgress'
import { MobileHeader } from '@/components/shared/MobileHeader'
import { requireTeamMember, getCurrentUserAndProfile } from '@/lib/auth/require-role'

function getInitials(name: string) {
  return name
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default async function TeamLayout({ children }: { children: React.ReactNode }) {
  await requireTeamMember()
  const { user, profile } = await getCurrentUserAndProfile()
  let userName = 'Team Member'
  let userInitials = 'TM'
  if (user) {
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
