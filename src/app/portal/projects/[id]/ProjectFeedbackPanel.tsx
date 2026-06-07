'use client'

import { useState, useTransition } from 'react'
import { addRevision } from '@/lib/actions/projects/project-feedback'
import type { ProjectRevision } from '@/lib/queries/revisions'

interface Props {
  projectId: string
  revisions: ProjectRevision[]
}

export function ProjectFeedbackPanel({ projectId, revisions }: Props) {
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    setError('')
    if (!note.trim()) { setError('Please describe your concern.'); return }
    startTransition(async () => {
      try {
        await addRevision(projectId, note)
        setNote('')
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to submit')
      }
    })
  }

  return (
    <div style={{
      background: '#0f1220',
      border: '1px solid rgba(251,191,36,0.18)',
      borderRadius: 14,
      padding: '1rem 1.25rem',
    }}>
      <p style={{
        fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: 'rgba(251,191,36,0.7)', margin: '0 0 0.75rem',
      }}>
        Request Changes
      </p>

      {/* Submit form — always visible */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: revisions.length > 0 ? '1.25rem' : 0 }}>
        <textarea
          rows={3}
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Describe what you'd like changed…"
          style={{
            width: '100%', background: '#161d2e',
            border: '1px solid rgba(255,255,255,0.11)',
            borderRadius: 9, padding: '0.6rem 0.85rem',
            fontSize: '0.8rem', color: 'rgba(255,255,255,0.88)',
            outline: 'none', fontFamily: 'inherit',
            boxSizing: 'border-box', resize: 'vertical',
          }}
        />
        {error && (
          <p style={{ fontSize: '0.72rem', color: 'rgba(248,113,113,0.85)', margin: 0 }}>
            {error}
          </p>
        )}
        <div>
          <button
            disabled={isPending}
            onClick={handleSubmit}
            style={{
              padding: '0.4rem 1rem',
              background: isPending ? 'rgba(251,191,36,0.06)' : 'rgba(251,191,36,0.10)',
              color: 'rgba(251,191,36,0.90)', fontSize: '0.68rem', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              border: '1px solid rgba(251,191,36,0.28)',
              borderRadius: 7, cursor: isPending ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', opacity: isPending ? 0.6 : 1,
            }}
          >
            {isPending ? 'Sending…' : 'Submit Request'}
          </button>
        </div>
      </div>

      {/* Past revisions list */}
      {revisions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: '0.25rem' }} />
          {revisions.map(r => (
            <div
              key={r.id}
              style={{
                opacity: r.status === 'resolved' ? 0.45 : 1,
                padding: '0.625rem 0.75rem',
                background: r.status === 'open' ? 'rgba(251,191,36,0.04)' : 'rgba(255,255,255,0.02)',
                border: r.status === 'open' ? '1px solid rgba(251,191,36,0.14)' : '1px solid rgba(255,255,255,0.06)',
                borderRadius: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <span style={{
                  fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', padding: '0.1rem 0.4rem', borderRadius: 4,
                  background: r.status === 'open' ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.06)',
                  color: r.status === 'open' ? 'rgba(251,191,36,0.85)' : 'rgba(255,255,255,0.28)',
                  border: r.status === 'open' ? '1px solid rgba(251,191,36,0.25)' : '1px solid rgba(255,255,255,0.08)',
                }}>
                  {r.status === 'open' ? 'Open' : 'Resolved'}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)' }}>
                  {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <p style={{
                fontSize: '0.82rem', margin: 0, lineHeight: 1.5,
                color: r.status === 'open' ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.40)',
              }}>
                {r.note}
              </p>
            </div>
          ))}
        </div>
      )}

      {revisions.length === 0 && (
        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.22)', fontStyle: 'italic', margin: 0 }}>
          No revision requests yet.
        </p>
      )}
    </div>
  )
}
