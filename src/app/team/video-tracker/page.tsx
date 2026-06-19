import { requireTeamMember } from '@/lib/auth/require-role'
import { getVideoGenerationTasksForTeamMember } from '@/lib/queries/video-tracker'
import { getProductionDeliverablesForTeamMember } from '@/lib/queries/production-tracker'
import { Tabs } from '@/components/ui/Tabs'
import { TrackerPriorityBadge, TrackerStatusBadge } from '@/components/shared/StatusBadge'
import { VideoTaskCard } from './VideoTaskCard'

export default async function TeamVideoTrackerPage() {
  const user = await requireTeamMember()
  const [tasks, deliverables] = await Promise.all([
    getVideoGenerationTasksForTeamMember(user.id),
    getProductionDeliverablesForTeamMember(user.id),
  ])

  return (
    <div className="p-content-wrap">
      <div style={{ marginBottom: '1.75rem' }}>
        <p className="p-eyebrow">Team · Workspace</p>
        <h1 className="p-page-title">Video Gen Tracker</h1>
        <p className="p-page-sub">{tasks.length} generation task{tasks.length !== 1 ? 's' : ''} · {deliverables.length} deliverable{deliverables.length !== 1 ? 's' : ''} pending with you</p>
      </div>

      <Tabs
        tabs={[
          {
            key: 'tasks',
            label: 'My Generation Tasks',
            content: tasks.length === 0 ? (
              <div className="p-empty">
                <p className="p-empty-title">No generation tasks assigned</p>
                <p className="p-empty-sub">Tasks appear here automatically once you're assigned to a video project.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {tasks.map(task => (
                  <VideoTaskCard key={task.id} task={task} />
                ))}
              </div>
            ),
          },
          {
            key: 'deliverables',
            label: 'My Production Deliverables',
            content: deliverables.length === 0 ? (
              <div className="p-empty">
                <p className="p-empty-title">No deliverables pending</p>
                <p className="p-empty-sub">Production tracker rows appear here once you're assigned to a project.</p>
              </div>
            ) : (
              <div className="p-table-wrap">
                <table className="p-table">
                  <thead>
                    <tr>
                      <th>Brand</th>
                      <th>Type</th>
                      <th>Details</th>
                      <th>Status</th>
                      <th>Delivery</th>
                      <th>Priority</th>
                      <th>Admin Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliverables.map(d => (
                      <tr key={d.id}>
                        <td className="p-table-name">{d.brand_name}</td>
                        <td>{d.deliverable_type}</td>
                        <td style={{ color: 'var(--ds-text-3)' }}>{d.details ?? '—'}</td>
                        <td><TrackerStatusBadge status={d.status} /></td>
                        <td style={{ color: 'var(--ds-text-3)' }}>
                          {d.delivery_date ? new Date(d.delivery_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                        </td>
                        <td><TrackerPriorityBadge priority={d.priority} /></td>
                        <td style={{ color: 'var(--ds-text-3)' }}>{d.comments ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}
