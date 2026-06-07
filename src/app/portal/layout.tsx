import { ClientSidebar } from '@/components/portal/ClientSidebar'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-shell">
      <ClientSidebar />
      <main className="p-main">{children}</main>
    </div>
  )
}
