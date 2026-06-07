import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-shell">
      <AdminSidebar />
      <main className="p-main">{children}</main>
    </div>
  )
}
