'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/dashboard/components/ui/Badge'
import { ProjectStatusBadge } from '@/dashboard/components/shared/StatusBadge'

export type ProjectWorkRow = {
  id: string
  name: string
  client: string
  package: string | null
  status: 'briefing' | 'in_progress' | 'final_review' | 'completed' | 'paused'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  startedDate: string | null
  startedLabel: string
  completionDate: string | null
  completionLabel: string
  progress: number
}

type SortKey = 'name' | 'client' | 'status' | 'priority' | 'startedDate' | 'completionDate' | 'progress'

const STATUS_OPTIONS = ['All', 'briefing', 'in_progress', 'final_review', 'completed', 'paused'] as const
const PRIORITY_OPTIONS = ['All', 'low', 'medium', 'high', 'urgent'] as const

const PRIORITY_BADGE: Record<ProjectWorkRow['priority'], { label: string; variant: 'gray' | 'blue' | 'orange' | 'red' }> = {
  low: { label: 'Low', variant: 'gray' },
  medium: { label: 'Medium', variant: 'blue' },
  high: { label: 'High', variant: 'orange' },
  urgent: { label: 'Urgent', variant: 'red' },
}

function SortableHeader({ label, sortableKey, sortKey, sortAsc, onSort }: {
  label: string
  sortableKey: SortKey
  sortKey: SortKey
  sortAsc: boolean
  onSort: (key: SortKey) => void
}) {
  return (
    <th onClick={() => onSort(sortableKey)} style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
      {label}{sortKey === sortableKey ? (sortAsc ? ' ▲' : ' ▼') : ''}
    </th>
  )
}

export function ProjectWorkSheet({ rows }: { rows: ProjectWorkRow[] }) {
  const [statusFilter, setStatusFilter] = useState<typeof STATUS_OPTIONS[number]>('All')
  const [priorityFilter, setPriorityFilter] = useState<typeof PRIORITY_OPTIONS[number]>('All')
  const [sortKey, setSortKey] = useState<SortKey>('startedDate')
  const [sortAsc, setSortAsc] = useState(false)

  const filtered = useMemo(() => {
    let result = rows
    if (statusFilter !== 'All') result = result.filter(r => r.status === statusFilter)
    if (priorityFilter !== 'All') result = result.filter(r => r.priority === priorityFilter)

    return [...result].sort((a, b) => {
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortAsc ? av - bv : bv - av
      }
      const cmp = String(av).localeCompare(String(bv))
      return sortAsc ? cmp : -cmp
    })
  }, [rows, statusFilter, priorityFilter, sortKey, sortAsc])

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortAsc(v => !v)
    else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <select className="p-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value as typeof statusFilter)} style={{ width: 'auto' }}>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s.replace('_', ' ')}</option>)}
        </select>
        <select className="p-select" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as typeof priorityFilter)} style={{ width: 'auto' }}>
          {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p === 'All' ? 'All Priorities' : p}</option>)}
        </select>
        <span style={{ fontSize: '0.78rem', color: 'var(--ds-text-3)', alignSelf: 'center', marginLeft: 'auto' }}>
          {filtered.length} of {rows.length} rows
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="p-empty">
          <p className="p-empty-title">No projects match these filters</p>
        </div>
      ) : (
        <div className="p-table-wrap">
          <table className="p-table">
            <thead>
              <tr>
                <SortableHeader label="Project" sortableKey="name" sortKey={sortKey} sortAsc={sortAsc} onSort={toggleSort} />
                <SortableHeader label="Client" sortableKey="client" sortKey={sortKey} sortAsc={sortAsc} onSort={toggleSort} />
                <SortableHeader label="Status" sortableKey="status" sortKey={sortKey} sortAsc={sortAsc} onSort={toggleSort} />
                <SortableHeader label="Priority" sortableKey="priority" sortKey={sortKey} sortAsc={sortAsc} onSort={toggleSort} />
                <SortableHeader label="Started" sortableKey="startedDate" sortKey={sortKey} sortAsc={sortAsc} onSort={toggleSort} />
                <SortableHeader label="Completion" sortableKey="completionDate" sortKey={sortKey} sortAsc={sortAsc} onSort={toggleSort} />
                <SortableHeader label="Progress" sortableKey="progress" sortKey={sortKey} sortAsc={sortAsc} onSort={toggleSort} />
                <th>Package</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id}>
                  <td>
                    <Link href={`/team/projects/${row.id}`} className="p-table-name" style={{ color: 'inherit' }}>{row.name}</Link>
                  </td>
                  <td style={{ color: 'var(--ds-text-3)' }}>{row.client}</td>
                  <td><ProjectStatusBadge status={row.status} /></td>
                  <td><Badge variant={PRIORITY_BADGE[row.priority].variant}>{PRIORITY_BADGE[row.priority].label}</Badge></td>
                  <td style={{ color: 'var(--ds-text-3)', whiteSpace: 'nowrap' }}>{row.startedLabel}</td>
                  <td style={{ color: 'var(--ds-text-3)', whiteSpace: 'nowrap' }}>{row.completionLabel}</td>
                  <td style={{ color: 'var(--ds-text-3)' }}>{row.progress}%</td>
                  <td style={{ color: 'var(--ds-text-3)' }}>{row.package ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
