import { TeamSidebar } from '@/dashboard/components/team/TeamSidebar'
import { NavigationProgress } from '@/dashboard/components/shared/NavigationProgress'
import { MobileHeader } from '@/dashboard/components/shared/MobileHeader'
import { NotificationBell } from '@/dashboard/components/notifications/NotificationBell'
import { NotificationProvider } from '@/dashboard/components/notifications/NotificationProvider'
import { PushPermissionPrompt } from '@/dashboard/components/notifications/PushPermissionPrompt'
import { requireTeamMember, getCurrentUserAndProfile } from '@/dashboard/lib/auth/require-role'
import { getRecentNotifications, getUnreadCount } from '@/dashboard/lib/queries/notifications'

function getInitials(name: string) {
  return name
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default async function TeamLayout({ children }: { children: React.ReactNode }) {
  const teamUser = await requireTeamMember()
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

  const [notifications, unreadCount] = await Promise.all([
    getRecentNotifications(teamUser.id).catch((error) => {
      console.error('Failed to load recent notifications:', error)
      return []
    }),
    getUnreadCount(teamUser.id).catch((error) => {
      console.error('Failed to load unread notification count:', error)
      return 0
    }),
  ])
  const bell = <NotificationBell />

  return (
    <NotificationProvider userId={teamUser.id} initialNotifications={notifications} initialUnreadCount={unreadCount} initialNotifySelf={profile?.notify_self ?? true}>
      <NavigationProgress />
      <MobileHeader roleLabel="Team Workspace" notificationBell={bell} />
      <div className="p-shell">
        <TeamSidebar userName={userName} userInitials={userInitials} notificationBell={bell} />
        <main className="p-main">
          <PushPermissionPrompt />
          {children}
        </main>
      </div>
    </NotificationProvider>
  )
}
