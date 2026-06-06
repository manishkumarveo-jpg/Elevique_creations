import { requireClient } from '@/lib/auth/require-role'
import { ClientSidebar } from '@/components/portal/ClientSidebar'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  await requireClient()
  return (
    <div className="p-shell">
      <ClientSidebar />
      <main className="p-main">{children}</main>
    </div>
  )
}
