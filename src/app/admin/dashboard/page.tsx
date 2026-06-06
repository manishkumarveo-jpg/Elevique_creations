import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { getRecentActivity } from '@/lib/queries/activity'
import { getProjectsWithTeam } from '@/lib/queries/projects'
import { ProjectStatusBadge, RoleBadge } from '@/components/shared/StatusBadge'
import { Avatar } from '@/components/ui/Avatar'

async function getStats() {
  const supabase = await createServerClient()
  const [usersRes, clientsRes, teamRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }).neq('role', 'admin'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'client'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'team_member'),
  ])
  return {
    totalUsers: usersRes.count ?? 0,
    totalClients: clientsRes.count ?? 0,
    totalTeam: teamRes.count ?? 0,
  }
}

const STATUS_ORDER = ['in_progress', 'final_review', 'briefing', 'paused', 'completed'] as const

export default async function AdminDashboardPage() {
  const [stats, projects, activity] = await Promise.all([
    getStats(),
    getProjectsWithTeam(),
    getRecentActivity(8),
  ])

  const activeProjects = projects.filter(p => p.status !== 'completed')
  const noTeam        = projects.filter(p => p.team.length === 0 && p.status !== 'completed')
  const overdue       = projects.filter(p => p.deadline && new Date(p.deadline) < new Date() && p.status !== 'completed')
  const attention     = noTeam.length + overdue.length

  const sorted = [...projects].sort((a, b) =>
    STATUS_ORDER.indexOf(a.status as typeof STATUS_ORDER[number]) -
    STATUS_ORDER.indexOf(b.status as typeof STATUS_ORDER[number])
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Header */}
      <div>
        <p className="p-eyebrow">Overview</p>
        <h1 className="p-page-title">Dashboard</h1>
        <p className="p-page-sub">Assign, monitor, and let the team run with it.</p>
      </div>

      {/* Stat cards */}
      <div className="p-stat-grid">
        <div className="p-stat">
          <p className="p-stat-label">Active Projects</p>
          <p className="p-stat-value">{activeProjects.length}</p>
        </div>
        <div className="p-stat">
          <p className="p-stat-label">Clients</p>
          <p className="p-stat-value">{stats.totalClients}</p>
        </div>
        <div className="p-stat">
          <p className="p-stat-label">Team Members</p>
          <p className="p-stat-value">{stats.totalTeam}</p>
        </div>
        <div className="p-stat">
          <p className="p-stat-label">Needs Attention</p>
          <p className={`p-stat-value${attention > 0 ? ' p-stat-value--warn' : ''}`}>{attention}</p>
        </div>
      </div>

      {/* Attention banners */}
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

      {/* Two-column: projects + activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* Projects */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="p-section-header">
            <p className="p-section-label">All Projects</p>
            <Link href="/admin/projects/new" className="p-link-teal">+ New Project</Link>
          </div>

          {sorted.length === 0 ? (
            <div className="p-empty">
              <div className="p-empty-icon-wrap">
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              </div>
              <p className="p-empty-title">No projects yet</p>
            </div>
          ) : (
            sorted.map(project => {
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
                      {project.deadline ? ` · Due ${project.deadline}` : ''}
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
            })
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
