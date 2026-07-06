'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { RoleBadge } from '@/dashboard/components/shared/StatusBadge'
import { Avatar } from '@/dashboard/components/ui/Avatar'
import { Pagination } from '@/dashboard/components/ui/Pagination'
import { ToggleActiveButton } from './ToggleActiveButton'
import { Eye } from 'lucide-react'
import type { Database } from '@/shared/lib/types/database'

type User = Database['public']['Tables']['profiles']['Row']

const ROLE_OPTIONS = ['All', 'admin', 'team_member', 'client'] as const
const STATUS_OPTIONS = ['All', 'active', 'inactive'] as const
const PAGE_SIZE = 10

const inputStyle: React.CSSProperties = {
  background: '#161d2e',
  border: '1px solid rgba(255,255,255,0.11)',
  borderRadius: 9,
  padding: '0.5rem 0.8rem',
  fontSize: '0.78rem',
  color: 'rgba(255,255,255,0.82)',
  outline: 'none',
  fontFamily: 'inherit',
}

export function UsersTable({ users }: { users: User[] }) {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<typeof ROLE_OPTIONS[number]>('All')
  const [status, setStatus] = useState<typeof STATUS_OPTIONS[number]>('All')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return users.filter(u => {
      if (role !== 'All' && u.role !== role) return false
      if (status === 'active' && !u.is_active) return false
      if (status === 'inactive' && u.is_active) return false
      if (!q) return true
      return u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    })
  }, [users, search, role, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function updateSearch(v: string) { setSearch(v); setPage(1) }
  function updateRole(v: typeof ROLE_OPTIONS[number]) { setRole(v); setPage(1) }
  function updateStatus(v: typeof STATUS_OPTIONS[number]) { setStatus(v); setPage(1) }

  return (
    <>
      <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={e => updateSearch(e.target.value)}
          style={{ ...inputStyle, minWidth: 220 }}
        />
        <select className="p-select" value={role} onChange={e => updateRole(e.target.value as typeof role)} style={{ width: 'auto' }}>
          {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r === 'All' ? 'All Roles' : r.replace('_', ' ')}</option>)}
        </select>
        <select className="p-select" value={status} onChange={e => updateStatus(e.target.value as typeof status)} style={{ width: 'auto' }}>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
        </select>
        <span style={{ fontSize: '0.78rem', color: 'var(--ds-text-3)', alignSelf: 'center', marginLeft: 'auto' }}>
          {filtered.length} of {users.length} users
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="p-empty">
          <p className="p-empty-title">No users match these filters</p>
        </div>
      ) : (
        <div className="p-table-wrap">
          <table className="p-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Company</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(user => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Avatar name={user.full_name} size="sm" />
                      <span className="p-table-name">{user.full_name}</span>
                    </div>
                  </td>
                  <td className="mono" style={{ color: 'var(--ds-text-3)' }}>{user.email}</td>
                  <td><RoleBadge role={user.role} /></td>
                  <td style={{ color: 'var(--ds-text-3)' }}>{user.company_name ?? '—'}</td>
                  <td>
                    <span className={`p-chip ${user.is_active ? 'p-chip--active' : 'p-chip--inactive'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ToggleActiveButton userId={user.id} isActive={user.is_active} />
                      {user.role === 'team_member' && (
                        <Link
                          href={`/admin/team/${user.id}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '11.5px',
                            color: 'var(--ds-text-3)',
                            textDecoration: 'none',
                            padding: '0.3rem 0.625rem',
                            borderRadius: 'var(--ds-radius-sm)',
                            border: '1px solid var(--ds-border)',
                            background: 'var(--ds-panel)',
                            transition: 'all 0.12s',
                            whiteSpace: 'nowrap',
                          }}
                          className="p-view-dashboard-btn"
                        >
                          <Eye size={12} />
                          View Dashboard
                        </Link>
                      )}
                      {user.role === 'client' && (
                        <Link
                          href={`/admin/clients/${user.id}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '11.5px',
                            color: 'var(--ds-text-3)',
                            textDecoration: 'none',
                            padding: '0.3rem 0.625rem',
                            borderRadius: 'var(--ds-radius-sm)',
                            border: '1px solid var(--ds-border)',
                            background: 'var(--ds-panel)',
                            transition: 'all 0.12s',
                            whiteSpace: 'nowrap',
                          }}
                          className="p-view-dashboard-btn"
                        >
                          <Eye size={12} />
                          View Portal
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
    </>
  )
}
