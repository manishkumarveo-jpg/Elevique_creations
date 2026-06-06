import { requireTeamMember } from '@/lib/auth/require-role'
import { TeamSidebar } from '@/components/team/TeamSidebar'

export default async function TeamLayout({ children }: { children: React.ReactNode }) {
  await requireTeamMember()
  return (
    <div className="p-shell">
      <TeamSidebar />
      <main className="p-main">{children}</main>
    </div>
  )
}
