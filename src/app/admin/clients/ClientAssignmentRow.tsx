'use client'

import { useState, useTransition } from 'react'
import { Avatar } from '@/dashboard/components/ui/Avatar'
import { Td, Tr } from '@/dashboard/components/ui/Table'
import { assignTeamMemberToClient } from '@/dashboard/lib/actions/users/assign-team-member'

interface TeamMember { id: string; full_name: string; email?: string | null }
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
  compact = false,
}: {
  client: Client
  teamMembers: TeamMember[]
  compact?: boolean
}) {
  const [selectedId, setSelectedId] = useState(client.assigned_team_member_id ?? '')
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value
    setSelectedId(value)
    startTransition(() => assignTeamMemberToClient(client.id, value || null))
  }

  const assigned = teamMembers.find(m => m.id === selectedId)

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {assigned && <Avatar name={assigned.full_name} size="sm" />}
        <select
          value={selectedId}
          onChange={handleChange}
          disabled={isPending}
          className="p-select"
          style={{ minWidth: 0, fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
        >
          <option value="">— Unassigned —</option>
          {teamMembers.map(m => (
            <option key={m.id} value={m.id}>{m.full_name}</option>
          ))}
        </select>
        {isPending && <span style={{ fontSize: '0.65rem', color: 'var(--p-teal)' }} className="animate-pulse">…</span>}
      </div>
    )
  }

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
            value={selectedId}
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
