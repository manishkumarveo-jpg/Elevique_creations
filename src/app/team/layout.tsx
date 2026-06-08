import { TeamSidebar } from '@/components/team/TeamSidebar'
import { NavigationProgress } from '@/components/shared/NavigationProgress'
import { MobileHeader } from '@/components/shared/MobileHeader'

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-shell">
      <NavigationProgress />
      <MobileHeader roleLabel="Team" />
      <TeamSidebar />
      <main className="p-main">{children}</main>
    </div>
  )
}
