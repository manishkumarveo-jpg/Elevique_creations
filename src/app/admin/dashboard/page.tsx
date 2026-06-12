import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { getRecentActivity } from '@/lib/queries/activity'
import { getProjectsWithTeam } from '@/lib/queries/projects'
import { ProjectStatusBadge, RoleBadge } from '@/components/shared/StatusBadge'
import { Avatar } from '@/components/ui/Avatar'

async function getStats() {
  const supabase = await createServerClient()
  const [clientsRes, teamRes, deliveredRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'client'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'team_member'),
    supabase.from('deliverables').select('id', { count: 'exact', head: true }).eq('status', 'delivered'),
  ])
  return {
    totalClients: clientsRes.count ?? 0,
    totalTeam: teamRes.count ?? 0,
    awaitingApproval: deliveredRes.count ?? 0,
  }
}

const STATUS_ORDER = ['in_progress', 'final_review', 'briefing', 'paused', 'completed'] as const

function getThumbGradient(index: number) {
  const gradients = [
    'linear-gradient(135deg, rgba(124,58,237,0.40) 0%, rgba(20,184,166,0.30) 100%)',
    'linear-gradient(135deg, rgba(20,184,166,0.35) 0%, rgba(96,165,250,0.30) 100%)',
    'linear-gradient(135deg, rgba(251,146,60,0.30) 0%, rgba(124,58,237,0.35) 100%)',
    'linear-gradient(135deg, rgba(96,165,250,0.35) 0%, rgba(52,211,153,0.25) 100%)',
    'linear-gradient(135deg, rgba(52,211,153,0.30) 0%, rgba(20,184,166,0.35) 100%)',
  ]
  return gradients[index % gradients.length]
}

function getStatusBadgeClass(status: string) {
  if (status === 'in_progress') return 'p-project-thumb-badge--active'
  if (status === 'final_review') return 'p-project-thumb-badge--review'
  if (status === 'paused') return 'p-project-thumb-badge--paused'
  return 'p-project-thumb-badge--pending'
}

function getStatusLabel(status: string) {
  if (status === 'in_progress') return 'ACTIVE'
  if (status === 'final_review') return 'IN REVIEW'
  if (status === 'paused') return 'PAUSED'
  if (status === 'completed') return 'COMPLETED'
  return 'BRIEFING'
}

