import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { NavigationProgress } from '@/components/shared/NavigationProgress'
import { MobileHeader } from '@/components/shared/MobileHeader'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-shell">
      <NavigationProgress />
      <MobileHeader roleLabel="Management Suite" />
      <AdminSidebar />
      <main className="p-main">{children}</main>
    </div>
  )
}
