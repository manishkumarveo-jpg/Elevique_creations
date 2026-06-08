import { ClientSidebar } from '@/components/portal/ClientSidebar'
import { NavigationProgress } from '@/components/shared/NavigationProgress'
import { MobileHeader } from '@/components/shared/MobileHeader'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-shell">
      <NavigationProgress />
      <MobileHeader roleLabel="Premium Portal" />
      <ClientSidebar />
      <main className="p-main">{children}</main>
    </div>
  )
}
