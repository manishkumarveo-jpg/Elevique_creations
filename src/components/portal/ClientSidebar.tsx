'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, startTransition } from 'react'
import { logoutClient } from '@/lib/actions/auth/logout-admin'
import {
  Home,
  Folder,
  CheckSquare,
  ChevronsUpDown,
  Check,
  X,
  LogOut,
} from 'lucide-react'

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { href: '/portal/dashboard', label: 'Home', icon: Home, matchPrefix: '/portal/dashboard' },
      { href: '/portal/projects', label: 'Projects', icon: Folder, matchPrefix: '/portal/projects' },
    ],
  },
  {
    label: 'Delivery',
    items: [
      { href: '/portal/approvals', label: 'Approvals', icon: CheckSquare, matchPrefix: '/portal/approvals' },
    ],
  },
]

interface ClientSidebarProps {
  userName?: string
  userInitials?: string
  companyName?: string
}

export function ClientSidebar({
  userName = 'Client',
  userInitials = 'C',
  companyName = 'Client Portal',
}: ClientSidebarProps) {
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
        <div
          className="p-overlay"
          onClick={() => setMobileOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') setMobileOpen(false)
          }}
        />
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
              <div className="p-ws-mark">Q</div>
              <div className="p-ws-name">
                <span className="p-sidebar-brand-name">quartz</span>
                <span className="p-sidebar-role-tag">Client Portal</span>
              </div>
              <ChevronsUpDown size={14} className="p-ws-chevron" />
            </button>

            {wsOpen && (
              <div className="p-ws-dropdown">
                <button type="button" className="p-ws-dropdown-item active">
                  <div className="p-ws-mark" style={{ width: 22, height: 22, fontSize: '0.7rem' }}>Q</div>
                  {companyName}
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
                  const active = pathname === item.href || pathname.startsWith(item.matchPrefix + '/')
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
              <div className="p-user-role">Client</div>
            </div>
            <form action={logoutClient}>
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
