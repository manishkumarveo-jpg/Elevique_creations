import { ClientSidebar } from '@/components/portal/ClientSidebar'
import { NavigationProgress } from '@/components/shared/NavigationProgress'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-shell">
      <NavigationProgress />
      <ClientSidebar />
      <main className="p-main">{children}</main>
    </div>
  )
}
