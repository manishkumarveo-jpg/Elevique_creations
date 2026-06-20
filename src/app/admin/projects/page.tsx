import Link from 'next/link'
import { getProjectsWithTeam } from '@/lib/queries/projects'
import { ProjectsListView } from './ProjectsListView'

export default async function AdminProjectsPage() {
  const projects = await getProjectsWithTeam()

  return (
    <div className="p-content-wrap">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <p className="p-eyebrow">Admin</p>
          <h1 className="p-page-title">Projects</h1>
          <p className="p-page-sub">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/projects/new" className="p-btn-primary" style={{ textDecoration: 'none' }}>
          + New Project
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
          <p className="p-empty-sub">Create your first project to get started.</p>
        </div>
      ) : (
        <ProjectsListView projects={projects} />
      )}
    </div>
  )
}
