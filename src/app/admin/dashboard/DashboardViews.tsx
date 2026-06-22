'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { FeaturedProjectCard } from '@/components/shared/FeaturedProjectCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ProjectStatusBadge, RoleBadge } from '@/components/shared/StatusBadge'
import { Avatar } from '@/components/ui/Avatar'
import { CalendarDays, Check, Clock, Trash2, AlertTriangle } from 'lucide-react'
import { deleteMeeting } from '@/lib/actions/meetings/schedule-meeting'

interface ProjectRow {
  id: string
  name: string
  status: string
  clientName: string
  clientDeadline: string | null
  internalDeadline: string | null
  milestoneDone: number
  milestoneTotal: number
  adminApproved: boolean
  team: { id: string; full_name: string }[]
}

interface ActivityRow {
  id: string
  actorName: string
  actorInitial: string
  actorRole: 'admin' | 'team_member' | 'client'
  action: string
  entityName: string | null
  createdAt: string
}

interface MeetingViewRow {
  id: string
  title: string
  scheduled_at: string
  notes: string | null
  attended_by_team: boolean
  attended_at: string | null
  clientName: string | null
  teamMemberName: string | null
  teamMemberId: string | null
  missed: boolean
}

interface DashboardViewsProps {
  globalPct: number
  awaitingApproval: number
  attention: number
  activeCount: number
  doneMilestones: number
  totalMilestones: number
  projects: ProjectRow[]
  activity: ActivityRow[]
  upcomingMeetings: MeetingViewRow[]
  missedMeetings: MeetingViewRow[]
}

