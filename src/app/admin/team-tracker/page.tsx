import { getProductionDeliverables } from '@/lib/queries/production-tracker'
import { getVideoGenerationTasks } from '@/lib/queries/video-tracker'
import { getAllMilestonesWithDetails } from '@/lib/queries/milestones'
import { getTeamMembers } from '@/lib/queries/users'
import { TeamTrackerSheet, type TrackerRow } from './TeamTrackerSheet'

const MILESTONE_STATUS_MAP = {
  pending: 'pending',
  in_progress: 'in_progress',
  done: 'completed',
} as const

export default async function AdminTeamTrackerPage() {
  const [deliverables, tasks, milestones, teamMembers] = await Promise.all([
    getProductionDeliverables(),
    getVideoGenerationTasks(),
    getAllMilestonesWithDetails(),
    getTeamMembers(),
  ])

  const rows: TrackerRow[] = [
    ...deliverables.map(d => ({
      id: `pd-${d.id}`,
      source: 'Production' as const,
      teamMemberId: d.pending_with_id,
      teamMemberName: d.pending_with?.full_name ?? 'Unassigned',
      brandName: d.brand_name,
      type: d.deliverable_type,
      detail: d.details ?? '—',
      status: d.status,
      priority: d.priority,
      date: d.delivery_date,
      extra: d.assets_location ?? '—',
      comments: d.comments ?? '—',
    })),
    ...tasks.map(t => ({
      id: `vt-${t.id}`,
      source: 'Video' as const,
      teamMemberId: t.assigned_to_id,
      teamMemberName: t.assignee?.full_name ?? 'Unassigned',
      brandName: t.brand_name,
      type: `${t.content_type} #${t.script_number}`,
      detail: `${t.checks_performed.length} check${t.checks_performed.length !== 1 ? 's' : ''} done`,
      status: t.status,
      priority: null,
      date: t.assigned_at,
      extra: t.checks_performed.join(', ') || '—',
      comments: '—',
    })),
    ...milestones.map(m => ({
      id: `ms-${m.id}`,
      source: 'Milestone' as const,
      teamMemberId: m.updated_by,
      teamMemberName: m.updater?.full_name ?? 'Unassigned',
      brandName: m.project?.name ?? '—',
      type: `Phase ${m.phase_number}: ${m.phase_name}`,
      detail: m.phase_number === Math.max(...milestones.filter(x => x.project_id === m.project_id).map(x => x.phase_number)) ? 'Final phase' : '—',
      status: MILESTONE_STATUS_MAP[m.status],
      priority: null,
      date: m.completed_date ?? m.scheduled_date,
      extra: '—',
      comments: m.notes ?? '—',
    })),
  ]

  return (
    <div className="p-content-wrap">
      <div style={{ marginBottom: '1.75rem' }}>
        <p className="p-eyebrow">Admin · Team Tracker</p>
        <h1 className="p-page-title">All Records</h1>
        <p className="p-page-sub">{rows.length} record{rows.length !== 1 ? 's' : ''} across {teamMembers.length} team member{teamMembers.length !== 1 ? 's' : ''} · Production + Video Gen + Milestones combined</p>
      </div>

      <TeamTrackerSheet rows={rows} teamMembers={teamMembers.map(m => ({ id: m.id, full_name: m.full_name }))} />
    </div>
  )
}
