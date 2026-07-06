'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { ClientAssignmentRow } from './ClientAssignmentRow'
import { deactivateUser, reactivateUser } from '@/dashboard/lib/actions/auth/deactivate-user'
import { Pagination } from '@/dashboard/components/ui/Pagination'
import type { ClientWithAssignment } from '@/dashboard/lib/queries/users'

const PAGE_SIZE = 10

type Client = ClientWithAssignment

type TeamMember = {
  id: string
  full_name: string
  email: string
  role: string
  is_active: boolean
}

type Props = {
  clients: Client[]
  teamMembers: TeamMember[]
  projectCounts: Record<string, number>
}

type FilterStatus = 'all' | 'active' | 'inactive'
type FilterAssignment = 'all' | 'assigned' | 'unassigned'

function ClientRowMenu({ client, onToggle }: { client: Client; onToggle: () => void }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function handleToggleActive() {
    setOpen(false)
    startTransition(async () => {
      try {
        const result = client.is_active
          ? await deactivateUser({ user_id: client.id })
          : await reactivateUser({ user_id: client.id })
        if (result && 'error' in result && result.error) {
          console.error('[ClientsTable] toggle active failed:', result.error)
          return
        }
        onToggle()
      } catch (err) {
        console.error('[ClientsTable] toggle active error:', err)
      }
    })
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="p-dot-menu"
        type="button"
        title="Options"
        onClick={() => setOpen(v => !v)}
        disabled={isPending}
      >
        {isPending ? (
          <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14, opacity: 0.4, animation: 'spin 1s linear infinite' }}>
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14 }}>
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: 'calc(100% + 4px)',
          background: 'var(--p-s2)',
          border: '1px solid var(--p-b1)',
          borderRadius: 10,
          padding: '0.25rem',
          minWidth: 160,
          zIndex: 50,
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        }}>
          <a
            href={`/admin/projects?client=${client.id}`}
            style={{
              display: 'block',
              padding: '0.5rem 0.75rem',
              fontSize: '0.78rem',
              color: 'var(--p-t2)',
              borderRadius: 7,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--p-s3)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            View Projects
          </a>
          <button
            type="button"
            onClick={handleToggleActive}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '0.5rem 0.75rem',
              fontSize: '0.78rem',
              color: client.is_active ? 'var(--p-error, #f87171)' : 'var(--p-teal)',
              borderRadius: 7,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--p-s3)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {client.is_active ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      )}
    </div>
  )
}

