'use client'

import { useTransition } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Td, Tr } from '@/components/ui/Table'
import { assignTeamMemberToClient } from '@/lib/actions/users/assign-team-member'

interface TeamMember { id: string; full_name: string; email: string }
interface Client {
  id: string
  full_name: string
  email: string
  company_name: string | null
  is_active: boolean
  assigned_team_member_id: string | null
}

export function ClientAssignmentRow({
  client,
  teamMembers,
}: {
  client: Client
  teamMembers: TeamMember[]
}) {
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value || null
    startTransition(() => assignTeamMemberToClient(client.id, value))
  }

  const assigned = teamMembers.find(m => m.id === client.assigned_team_member_id)

  return (
    <Tr>
      <Td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Avatar name={client.full_name} size="sm" />
          <div>
            <p className="p-table-name">{client.full_name}</p>
            <p className="p-table-sub">{client.email}</p>
          </div>
        </div>
      </Td>
      <Td>{client.company_name ?? <span style={{ color: 'var(--p-t3)' }}>—</span>}</Td>
      <Td>
        <span className={`p-chip ${client.is_active ? 'p-chip--active' : 'p-chip--inactive'}`}>
          {client.is_active ? 'Active' : 'Inactive'}
        </span>
      </Td>
      <Td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          {assigned && <Avatar name={assigned.full_name} size="sm" />}
          <select
            defaultValue={client.assigned_team_member_id ?? ''}
            onChange={handleChange}
            disabled={isPending}
            className="p-select"
          >
            <option value="">— Unassigned —</option>
            {teamMembers.map(m => (
              <option key={m.id} value={m.id}>{m.full_name}</option>
            ))}
          </select>
          {isPending && (
            <span style={{ fontSize: '0.7rem', color: 'var(--p-teal)' }} className="animate-pulse">
              Saving…
            </span>
          )}
        </div>
      </Td>
    </Tr>
  )
}
