import Link from 'next/link'
import { getProjectsWithTeam } from '@/lib/queries/projects'
import { ProjectStatusBadge } from '@/components/shared/StatusBadge'
import { Avatar } from '@/components/ui/Avatar'

export default async function AdminProjectsPage() {
  const projects = await getProjectsWithTeam()

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <p className="p-eyebrow">Admin</p>
          <h1 className="p-page-title">Projects</h1>
          <p className="p-page-sub">
            {projects.length} active project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/projects/new">
          <button className="auth-btn" style={{ width: 'auto', padding: '0.55rem 1.25rem', marginTop: 0 }}>
            + New Project
          </button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="p-empty">
          <div className="p-empty-icon-wrap">
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          </div>
          <p className="p-empty-title">No projects yet</p>
          <p className="p-empty-sub">Create your first project to get started</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {projects.map(project => {
            const progress = project.milestone_total > 0
              ? Math.round((project.milestone_done / project.milestone_total) * 100)
              : null

            return (
              <Link key={project.id} href={`/admin/projects/${project.id}`} className="p-project-row">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span className="p-project-name">{project.name}</span>
                    <ProjectStatusBadge status={project.status} />
                  </div>
                  <p className="p-project-meta">
                    {project.client?.company_name ?? project.client?.full_name ?? '—'}
                    {project.package ? ` · ${project.package}` : ''}
                    {project.deadline ? ` · Due ${project.deadline}` : ''}
                  </p>
                </div>

                <div style={{ flexShrink: 0 }}>
                  {project.team.length > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="p-project-meta">Team:</span>
                      <div className="p-avatar-stack">
                        {project.team.slice(0, 4).map(m => (
                          <Avatar key={m.id} name={m.full_name} size="sm" />
                        ))}
                        {project.team.length > 4 && (
                          <div className="p-avatar-sm p-avatar-overflow">+{project.team.length - 4}</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="p-unassigned">No team assigned</span>
                  )}
                </div>

                {progress !== null ? (
                  <div className="p-progress-wrap">
                    <div className="p-progress-track">
                      <div className="p-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="p-progress-pct">{progress}%</span>
                  </div>
                ) : (
                  <span className="p-progress-pct">No milestones</span>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