export function ClientsTable({ clients: initialClients, teamMembers, projectCounts }: Props) {
  const [clients, setClients] = useState(initialClients)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [filterAssignment, setFilterAssignment] = useState<FilterAssignment>('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false)
      }
    }
    if (filterOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [filterOpen])

  function handleToggle(clientId: string) {
    setClients(prev =>
      prev.map(c => c.id === clientId ? { ...c, is_active: !c.is_active } : c)
    )
  }

  const filtered = clients.filter(c => {
    if (filterStatus === 'active' && !c.is_active) return false
    if (filterStatus === 'inactive' && c.is_active) return false
    if (filterAssignment === 'assigned' && !c.assigned_team_member_id) return false
    if (filterAssignment === 'unassigned' && c.assigned_team_member_id) return false
    return true
  })

  const hasActiveFilter = filterStatus !== 'all' || filterAssignment !== 'all'
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function setFilterStatusAndResetPage(v: FilterStatus) { setFilterStatus(v); setPage(1) }
  function setFilterAssignmentAndResetPage(v: FilterAssignment) { setFilterAssignment(v); setPage(1) }

  return (
    <>
      {/* Header actions */}
      <div className="p-ecosystem-actions">
        <div ref={filterRef} style={{ position: 'relative' }}>
          <button
            className="p-btn-filter"
            type="button"
            onClick={() => setFilterOpen(v => !v)}
            style={hasActiveFilter ? { borderColor: 'var(--p-teal)', color: 'var(--p-teal)' } : {}}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 13, height: 13 }}>
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filter{hasActiveFilter ? ' •' : ''}
          </button>

          {filterOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 6px)',
              background: 'var(--p-s2)',
              border: '1px solid var(--p-b1)',
              borderRadius: 12,
              padding: '1rem',
              minWidth: 200,
              zIndex: 50,
              boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.875rem',
            }}>
              <div>
                <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--p-t3)', marginBottom: '0.5rem' }}>Status</p>
                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                  {(['all', 'active', 'inactive'] as FilterStatus[]).map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setFilterStatusAndResetPage(v)}
                      style={{
                        padding: '0.25rem 0.625rem',
                        fontSize: '0.72rem',
                        borderRadius: 6,
                        border: '1px solid',
                        cursor: 'pointer',
                        borderColor: filterStatus === v ? 'var(--p-teal)' : 'var(--p-b1)',
                        background: filterStatus === v ? 'rgba(0,200,180,0.1)' : 'transparent',
                        color: filterStatus === v ? 'var(--p-teal)' : 'var(--p-t2)',
                        textTransform: 'capitalize',
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--p-t3)', marginBottom: '0.5rem' }}>Assignment</p>
                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                  {(['all', 'assigned', 'unassigned'] as FilterAssignment[]).map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setFilterAssignmentAndResetPage(v)}
                      style={{
                        padding: '0.25rem 0.625rem',
                        fontSize: '0.72rem',
                        borderRadius: 6,
                        border: '1px solid',
                        cursor: 'pointer',
                        borderColor: filterAssignment === v ? 'var(--p-teal)' : 'var(--p-b1)',
                        background: filterAssignment === v ? 'rgba(0,200,180,0.1)' : 'transparent',
                        color: filterAssignment === v ? 'var(--p-teal)' : 'var(--p-t2)',
                        textTransform: 'capitalize',
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={() => { setFilterStatus('all'); setFilterAssignment('all'); setPage(1) }}
                  style={{ fontSize: '0.72rem', color: 'var(--p-t3)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        <a href="/admin/users/new" className="p-btn-new-client">
          <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 13, height: 13 }}>
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Client
        </a>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="p-empty">
          <div className="p-empty-icon-wrap">
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="p-empty-title">No clients match these filters</p>
          <button type="button" onClick={() => { setFilterStatus('all'); setFilterAssignment('all'); setPage(1) }} style={{ fontSize: '0.78rem', color: 'var(--p-teal)', background: 'none', border: 'none', cursor: 'pointer', marginTop: '0.25rem' }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div style={{ background: 'var(--p-s1)', border: '1px solid var(--p-b1)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
            gap: '1rem',
            padding: '0.625rem 1.125rem',
            borderBottom: '1px solid var(--p-b1)',
          }}>
            {['Client', 'Team Member', 'Projects', 'Status', ''].map(h => (
              <span key={h} style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--p-t3)' }}>{h}</span>
            ))}
          </div>

          {paged.map(client => {
            const assignedMember = teamMembers.find(m => m.id === client.assigned_team_member_id)
            const activeCount = projectCounts[client.id] ?? 0

            return (
              <div
                key={client.id}
                className="p-ecosystem-client-row"
                style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr auto', display: 'grid', gap: '1rem', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="p-ecosystem-logo">
                    {(client.company_name ?? client.full_name)?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p className="p-ecosystem-client-name">{client.full_name}</p>
                    <p className="p-ecosystem-client-domain">{client.company_name ?? client.email}</p>
                  </div>
                </div>

                <div>
                  {assignedMember ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="p-avatar-sm">{assignedMember.full_name[0].toUpperCase()}</div>
                      <span style={{ fontSize: '0.73rem', color: 'var(--p-t2)' }}>{assignedMember.full_name.split(' ')[0]}</span>
                    </div>
                  ) : (
                    <ClientAssignmentRow client={client} teamMembers={teamMembers} compact />
                  )}
                </div>

                <div>
                  <span style={{ fontSize: '0.78rem', color: activeCount > 0 ? 'var(--p-t1)' : 'var(--p-t3)', fontWeight: activeCount > 0 ? 500 : 400 }}>
                    {activeCount} active
                  </span>
                </div>

                <div>
                  <span className={client.is_active ? 'p-chip p-chip--active' : 'p-chip p-chip--inactive'}>
                    {client.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <ClientRowMenu client={client} onToggle={() => handleToggle(client.id)} />
              </div>
            )
          })}
        </div>
      )}

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
    </>
  )
}
