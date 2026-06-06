'use client'

import { useTransition } from 'react'
import { DeliverableStatusBadge } from '@/components/shared/StatusBadge'
import { approveDeliverable } from '@/lib/actions/deliverables/update-deliverable'
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
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: '0.875rem 0',
              borderBottom: i < deliverables.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
                <DeliverableStatusBadge status={d.status} />
                {d.status === 'delivered' && (
                  <button
                    disabled={isPending}
                    onClick={() => startTransition(() => approveDeliverable(d.id, projectId))}
                    style={{
                      padding: '0.3rem 0.75rem',
                      background: 'rgba(20,184,166,0.10)',
                      color: '#14B8A6',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      border: '1px solid rgba(20,184,166,0.25)',
                      borderRadius: 7,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      opacity: isPending ? 0.5 : 1,
                    }}
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
