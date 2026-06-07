import { createServerClient } from '@/lib/supabase/server'
import { getClientsWithAssignment, getTeamMembers } from '@/lib/queries/users'
import { ClientAssignmentRow } from './ClientAssignmentRow'

export default async function ClientsPage() {
  let clients: Awaited<ReturnType<typeof getClientsWithAssignment>> = []
  let teamMembers: Awaited<ReturnType<typeof getTeamMembers>> = []
  let migrationMissing = false
  let projectCounts: Record<string, number> = {}

  try {
    const supabase = await createServerClient()
    ;[clients, teamMembers] = await Promise.all([
      getClientsWithAssignment(),
      getTeamMembers(),
    ])
    // Get active project count per client
    const { data: projectData } = await supabase
      .from('projects')
      .select('client_id')
      .neq('status', 'completed')
      .eq('is_archived', false)
    for (const p of projectData ?? []) {
      if (p.client_id) projectCounts[p.client_id] = (projectCounts[p.client_id] ?? 0) + 1
    }
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

  const assigned      = clients.filter(c => c.assigned_team_member_id)
  const unassigned    = clients.filter(c => !c.assigned_team_member_id)
  const activeClients = clients.filter(c => c.is_active)
  const totalActive   = Object.values(projectCounts).reduce((s, n) => s + n, 0)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Header */}
      <div className="p-ecosystem-header-bar">
        <div>
          <h1 className="p-ecosystem-title">Client Ecosystem</h1>
          <p className="p-ecosystem-sub">
            Manage and monitor {clients.length} strategic client partnership{clients.length !== 1 ? 's' : ''}.
          </p>
        </div>
        <div className="p-ecosystem-actions">
          <button className="p-btn-filter" type="button">
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 13, height: 13 }}>
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filter
          </button>
          <a href="/admin/users/new" className="p-btn-new-client">
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 13, height: 13 }}>
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Client
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="p-ecosystem-stats">
        <div className="p-ecosystem-stat">
          <p className="p-ecosystem-stat-label">Total Clients</p>
          <p className="p-ecosystem-stat-value">{clients.length}</p>
        </div>
        <div className="p-ecosystem-stat">
          <p className="p-ecosystem-stat-label">Active Projects</p>
          <p className="p-ecosystem-stat-value">
            {totalActive}
            <span style={{ fontSize: '0.85rem', color: 'var(--p-t3)', fontWeight: 300, marginLeft: '0.3rem' }}>/ {clients.length} total</span>
          </p>
        </div>
        <div className="p-ecosystem-stat">
          <p className="p-ecosystem-stat-label">Assignment Coverage</p>
          <p className="p-ecosystem-stat-value">
            {clients.length > 0 ? Math.round((assigned.length / clients.length) * 100) : 0}
            <span style={{ fontSize: '1rem', color: 'var(--p-t3)', fontWeight: 300 }}>%</span>
          </p>
          <div className="p-analytics-bar-track" style={{ marginTop: '0.5rem' }}>
            <div
              className="p-analytics-bar-fill"
              style={{ width: clients.length > 0 ? `${Math.round((assigned.length / clients.length) * 100)}%` : '0%' }}
            />
          </div>
        </div>
      </div>

      {/* Client table */}
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
        <div style={{ background: 'var(--p-s1)', border: '1px solid var(--p-b1)', borderRadius: 16, overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
            gap: '1rem',
            padding: '0.625rem 1.125rem',
            borderBottom: '1px solid var(--p-b1)',
          }}>
            {['Client', 'Team Member', 'Projects', 'Status', ''].map(h => (
              <span key={h} style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--p-t3)' }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {clients.map(client => {
            const assignedMember = teamMembers.find(m => m.id === client.assigned_team_member_id)
            const activeCount = projectCounts[client.id] ?? 0

            return (
              <div
                key={client.id}
                className="p-ecosystem-client-row"
                style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr auto', display: 'grid', gap: '1rem', alignItems: 'center' }}
              >
                {/* Logo + name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="p-ecosystem-logo">
                    {(client.company_name ?? client.full_name)?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p className="p-ecosystem-client-name">{client.full_name}</p>
                    <p className="p-ecosystem-client-domain">{client.company_name ?? client.email}</p>
                  </div>
                </div>

                {/* Assigned team member */}
                <div>
                  {assignedMember ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="p-avatar-sm">{assignedMember.full_name[0].toUpperCase()}</div>
                      <span style={{ fontSize: '0.73rem', color: 'var(--p-t2)' }}>{assignedMember.full_name.split(' ')[0]}</span>
                    </div>
                  ) : (
                    <ClientAssignmentRow client={client} teamMembers={teamMembers} compact />
                  )}
                </div>

                {/* Project count */}
                <div>
                  <span style={{ fontSize: '0.78rem', color: activeCount > 0 ? 'var(--p-t1)' : 'var(--p-t3)', fontWeight: activeCount > 0 ? 500 : 400 }}>
                    {activeCount} active
                  </span>
                </div>

                {/* Status chip */}
                <div>
                  <span className={client.is_active ? 'p-chip p-chip--active' : 'p-chip p-chip--inactive'}>
                    {client.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Three-dot menu */}
                <button className="p-dot-menu" type="button" title="Options">
                  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14 }}>
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Summary */}
      <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
        <span className="p-stat-chip p-stat-chip--teal">{activeClients.length} active clients</span>
        <span className="p-stat-chip p-stat-chip--amber">{unassigned.length} unassigned</span>
        <span className="p-stat-chip p-stat-chip--muted">{teamMembers.length} team members available</span>
      </div>
    </div>
  )
}
