import { TeamSidebar } from '@/components/team/TeamSidebar'

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-shell">
      <TeamSidebar />
      <main className="p-main">{children}</main>
    </div>
  )
}
