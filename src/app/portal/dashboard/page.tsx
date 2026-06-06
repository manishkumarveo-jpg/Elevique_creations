import { createServerClient } from '@/lib/supabase/server'
import { getProjectsForClient } from '@/lib/queries/projects'
import Link from 'next/link'
import { ProjectStatusBadge } from '@/components/shared/StatusBadge'

export default async function ClientDashboardPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const projects = user ? await getProjectsForClient(user.id) : []

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <p className="p-eyebrow">Portal</p>
        <h1 className="p-page-title">My Projects</h1>
        <p className="p-page-sub">Track the progress of your active projects</p>
      </div>

      {projects.length === 0 ? (
        <div className="p-empty">
          <div className="p-empty-icon-wrap">
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          </div>
          <p className="p-empty-title">No active projects</p>
          <p className="p-empty-sub">Your projects will appear here once created by our team</p>
        </div>
      ) : (
        <div className="p-card-grid">
          {projects.map(project => (
            <Link key={project.id} href={`/portal/projects/${project.id}`} className="p-project-card">
              <div className="p-project-card-header">
                <h3 className="p-project-card-name">{project.name}</h3>
                <ProjectStatusBadge status={project.status} />
              </div>
              {project.package && (
                <p className="p-project-card-package">{project.package}</p>
              )}
              <div className="p-project-card-footer">
                {project.deadline && (
                  <span className="p-project-card-date">Due {project.deadline}</span>
                )}
                <span className="p-project-card-date" style={{ marginLeft: 'auto' }}>
                  Started {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
