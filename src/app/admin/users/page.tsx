import Link from 'next/link'
import { getAllProfiles } from '@/lib/queries/users'
import { Table, Thead, Tbody, Th, Td, Tr } from '@/components/ui/Table'
import { RoleBadge } from '@/components/shared/StatusBadge'
import { Avatar } from '@/components/ui/Avatar'
import { ToggleActiveButton } from './ToggleActiveButton'

export default async function UsersPage() {
  const users = await getAllProfiles()

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p className="p-eyebrow">Admin</p>
          <h1 className="p-page-title">Users</h1>
        </div>
        <Link href="/admin/users/new">
          <button type="button" className="auth-btn" style={{ width: 'auto', padding: '0.55rem 1.25rem', marginTop: 0 }}>
            + New User
          </button>
        </Link>
      </div>

      <Table>
        <Thead>
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Company</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </tr>
        </Thead>
        <Tbody>
          {users.map(user => (
            <Tr key={user.id}>
              <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Avatar name={user.full_name} size="sm" />
                  <span className="p-table-name">{user.full_name}</span>
                </div>
              </Td>
              <Td>{user.email}</Td>
              <Td><RoleBadge role={user.role} /></Td>
              <Td>{user.company_name ?? <span style={{ color: 'var(--p-t3)' }}>—</span>}</Td>
              <Td>
                <span className={`p-chip ${user.is_active ? 'p-chip--active' : 'p-chip--inactive'}`}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </Td>
              <Td>
                <ToggleActiveButton userId={user.id} isActive={user.is_active} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  )
}
