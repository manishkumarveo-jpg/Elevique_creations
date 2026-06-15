import { createServerClient } from '@/lib/supabase/server'
import { getProjectsForTeam } from '@/lib/queries/projects'
import { ProjectStatusBadge } from '@/components/shared/StatusBadge'
import { FeaturedProjectCard } from '@/components/shared/FeaturedProjectCard'
import Link from 'next/link'
import { Folder } from 'lucide-react'

export default async function TeamProjectsPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const projects = user ? await getProjectsForTeam(user.id) : []
  const activeProjects = projects.filter(p => p.status !== 'completed')
  const completedProjects = projects.filter(p => p.status === 'completed')

  return (
    <div className="p-content-wrap">
      <div style={{ marginBottom: '1.75rem' }}>
        <p className="p-eyebrow">Team Workspace</p>
        <h1 className="p-page-title">My Projects</h1>
        <p className="p-page-sub">
          {activeProjects.length} active · {completedProjects.length} completed
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="p-empty">
          <div className="p-empty-icon-wrap"><Folder size={20} /></div>
          <p className="p-empty-title">No projects assigned yet</p>
          <p className="p-empty-sub">Check back once the admin assigns you to a project.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {activeProjects.length > 0 && (
            <div>
              <div className="p-section-header" style={{ marginBottom: '0.75rem' }}>
                <span className="p-section-label">Active</span>
                <span style={{ fontSize: '12px', color: 'var(--ds-text-3)' }}>{activeProjects.length}</span>
              </div>
              <div className="p-card-grid">
                {activeProjects.map(p => {
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

          <div>
            <div className="p-section-header" style={{ marginBottom: '0.5rem' }}>
              <span className="p-section-label">All Projects</span>
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
                          ? ` · Due ${new Date(p.internal_deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                          : ''}
                      </div>
                    </div>
                    <span style={{ fontSize: '11.5px', color: 'var(--ds-text-3)', flexShrink: 0 }}>View →</span>
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
