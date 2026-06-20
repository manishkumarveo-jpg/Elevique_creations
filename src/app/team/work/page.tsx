import Link from 'next/link'
import { requireTeamMember } from '@/lib/auth/require-role'
import { getProjectsForTeam } from '@/lib/queries/projects'
import { ProjectWorkSheet, type ProjectWorkRow } from './ProjectWorkSheet'

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function TeamWorkPage() {
  const user = await requireTeamMember()
  const projects = await getProjectsForTeam(user.id)

  const rows: ProjectWorkRow[] = projects.map(p => {
    const client = (p as { client?: { full_name?: string; company_name?: string } | null }).client ?? null
    const startedDate = p.work_started_date ?? p.start_date
    return {
      id: p.id,
      name: p.name,
      client: client?.company_name ?? client?.full_name ?? '—',
      package: p.package,
      status: p.status,
      priority: p.priority,
      startedDate,
      startedLabel: formatDate(startedDate),
      completionDate: p.completion_date,
      completionLabel: formatDate(p.completion_date),
      progress: p.progress_percent,
    }
  })

  return (
    <div className="p-content-wrap">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
        <div>
          <p className="p-eyebrow">Team · Workspace</p>
          <h1 className="p-page-title">My Work</h1>
          <p className="p-page-sub">{rows.length} project{rows.length !== 1 ? 's' : ''} assigned to you — start and completion dates at a glance</p>
        </div>
        <Link href="/team/video-tracker" className="p-link-teal">Video Gen Tracker →</Link>
      </div>

      <ProjectWorkSheet rows={rows} />
    </div>
  )
}
