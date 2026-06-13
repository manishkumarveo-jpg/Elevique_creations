import { createServerClient } from '@/lib/supabase/server'
import { getProjectsForTeam } from '@/lib/queries/projects'
import Link from 'next/link'
import { FeaturedProjectCard } from '@/components/shared/FeaturedProjectCard'
import { ProjectStatusBadge } from '@/components/shared/StatusBadge'
import { Folder } from 'lucide-react'

export default async function TeamDashboardPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('full_name').eq('id', user.id).single()
    : { data: null }

  const projects = user ? await getProjectsForTeam(user.id) : []
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
                          ? ` · Team due ${new Date(p.internal_deadline + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
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
