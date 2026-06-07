'use client'

import { useState, useTransition } from 'react'
import { resolveRevision } from '@/lib/actions/projects/project-feedback'
import type { ProjectRevision } from '@/lib/queries/revisions'

interface Props {
  projectId: string
  revisions: ProjectRevision[]
}

export function ClientNoteAlert({ projectId, revisions }: Props) {
  const [showResolved, setShowResolved] = useState(false)

  const open = revisions.filter(r => r.status === 'open')
  const resolved = revisions.filter(r => r.status === 'resolved')

  if (revisions.length === 0) return null

  return (
    <div style={{
      background: 'rgba(251,191,36,0.04)',
      border: '1px solid rgba(251,191,36,0.22)',
      borderRadius: 12,
      padding: '1rem 1.25rem',
    }}>
      <p style={{
        fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: 'rgba(251,191,36,0.7)', margin: '0 0 0.875rem',
      }}>
        Client Revision Requests
      </p>

      {open.length === 0 && (
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.28)', fontStyle: 'italic', margin: '0 0 0.75rem' }}>
          No open requests.
        </p>
      )}

      {open.map(r => (
        <RevisionRow key={r.id} revision={r} projectId={projectId} />
      ))}

      {resolved.length > 0 && (
        <div style={{ marginTop: open.length > 0 ? '0.75rem' : 0 }}>
          <button
            onClick={() => setShowResolved(v => !v)}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              fontSize: '0.65rem', color: 'rgba(255,255,255,0.28)', fontFamily: 'inherit',
              letterSpacing: '0.05em',
            }}
          >
            {showResolved ? `▾ Hide resolved (${resolved.length})` : `▸ Show resolved (${resolved.length})`}
          </button>
          {showResolved && (
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {resolved.map(r => (
                <div key={r.id} style={{
                  opacity: 0.45,
                  padding: '0.5rem 0.75rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 8,
                }}>
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)' }}>
                    {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' · Resolved ✓'}
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', margin: '0.2rem 0 0', lineHeight: 1.5 }}>
                    {r.note}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RevisionRow({ revision, projectId }: { revision: ProjectRevision; projectId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem',
      padding: '0.625rem 0.75rem',
      background: 'rgba(251,191,36,0.04)',
      border: '1px solid rgba(251,191,36,0.14)',
      borderRadius: 8,
      marginBottom: '0.5rem',
    }}>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: '0.65rem', color: 'rgba(251,191,36,0.55)' }}>
          {new Date(revision.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <p style={{ fontSize: '0.82rem', color: 'rgba(251,191,36,0.88)', margin: '0.2rem 0 0', lineHeight: 1.5 }}>
          {revision.note}
        </p>
      </div>
      <button
        disabled={isPending}
        onClick={() => startTransition(() => resolveRevision(revision.id, projectId))}
        style={{
          padding: '0.3rem 0.75rem', flexShrink: 0,
          background: 'none', border: '1px solid rgba(251,191,36,0.3)',
          borderRadius: 7, fontSize: '0.62rem', fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'rgba(251,191,36,0.70)', cursor: isPending ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', opacity: isPending ? 0.5 : 1, whiteSpace: 'nowrap',
        }}
      >
        {isPending ? '…' : 'Mark Resolved'}
      </button>
    </div>
  )
}
