import { requireAdmin } from '@/dashboard/lib/auth/require-role'
import { getProfileById } from '@/dashboard/lib/queries/users'
import { getProjectsForClient } from '@/dashboard/lib/queries/projects'
import { createServerClient } from '@/shared/lib/supabase/server'
import { FeaturedProjectCard } from '@/dashboard/components/shared/FeaturedProjectCard'
import { ProjectStatusBadge } from '@/dashboard/components/shared/StatusBadge'
import Link from 'next/link'
import { ArrowLeft, Folder, ShieldAlert } from 'lucide-react'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ clientId: string }>
}

export default async function AdminClientDashboardPage({ params }: Props) {
  await requireAdmin()

  const { clientId } = await params

  // Fetch client profile
  let profile: Awaited<ReturnType<typeof getProfileById>> | null = null
  try {
    profile = await getProfileById(clientId)
  } catch {
    notFound()
  }

  // Only clients can be viewed this way
  if (!profile || profile.role !== 'client') {
    notFound()
  }

  const supabase = await createServerClient()
  const projects = await getProjectsForClient(clientId)

  // Milestone data (same as real client dashboard)
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

  const activeProjects = projects.filter(p => p.status !== 'completed')
  const completedProjects = projects.filter(p => p.status === 'completed')

  const displayName = profile.company_name ?? profile.full_name ?? 'Client'
  const initials = (profile.company_name ?? profile.full_name ?? 'C')
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="p-content-wrap">
      {/* Back nav */}
      <Link
        href="/admin/users"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          fontSize: '12px',
          color: 'var(--ds-text-3)',
          textDecoration: 'none',
          marginBottom: '1.5rem',
          transition: 'color 0.12s',
        }}
        className="p-link-back"
      >
        <ArrowLeft size={13} />
        Back to Users
      </Link>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #1e3a2f 0%, #111 100%)',
          border: '1px solid var(--ds-border-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 700,
          color: 'var(--ds-white)',
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.2rem' }}>
            <p className="p-eyebrow" style={{ margin: 0 }}>Client Portal</p>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '10.5px',
              fontWeight: 500,
              color: 'var(--ds-text-3)',
              background: 'var(--ds-hover)',
              border: '1px solid var(--ds-border)',
              borderRadius: 999,
              padding: '0.15rem 0.625rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              <ShieldAlert size={10} />
              Admin View · Read Only
            </span>
          </div>
          <h1 className="p-page-title" style={{ margin: 0 }}>{displayName}</h1>
          <p className="p-page-sub" style={{ margin: 0 }}>
            {activeProjects.length} active project{activeProjects.length !== 1 ? 's' : ''} in progress
            {profile.email ? ` · ${profile.email}` : ''}
            {profile.company_name && profile.full_name ? ` · ${profile.full_name}` : ''}
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="p-empty">
          <div className="p-empty-icon-wrap">
            <Folder size={20} />
          </div>
          <p className="p-empty-title">No projects yet</p>
          <p className="p-empty-sub">
            {displayName} has no projects.{' '}
            <Link href="/admin/projects/new" className="p-link-teal">Create one →</Link>
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Active project cards — mirrors the real client dashboard */}
          {activeProjects.length > 0 && (
            <div>
              <div className="p-section-header" style={{ marginBottom: '0.75rem' }}>
                <span className="p-section-label">Active Projects</span>
                <span style={{ fontSize: '12px', color: 'var(--ds-text-3)' }}>
                  {activeProjects.length} project{activeProjects.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="p-card-grid">
                {activeProjects.slice(0, 4).map(p => {
                  const ms = mByProject[p.id]
                  return (
                    <FeaturedProjectCard
                      key={p.id}
                      id={p.id}
                      name={p.name}
                      clientName={p.package ?? ''}
                      status={p.status}
                      dueDate={p.client_deadline ?? null}
                      milestoneDone={ms?.done ?? 0}
                      milestoneTotal={ms?.total ?? 0}
                      href={`/admin/projects/${p.id}`}
                    />
                  )
                })}
              </div>
            </div>
          )}

          {/* Full project list with progress bars — mirrors real client dashboard */}
          <div>
            <div className="p-section-header" style={{ marginBottom: '0.5rem' }}>
              <span className="p-section-label">All Projects</span>
              <span style={{ fontSize: '12px', color: 'var(--ds-text-3)' }}>
                {projects.length} total · {completedProjects.length} completed
              </span>
            </div>
            <div className="p-project-rows">
              {projects.map(p => {
                const ms = mByProject[p.id]
                const pct = ms && ms.total > 0 ? Math.round((ms.done / ms.total) * 100) : null
                return (
                  <Link key={p.id} href={`/admin/projects/${p.id}`} className="p-project-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                        <span className="p-project-name">{p.name}</span>
                        <ProjectStatusBadge status={p.status} />
                      </div>
                      <div className="p-project-meta">
                        {p.package ?? ''}
                        {p.client_deadline
                          ? ` · Delivery ${new Date(p.client_deadline + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                          : ''}
                      </div>
                    </div>
                    {pct !== null && (
                      <div className="p-progress-wrap">
                        <div className="p-progress-track">
                          <div className="p-progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="p-progress-pct">{pct}%</span>
                      </div>
                    )}
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
