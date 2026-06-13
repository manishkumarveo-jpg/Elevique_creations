import { requireAdmin } from '@/lib/auth/require-role'
import { getProfileById } from '@/lib/queries/users'
import { getProjectsForTeam } from '@/lib/queries/projects'
import { FeaturedProjectCard } from '@/components/shared/FeaturedProjectCard'
import { ProjectStatusBadge } from '@/components/shared/StatusBadge'
import Link from 'next/link'
import { ArrowLeft, Folder, ShieldAlert } from 'lucide-react'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ memberId: string }>
}

export default async function AdminTeamMemberDashboardPage({ params }: Props) {
  await requireAdmin()

  const { memberId } = await params

  // Fetch member profile
  let profile: Awaited<ReturnType<typeof getProfileById>> | null = null
  try {
    profile = await getProfileById(memberId)
  } catch {
    notFound()
  }

  // Only team members can be viewed this way
  if (!profile || profile.role !== 'team_member') {
    notFound()
  }

  const projects = await getProjectsForTeam(memberId)
  const activeProjects = projects.filter(p => p.status !== 'completed')
  const completedProjects = projects.filter(p => p.status === 'completed')
  const firstName = profile.full_name?.split(' ')[0] ?? 'Member'
  const initials = profile.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '?'

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
          background: 'linear-gradient(135deg, #2c2c2c 0%, #181818 100%)',
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
            <p className="p-eyebrow" style={{ margin: 0 }}>Team Member</p>
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
          <h1 className="p-page-title" style={{ margin: 0 }}>{profile.full_name}</h1>
          <p className="p-page-sub" style={{ margin: 0 }}>
            {activeProjects.length} active project{activeProjects.length !== 1 ? 's' : ''} assigned
            {profile.email ? ` · ${profile.email}` : ''}
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="p-empty">
          <div className="p-empty-icon-wrap">
            <Folder size={20} />
          </div>
          <p className="p-empty-title">No projects assigned</p>
          <p className="p-empty-sub">
            {firstName} has no projects assigned yet.{' '}
            <Link href="/admin/projects" className="p-link-teal">Go to Projects →</Link>
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Active projects card grid */}
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
                      href={`/admin/projects/${p.id}`}
                    />
                  )
                })}
              </div>
            </div>
          )}

          {/* Full project list */}
          <div>
            <div className="p-section-header" style={{ marginBottom: '0.5rem' }}>
              <span className="p-section-label">All Projects</span>
              <span style={{ fontSize: '12px', color: 'var(--ds-text-3)' }}>
                {projects.length} total · {completedProjects.length} completed
              </span>
            </div>
            <div className="p-project-rows">
              {projects.map(p => {
                const client = (p as { client?: { full_name?: string; company_name?: string } | null }).client ?? null
                return (
                  <Link key={p.id} href={`/admin/projects/${p.id}`} className="p-project-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                        <span className="p-project-name">{p.name}</span>
                        <ProjectStatusBadge status={p.status} />
                      </div>
                      <div className="p-project-meta">
                        {client?.company_name ?? client?.full_name ?? '—'}
                        {p.internal_deadline
                          ? ` · Due ${new Date(p.internal_deadline + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                          : ''}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '11.5px',
                      color: 'var(--ds-text-3)',
                      flexShrink: 0,
                    }}>
                      View →
                    </span>
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
