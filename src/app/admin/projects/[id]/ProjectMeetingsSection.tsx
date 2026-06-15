'use client'

import { useState, useTransition } from 'react'
import { CalendarDays, Check, Clock, Trash2, AlertTriangle } from 'lucide-react'
import { scheduleMeeting, deleteMeeting } from '@/lib/actions/meetings/schedule-meeting'
import type { MeetingRow } from '@/lib/queries/meetings'

interface TeamMember {
  id: string
  full_name: string
}

interface Props {
  projectId: string
  teamMembers: TeamMember[]
  meetings: MeetingRow[]
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function isPast(iso: string) {
  return new Date(iso) < new Date(Date.now() - 30 * 60 * 1000)
}

export function ProjectMeetingsSection({ projectId, teamMembers, meetings }: Props) {
  const [title, setTitle] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [teamMemberId, setTeamMemberId] = useState(teamMembers[0]?.id ?? '')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [isPending, startTransition] = useTransition()

  const upcoming = meetings.filter(m => !isPast(m.scheduled_at))
  const past = meetings.filter(m => isPast(m.scheduled_at))
  const missed = past.filter(m => !m.attended_by_team)

  function handleSchedule() {
    if (!title || !scheduledAt) return
    startTransition(async () => {
      const result = await scheduleMeeting({
        title,
        scheduled_at: new Date(scheduledAt).toISOString(),
        client_id: null,
        assigned_team_member_id: teamMemberId || null,
        project_id: projectId,
        notes: notes || null,
      })
      if (result.success) {
        setStatus('saved')
        setTitle('')
        setScheduledAt('')
        setNotes('')
        setTimeout(() => setStatus('idle'), 2500)
      } else {
        setStatus('error')
      }
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Schedule form */}
      <div className="p-info-panel">
        <p className="p-info-panel-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1rem' }}>
          <CalendarDays size={13} />
          Schedule a Team Meeting
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: '2 1 200px' }}>
              <label className="auth-label">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => { setTitle(e.target.value); setStatus('idle') }}
                placeholder="e.g. Project Sync, Progress Review…"
                className="p-select"
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: '1 1 180px' }}>
              <label className="auth-label">Date & Time</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={e => { setScheduledAt(e.target.value); setStatus('idle') }}
                className="p-select"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {teamMembers.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: '1 1 160px' }}>
                <label className="auth-label">Team Member</label>
                <select
                  value={teamMemberId}
                  onChange={e => setTeamMemberId(e.target.value)}
                  className="p-select"
                  style={{ width: '100%' }}
                >
                  <option value="">— None —</option>
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.full_name}</option>
                  ))}
                </select>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: '2 1 220px' }}>
              <label className="auth-label">Notes (optional)</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Agenda, link, context…"
                className="p-select"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', paddingTop: '0.25rem' }}>
            <button
              onClick={handleSchedule}
              disabled={!title || !scheduledAt || isPending}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0 1.375rem',
                height: '38px',
                background: (!title || !scheduledAt || isPending)
                  ? 'rgba(14,210,189,0.25)'
                  : 'linear-gradient(135deg, #0ED2BD 0%, #0bbfac 100%)',
                color: (!title || !scheduledAt || isPending) ? 'rgba(14,210,189,0.5)' : '#07080c',
                fontSize: '13.5px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                cursor: (!title || !scheduledAt || isPending) ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
                boxShadow: (!title || !scheduledAt || isPending) ? 'none' : '0 2px 12px rgba(14,210,189,0.25)',
                letterSpacing: '0.01em',
              }}
            >
              {isPending ? (
                <>
                  <span style={{
                    width: 13, height: 13, border: '2px solid rgba(7,8,12,0.25)',
                    borderTopColor: '#07080c', borderRadius: '50%',
                    animation: 'p-spin 0.7s linear infinite', flexShrink: 0,
                  }} />
                  Scheduling…
                </>
              ) : (
                <>
                  <CalendarDays size={15} />
                  Schedule Meeting
                </>
              )}
            </button>
            {status === 'saved' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '12px', color: '#0ED2BD' }}>
                <Check size={12} /> Scheduled
              </span>
            )}
            {status === 'error' && (
              <span style={{ fontSize: '12px', color: 'var(--ds-red)' }}>Failed to save</span>
            )}
          </div>
        </div>
      </div>

      {/* Missed alert */}
      {missed.length > 0 && (
        <div className="p-alert p-alert--warn">
          <span className="p-alert-dot" />
          {missed.length} meeting{missed.length > 1 ? 's were' : ' was'} not attended by team
          <div className="p-alert-links">
            {missed.map(m => (
              <span key={m.id} className="p-alert-link" style={{ cursor: 'default' }}>{m.title}</span>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <div className="p-section-header" style={{ marginBottom: '0.625rem' }}>
            <span className="p-section-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <CalendarDays size={13} /> Upcoming
            </span>
            <span style={{ fontSize: '12px', color: 'var(--ds-text-3)' }}>{upcoming.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {upcoming.map(m => <MeetingItem key={m.id} meeting={m} />)}
          </div>
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div>
          <div className="p-section-header" style={{ marginBottom: '0.625rem' }}>
            <span className="p-section-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Clock size={13} /> Past Meetings
            </span>
            <span style={{ fontSize: '12px', color: 'var(--ds-text-3)' }}>{past.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {past.map(m => <MeetingItem key={m.id} meeting={m} />)}
          </div>
        </div>
      )}

      {meetings.length === 0 && (
        <div className="p-empty" style={{ padding: '2rem 1rem' }}>
          <div className="p-empty-icon-wrap"><CalendarDays size={18} /></div>
          <p className="p-empty-title">No meetings yet</p>
          <p className="p-empty-sub">Schedule the first team meeting for this project above.</p>
        </div>
      )}
    </div>
  )
}

function MeetingItem({ meeting: m }: { meeting: MeetingRow }) {
  const [deleting, startDelete] = useTransition()
  const missed = isPast(m.scheduled_at) && !m.attended_by_team

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.625rem 0.875rem',
      background: 'var(--ds-surface-1)',
      border: `1px solid ${missed ? 'rgba(245,158,11,0.2)' : 'var(--ds-border)'}`,
      borderRadius: '8px',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.1rem' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ds-white)' }}>{m.title}</span>
          {m.attended_by_team && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '10px', color: '#0ED2BD' }}>
              <Check size={10} /> Attended
            </span>
          )}
          {missed && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '10px', color: '#f59e0b' }}>
              <AlertTriangle size={10} /> Missed
            </span>
          )}
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--ds-text-3)' }}>
          {formatDate(m.scheduled_at)}
          {m.team_member && ` · ${m.team_member.full_name}`}
        </div>
        {m.notes && (
          <div style={{ fontSize: '11.5px', color: 'var(--ds-text-3)', fontStyle: 'italic', marginTop: '0.1rem' }}>{m.notes}</div>
        )}
      </div>
      <button
        onClick={() => startDelete(async () => { await deleteMeeting(m.id) })}
        disabled={deleting}
        title="Remove"
        style={{ background: 'none', border: 'none', cursor: deleting ? 'not-allowed' : 'pointer', color: 'var(--ds-text-3)', padding: '0.25rem', flexShrink: 0, opacity: deleting ? 0.4 : 1 }}
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}
