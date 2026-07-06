'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, startTransition } from 'react'
import { logoutTeam } from '@/dashboard/lib/actions/auth/logout-admin'
import {
  LayoutDashboard,
  ClipboardList,
  ChevronsUpDown,
  Check,
  X,
  LogOut,
} from 'lucide-react'

const NAV_GROUPS = [
  {
    label: 'Workspace',
    items: [
      { href: '/team/dashboard', label: 'Dashboard', icon: LayoutDashboard, matchPrefixes: ['/team/dashboard', '/team/projects', '/team/communications'] },
      { href: '/team/work', label: 'My Work', icon: ClipboardList, matchPrefixes: ['/team/work', '/team/video-tracker'] },
    ],
  },
]

interface TeamSidebarProps {
  userName?: string
  userInitials?: string
}

export function TeamSidebar({ userName = 'Team Member', userInitials = 'T' }: TeamSidebarProps) {
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
              <div className="p-ws-mark">T</div>
              <div className="p-ws-name">
                <span className="p-sidebar-brand-name">Elevique</span>
                <span className="p-sidebar-role-tag">Team Workspace</span>
              </div>
              <ChevronsUpDown size={14} className="p-ws-chevron" />
            </button>

            {wsOpen && (
              <div className="p-ws-dropdown">
                <button type="button" className="p-ws-dropdown-item active">
                  <div className="p-ws-mark" style={{ width: 22, height: 22, fontSize: '0.7rem' }}>T</div>
                  Team Workspace
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
                  const active = item.matchPrefixes.some(prefix => pathname === prefix || pathname.startsWith(prefix + '/'))
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
              <div className="p-user-role">Team Member</div>
            </div>
            <form action={logoutTeam}>
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
