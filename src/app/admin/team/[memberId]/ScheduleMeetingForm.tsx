'use client'

import { useState, useTransition } from 'react'
import { CalendarDays, Check, Trash2 } from 'lucide-react'
import { scheduleMeeting, deleteMeeting } from '@/lib/actions/meetings/schedule-meeting'
import type { MeetingRow } from '@/lib/queries/meetings'

interface Client {
  id: string
  full_name: string
  company_name: string | null
}

interface Props {
  memberId: string
  clients: Client[]
  meetings: MeetingRow[]
}

function formatMeetingDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function isPast(iso: string) {
  return new Date(iso) < new Date()
}

export function ScheduleMeetingForm({ memberId, clients, meetings }: Props) {
  const [title, setTitle] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [clientId, setClientId] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    if (!title || !scheduledAt) return
    startTransition(async () => {
      const result = await scheduleMeeting({
        title,
        scheduled_at: new Date(scheduledAt).toISOString(),
        client_id: clientId || null,
        assigned_team_member_id: memberId,
        project_id: null,
        notes: notes || null,
      })
      if (result.success) {
        setStatus('saved')
        setTitle('')
        setScheduledAt('')
        setClientId('')
        setNotes('')
        setTimeout(() => setStatus('idle'), 2500)
      } else {
        setStatus('error')
      }
    })
  }

  return (
    <div style={{
      background: 'var(--ds-surface-2)',
      border: '1px solid var(--ds-border)',
      borderRadius: '10px',
      padding: '1rem 1.25rem',
      marginBottom: '2rem',
    }}>
      <div className="p-section-header" style={{ marginBottom: '0.875rem' }}>
        <span className="p-section-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <CalendarDays size={13} />
          Schedule a Meeting
        </span>
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: '1 1 200px' }}>
            <label className="auth-label">Meeting Title</label>
            <input
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); setStatus('idle') }}
              placeholder="e.g. Project Review Call"
              className="p-select"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: '1 1 200px' }}>
            <label className="auth-label">Date & Time</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={e => { setScheduledAt(e.target.value); setStatus('idle') }}
              className="p-select"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: '1 1 180px' }}>
            <label className="auth-label">Client (optional)</label>
            <select
              value={clientId}
              onChange={e => { setClientId(e.target.value); setStatus('idle') }}
              className="p-select"
              style={{ width: '100%' }}
            >
              <option value="">— Select client —</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.company_name ?? c.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label className="auth-label">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={e => { setNotes(e.target.value); setStatus('idle') }}
            placeholder="Agenda, link, or context…"
            className="p-select"
            rows={2}
            style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', paddingTop: '0.25rem' }}>
          <button
            onClick={handleSave}
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
            <span style={{ fontSize: '12px', color: 'var(--ds-red)' }}>Failed to schedule</span>
          )}
        </div>
      </div>

      {/* Existing meetings list */}
      {meetings.length > 0 && (
        <div style={{ borderTop: '1px solid var(--ds-border)', paddingTop: '0.875rem', marginTop: '0.25rem' }}>
          <p style={{ fontSize: '11px', color: 'var(--ds-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
            Scheduled Meetings
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {meetings.map(m => (
              <MeetingListItem key={m.id} meeting={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MeetingListItem({ meeting: m }: { meeting: MeetingRow }) {
  const [deleting, startDelete] = useTransition()
  const past = isPast(m.scheduled_at)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.5rem 0.625rem',
      background: 'var(--ds-surface-1)',
      borderRadius: '7px',
      border: '1px solid var(--ds-border)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ds-white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {m.title}
          </span>
          {m.attended_by_team && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '10px', color: '#0ED2BD', flexShrink: 0 }}>
              <Check size={10} /> Attended
            </span>
          )}
          {past && !m.attended_by_team && (
            <span style={{ fontSize: '10px', color: 'var(--ds-amber, #f59e0b)', flexShrink: 0 }}>Missed</span>
          )}
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--ds-text-3)', marginTop: '0.1rem' }}>
          {formatMeetingDate(m.scheduled_at)}
          {m.client && ` · ${m.client.company_name ?? m.client.full_name}`}
        </div>
      </div>
      <button
        onClick={() => startDelete(async () => { await deleteMeeting(m.id) })}
        disabled={deleting}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ds-text-3)', padding: '0.25rem', flexShrink: 0 }}
        title="Remove meeting"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}