export default async function AdminDashboardPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('full_name').eq('id', user.id).single()
    : { data: null }

  const [stats, projects, activity] = await Promise.all([
    getStats(),
    getProjectsWithTeam(),
    getRecentActivity(8),
  ])

  const activeProjects = projects.filter(p => p.status !== 'completed')
  const noTeam   = projects.filter(p => p.team.length === 0 && p.status !== 'completed')
  const overdue  = projects.filter(p => p.client_deadline && new Date(p.client_deadline) < new Date() && p.status !== 'completed')
  const attention = noTeam.length + overdue.length

  const totalMilestones = projects.reduce((s, p) => s + p.milestone_total, 0)
  const doneMilestones  = projects.reduce((s, p) => s + p.milestone_done, 0)
  const globalPct = totalMilestones > 0 ? Math.round((doneMilestones / totalMilestones) * 100) : 0

  const sorted = [...projects].sort((a, b) =>
    STATUS_ORDER.indexOf(a.status as typeof STATUS_ORDER[number]) -
    STATUS_ORDER.indexOf(b.status as typeof STATUS_ORDER[number])
  )

  const displayName = profile?.full_name?.split(' ')[0] ?? 'Admin'

  // SVG circle values
  const r = 36, circ = 2 * Math.PI * r
  const dash = (globalPct / 100) * circ

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Welcome hero */}
      <div className="p-welcome-card">
        <h1 className="p-welcome-title">Welcome back, {displayName}.</h1>
        <p className="p-welcome-sub">
          Your design ecosystem is performing. You have{' '}
          <strong style={{ color: 'var(--p-t1)' }}>{stats.awaitingApproval} pending approval{stats.awaitingApproval !== 1 ? 's' : ''}</strong>{' '}
          and{' '}
          <strong style={{ color: 'var(--p-t1)' }}>{activeProjects.length} active project{activeProjects.length !== 1 ? 's' : ''}</strong>{' '}
          this week.
        </p>
        <div className="p-welcome-actions">
          <Link href="/admin/projects" className="p-welcome-btn-primary">Review Pipeline</Link>
          <button className="p-welcome-btn-secondary" type="button">Schedule Meeting</button>
        </div>
      </div>

      {/* Alerts */}
      {(noTeam.length > 0 || overdue.length > 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {noTeam.length > 0 && (
            <div className="p-alert p-alert--warn">
              <span className="p-alert-dot" />
              {noTeam.length} project{noTeam.length > 1 ? 's have' : ' has'} no team assigned
              <div className="p-alert-links">
                {noTeam.slice(0, 3).map(p => (
                  <Link key={p.id} href={`/admin/projects/${p.id}`} className="p-alert-link">{p.name}</Link>
                ))}
              </div>
            </div>
          )}
          {overdue.length > 0 && (
            <div className="p-alert p-alert--danger">
              <span className="p-alert-dot" />
              {overdue.length} project{overdue.length > 1 ? 's are' : ' is'} past deadline
              <div className="p-alert-links">
                {overdue.slice(0, 3).map(p => (
                  <Link key={p.id} href={`/admin/projects/${p.id}`} className="p-alert-link">{p.name}</Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stat row */}
      <div className="p-dash-stat-row">
        {/* Circular progress */}
        <div className="p-stat" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem 1rem' }}>
          <p className="p-stat-label" style={{ textAlign: 'center', marginBottom: '1rem' }}>Global Progress</p>
          <div style={{ position: 'relative', width: 90, height: 90 }}>
            <svg width="90" height="90" viewBox="0 0 90 90">
              <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
              <circle
                cx="45" cy="45" r={r} fill="none"
                stroke="url(#circGrad)" strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circ}`}
                strokeDashoffset={circ * 0.25}
                transform="rotate(-90 45 45)"
              />
              <defs>
                <linearGradient id="circGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#14B8A6" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', fontWeight: 600, color: 'var(--p-t1)' }}>
              {globalPct}%
            </div>
          </div>
        </div>

        {/* Awaiting approval */}
        <div className="p-stat">
          <p className="p-stat-label">Awaiting Approval</p>
          <p className="p-stat-value" style={{ fontSize: '2.6rem', fontWeight: 200 }}>
            {String(stats.awaitingApproval).padStart(2, '0')}
          </p>
          {stats.awaitingApproval > 0 && (
            <p style={{ fontSize: '0.65rem', color: 'var(--p-amber)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
              Due for review
            </p>
          )}
        </div>

        {/* Needs attention */}
        <div className="p-stat">
          <p className="p-stat-label">Needs Attention</p>
          <p className={`p-stat-value${attention > 0 ? ' p-stat-value--warn' : ''}`} style={{ fontSize: '2.6rem', fontWeight: 200 }}>
            {String(attention).padStart(2, '0')}
          </p>
          <p style={{ fontSize: '0.65rem', color: 'var(--p-t3)', marginTop: '0.5rem' }}>
            {activeProjects.length} active project{activeProjects.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Two-column: project cards + activity */}
      <div className="p-dash-main-grid">

        {/* Active project cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div className="p-section-header">
            <p className="p-section-label">Active Projects</p>
            <Link href="/admin/projects" className="p-link-teal">View all</Link>
          </div>

          {activeProjects.length === 0 ? (
            <div className="p-empty">
              <div className="p-empty-icon-wrap">
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              </div>
              <p className="p-empty-title">No active projects</p>
            </div>
          ) : (
            <div className="p-card-grid">
              {activeProjects.slice(0, 4).map((project, i) => {
                const progress = project.milestone_total > 0
                  ? Math.round((project.milestone_done / project.milestone_total) * 100)
                  : null

                return (
                  <Link key={project.id} href={`/admin/projects/${project.id}`} className="p-project-card" style={{ textDecoration: 'none' }}>
                    <div className="p-project-thumb">
                      <div className="p-project-thumb-gradient" style={{ background: getThumbGradient(i) }} />
                      <span className={`p-project-thumb-badge ${getStatusBadgeClass(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </div>

                    <p className="p-project-card-name">{project.name}</p>
                    <p className="p-project-card-client" style={{ marginTop: '0.25rem', marginBottom: '0.75rem' }}>
                      {project.client?.company_name ?? project.client?.full_name ?? '—'}
                    </p>

                    {progress !== null && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                          <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--p-t3)' }}>
                            Milestone Progress
                          </span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--p-t2)', fontWeight: 600 }}>{progress}%</span>
                        </div>
                        <div className="p-progress-track" style={{ height: 4 }}>
                          <div className="p-progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="p-project-card-footer">
                      <span className="p-project-card-date">
                        {project.client_deadline ? `Deadline: ${new Date(project.client_deadline + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'No deadline'}
                      </span>
                      <span className="p-link-teal" style={{ fontSize: '0.72rem' }}>View details →</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* All projects list below cards */}
          {sorted.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <p className="p-section-label" style={{ marginBottom: '0.25rem' }}>All Projects</p>
              {sorted.map(project => {
                const progress = project.milestone_total > 0
                  ? Math.round((project.milestone_done / project.milestone_total) * 100)
                  : null
                return (
                  <Link key={project.id} href={`/admin/projects/${project.id}`} className="p-project-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.1rem' }}>
                        <span className="p-project-name">{project.name}</span>
                        <ProjectStatusBadge status={project.status} />
                      </div>
                      <p className="p-project-meta">
                        {project.client?.company_name ?? project.client?.full_name ?? '—'}
                        {project.client_deadline ? ` · Due ${project.client_deadline}` : ''}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      {project.team.length > 0 ? (
                        <div className="p-avatar-stack">
                          {project.team.slice(0, 3).map(m => (
                            <Avatar key={m.id} name={m.full_name} size="sm" />
                          ))}
                          {project.team.length > 3 && (
                            <div className="p-avatar-sm p-avatar-overflow">+{project.team.length - 3}</div>
                          )}
                        </div>
                      ) : (
                        <span className="p-unassigned">Unassigned</span>
                      )}
                    </div>
                    {progress !== null && (
                      <div className="p-progress-wrap">
                        <div className="p-progress-track">
                          <div className="p-progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="p-progress-pct">{progress}%</span>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p className="p-section-label">Recent Activity</p>
          <div className="p-feed">
            {activity.length === 0 ? (
              <p style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--p-t3)' }}>No activity yet.</p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {activity.map(log => (
                  <li key={log.id} className="p-feed-item">
                    <div className="p-feed-avatar">
                      {(log.actor as { full_name?: string } | null)?.full_name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="p-feed-text">
                        <span className="p-feed-actor">
                          {(log.actor as { full_name?: string } | null)?.full_name ?? 'Unknown'}
                        </span>
                        {' '}{log.action.replace('.', ' ')}
                        {log.entity_name
                          ? <span className="p-feed-entity"> · {log.entity_name}</span>
                          : ''}
                      </p>
                      <div className="p-feed-row">
                        <span className="p-feed-time">{new Date(log.created_at).toLocaleString()}</span>
                        <RoleBadge role={log.actor_role} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
