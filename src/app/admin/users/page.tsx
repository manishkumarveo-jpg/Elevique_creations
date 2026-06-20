import Link from 'next/link'
import { getAllProfiles } from '@/lib/queries/users'
import { UsersTable } from './UsersTable'

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

      <UsersTable users={users} />
    </div>
  )
}
