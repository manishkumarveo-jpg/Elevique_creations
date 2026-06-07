import { TeamSidebar } from '@/components/team/TeamSidebar'
import { NavigationProgress } from '@/components/shared/NavigationProgress'

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-shell">
      <NavigationProgress />
      <TeamSidebar />
      <main className="p-main">{children}</main>
    </div>
  )
}
