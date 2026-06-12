'use client'

import { useState, useTransition } from 'react'
import { extendDeadline } from '@/lib/actions/projects/extend-deadline'
import type { DeadlineExtension } from '@/lib/queries/projects'

interface Props {
  projectId: string
  internal_deadline: string | null
  client_deadline: string | null
  extensions: DeadlineExtension[]
}

const panel: React.CSSProperties = {
  background: '#0f1220',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 16,
  padding: '1.25rem 1.5rem',
}

const sectionLabel: React.CSSProperties = {
  fontSize: '0.6rem',
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.28)',
  marginBottom: '0.75rem',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#161d2e',
  border: '1px solid rgba(255,255,255,0.11)',
  borderRadius: 9,
  padding: '0.55rem 0.8rem',
  fontSize: '0.8rem',
  color: 'rgba(255,255,255,0.90)',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}

const btnTeal: React.CSSProperties = {
  padding: '0.45rem 0.9rem',
  background: 'rgba(20,184,166,0.12)',
  color: '#14B8A6',
  border: '1px solid rgba(20,184,166,0.25)',
  borderRadius: 7,
  fontSize: '0.68rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  fontFamily: 'inherit',
}

const btnGhost: React.CSSProperties = {
  padding: '0.45rem 0.9rem',
  background: 'none',
  color: 'rgba(255,255,255,0.45)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 7,
  fontSize: '0.68rem',
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
}

function fmt(date: string | null) {
  if (!date) return '—'
  return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

interface DeadlineSectionProps {
  label: string
  badge: string
  current: string | null
  deadlineType: 'internal' | 'client'
  projectId: string
  extensions: DeadlineExtension[]
}

function DeadlineSection({ label, badge, current, deadlineType, projectId, extensions }: DeadlineSectionProps) {
  const [open, setOpen] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const relevantHistory = extensions.filter(e => e.deadline_type === deadlineType)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      try {
        await extendDeadline(projectId, { deadline_type: deadlineType, new_date: newDate, reason })
        setOpen(false)
        setNewDate('')
        setReason('')
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to update deadline')
      }
    })
  }

  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>{label}</span>
          <span style={{
            fontSize: '0.58rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '0.15rem 0.45rem',
            borderRadius: 20,
            background: deadlineType === 'internal' ? 'rgba(99,102,241,0.12)' : 'rgba(20,184,166,0.12)',
            color: deadlineType === 'internal' ? '#a5b4fc' : '#14B8A6',
            border: deadlineType === 'internal' ? '1px solid rgba(99,102,241,0.2)' : '1px solid rgba(20,184,166,0.2)',
          }}>
            {badge}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.82rem', color: current ? 'rgba(255,255,255,0.80)' : 'rgba(255,255,255,0.22)', fontStyle: current ? 'normal' : 'italic' }}>
            {fmt(current)}
          </span>
          <button type="button" style={btnTeal} onClick={() => setOpen(v => !v)}>
            {open ? 'Cancel' : 'Extend'}
          </button>
        </div>
      </div>

      {open && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.625rem' }}>
            <div>
              <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '0.3rem' }}>
                New Date
              </p>
              <input
                type="date"
                required
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '0.3rem' }}>
                Reason (optional)
              </p>
              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g. Client requested more time"
                style={inputStyle}
              />
            </div>
          </div>
          {error && (
            <p style={{ fontSize: '0.72rem', color: 'rgba(248,113,113,0.85)', margin: 0 }}>{error}</p>
          )}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" disabled={isPending} style={{ ...btnTeal, opacity: isPending ? 0.5 : 1 }}>
              {isPending ? 'Saving…' : 'Save'}
            </button>
            <button type="button" style={btnGhost} onClick={() => { setOpen(false); setError('') }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {relevantHistory.length > 0 && (
        <div style={{ marginTop: '0.625rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {relevantHistory.map(ext => (
            <div key={ext.id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              padding: '0.45rem 0.6rem',
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)' }}>
                  {fmt(ext.old_date)} → {fmt(ext.new_date)}
                </span>
                {ext.reason && (
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.30)', marginLeft: '0.5rem' }}>
                    · {ext.reason}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.22)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {new Date(ext.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function AdminDeadlinePanel({ projectId, internal_deadline, client_deadline, extensions }: Props) {
  return (
    <div style={panel}>
      <p style={sectionLabel}>Deadlines</p>
      <DeadlineSection
        label="Internal Deadline"
        badge="Team only"
        current={internal_deadline}
        deadlineType="internal"
        projectId={projectId}
        extensions={extensions}
      />
      <div style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
        <DeadlineSection
          label="Client Deadline"
          badge="Client-facing"
          current={client_deadline}
          deadlineType="client"
          projectId={projectId}
          extensions={extensions}
        />
      </div>
    </div>
  )
}
