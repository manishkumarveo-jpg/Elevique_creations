'use client'

import { useMemo, useState } from 'react'
import { TrackerStatusBadge, TrackerPriorityBadge } from '@/components/shared/StatusBadge'

export type TrackerRow = {
  id: string
  source: 'Production' | 'Video'
  teamMemberId: string | null
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

const SOURCE_OPTIONS = ['All', 'Production', 'Video'] as const
const STATUS_OPTIONS = ['All', 'pending', 'in_progress', 'revision_pending', 'completed', 'paused'] as const

export function TeamTrackerSheet({ rows, teamMembers }: { rows: TrackerRow[]; teamMembers: { id: string; full_name: string }[] }) {
  const [memberFilter, setMemberFilter] = useState('All')
  const [sourceFilter, setSourceFilter] = useState<typeof SOURCE_OPTIONS[number]>('All')
  const [statusFilter, setStatusFilter] = useState<typeof STATUS_OPTIONS[number]>('All')
  const [sortKey, setSortKey] = useState<SortKey>('teamMemberName')
  const [sortAsc, setSortAsc] = useState(true)

  const filtered = useMemo(() => {
    let result = rows
    if (memberFilter !== 'All') result = result.filter(r => r.teamMemberId === memberFilter)
    if (sourceFilter !== 'All') result = result.filter(r => r.source === sourceFilter)
    if (statusFilter !== 'All') result = result.filter(r => r.status === statusFilter)

    return [...result].sort((a, b) => {
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      const cmp = String(av).localeCompare(String(bv))
      return sortAsc ? cmp : -cmp
    })
  }, [rows, memberFilter, sourceFilter, statusFilter, sortKey, sortAsc])

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortAsc(v => !v)
    else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  function SortableHeader({ label, sortableKey }: { label: string; sortableKey: SortKey }) {
    return (
      <th
        onClick={() => toggleSort(sortableKey)}
        style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
      >
        {label}{sortKey === sortableKey ? (sortAsc ? ' ▲' : ' ▼') : ''}
      </th>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <select className="p-select" value={memberFilter} onChange={e => setMemberFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="All">All Team Members</option>
          {teamMembers.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
        </select>
        <select className="p-select" value={sourceFilter} onChange={e => setSourceFilter(e.target.value as typeof sourceFilter)} style={{ width: 'auto' }}>
          {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Trackers' : s}</option>)}
        </select>
        <select className="p-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value as typeof statusFilter)} style={{ width: 'auto' }}>
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
                <SortableHeader label="Team Member" sortableKey="teamMemberName" />
                <th>Tracker</th>
                <SortableHeader label="Brand" sortableKey="brandName" />
                <th>Type</th>
                <th>Detail</th>
                <SortableHeader label="Status" sortableKey="status" />
                <th>Priority</th>
                <SortableHeader label="Date" sortableKey="date" />
                <th>Assets / Checks</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
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
    </>
  )
}
