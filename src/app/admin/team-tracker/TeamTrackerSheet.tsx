'use client'

import { useMemo, useState } from 'react'
import { TrackerStatusBadge, TrackerPriorityBadge } from '@/dashboard/components/shared/StatusBadge'
import { Pagination } from '@/dashboard/components/ui/Pagination'

export type TrackerRow = {
  id: string
  source: 'Production' | 'Video' | 'Milestone'
  teamMemberIds: string[]
  teamMemberName: string
  brandName: string
  type: string
  detail: string
  status: 'pending' | 'in_progress' | 'revision_pending' | 'completed' | 'paused'
  priority: 'P1' | 'P2' | 'P3' | null
  date: string | null
  extra: string
  comments: string
}

type SortKey = 'teamMemberName' | 'brandName' | 'status' | 'date'

const SOURCE_OPTIONS = ['All', 'Production', 'Video', 'Milestone'] as const
const STATUS_OPTIONS = ['All', 'pending', 'in_progress', 'revision_pending', 'completed', 'paused'] as const
const PAGE_SIZE = 10

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

export function TeamTrackerSheet({ rows, teamMembers }: { rows: TrackerRow[]; teamMembers: { id: string; full_name: string }[] }) {
  const [memberFilter, setMemberFilter] = useState('All')
  const [sourceFilter, setSourceFilter] = useState<typeof SOURCE_OPTIONS[number]>('All')
  const [statusFilter, setStatusFilter] = useState<typeof STATUS_OPTIONS[number]>('All')
  const [sortKey, setSortKey] = useState<SortKey>('teamMemberName')
  const [sortAsc, setSortAsc] = useState(true)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = rows
    if (memberFilter !== 'All') result = result.filter(r => r.teamMemberIds.includes(memberFilter))
    if (sourceFilter !== 'All') result = result.filter(r => r.source === sourceFilter)
    if (statusFilter !== 'All') result = result.filter(r => r.status === statusFilter)

    return [...result].sort((a, b) => {
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      const cmp = String(av).localeCompare(String(bv))
      return sortAsc ? cmp : -cmp
    })
  }, [rows, memberFilter, sourceFilter, statusFilter, sortKey, sortAsc])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortAsc(v => !v)
    else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  function updateMemberFilter(v: string) { setMemberFilter(v); setPage(1) }
  function updateSourceFilter(v: typeof SOURCE_OPTIONS[number]) { setSourceFilter(v); setPage(1) }
  function updateStatusFilter(v: typeof STATUS_OPTIONS[number]) { setStatusFilter(v); setPage(1) }

  return (
    <>
      <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <select className="p-select" value={memberFilter} onChange={e => updateMemberFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="All">All Team Members</option>
          {teamMembers.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
        </select>
        <select className="p-select" value={sourceFilter} onChange={e => updateSourceFilter(e.target.value as typeof sourceFilter)} style={{ width: 'auto' }}>
          {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Trackers' : s}</option>)}
        </select>
        <select className="p-select" value={statusFilter} onChange={e => updateStatusFilter(e.target.value as typeof statusFilter)} style={{ width: 'auto' }}>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s.replace('_', ' ')}</option>)}
        </select>
        <span style={{ fontSize: '0.78rem', color: 'var(--ds-text-3)', alignSelf: 'center', marginLeft: 'auto' }}>
          {filtered.length} of {rows.length} rows
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="p-empty">
          <p className="p-empty-title">No records match these filters</p>
        </div>
      ) : (
        <div className="p-table-wrap">
          <table className="p-table">
            <thead>
              <tr>
                <SortableHeader label="Team Member" sortableKey="teamMemberName" sortKey={sortKey} sortAsc={sortAsc} onSort={toggleSort} />
                <th>Tracker</th>
                <SortableHeader label="Brand" sortableKey="brandName" sortKey={sortKey} sortAsc={sortAsc} onSort={toggleSort} />
                <th>Type</th>
                <th>Detail</th>
                <SortableHeader label="Status" sortableKey="status" sortKey={sortKey} sortAsc={sortAsc} onSort={toggleSort} />
                <th>Priority</th>
                <SortableHeader label="Date" sortableKey="date" sortKey={sortKey} sortAsc={sortAsc} onSort={toggleSort} />
                <th>Assets / Checks</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(row => (
                <tr key={row.id}>
                  <td className="p-table-name">{row.teamMemberName}</td>
                  <td>{row.source}</td>
                  <td>{row.brandName}</td>
                  <td>{row.type}</td>
                  <td style={{ color: 'var(--ds-text-3)' }}>{row.detail}</td>
                  <td><TrackerStatusBadge status={row.status} /></td>
                  <td>{row.priority ? <TrackerPriorityBadge priority={row.priority} /> : '—'}</td>
                  <td style={{ color: 'var(--ds-text-3)' }}>
                    {row.date ? new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                  </td>
                  <td style={{ maxWidth: 200, color: 'var(--ds-text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.extra}</td>
                  <td style={{ maxWidth: 160, color: 'var(--ds-text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.comments}</td>
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
