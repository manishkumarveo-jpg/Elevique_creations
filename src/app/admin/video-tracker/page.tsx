import { getVideoGenerationTasks } from '@/lib/queries/video-tracker'
import { StatTile } from '@/components/ui/StatTile'
import { VideoTrackerView } from './VideoTrackerView'

export default async function AdminVideoTrackerPage() {
  const tasks = await getVideoGenerationTasks()

  const inProgress = tasks.filter(t => t.status === 'in_progress')
  const completed = tasks.filter(t => t.status === 'completed')
  const revisionPending = tasks.filter(t => t.status === 'revision_pending')

  return (
    <div className="p-content-wrap">
      <div style={{ marginBottom: '1.75rem' }}>
        <p className="p-eyebrow">Admin</p>
        <h1 className="p-page-title">Video Generation Tracker</h1>
        <p className="p-page-sub">{tasks.length} task{tasks.length !== 1 ? 's' : ''} · auto-generated per assigned video deliverable</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem', marginBottom: '1.75rem' }}>
        <StatTile label="In Progress" value={inProgress.length} />
        <StatTile label="Scripts Completed" value={completed.length} />
        <StatTile label="Revisions Pending" value={revisionPending.length} warn={revisionPending.length > 0} />
      </div>

      {tasks.length === 0 ? (
        <div className="p-empty">
          <p className="p-empty-title">No video generation tasks yet</p>
          <p className="p-empty-sub">Tasks are created automatically when a team member is assigned to a video-deliverable project.</p>
        </div>
      ) : (
        <VideoTrackerView tasks={tasks} />
      )}
    </div>
  )
}
