'use client'

import { useMemo, useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Pagination } from '@/components/ui/Pagination'
import { VideoTaskStatusSelect } from './VideoTaskStatusSelect'
import type { VideoGenerationTask } from '@/lib/queries/video-tracker'

const STATUS_OPTIONS = ['All', 'pending', 'in_progress', 'revision_pending', 'completed', 'paused'] as const
const PAGE_SIZE = 10

const inputStyle: React.CSSProperties = {
  background: '#161d2e',
  border: '1px solid rgba(255,255,255,0.11)',
  borderRadius: 9,
  padding: '0.5rem 0.8rem',
  fontSize: '0.78rem',
  color: 'rgba(255,255,255,0.82)',
  outline: 'none',
  fontFamily: 'inherit',
}

export function VideoTrackerView({ tasks }: { tasks: VideoGenerationTask[] }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<typeof STATUS_OPTIONS[number]>('All')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return tasks.filter(t => {
      if (status !== 'All' && t.status !== status) return false
      if (!q) return true
      return t.brand_name.toLowerCase().includes(q) ||
        t.content_type.toLowerCase().includes(q) ||
        (t.assignee?.full_name ?? '').toLowerCase().includes(q)
    })
  }, [tasks, search, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function updateSearch(v: string) { setSearch(v); setPage(1) }
  function updateStatus(v: typeof STATUS_OPTIONS[number]) { setStatus(v); setPage(1) }

  return (
    <>
      <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by brand, type, or assignee…"
          value={search}
          onChange={e => updateSearch(e.target.value)}
          style={{ ...inputStyle, minWidth: 240 }}
        />
        <select className="p-select" value={status} onChange={e => updateStatus(e.target.value as typeof status)} style={{ width: 'auto' }}>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s.replace('_', ' ')}</option>)}
        </select>
        <span style={{ fontSize: '0.78rem', color: 'var(--ds-text-3)', alignSelf: 'center', marginLeft: 'auto' }}>
          {filtered.length} of {tasks.length} tasks
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="p-empty">
          <p className="p-empty-title">No tasks match these filters</p>
        </div>
      ) : (
        <div className="p-table-wrap">
          <table className="p-table">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Content Type</th>
                <th>Script #</th>
                <th>Assignee</th>
                <th>Assigned</th>
                <th>Status</th>
                <th>Checks</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(task => (
                <tr key={task.id}>
                  <td className="p-table-name">{task.brand_name}</td>
                  <td>{task.content_type}</td>
                  <td>{task.script_number}</td>
                  <td>
                    {task.assignee ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Avatar name={task.assignee.full_name} size="sm" />
                        <span>{task.assignee.full_name}</span>
                      </div>
                    ) : '—'}
                  </td>
                  <td style={{ color: 'var(--ds-text-3)' }}>
                    {new Date(task.assigned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td>
                    <VideoTaskStatusSelect taskId={task.id} projectId={task.project_id} status={task.status} />
                  </td>
                  <td style={{ color: 'var(--ds-text-3)' }}>{task.checks_performed.length} checked</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
    </>
  )
}
