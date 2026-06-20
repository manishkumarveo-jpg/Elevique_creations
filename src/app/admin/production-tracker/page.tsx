import { getProductionDeliverables } from '@/lib/queries/production-tracker'
import { StatTile } from '@/components/ui/StatTile'
import { ProductionTrackerView } from './ProductionTrackerView'

export default async function AdminProductionTrackerPage() {
  const deliverables = await getProductionDeliverables()

  const pending = deliverables.filter(d => d.status === 'pending' || d.status === 'in_progress')
  const p1 = deliverables.filter(d => d.priority === 'P1' && d.status !== 'completed')
  const underRevision = deliverables.filter(d => d.status === 'revision_pending')
  const completed = deliverables.filter(d => d.status === 'completed')

  return (
    <div className="p-content-wrap">
      <div style={{ marginBottom: '1.75rem' }}>
        <p className="p-eyebrow">Admin</p>
        <h1 className="p-page-title">Production Tracker</h1>
        <p className="p-page-sub">{deliverables.length} deliverable{deliverables.length !== 1 ? 's' : ''} · auto-generated from project assignments</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem', marginBottom: '1.75rem' }}>
        <StatTile label="Pending Deliverables" value={pending.length} />
        <StatTile label="P1 Priority" value={p1.length} warn={p1.length > 0} />
        <StatTile label="Under Revision" value={underRevision.length} />
        <StatTile label="Completed" value={completed.length} />
      </div>

      {deliverables.length === 0 ? (
        <div className="p-empty">
          <p className="p-empty-title">No production deliverables yet</p>
          <p className="p-empty-sub">Rows are created automatically when a team member is assigned to a project.</p>
        </div>
      ) : (
        <ProductionTrackerView deliverables={deliverables} />
      )}
    </div>
  )
}
