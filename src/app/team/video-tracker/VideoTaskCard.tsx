'use client'

import { useState, useTransition } from 'react'
import { toggleVideoTaskCheck, updateVideoTaskStatusTeam } from '@/lib/actions/video-tracker'
import type { VideoGenerationTask } from '@/lib/queries/video-tracker'
import { TrackerStatusBadge } from '@/components/shared/StatusBadge'

const CHECK_ITEMS = ['Camera angles', 'Lighting', 'Audio quality', 'Brand consistency']
const STATUS_OPTIONS = ['in_progress', 'revision_pending', 'completed'] as const

export function VideoTaskCard({ task }: { task: VideoGenerationTask }) {
  const [expanded, setExpanded] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleCheckToggle(label: string, checked: boolean) {
    startTransition(async () => {
      await toggleVideoTaskCheck(task.id, task.project_id, label, checked)
    })
  }

  function handleStatusChange(status: string) {
    startTransition(async () => {
      await updateVideoTaskStatusTeam(task.id, task.project_id, status)
    })
  }

  return (
    <div className="p-info-panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <p className="p-table-name" style={{ marginBottom: '0.15rem' }}>{task.brand_name} — Script #{task.script_number}</p>
          <p style={{ fontSize: '0.78rem', color: 'var(--ds-text-3)' }}>{task.content_type}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <TrackerStatusBadge status={task.status} />
          <select
            className="p-select"
            value={task.status}
            disabled={pending}
            style={{ width: 'auto' }}
            onChange={e => handleStatusChange(e.target.value)}
          >
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
          <button type="button" className="p-action-deactivate" onClick={() => setExpanded(v => !v)}>
            {expanded ? 'Hide checklist' : 'Checklist'}
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {CHECK_ITEMS.map(label => {
            const checked = task.checks_performed.includes(label)
            return (
              <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.78rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={pending}
                  onChange={e => handleCheckToggle(label, e.target.checked)}
                />
                {label}
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}
