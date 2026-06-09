'use client'

import { useState, useTransition } from 'react'
import { DeliverableStatusBadge } from '@/components/shared/StatusBadge'
import { approveDeliverable, requestRevision } from '@/lib/actions/deliverables/update-deliverable'
import type { Database } from '@/lib/types/database'

type Deliverable = Database['public']['Tables']['deliverables']['Row']

const VideoIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14, color: '#14B8A6' }}>
    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
  </svg>
)
const ImageIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14, color: 'rgba(251,191,36,0.8)' }}>
    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
  </svg>
)

export function ClientDeliverablesSection({ deliverables, projectId }: { deliverables: Deliverable[]; projectId: string }) {
  const [isPending, startTransition] = useTransition()
  const [revisionOpen, setRevisionOpen] = useState<string | null>(null)
  const [revisionNote, setRevisionNote] = useState('')
  const [revisionError, setRevisionError] = useState('')

  function openRevision(id: string) {
    setRevisionOpen(id)
    setRevisionNote('')
    setRevisionError('')
  }

  function handleRevisionSubmit(deliverableId: string) {
    setRevisionError('')
    if (!revisionNote.trim()) {
      setRevisionError('Please describe what needs to change.')
      return
    }
    startTransition(async () => {
      try {
        await requestRevision(deliverableId, projectId, revisionNote)
        setRevisionOpen(null)
        setRevisionNote('')
      } catch (err: unknown) {
        setRevisionError(err instanceof Error ? err.message : 'Failed to submit')
      }
    })
  }

  return (
    <div style={{
      background: '#0f1220',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 16,
      padding: '1.5rem',
    }}>
      <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', margin: '0 0 0.35rem' }}>
        Deliverables
      </p>
      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.28)', marginBottom: '1.125rem' }}>
        Review and approve your delivered assets.
      </p>

      {deliverables.length === 0 ? (
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.22)', fontStyle: 'italic' }}>No deliverables shared yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {deliverables.map((d, i) => (
            <div key={d.id} style={{
              padding: '0.875rem 0',
              borderBottom: i < deliverables.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              {/* Main row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {d.deliverable_type === 'video' ? <VideoIcon /> : <ImageIcon />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: 500, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                    {d.file_name}
                  </p>
                  <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.28)', margin: 0 }}>
                    {[d.format, d.dimensions, d.duration].filter(Boolean).join(' · ')}
                    {d.delivered_on && ` · Delivered ${new Date(d.delivered_on).toLocaleDateString()}`}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  {d.drive_link && (
                    <a
                      href={d.drive_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        padding: '0.25rem 0.65rem',
                        background: 'rgba(66,133,244,0.08)',
                        border: '1px solid rgba(66,133,244,0.25)',
                        borderRadius: 7, fontSize: '0.62rem', fontWeight: 600,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        color: 'rgba(66,133,244,0.85)', textDecoration: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 11, height: 11 }}>
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                      Drive
                    </a>
                  )}
                  <DeliverableStatusBadge status={d.status} />
                  {d.status === 'delivered' && revisionOpen !== d.id && (
                    <>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => startTransition(() => approveDeliverable(d.id, projectId))}
                        style={{
                          padding: '0.3rem 0.75rem',
                          background: 'rgba(20,184,166,0.10)',
                          color: '#14B8A6',
                          fontSize: '0.65rem', fontWeight: 700,
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                          border: '1px solid rgba(20,184,166,0.25)',
                          borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit',
                          opacity: isPending ? 0.5 : 1,
                        }}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => openRevision(d.id)}
                        style={{
                          padding: '0.3rem 0.75rem',
                          background: 'rgba(251,191,36,0.08)',
                          color: 'rgba(251,191,36,0.90)',
                          fontSize: '0.65rem', fontWeight: 700,
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                          border: '1px solid rgba(251,191,36,0.22)',
                          borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit',
                          opacity: isPending ? 0.5 : 1,
                        }}
                      >
                        Request Revision
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Pending revision confirmation (status rolled back to shared) */}
              {d.revision_note && d.status === 'shared' && (
                <div style={{
                  marginTop: '0.625rem',
                  padding: '0.4rem 0.625rem',
                  background: 'rgba(251,191,36,0.06)',
                  border: '1px solid rgba(251,191,36,0.18)',
                  borderRadius: 7,
                  fontSize: '0.68rem',
                  color: 'rgba(251,191,36,0.80)',
                }}>
                  <span style={{ fontWeight: 700 }}>Revision requested: </span>{d.revision_note}
                </div>
              )}

              {/* Inline revision form */}
              {revisionOpen === d.id && (
                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p style={{
                    fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', margin: 0,
                  }}>
                    Describe what needs to change
                  </p>
                  <textarea
                    rows={4}
                    value={revisionNote}
                    onChange={e => setRevisionNote(e.target.value)}
                    placeholder="e.g. Please adjust the color grading and trim the first 3 seconds…"
                    style={{
                      width: '100%', background: '#161d2e',
                      border: '1px solid rgba(255,255,255,0.11)',
                      borderRadius: 9, padding: '0.6rem 0.85rem',
                      fontSize: '0.8rem', color: 'rgba(255,255,255,0.88)',
                      outline: 'none', fontFamily: 'inherit',
                      boxSizing: 'border-box', resize: 'vertical',
                    }}
                  />
                  {revisionError && (
                    <p style={{ fontSize: '0.72rem', color: 'rgba(248,113,113,0.85)', margin: 0 }}>{revisionError}</p>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleRevisionSubmit(d.id)}
                      style={{
                        padding: '0.45rem 1rem',
                        background: isPending ? 'rgba(20,184,166,0.3)' : '#14B8A6',
                        color: '#07080c', fontSize: '0.68rem', fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        border: 'none', borderRadius: 7, cursor: isPending ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      {isPending ? 'Submitting…' : 'Submit'}
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => setRevisionOpen(null)}
                      style={{
                        padding: '0.45rem 1rem',
                        background: 'none',
                        color: 'rgba(255,255,255,0.38)', fontSize: '0.68rem', fontWeight: 600,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        border: '1px solid rgba(255,255,255,0.10)',
                        borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
