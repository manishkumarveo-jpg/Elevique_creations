import { requireAdmin } from '@/lib/auth/require-role'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return (
    <div className="p-shell">
      <AdminSidebar />
      <main className="p-main">{children}</main>
    </div>
  )
}
