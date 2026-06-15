'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Milestone, CheckCircle2, Circle, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

type MsStatus = 'pending' | 'in_progress' | 'done'
type Filter = 'all' | MsStatus

interface MilestoneItem {
  id: string
  phase_number: number
  phase_name: string
  status: string
  scheduled_date: string | null
  notes: string | null
}

interface Group {
  projectId: string
  projectName: string
  clientName: string | null
  status: string
  milestones: MilestoneItem[]
}

interface Stats {
  total: number
  done: number
  inProgress: number
  pending: number
}

const STATUS_META: Record<MsStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  done: {
    label: 'Done',
    color: '#6ee7b7',
    bg: 'rgba(110,231,183,0.08)',
    border: 'rgba(110,231,183,0.2)',
    icon: <CheckCircle2 size={15} />,
  },
  in_progress: {
    label: 'In Progress',
    color: '#0ED2BD',
    bg: 'rgba(14,210,189,0.08)',
    border: 'rgba(14,210,189,0.22)',
    icon: <Loader2 size={15} />,
  },
  pending: {
    label: 'Pending',
    color: 'var(--ds-text-3)',
    bg: 'rgba(255,255,255,0.03)',
    border: 'var(--ds-border)',
    icon: <Circle size={15} />,
  },
}

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function ProjectGroup({ group, filter }: { group: Group; filter: Filter }) {
  const [collapsed, setCollapsed] = useState(false)

  const visible = filter === 'all'
    ? group.milestones
    : group.milestones.filter(m => m.status === filter)

  if (visible.length === 0) return null

  const done  = group.milestones.filter(m => m.status === 'done').length
  const total = group.milestones.length
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0
  const inProg = group.milestones.filter(m => m.status === 'in_progress').length

  return (
    <div style={{
      background: 'var(--ds-surface-2)',
      border: '1px solid var(--ds-border)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      {/* Project header */}
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '1rem',
          padding: '0.875rem 1.125rem',
          borderBottom: collapsed ? 'none' : '1px solid var(--ds-border)',
        }}
      >
        {/* Progress ring */}
        <div style={{ position: 'relative', width: 36, height: 36, flexShrink: 0 }}>
          <svg width="36" height="36" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="14" fill="none" stroke="var(--ds-border-2)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="14" fill="none"
              stroke={pct === 100 ? '#6ee7b7' : '#0ED2BD'}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${(pct / 100) * 87.96} 87.96`}
              transform="rotate(-90 18 18)"
              style={{ transition: 'stroke-dasharray 0.4s ease' }}
            />
          </svg>
          <span style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '9px', fontWeight: 700, color: 'var(--ds-text-2)',
            fontFamily: 'var(--font-mono, monospace)',
          }}>
            {pct}%
          </span>
        </div>

        {/* Name + meta */}
        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link
              href={`/team/projects/${group.projectId}`}
              onClick={e => e.stopPropagation()}
              style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ds-white)', textDecoration: 'none' }}
            >
              {group.projectName}
            </Link>
            {inProg > 0 && (
              <span style={{
                fontSize: '10px', fontWeight: 600, color: '#0ED2BD',
                background: 'rgba(14,210,189,0.1)', border: '1px solid rgba(14,210,189,0.2)',
                borderRadius: '4px', padding: '0.1rem 0.45rem',
              }}>
                {inProg} active
              </span>
            )}
          </div>
          {group.clientName && (
            <div style={{ fontSize: '11.5px', color: 'var(--ds-text-3)', marginTop: '0.1rem' }}>
              {group.clientName}
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ds-text-2)', fontFamily: 'var(--font-mono, monospace)' }}>
              {done}<span style={{ color: 'var(--ds-text-3)', fontWeight: 400 }}>/{total}</span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--ds-text-3)' }}>milestones</div>
          </div>
          <div style={{ color: 'var(--ds-text-3)' }}>
            {collapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          </div>
        </div>
      </button>

      {/* Milestones */}
      {!collapsed && (
        <div style={{ padding: '0.625rem 0.875rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {visible.map(m => {
            const meta = STATUS_META[m.status as MsStatus] ?? STATUS_META.pending
            return (
              <div key={m.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '0.625rem 0.75rem',
                background: meta.bg,
                border: `1px solid ${meta.border}`,
                borderRadius: '8px',
                transition: 'background 0.15s',
              }}>
                {/* Phase indicator */}
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--ds-surface-1)',
                  border: `1.5px solid ${meta.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: meta.color,
                }}>
                  {m.status === 'done' ? (
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" style={{ width: 11, height: 11 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M2 6l3 3 5-5" />
                    </svg>
                  ) : (
                    <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono, monospace)' }}>
                      {m.phase_number}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '13px', fontWeight: 500,
                    color: m.status === 'done' ? 'var(--ds-text-3)' : 'var(--ds-white)',
                    textDecoration: m.status === 'done' ? 'line-through' : 'none',
                  }}>
                    {m.phase_name}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.15rem', flexWrap: 'wrap' }}>
                    {m.scheduled_date && (
                      <span style={{ fontSize: '11px', color: 'var(--ds-text-3)' }}>
                        {fmtDate(m.scheduled_date)}
                      </span>
                    )}
                    {m.notes && (
                      <span style={{ fontSize: '11px', color: 'var(--ds-text-3)', fontStyle: 'italic' }}>
                        {m.notes}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status badge */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  fontSize: '10.5px', fontWeight: 600,
                  color: meta.color,
                  background: meta.bg,
                  border: `1px solid ${meta.border}`,
                  borderRadius: '5px',
                  padding: '0.2rem 0.55rem',
                  flexShrink: 0,
                }}>
                  {meta.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function MilestonesView({ groups, stats }: { groups: Group[]; stats: Stats }) {
  const [filter, setFilter] = useState<Filter>('all')

  const visibleGroups = useMemo(() =>
    groups.filter(g =>
      filter === 'all' || g.milestones.some(m => m.status === filter)
    ),
  [groups, filter])

  const globalPct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0

  const filterOpts: { key: Filter; label: string; count: number }[] = [
    { key: 'all',         label: 'All',         count: stats.total },
    { key: 'in_progress', label: 'In Progress',  count: stats.inProgress },
    { key: 'pending',     label: 'Pending',      count: stats.pending },
    { key: 'done',        label: 'Done',         count: stats.done },
  ]

  return (
    <div className="p-content-wrap">
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <p className="p-eyebrow">Team Workspace</p>
        <h1 className="p-page-title">Milestones</h1>
      </div>

      {stats.total === 0 ? (
        <div className="p-empty">
          <div className="p-empty-icon-wrap"><Milestone size={20} /></div>
          <p className="p-empty-title">No milestones yet</p>
          <p className="p-empty-sub">Milestones will appear here once added to your projects.</p>
        </div>
      ) : (
        <>
          {/* Stats bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}>
            {[
              { label: 'Total', value: stats.total, color: 'var(--ds-text-2)' },
              { label: 'In Progress', value: stats.inProgress, color: '#0ED2BD' },
              { label: 'Pending', value: stats.pending, color: 'var(--ds-text-3)' },
              { label: 'Done', value: stats.done, color: '#6ee7b7' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'var(--ds-surface-2)',
                border: '1px solid var(--ds-border)',
                borderRadius: '10px',
                padding: '0.875rem 1rem',
              }}>
                <div style={{ fontSize: '11px', color: 'var(--ds-text-3)', marginBottom: '0.3rem' }}>{s.label}</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono, monospace)', lineHeight: 1 }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Global progress bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '11.5px', color: 'var(--ds-text-3)' }}>Overall progress</span>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: globalPct === 100 ? '#6ee7b7' : '#0ED2BD', fontFamily: 'var(--font-mono, monospace)' }}>
                {globalPct}%
              </span>
            </div>
            <div style={{ height: 5, background: 'var(--ds-border-2)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${globalPct}%`,
                background: globalPct === 100
                  ? 'linear-gradient(90deg, #6ee7b7, #34d399)'
                  : 'linear-gradient(90deg, #0ED2BD, #14b8a6)',
                borderRadius: 3,
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {filterOpts.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.35rem 0.875rem',
                  fontSize: '12px', fontWeight: 500,
                  background: filter === f.key ? 'rgba(14,210,189,0.12)' : 'var(--ds-surface-2)',
                  color: filter === f.key ? '#0ED2BD' : 'var(--ds-text-3)',
                  border: filter === f.key ? '1px solid rgba(14,210,189,0.3)' : '1px solid var(--ds-border)',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.13s ease',
                }}
              >
                {f.label}
                <span style={{
                  fontSize: '10px', fontWeight: 700,
                  color: filter === f.key ? '#0ED2BD' : 'var(--ds-text-3)',
                  background: filter === f.key ? 'rgba(14,210,189,0.15)' : 'rgba(255,255,255,0.05)',
                  borderRadius: '999px',
                  padding: '0.05rem 0.45rem',
                  minWidth: 20, textAlign: 'center',
                }}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Project groups */}
          {visibleGroups.length === 0 ? (
            <div className="p-empty" style={{ padding: '2.5rem 1rem' }}>
              <p className="p-empty-title">No milestones match this filter</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {visibleGroups.map(g => (
                <ProjectGroup key={g.projectId} group={g} filter={filter} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
