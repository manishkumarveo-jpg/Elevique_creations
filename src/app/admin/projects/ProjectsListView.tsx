'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ProjectStatusBadge } from '@/dashboard/components/shared/StatusBadge'
import { Avatar } from '@/dashboard/components/ui/Avatar'
import { Pagination } from '@/dashboard/components/ui/Pagination'
import type { ProjectWithTeam } from '@/dashboard/lib/queries/projects'

const STATUS_OPTIONS = ['All', 'briefing', 'in_progress', 'final_review', 'completed', 'paused'] as const
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

export function ProjectsListView({ projects }: { projects: ProjectWithTeam[] }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<typeof STATUS_OPTIONS[number]>('All')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return projects.filter(p => {
      if (status !== 'All' && p.status !== status) return false
      if (!q) return true
      const clientName = (p.client?.company_name ?? p.client?.full_name ?? '').toLowerCase()
      return p.name.toLowerCase().includes(q) || clientName.includes(q)
    })
  }, [projects, search, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function updateSearch(v: string) {
    setSearch(v)
    setPage(1)
  }
  function updateStatus(v: typeof STATUS_OPTIONS[number]) {
    setStatus(v)
    setPage(1)
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by project or client…"
          value={search}
          onChange={e => updateSearch(e.target.value)}
          style={{ ...inputStyle, minWidth: 220 }}
        />
        <select className="p-select" value={status} onChange={e => updateStatus(e.target.value as typeof status)} style={{ width: 'auto' }}>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s.replace('_', ' ')}</option>)}
        </select>
        <span style={{ fontSize: '0.78rem', color: 'var(--ds-text-3)', alignSelf: 'center', marginLeft: 'auto' }}>
          {filtered.length} of {projects.length} projects
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="p-empty">
          <p className="p-empty-title">No projects match these filters</p>
        </div>
      ) : (
        <div className="p-project-rows">
          {paged.map(project => {
            const progress = project.milestone_total > 0
              ? Math.round((project.milestone_done / project.milestone_total) * 100)
              : null
            return (
              <Link key={project.id} href={`/admin/projects/${project.id}`} className="p-project-row">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                    <span className="p-project-name">{project.name}</span>
                    <ProjectStatusBadge status={project.status} />
                  </div>
                  <div className="p-project-meta">
                    {project.client?.company_name ?? project.client?.full_name ?? '—'}
                    {project.package ? ` · ${project.package}` : ''}
                    {project.client_deadline
                      ? ` · Due ${new Date(project.client_deadline + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                      : ''}
                  </div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  {project.team.length > 0 ? (
                    <div className="p-avatar-stack">
                      {project.team.slice(0, 4).map(m => (
                        <Avatar key={m.id} name={m.full_name} size="sm" />
                      ))}
                      {project.team.length > 4 && (
                        <div className="p-avatar-sm p-avatar-overflow">+{project.team.length - 4}</div>
                      )}
                    </div>
                  ) : (
                    <span className="p-unassigned">Unassigned</span>
                  )}
                </div>

                {progress !== null ? (
                  <div className="p-progress-wrap">
                    <div className="p-progress-track">
                      <div className="p-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="p-progress-pct">{progress}%</span>
                  </div>
                ) : (
                  <span className="p-progress-pct" style={{ color: 'var(--ds-text-3)' }}>—</span>
                )}
              </Link>
            )
          })}
        </div>
      )}

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
    </>
  )
}
