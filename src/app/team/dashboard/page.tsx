import { createServerClient } from '@/lib/supabase/server'
import { getProjectsForTeam } from '@/lib/queries/projects'
import Link from 'next/link'
import { ProjectStatusBadge } from '@/components/shared/StatusBadge'

export default async function TeamDashboardPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const projects = user ? await getProjectsForTeam(user.id) : []

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <p className="p-eyebrow">Team</p>
        <h1 className="p-page-title">My Projects</h1>
        <p className="p-page-sub">Projects assigned to you</p>
      </div>

      {projects.length === 0 ? (
        <div className="p-empty">
          <div className="p-empty-icon-wrap">
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          </div>
          <p className="p-empty-title">No projects assigned yet</p>
          <p className="p-empty-sub">Check back once the admin assigns you to a project</p>
        </div>
      ) : (
        <div className="p-card-grid">
          {projects.map(project => {
            const client = project.client as { full_name?: string; company_name?: string } | null
            return (
              <Link key={project.id} href={`/team/projects/${project.id}`} className="p-project-card">
                <div className="p-project-card-header">
                  <h3 className="p-project-card-name">{project.name}</h3>
                  <ProjectStatusBadge status={project.status} />
                </div>
                {(client?.company_name ?? client?.full_name) && (
                  <p className="p-project-card-client">
                    {client?.company_name ?? client?.full_name}
                  </p>
                )}
                {project.deadline && (
                  <div className="p-project-card-footer">
                    <span className="p-project-card-date">Due {project.deadline}</span>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
