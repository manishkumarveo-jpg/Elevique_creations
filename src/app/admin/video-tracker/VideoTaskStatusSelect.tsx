'use client'

import { useTransition } from 'react'
import { updateVideoTaskStatus } from '@/dashboard/lib/actions/video-tracker'

const STATUS_OPTIONS = ['pending', 'in_progress', 'revision_pending', 'completed', 'paused'] as const

export function VideoTaskStatusSelect({ taskId, projectId, status }: { taskId: string; projectId: string; status: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <select
      className="p-select"
      value={status}
      disabled={pending}
      style={{ width: 'auto' }}
      onChange={e => startTransition(async () => {
        await updateVideoTaskStatus(taskId, projectId, e.target.value)
      })}
    >
      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
    </select>
  )
}
