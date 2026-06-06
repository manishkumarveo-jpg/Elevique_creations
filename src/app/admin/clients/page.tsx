import { getClientsWithAssignment, getTeamMembers } from '@/lib/queries/users'
import { Table, Thead, Tbody, Th } from '@/components/ui/Table'
import { ClientAssignmentRow } from './ClientAssignmentRow'

export default async function ClientsPage() {
  let clients: Awaited<ReturnType<typeof getClientsWithAssignment>> = []
  let teamMembers: Awaited<ReturnType<typeof getTeamMembers>> = []
  let migrationMissing = false

  try {
    ;[clients, teamMembers] = await Promise.all([
      getClientsWithAssignment(),
      getTeamMembers(),
    ])
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('assigned_team_member_id') || msg.includes('column')) {
      migrationMissing = true
    } else {
      throw err
    }
  }

  if (migrationMissing) {
    return (
      <div className="p-warn-box">
        <p style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>⚠</p>
        <h2 className="p-warn-box-title">Database migration required</h2>
        <p className="p-warn-box-sub">
          Run this SQL in <strong>Supabase → SQL Editor</strong> to enable client assignments:
        </p>
        <pre>{`ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS assigned_team_member_id UUID
    REFERENCES profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_assigned_team_member
  ON profiles(assigned_team_member_id)
  WHERE assigned_team_member_id IS NOT NULL;`}</pre>
        <p className="p-warn-box-hint">After running it, refresh this page.</p>
      </div>
    )
  }

  const assigned   = clients.filter(c => c.assigned_team_member_id)
  const unassigned = clients.filter(c => !c.assigned_team_member_id)

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <p className="p-eyebrow">Admin</p>
        <h1 className="p-page-title">Client Assignments</h1>
        <p className="p-page-sub">Assign a team member as the primary contact for each client.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
        <span className="p-stat-chip p-stat-chip--teal">{assigned.length} assigned</span>
        <span className="p-stat-chip p-stat-chip--amber">{unassigned.length} unassigned</span>
        <span className="p-stat-chip p-stat-chip--muted">{teamMembers.length} team members available</span>
      </div>

      {clients.length === 0 ? (
        <div className="p-empty">
          <div className="p-empty-icon-wrap">
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5z" clipRule="evenodd" />
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>
          </div>
          <p className="p-empty-title">No clients yet</p>
          <p className="p-empty-sub">Create client accounts from the Users page first.</p>
        </div>
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Client</Th>
              <Th>Company</Th>
              <Th>Status</Th>
              <Th>Assigned Team Member</Th>
            </tr>
          </Thead>
          <Tbody>
            {clients.map(client => (
              <ClientAssignmentRow key={client.id} client={client} teamMembers={teamMembers} />
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  )
}
