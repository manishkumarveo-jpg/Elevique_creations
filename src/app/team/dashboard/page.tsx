import { createServerClient } from '@/lib/supabase/server'
import { getProjectsForTeam } from '@/lib/queries/projects'
import { getUpcomingMeetingsForTeam, getMissedMeetingsForTeam } from '@/lib/queries/meetings'
import Link from 'next/link'
import { FeaturedProjectCard } from '@/components/shared/FeaturedProjectCard'
import { ProjectStatusBadge } from '@/components/shared/StatusBadge'
import { MeetingAttendButton } from '@/components/team/MeetingAttendButton'
import { CalendarDays, Folder } from 'lucide-react'

function formatMeetingDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export default async function TeamDashboardPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('full_name').eq('id', user.id).single()
    : { data: null }

  const [projects, upcomingMeetings, missedMeetings] = await Promise.all([
    user ? getProjectsForTeam(user.id) : Promise.resolve([]),
    user ? getUpcomingMeetingsForTeam(user.id) : Promise.resolve([]),
    user ? getMissedMeetingsForTeam(user.id) : Promise.resolve([]),
  ])

  const activeProjects = projects.filter(p => p.status !== 'completed')
  const displayName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="p-content-wrap">
      <div style={{ marginBottom: '1.75rem' }}>
        <p className="p-eyebrow">Team Workspace</p>
        <h1 className="p-page-title">Good morning, {displayName}.</h1>
        <p className="p-page-sub">
          {activeProjects.length} active project{activeProjects.length !== 1 ? 's' : ''} assigned to you.
        </p>
      </div>

      {/* Missed meeting alert */}
      {missedMeetings.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="p-alert p-alert--warn">
            <span className="p-alert-dot" />
            You missed {missedMeetings.length} scheduled meeting{missedMeetings.length > 1 ? 's' : ''}
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
                padding: '0.625rem 0.875rem',
                background: 'var(--ds-surface-2)',
                border: '1px solid var(--ds-border)',
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
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ds-white)' }}>{m.title}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--ds-text-3)', marginTop: '0.1rem' }}>
                    {formatMeetingDate(m.scheduled_at)}
                    {m.client && ` · ${m.client.company_name ?? m.client.full_name}`}
                  </div>
                  {m.notes && (
                    <div style={{ fontSize: '11.5px', color: 'var(--ds-text-3)', marginTop: '0.15rem', fontStyle: 'italic' }}>
                      {m.notes}
                    </div>
                  )}
                </div>
                {!m.attended_by_team && <MeetingAttendButton meetingId={m.id} />}
                {m.attended_by_team && (
                  <span style={{ fontSize: '11px', color: '#0ED2BD', flexShrink: 0 }}>✓ Attended</span>
                )}
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
          <p className="p-empty-title">No projects assigned yet</p>
          <p className="p-empty-sub">Check back once the admin assigns you to a project.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Featured card grid */}
          {activeProjects.length > 0 && (
            <div>
              <div className="p-section-header" style={{ marginBottom: '0.75rem' }}>
                <span className="p-section-label">Active Projects</span>
              </div>
              <div className="p-card-grid">
                {activeProjects.slice(0, 4).map(p => {
                  const client = (p as { client?: { full_name?: string; company_name?: string } | null }).client ?? null
                  return (
                    <FeaturedProjectCard
                      key={p.id}
                      id={p.id}
                      name={p.name}
                      clientName={client?.company_name ?? client?.full_name ?? '—'}
                      status={p.status}
                      dueDate={p.internal_deadline ?? null}
                      milestoneDone={0}
                      milestoneTotal={0}
                      href={`/team/projects/${p.id}`}
                    />
                  )
                })}
              </div>
            </div>
          )}

          {/* All projects list */}
          <div>
            <div className="p-section-header" style={{ marginBottom: '0.5rem' }}>
              <span className="p-section-label">All Projects</span>
              <Link href="/team/projects" className="p-link-teal">View all →</Link>
            </div>
            <div className="p-project-rows">
              {projects.map(p => {
                const client = (p as { client?: { full_name?: string; company_name?: string } | null }).client ?? null
                return (
                  <Link key={p.id} href={`/team/projects/${p.id}`} className="p-project-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                        <span className="p-project-name">{p.name}</span>
                        <ProjectStatusBadge status={p.status} />
                      </div>
                      <div className="p-project-meta">
                        {client?.company_name ?? client?.full_name ?? '—'}
                        {p.internal_deadline
                          ? ` · Team due ${new Date(p.internal_deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${new Date(p.internal_deadline).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
                          : ''}
                      </div>
                    </div>
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
