import { createServerClient } from '@/shared/lib/supabase/server'
import { getProjectsForClient } from '@/dashboard/lib/queries/projects'
import { getUpcomingMeetingsForClient, getMissedMeetingsForClient } from '@/dashboard/lib/queries/meetings'
import { FeaturedProjectCard } from '@/dashboard/components/shared/FeaturedProjectCard'
import { ProjectStatusBadge } from '@/dashboard/components/shared/StatusBadge'
import Link from 'next/link'
import { CalendarDays, Folder } from 'lucide-react'

function formatMeetingDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) +
    ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export default async function ClientDashboardPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('full_name, company_name').eq('id', user.id).single()
    : { data: null }

  const [projects, upcomingMeetings, missedMeetings] = await Promise.all([
    user ? getProjectsForClient(user.id) : Promise.resolve([]),
    user ? getUpcomingMeetingsForClient(user.id) : Promise.resolve([]),
    user ? getMissedMeetingsForClient(user.id) : Promise.resolve([]),
  ])

  const milestoneData = projects.length > 0
    ? await supabase
        .from('milestones')
        .select('project_id, status')
        .in('project_id', projects.map(p => p.id))
    : { data: [] }

  const mByProject: Record<string, { total: number; done: number }> = {}
  for (const m of milestoneData.data ?? []) {
    if (!mByProject[m.project_id]) mByProject[m.project_id] = { total: 0, done: 0 }
    mByProject[m.project_id].total++
    if (m.status === 'done') mByProject[m.project_id].done++
  }

  const activeProjects = projects.filter(p => p.status !== 'completed')
  const displayName = profile?.company_name ?? profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="p-content-wrap">
      <div style={{ marginBottom: '1.75rem' }}>
        <p className="p-eyebrow">Client Portal</p>
        <h1 className="p-page-title">Hello, {displayName}.</h1>
        <p className="p-page-sub">
          {activeProjects.length} active project{activeProjects.length !== 1 ? 's' : ''} in progress.
        </p>
      </div>

      {/* Missed meeting alert */}
      {missedMeetings.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="p-alert p-alert--warn">
            <span className="p-alert-dot" />
            A scheduled meeting was missed — please contact your team
            <div className="p-alert-links">
              {missedMeetings.map(m => (
                <span key={m.id} className="p-alert-link" style={{ cursor: 'default' }}>{m.title}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upcoming meetings */}
      {upcomingMeetings.length > 0 && (
        <div style={{ marginBottom: '1.75rem' }}>
          <div className="p-section-header" style={{ marginBottom: '0.625rem' }}>
            <span className="p-section-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <CalendarDays size={13} />
              Upcoming Meetings
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {upcomingMeetings.map(m => (
              <div key={m.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '0.75rem 1rem',
                background: 'var(--ds-surface-2)',
                border: '1px solid rgba(14,210,189,0.18)',
                borderRadius: '8px',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '8px',
                  background: 'rgba(14,210,189,0.08)',
                  border: '1px solid rgba(14,210,189,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <CalendarDays size={15} style={{ color: '#0ED2BD' }} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ds-white)' }}>{m.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ds-text-3)', marginTop: '0.15rem' }}>
                    {formatMeetingDate(m.scheduled_at)}
                  </div>
                  {m.notes && (
                    <div style={{ fontSize: '12px', color: 'var(--ds-text-3)', marginTop: '0.15rem', fontStyle: 'italic' }}>
                      {m.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="p-empty">
          <div className="p-empty-icon-wrap">
            <Folder size={20} />
          </div>
          <p className="p-empty-title">No active projects</p>
          <p className="p-empty-sub">Your projects will appear here once created by our team.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {activeProjects.length > 0 && (
            <div>
              <div className="p-section-header" style={{ marginBottom: '0.75rem' }}>
                <span className="p-section-label">Your Projects</span>
              </div>
              <div className="p-card-grid">
                {activeProjects.slice(0, 4).map(p => {
                  const ms = mByProject[p.id]
                  return (
                    <FeaturedProjectCard
                      key={p.id}
                      id={p.id}
                      name={p.name}
                      clientName={p.package ?? ''}
                      status={p.status}
                      dueDate={p.client_deadline ?? null}
                      milestoneDone={ms?.done ?? 0}
                      milestoneTotal={ms?.total ?? 0}
                      href={`/portal/projects/${p.id}`}
                    />
                  )
                })}
              </div>
            </div>
          )}

          <div>
            <div className="p-section-header" style={{ marginBottom: '0.5rem' }}>
              <span className="p-section-label">All Projects</span>
              <Link href="/portal/projects" className="p-link-teal">View all →</Link>
            </div>
            <div className="p-project-rows">
              {projects.map(p => {
                const ms = mByProject[p.id]
                const pct = ms && ms.total > 0 ? Math.round((ms.done / ms.total) * 100) : null
                return (
                  <Link key={p.id} href={`/portal/projects/${p.id}`} className="p-project-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                        <span className="p-project-name">{p.name}</span>
                        <ProjectStatusBadge status={p.status} />
                      </div>
                      <div className="p-project-meta">
                        {p.package ?? ''}
                        {p.client_deadline
                          ? ` · Delivery ${new Date(p.client_deadline + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                          : ''}
                      </div>
                    </div>
                    {pct !== null && (
                      <div className="p-progress-wrap">
                        <div className="p-progress-track">
                          <div className="p-progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="p-progress-pct">{pct}%</span>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
