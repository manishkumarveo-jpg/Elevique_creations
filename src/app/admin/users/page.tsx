import Link from 'next/link'
import { getAllProfiles } from '@/lib/queries/users'
import { RoleBadge } from '@/components/shared/StatusBadge'
import { Avatar } from '@/components/ui/Avatar'
import { ToggleActiveButton } from './ToggleActiveButton'
import { Eye } from 'lucide-react'

export default async function UsersPage() {
  const users = await getAllProfiles()

  return (
    <div className="p-content-wrap">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <p className="p-eyebrow">Admin</p>
          <h1 className="p-page-title">Users</h1>
          <p className="p-page-sub">{users.length} user{users.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/users/new" className="p-btn-primary" style={{ textDecoration: 'none' }}>
          + New User
        </Link>
      </div>

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
            {users.map(user => (
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
    </div>
  )
}
