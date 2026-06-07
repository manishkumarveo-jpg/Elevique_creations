import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { NavigationProgress } from '@/components/shared/NavigationProgress'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-shell">
      <NavigationProgress />
      <AdminSidebar />
      <main className="p-main">{children}</main>
    </div>
  )
}