function fmtDate(d: string | null) {
  if (!d) return null
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

export default function DashboardViews({
  globalPct,
  awaitingApproval,
  attention,
  activeCount,
  doneMilestones,
  totalMilestones,
  projects,
  activity,
  upcomingMeetings,
  missedMeetings,
}: DashboardViewsProps) {
  const [view, setView] = useState('Cards')
  const [listFilter, setListFilter] = useState<'all' | 'attention' | 'approval'>('all')

  const activeProjects = projects.filter(p => p.status !== 'completed')
  const isAtRisk = (p: ProjectRow) =>
    p.status !== 'completed' &&
    (p.team.length === 0 || (!!p.clientDeadline && new Date(p.clientDeadline) < new Date()))
  const isAwaitingApproval = (p: ProjectRow) => p.status === 'final_review' && !p.adminApproved
  const visibleProjects =
    listFilter === 'attention' ? projects.filter(isAtRisk) :
      listFilter === 'approval' ? projects.filter(isAwaitingApproval) :
        projects
  const attentionOnly = listFilter === 'attention'
  const approvalOnly = listFilter === 'approval'
  const listLabel = attentionOnly ? 'Needs Attention' : approvalOnly ? 'Awaiting Approval' : 'All Projects'
  const listEmptyText = attentionOnly ? 'No projects need attention' : 'No projects awaiting approval'
  const r = 36, circ = 2 * Math.PI * r
  const dash = (globalPct / 100) * circ

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Segmented control */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <SegmentedControl
            options={['Cards', 'Operations', 'Editorial', 'Meetings']}
            value={view}
            onChange={setView}
          />
          {missedMeetings.length > 0 && view !== 'Meetings' && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              fontSize: '11px', fontWeight: 600,
              color: '#f59e0b', background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: '999px', padding: '0.2rem 0.625rem',
              cursor: 'pointer',
            }} onClick={() => setView('Meetings')}>
              <AlertTriangle size={10} />
              {missedMeetings.length} missed
            </span>
          )}
        </div>
        <Link href="/admin/projects/new" className="p-btn-primary" style={{ textDecoration: 'none' }}>
          + New Project
        </Link>
      </div>

      {/* ─── CARDS VIEW ─── */}
      {view === 'Cards' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Stat row */}
          <div className="p-dash-stat-row">
            {/* Circular progress */}
            <div className="p-stat" style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', padding: '1.25rem 1rem 1rem' }}>
              <div className="p-stat-label" style={{ textAlign: 'center', marginBottom: '0.875rem' }}>Global Progress</div>
              <div style={{ position: 'relative', width: 90, height: 90 }}>
                <svg width="90" height="90" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r={r} fill="none" stroke="var(--ds-border-2)" strokeWidth="7" />
                  <circle
                    cx="45" cy="45" r={r} fill="none"
                    stroke="var(--ds-white)" strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circ}`}
                    transform="rotate(-90 45 45)"
                  />
                </svg>
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', fontWeight: 600, color: 'var(--ds-text)',
                  fontFamily: 'var(--font-mono), ui-monospace, monospace',
                }}>
                  {globalPct}%
                </div>
              </div>
              <div className="p-stat-foot" style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                Across {projects.length} projects
              </div>
            </div>

            <button
              type="button"
              className="p-stat"
              onClick={() => setListFilter(f => f === 'approval' ? 'all' : 'approval')}
              style={{
                cursor: 'pointer',
                textAlign: 'left',
                border: approvalOnly ? '1px solid var(--ds-amber, #f59e0b)' : undefined,
              }}
            >
              <div className="p-stat-label">Awaiting Approval</div>
              <div className="p-stat-value mono">{pad2(awaitingApproval)}</div>
              <div className="p-stat-foot">{approvalOnly ? 'Showing pending only · click to clear' : 'in final review'}</div>
            </button>

            <button
              type="button"
              className="p-stat"
              onClick={() => setListFilter(f => f === 'attention' ? 'all' : 'attention')}
              style={{
                cursor: 'pointer',
                textAlign: 'left',
                border: attentionOnly ? '1px solid var(--ds-amber, #f59e0b)' : undefined,
              }}
            >
              <div className="p-stat-label">Needs Attention</div>
              <div className={`p-stat-value mono${attention > 0 ? ' p-stat-value--warn' : ''}`}>{pad2(attention)}</div>
              <div className="p-stat-foot">{attentionOnly ? 'Showing at-risk only · click to clear' : `${activeCount} active projects`}</div>
            </button>
          </div>

          {/* Two-col: cards + activity */}
          <div className="p-dash-main-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="p-section-header">
                <span className="p-section-label">Active Projects</span>
                <Link href="/admin/projects" className="p-link-teal">View all →</Link>
              </div>

              {activeProjects.length === 0 ? (
                <div className="p-empty">
                  <div className="p-empty-icon-wrap">
                    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                  </div>
                  <p className="p-empty-title">No active projects</p>
                </div>
              ) : (
                <div className="p-card-grid">
                  {activeProjects.slice(0, 4).map(p => (
                    <FeaturedProjectCard
                      key={p.id}
                      id={p.id}
                      name={p.name}
                      clientName={p.clientName}
                      status={p.status}
                      dueDate={p.clientDeadline}
                      milestoneDone={p.milestoneDone}
                      milestoneTotal={p.milestoneTotal}
                      href={`/admin/projects/${p.id}`}
                    />
                  ))}
                </div>
              )}

              {/* All projects list */}
              {projects.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div className="p-section-header" style={{ marginBottom: '0.5rem' }}>
                    <span className="p-section-label">{listLabel}</span>
                    {listFilter !== 'all' && (
                      <button type="button" onClick={() => setListFilter('all')} className="p-link-teal" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        Clear filter
                      </button>
                    )}
                  </div>
                  {visibleProjects.length === 0 ? (
                    <div className="p-empty">
                      <p className="p-empty-title">{listEmptyText}</p>
                    </div>
                  ) : (
                    <div className="p-project-rows">
                      {visibleProjects.map(p => {
                        const pct = p.milestoneTotal > 0 ? Math.round((p.milestoneDone / p.milestoneTotal) * 100) : null
                        return (
                          <Link key={p.id} href={`/admin/projects/${p.id}`} className="p-project-row">
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span className="p-project-name">{p.name}</span>
                                <ProjectStatusBadge status={p.status as 'briefing' | 'in_progress' | 'final_review' | 'completed' | 'paused'} />
                              </div>
                              <div className="p-project-meta">
                                {p.clientName}
                                {p.clientDeadline ? ` · Due ${fmtDate(p.clientDeadline)}` : ''}
                              </div>
                            </div>
                            <div style={{ flexShrink: 0 }}>
                              {p.team.length > 0 ? (
                                <div className="p-avatar-stack">
                                  {p.team.slice(0, 3).map(m => (
                                    <Avatar key={m.id} name={m.full_name} size="sm" />
                                  ))}
                                  {p.team.length > 3 && (
                                    <div className="p-avatar-sm p-avatar-overflow">+{p.team.length - 3}</div>
                                  )}
                                </div>
                              ) : (
                                <span className="p-unassigned">Unassigned</span>
                              )}
                            </div>
                            {pct !== null && (
                              <div className="p-progress-wrap">
                                <div className="p-progress-track">
                                  <div className="p-progress-fill" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="p-progress-pct">{pct}%</span>
                              </div>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Activity */}
            <ActivityRail activity={activity} />
          </div>
        </div>
      )}

      {/* ─── OPERATIONS VIEW ─── */}
      {view === 'Operations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div className="p-kpi-bar">
            <div className="p-kpi-cell">
              <div className="p-kpi-label">Global Progress</div>
              <div className="p-kpi-value mono">{globalPct}%</div>
              <ProgressBar value={globalPct} />
            </div>
            <button
              type="button"
              className="p-kpi-cell"
              onClick={() => setListFilter(f => f === 'approval' ? 'all' : 'approval')}
              style={{
                cursor: 'pointer',
                textAlign: 'left',
                border: approvalOnly ? '1px solid var(--ds-amber, #f59e0b)' : undefined,
              }}
            >
              <div className="p-kpi-label">Awaiting Approval</div>
              <div className="p-kpi-value mono">{pad2(awaitingApproval)}</div>
              <div className="p-kpi-foot">{approvalOnly ? 'showing pending only' : 'deliverables pending'}</div>
            </button>
            <button
              type="button"
              className="p-kpi-cell"
              onClick={() => setListFilter(f => f === 'attention' ? 'all' : 'attention')}
              style={{
                cursor: 'pointer',
                textAlign: 'left',
                border: attentionOnly ? '1px solid var(--ds-amber, #f59e0b)' : undefined,
              }}
            >
              <div className="p-kpi-label">Needs Attention</div>
              <div className="p-kpi-value mono" style={attention > 0 ? { color: 'var(--ds-amber)' } : {}}>
                {pad2(attention)}
              </div>
              <div className="p-kpi-foot">{attentionOnly ? 'showing at-risk only' : 'projects at risk'}</div>
            </button>
            <div className="p-kpi-cell">
              <div className="p-kpi-label">Milestones Done</div>
              <div className="p-kpi-value mono">{doneMilestones}<span style={{ fontSize: 16, color: 'var(--ds-text-3)' }}>/{totalMilestones}</span></div>
              <div className="p-kpi-foot">across all projects</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            <div>
              <div className="p-section-header" style={{ marginBottom: '0.5rem' }}>
                <span className="p-section-label">{listLabel}</span>
                {listFilter !== 'all' && (
                  <button type="button" onClick={() => setListFilter('all')} className="p-link-teal" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    Clear filter
                  </button>
                )}
              </div>
              <div className="p-table-wrap">
                <table className="p-table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Status</th>
                      <th>Client</th>
                      <th>Deadline</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleProjects.map(p => {
                      const pct = p.milestoneTotal > 0 ? Math.round((p.milestoneDone / p.milestoneTotal) * 100) : 0
                      return (
                        <tr key={p.id}>
                          <td>
                            <Link href={`/admin/projects/${p.id}`} style={{ color: 'var(--ds-text)', textDecoration: 'none', fontWeight: 500 }}>
                              {p.name}
                            </Link>
                          </td>
                          <td><ProjectStatusBadge status={p.status as 'briefing' | 'in_progress' | 'final_review' | 'completed' | 'paused'} /></td>
                          <td className="mono" style={{ color: 'var(--ds-text-3)' }}>{p.clientName}</td>
                          <td className="mono" style={{ color: 'var(--ds-text-3)' }}>{fmtDate(p.clientDeadline) ?? '—'}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ minWidth: 60 }}><ProgressBar value={pct} /></div>
                              <span className="mono" style={{ fontSize: 12, color: 'var(--ds-text-3)' }}>{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <ActivityRail activity={activity} />
          </div>
        </div>
      )}

      {/* ─── EDITORIAL VIEW ─── */}
      {view === 'Editorial' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div className="p-editorial-stats">
            <div className="p-editorial-stat">
              <div className="p-editorial-stat-value mono">
                {globalPct}<span className="p-editorial-stat-unit">%</span>
              </div>
              <div className="p-editorial-stat-label">Global Progress</div>
            </div>
            <div className="p-editorial-stat">
              <div className="p-editorial-stat-value mono">{activeCount}</div>
              <div className="p-editorial-stat-label">Active Projects</div>
            </div>
            <div className="p-editorial-stat">
              <div className="p-editorial-stat-value mono">{pad2(awaitingApproval)}</div>
              <div className="p-editorial-stat-label">Awaiting Approval</div>
            </div>
            <div className="p-editorial-stat">
              <div className="p-editorial-stat-value mono">{doneMilestones}</div>
              <div className="p-editorial-stat-label">Milestones Done</div>
            </div>
          </div>

          {/* Full project list */}
          <div>
            <div className="p-section-label" style={{ marginBottom: '0.5rem' }}>All Projects</div>
            <div className="p-project-rows">
              {projects.map(p => {
                const pct = p.milestoneTotal > 0 ? Math.round((p.milestoneDone / p.milestoneTotal) * 100) : null
                return (
                  <Link key={p.id} href={`/admin/projects/${p.id}`} className="p-project-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="p-project-name">{p.name}</span>
                        <ProjectStatusBadge status={p.status as 'briefing' | 'in_progress' | 'final_review' | 'completed' | 'paused'} />
                      </div>
                      <div className="p-project-meta">
                        {p.clientName}{p.clientDeadline ? ` · Due ${fmtDate(p.clientDeadline)}` : ''}
                      </div>
                    </div>
                    {pct !== null && (
                      <div className="p-progress-wrap">
                        <div className="p-progress-track">
                          <div className="p-progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="p-progress-pct">{pct}%</span>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Timeline activity */}
          <div>
            <div className="p-section-label" style={{ marginBottom: '0.5rem' }}>Recent Activity</div>
            <div className="p-feed p-feed-editorial">
              {activity.length === 0 ? (
                <p style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--ds-text-3)' }}>No activity yet.</p>
              ) : (
                activity.map(log => (
                  <div key={log.id} className="p-feed-item">
                    <div className="p-feed-avatar">{log.actorInitial}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="p-feed-text">
                        <span className="p-feed-actor">{log.actorName}</span>
                        {' '}{log.action.replace('.', ' ')}
                        {log.entityName && <span className="p-feed-entity"> · {log.entityName}</span>}
                      </div>
                      <div className="p-feed-row">
                        <span className="p-feed-time mono">{new Date(log.createdAt).toLocaleString('en-US')}</span>
                        <RoleBadge role={log.actorRole} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {/* ─── MEETINGS VIEW ─── */}
      {view === 'Meetings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

          {/* Missed meetings */}
          {missedMeetings.length > 0 && (
            <div>
              <div className="p-section-header" style={{ marginBottom: '0.625rem' }}>
                <span className="p-section-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#f59e0b' }}>
                  <AlertTriangle size={13} />
                  Missed Meetings
                </span>
                <span style={{ fontSize: '12px', color: 'var(--ds-text-3)' }}>{missedMeetings.length} unattended</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {missedMeetings.map(m => (
                  <MeetingCard key={m.id} meeting={m} variant="missed" />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming meetings */}
          <div>
            <div className="p-section-header" style={{ marginBottom: '0.625rem' }}>
              <span className="p-section-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <CalendarDays size={13} />
                Upcoming Meetings
              </span>
              <Link href="/admin/users" className="p-link-teal" style={{ fontSize: '12px' }}>
                Schedule → Team
              </Link>
            </div>
            {upcomingMeetings.length === 0 ? (
              <div className="p-empty" style={{ padding: '2rem 1rem' }}>
                <div className="p-empty-icon-wrap"><CalendarDays size={18} /></div>
                <p className="p-empty-title">No upcoming meetings</p>
                <p className="p-empty-sub">Schedule a meeting from a team member's profile.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {upcomingMeetings.map(m => (
                  <MeetingCard key={m.id} meeting={m} variant="upcoming" />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

function MeetingCard({ meeting: m, variant }: { meeting: MeetingViewRow; variant: 'upcoming' | 'missed' }) {
  const [deleting, startDelete] = useTransition()

  const d = new Date(m.scheduled_at)
  const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  const accentColor = variant === 'missed' ? '#f59e0b' : '#0ED2BD'
  const accentBg = variant === 'missed' ? 'rgba(245,158,11,0.08)' : 'rgba(14,210,189,0.08)'
  const accentBorder = variant === 'missed' ? 'rgba(245,158,11,0.2)' : 'rgba(14,210,189,0.18)'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.875rem',
      padding: '0.875rem 1rem',
      background: 'var(--ds-surface-2)',
      border: `1px solid ${accentBorder}`,
      borderRadius: '10px',
    }}>
      {/* Date badge */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        width: 48, minWidth: 48, height: 48,
        borderRadius: '9px',
        background: accentBg,
        border: `1px solid ${accentBorder}`,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '9px', fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {d.toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ds-white)', lineHeight: 1.1 }}>
          {d.getDate()}
        </span>
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
          <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--ds-white)' }}>{m.title}</span>
          {m.attended_by_team && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '10px', color: '#0ED2BD', background: 'rgba(14,210,189,0.1)', borderRadius: '4px', padding: '0.1rem 0.4rem' }}>
              <Check size={9} /> Attended
            </span>
          )}
          {variant === 'missed' && (
            <span style={{ fontSize: '10px', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', borderRadius: '4px', padding: '0.1rem 0.4rem' }}>
              Not attended
            </span>
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem', fontSize: '11.5px', color: 'var(--ds-text-3)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={10} /> {dateStr} · {timeStr}
          </span>
          {m.clientName && (
            <span>Client: <strong style={{ color: 'var(--ds-text-2)' }}>{m.clientName}</strong></span>
          )}
          {m.teamMemberName && (
            <span>Team: <strong style={{ color: 'var(--ds-text-2)' }}>{m.teamMemberName}</strong></span>
          )}
        </div>
        {m.notes && (
          <p style={{ margin: '0.375rem 0 0', fontSize: '11.5px', color: 'var(--ds-text-3)', fontStyle: 'italic' }}>{m.notes}</p>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={() => startDelete(async () => { await deleteMeeting(m.id) })}
        disabled={deleting}
        title="Remove meeting"
        style={{ background: 'none', border: 'none', cursor: deleting ? 'not-allowed' : 'pointer', color: 'var(--ds-text-3)', padding: '0.25rem', flexShrink: 0, opacity: deleting ? 0.4 : 1 }}
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}

function ActivityRail({ activity }: { activity: ActivityRow[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div className="p-section-label">Recent Activity</div>
      <div className="p-feed">
        {activity.length === 0 ? (
          <p style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--ds-text-3)' }}>No activity yet.</p>
        ) : (
          activity.map(log => (
            <div key={log.id} className="p-feed-item">
              <div className="p-feed-avatar">{log.actorInitial}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="p-feed-text">
                  <span className="p-feed-actor">{log.actorName}</span>
                  {' '}{log.action.replace('.', ' ')}
                  {log.entityName && <span className="p-feed-entity"> · {log.entityName}</span>}
                </div>
                <div className="p-feed-row">
                  <span className="p-feed-time mono">{new Date(log.createdAt).toLocaleString('en-US')}</span>
                  <RoleBadge role={log.actorRole} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
