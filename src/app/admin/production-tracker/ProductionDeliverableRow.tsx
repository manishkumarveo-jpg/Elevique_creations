'use client'

import { useState, useTransition } from 'react'
import { updateProductionDeliverable } from '@/dashboard/lib/actions/production-tracker'
import type { ProductionDeliverable } from '@/dashboard/lib/queries/production-tracker'

const STATUS_OPTIONS = ['pending', 'in_progress', 'revision_pending', 'completed', 'paused'] as const
const PRIORITY_OPTIONS = ['P1', 'P2', 'P3'] as const

export function ProductionDeliverableRow({ deliverable }: { deliverable: ProductionDeliverable }) {
  const [editing, setEditing] = useState(false)
  const [comments, setComments] = useState(deliverable.comments ?? '')
  const [pending, startTransition] = useTransition()

  function handleStatusChange(status: string) {
    startTransition(async () => {
      await updateProductionDeliverable(deliverable.id, deliverable.project_id, { status })
    })
  }

  function handlePriorityChange(priority: string) {
    startTransition(async () => {
      await updateProductionDeliverable(deliverable.id, deliverable.project_id, { priority })
    })
  }

  function handleSaveComments() {
    startTransition(async () => {
      await updateProductionDeliverable(deliverable.id, deliverable.project_id, { comments })
      setEditing(false)
    })
  }

  return (
    <tr>
      <td className="p-table-name">{deliverable.brand_name}</td>
      <td>{deliverable.deliverable_type}</td>
      <td style={{ color: 'var(--ds-text-3)' }}>{deliverable.details ?? '—'}</td>
      <td>
        {deliverable.assets_location ? (
          <a href={deliverable.assets_location.split(',')[0].trim()} target="_blank" rel="noopener noreferrer" className="p-alert-link">
            Open Drive
          </a>
        ) : (
          <span style={{ color: 'var(--ds-text-3)' }}>—</span>
        )}
      </td>
      <td>
        <select
          className="p-select"
          value={deliverable.status}
          disabled={pending}
          onChange={e => handleStatusChange(e.target.value)}
          style={{ width: 'auto' }}
        >
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </td>
      <td>{deliverable.assignees.length ? deliverable.assignees.map(a => a.full_name).join(', ') : '—'}</td>
      <td>{deliverable.delivery_date ? new Date(deliverable.delivery_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</td>
      <td>
        <select
          className="p-select"
          value={deliverable.priority}
          disabled={pending}
          onChange={e => handlePriorityChange(e.target.value)}
          style={{ width: 'auto' }}
        >
          {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </td>
      <td style={{ maxWidth: 180, color: 'var(--ds-text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {deliverable.comments || '—'}
      </td>
      <td>
        <button type="button" className="p-action-deactivate" onClick={() => setEditing(true)}>
          Edit
        </button>
      </td>

      {editing && (
        <td style={{ position: 'fixed', inset: 0, padding: 0 }}>
          <div className="p-overlay" onClick={() => setEditing(false)} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: 'var(--ds-panel)', border: '1px solid var(--ds-border)', borderRadius: 'var(--ds-radius-sm)',
            padding: '1.25rem', width: 360, zIndex: 100,
          }}>
            <p className="p-info-panel-label" style={{ marginBottom: '0.75rem' }}>Comments — {deliverable.brand_name}</p>
            <textarea
              value={comments}
              onChange={e => setComments(e.target.value)}
              rows={4}
              style={{ width: '100%', background: '#161d2e', border: '1px solid rgba(255,255,255,0.11)', borderRadius: 8, color: 'rgba(255,255,255,0.88)', padding: '0.5rem', resize: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button type="button" className="p-action-deactivate" onClick={() => setEditing(false)}>Cancel</button>
              <button type="button" className="p-btn-primary" disabled={pending} onClick={handleSaveComments}>Save</button>
            </div>
          </div>
        </td>
      )}
    </tr>
  )
}
