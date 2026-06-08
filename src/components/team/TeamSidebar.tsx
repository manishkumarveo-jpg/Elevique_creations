'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { logoutTeam } from '@/lib/actions/auth/logout-admin'

const navItems = [
  {
    href: '/team/dashboard',
    label: 'Projects',
    matchPrefix: '/team/projects',
    icon: (
      <svg className="p-nav-icon" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
      </svg>
    ),
  },
  {
    href: '/team/communications',
    label: 'Communications',
    icon: (
      <svg className="p-nav-icon" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
      </svg>
    ),
  },
]

export function TeamSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const open = () => setMobileOpen(true)
    window.addEventListener('p:open-sidebar', open)
    return () => window.removeEventListener('p:open-sidebar', open)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      {mobileOpen && (
        <div className="p-overlay" onClick={() => setMobileOpen(false)} />
      )}
      <aside className={`p-sidebar${mobileOpen ? ' open' : ''}`}>
        <div className="p-sidebar-header">
          <div className="p-sidebar-logo-box">
            <span className="p-sidebar-logo-letter">E</span>
          </div>
          <div style={{ flex: 1 }}>
            <p className="p-sidebar-brand-name">Elevique</p>
            <p className="p-sidebar-role-tag">Team</p>
          </div>
          <button className="p-sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <nav className="p-sidebar-nav">
          {navItems.map(item => {
            const matchPath = 'matchPrefix' in item ? (item as { matchPrefix: string }).matchPrefix : item.href
            const active = pathname === item.href || pathname.startsWith(matchPath + '/')
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={`p-nav-item${active ? ' active' : ''}`}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '0 0 0.25rem' }}>
          <Link href="/team/projects/new" className="p-sidebar-cta">
            <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Project
          </Link>
        </div>

        <div className="p-sidebar-footer">
          <form action={logoutTeam}>
            <button type="submit" className="p-signout-btn">
              <svg className="p-nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
