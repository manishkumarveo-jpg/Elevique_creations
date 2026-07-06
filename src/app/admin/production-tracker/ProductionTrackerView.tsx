'use client'

import { useMemo, useState } from 'react'
import { Pagination } from '@/dashboard/components/ui/Pagination'
import { ProductionDeliverableRow } from './ProductionDeliverableRow'
import type { ProductionDeliverable } from '@/dashboard/lib/queries/production-tracker'

const STATUS_OPTIONS = ['All', 'pending', 'in_progress', 'revision_pending', 'completed', 'paused'] as const
const PRIORITY_OPTIONS = ['All', 'P1', 'P2', 'P3'] as const
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

export function ProductionTrackerView({ deliverables }: { deliverables: ProductionDeliverable[] }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<typeof STATUS_OPTIONS[number]>('All')
  const [priority, setPriority] = useState<typeof PRIORITY_OPTIONS[number]>('All')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return deliverables.filter(d => {
      if (status !== 'All' && d.status !== status) return false
      if (priority !== 'All' && d.priority !== priority) return false
      if (!q) return true
      return d.brand_name.toLowerCase().includes(q) || d.deliverable_type.toLowerCase().includes(q)
    })
  }, [deliverables, search, status, priority])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function updateSearch(v: string) { setSearch(v); setPage(1) }
  function updateStatus(v: typeof STATUS_OPTIONS[number]) { setStatus(v); setPage(1) }
  function updatePriority(v: typeof PRIORITY_OPTIONS[number]) { setPriority(v); setPage(1) }

  return (
    <>
      <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by brand or type…"
          value={search}
          onChange={e => updateSearch(e.target.value)}
          style={{ ...inputStyle, minWidth: 220 }}
        />
        <select className="p-select" value={status} onChange={e => updateStatus(e.target.value as typeof status)} style={{ width: 'auto' }}>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s.replace('_', ' ')}</option>)}
        </select>
        <select className="p-select" value={priority} onChange={e => updatePriority(e.target.value as typeof priority)} style={{ width: 'auto' }}>
          {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p === 'All' ? 'All Priorities' : p}</option>)}
        </select>
        <span style={{ fontSize: '0.78rem', color: 'var(--ds-text-3)', alignSelf: 'center', marginLeft: 'auto' }}>
          {filtered.length} of {deliverables.length} deliverables
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="p-empty">
          <p className="p-empty-title">No deliverables match these filters</p>
        </div>
      ) : (
        <div className="p-table-wrap">
          <table className="p-table">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Type</th>
                <th>Details</th>
                <th>Assets</th>
                <th>Status</th>
                <th>Pending With</th>
                <th>Delivery</th>
                <th>Priority</th>
                <th>Comments</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paged.map(d => (
                <ProductionDeliverableRow key={d.id} deliverable={d} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
    </>
  )
}
