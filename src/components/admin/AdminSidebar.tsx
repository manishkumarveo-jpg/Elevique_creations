'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, startTransition } from 'react'
import { logoutAdmin } from '@/lib/actions/auth/logout-admin'
import {
  LayoutGrid,
  BarChart3,
  Folder,
  Users,
  FileText,
  MessageCircle,
  Share2,
  ChevronsUpDown,
  Check,
  X,
  LogOut,
  CalendarCheck,
  Video,
  Table2,
} from 'lucide-react'

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutGrid },
      { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { href: '/admin/projects', label: 'Projects', icon: Folder },
      { href: '/admin/clients', label: 'Clients', icon: Users },
      { href: '/admin/documents', label: 'Documents', icon: FileText },
    ],
  },
  {
    label: 'Team Tracker',
    items: [
      { href: '/admin/team-tracker', label: 'All Records', icon: Table2 },
      { href: '/admin/production-tracker', label: 'Production Tracker', icon: CalendarCheck },
      { href: '/admin/video-tracker', label: 'Video Gen Tracker', icon: Video },
    ],
  },
  {
    label: 'People',
    items: [
      { href: '/admin/users', label: 'Users', icon: Users },
    ],
  },
  {
    label: 'Inbound',
    items: [
      { href: '/admin/inquiries', label: 'Inquiries', icon: MessageCircle },
      { href: '/admin/leads', label: 'Social Leads', icon: Share2 },
    ],
  },
]

interface AdminSidebarProps {
  userName?: string
  userInitials?: string
}

export function AdminSidebar({ userName = 'Admin', userInitials = 'A' }: AdminSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [wsOpen, setWsOpen] = useState(false)

  useEffect(() => {
    const open = () => setMobileOpen(true)
    window.addEventListener('p:open-sidebar', open)
    return () => window.removeEventListener('p:open-sidebar', open)
  }, [])

  useEffect(() => { startTransition(() => setMobileOpen(false)) }, [pathname])

  return (
    <>
      {mobileOpen && (
        <div className="p-overlay" onClick={() => setMobileOpen(false)} />
      )}
      <aside className={`p-sidebar${mobileOpen ? ' open' : ''}`}>
        {/* ── Workspace switcher ── */}
        <div className="p-sidebar-header">
          <div style={{ position: 'relative', width: '100%' }}>
            <button
              type="button"
              className="p-ws-btn"
              onClick={() => setWsOpen(v => !v)}
              aria-label="Switch workspace"
            >
              <div className="p-ws-mark">E</div>
              <div className="p-ws-name">
                <span className="p-sidebar-brand-name">Elevique</span>
                <span className="p-sidebar-role-tag">Admin Suite</span>
              </div>
              <ChevronsUpDown size={14} className="p-ws-chevron" />
            </button>

            {wsOpen && (
              <div className="p-ws-dropdown">
                <button type="button" className="p-ws-dropdown-item active">
                  <div className="p-ws-mark" style={{ width: 22, height: 22, fontSize: '0.7rem' }}>E</div>
                  Elevique
                  <Check size={13} className="p-ws-dropdown-check" />
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            className="p-sidebar-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="p-sidebar-nav">
          {NAV_GROUPS.map(group => (
            <div key={group.label} className="p-nav-group">
              <span className="p-nav-group-label">{group.label}</span>
              <div className="p-nav-items">
                {group.items.map(item => {
                  const Icon = item.icon
                  const active = pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`p-nav-item${active ? ' active' : ''}`}
                    >
                      <Icon size={15} className="p-nav-icon" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ── User card ── */}
        <div className="p-sidebar-footer">
          <div className="p-user-card">
            <div className="p-user-avatar">{userInitials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="p-user-name">{userName}</div>
              <div className="p-user-role">Admin</div>
            </div>
            <form action={logoutAdmin}>
              <button type="submit" className="p-signout-btn" title="Sign out">
                <LogOut size={14} />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  )
}
