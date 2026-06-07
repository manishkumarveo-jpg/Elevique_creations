import { createServerClient } from '@/lib/supabase/server'
import { getProjectsForClient } from '@/lib/queries/projects'
import Link from 'next/link'

function getThumbGradient(index: number) {
  const gradients = [
    'linear-gradient(135deg, rgba(124,58,237,0.40) 0%, rgba(20,184,166,0.30) 100%)',
    'linear-gradient(135deg, rgba(20,184,166,0.35) 0%, rgba(96,165,250,0.30) 100%)',
    'linear-gradient(135deg, rgba(251,146,60,0.30) 0%, rgba(124,58,237,0.35) 100%)',
    'linear-gradient(135deg, rgba(96,165,250,0.35) 0%, rgba(52,211,153,0.25) 100%)',
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
  if (status === 'in_progress') return 'IN PROGRESS'
  if (status === 'final_review') return 'IN REVIEW'
  if (status === 'paused') return 'PAUSED'
  if (status === 'completed') return 'COMPLETED'
  return 'BRIEFING'
}

export default async function ClientDashboardPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const projects = user ? await getProjectsForClient(user.id) : []

  // Fetch milestone progress for each project
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

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
          {projects.map((project, i) => {
            const ms = mByProject[project.id]
            const progress = ms && ms.total > 0 ? Math.round((ms.done / ms.total) * 100) : null

            return (
              <Link key={project.id} href={`/portal/projects/${project.id}`} className="p-project-card" style={{ textDecoration: 'none' }}>
                <div className="p-project-thumb">
                  <div className="p-project-thumb-gradient" style={{ background: getThumbGradient(i) }} />
                  <span className={`p-project-thumb-badge ${getStatusBadgeClass(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                </div>

                <h3 className="p-project-card-name">{project.name}</h3>
                {project.package && (
                  <p className="p-project-card-package" style={{ marginTop: '0.2rem', marginBottom: '0.75rem' }}>{project.package}</p>
                )}

                {progress !== null && (
                  <div style={{ margin: '0.75rem 0' }}>
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
                    {project.deadline
                      ? `Deadline: ${new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                      : `Started ${new Date(project.created_at).toLocaleDateString()}`
                    }
                  </span>
                  <span className="p-link-teal" style={{ fontSize: '0.72rem' }}>View details →</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
