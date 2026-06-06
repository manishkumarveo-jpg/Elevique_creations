'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutClient } from '@/lib/actions/auth/logout-admin'

const navItems = [
  {
    href: '/portal/dashboard',
    label: 'My Projects',
    icon: (
      <svg className="p-nav-icon" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
      </svg>
    ),
  },
]

export function ClientSidebar() {
  const pathname = usePathname()
  return (
    <aside className="p-sidebar">
      <div className="p-sidebar-header">
        <div className="p-sidebar-logo-box">
          <span className="p-sidebar-logo-letter">E</span>
        </div>
        <div>
          <p className="p-sidebar-brand-name">Elevique</p>
          <p className="p-sidebar-role-tag">Client Portal</p>
        </div>
      </div>

      <nav className="p-sidebar-nav">
        {navItems.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`p-nav-item${active ? ' active' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-sidebar-footer">
        <form action={logoutClient}>
          <button type="submit" className="p-signout-btn">
            <svg className="p-nav-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
