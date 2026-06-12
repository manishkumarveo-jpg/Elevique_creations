'use client'

import { useState, useTransition } from 'react'
import { DeliverableStatusBadge } from '@/components/shared/StatusBadge'
import { addDeliverableTeam, markDeliveredTeam } from '@/lib/actions/deliverables/update-deliverable'
import type { Database } from '@/lib/types/database'

type Deliverable = Database['public']['Tables']['deliverables']['Row']

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#161d2e',
  border: '1px solid rgba(255,255,255,0.11)',
  borderRadius: 9,
  padding: '0.6rem 0.85rem',
  fontSize: '0.8rem',
  color: 'rgba(255,255,255,0.88)',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}

const fieldLabel: React.CSSProperties = {
  fontSize: '0.58rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.28)',
  marginBottom: '0.3rem',
  display: 'block',
}

const selStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 8l4 4 4-4' stroke='rgba(255,255,255,0.35)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.7rem center',
  backgroundSize: '1rem',
  paddingRight: '2rem',
}

const panel: React.CSSProperties = {
  background: '#0f1220',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 16,
  padding: '1.5rem',
}

const panelLabel: React.CSSProperties = {
  fontSize: '0.6rem',
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.28)',
  marginBottom: '1rem',
}

export function TeamDeliverablesSection({ deliverables, projectId }: { deliverables: Deliverable[]; projectId: string }) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({ file_name: '', deliverable_type: 'video', format: '', duration: '', dimensions: '', drive_link: '' })
  const [error, setError] = useState('')
  const [markError, setMarkError] = useState('')

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }))
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      try {
        await addDeliverableTeam({ ...form, project_id: projectId, deliverable_type: form.deliverable_type as 'video' | 'image' })
        setForm({ file_name: '', deliverable_type: 'video', format: '', duration: '', dimensions: '', drive_link: '' })
        setShowForm(false)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to add deliverable')
      }
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Add form */}
      <div style={panel}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showForm ? '1.125rem' : 0 }}>
          <p style={{ ...panelLabel, margin: 0 }}>Add Deliverable</p>
          <button
            type="button"
            onClick={() => setShowForm(v => !v)}
            style={{
              background: showForm ? 'none' : 'rgba(20,184,166,0.1)',
              border: '1px solid rgba(20,184,166,0.25)',
              borderRadius: 8,
              padding: '0.3rem 0.875rem',
              fontSize: '0.68rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#14B8A6',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {showForm ? 'Cancel' : '+ Add'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
              <div>
                <label style={fieldLabel}>Item Name *</label>
                <input style={inputStyle} value={form.file_name} onChange={set('file_name')} required placeholder="e.g. Logo Vector Set" />
              </div>
              <div>
                <label style={fieldLabel}>Type</label>
                <select style={selStyle} value={form.deliverable_type} onChange={set('deliverable_type')}>
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.625rem' }}>
              <div>
                <label style={fieldLabel}>Format</label>
                <input style={inputStyle} value={form.format} onChange={set('format')} placeholder="MP4" />
              </div>
              <div>
                <label style={fieldLabel}>Duration</label>
                <input style={inputStyle} value={form.duration} onChange={set('duration')} placeholder="0:30" />
              </div>
              <div>
                <label style={fieldLabel}>Dimensions</label>
                <input style={inputStyle} value={form.dimensions} onChange={set('dimensions')} placeholder="1920×1080" />
              </div>
            </div>
            <div>
              <label style={fieldLabel}>Google Drive Link</label>
              <input style={inputStyle} value={form.drive_link} onChange={set('drive_link')} placeholder="https://drive.google.com/…" type="url" />
            </div>
            {error && <p style={{ fontSize: '0.72rem', color: 'rgba(248,113,113,0.85)', margin: 0 }}>{error}</p>}
            <button
              type="submit"
              disabled={isPending}
              style={{
                alignSelf: 'flex-end',
                padding: '0.5rem 1.25rem',
                background: isPending ? 'rgba(20,184,166,0.3)' : '#14B8A6',
                color: '#07080c',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: 8,
                cursor: isPending ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {isPending ? 'Adding…' : 'Create Item'}
            </button>
          </form>
        )}
      </div>

      {/* Deliverables list */}
      <div style={{ ...panel, padding: 0 }}>
        <div style={{ padding: '1.125rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p style={{ ...panelLabel, margin: 0 }}>Deliverables ({deliverables.length})</p>
          {markError && (
            <p style={{ fontSize: '0.72rem', color: 'rgba(248,113,113,0.85)', margin: '0.5rem 0 0' }}>{markError}</p>
          )}
        </div>

        {deliverables.length === 0 ? (
          <p style={{ padding: '1.5rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
            No deliverables yet. Add the first one above.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Deliverable', 'Format', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '0.6rem 1.25rem',
                      textAlign: 'left',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.28)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deliverables.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem 1.25rem' }}>
                      <p style={{ margin: 0, fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>{d.file_name}</p>
                      <p style={{ margin: '0.15rem 0 0', fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>
                        {d.deliverable_type === 'video' ? '🎬' : '🖼'}{' '}
                        {[d.format, d.dimensions, d.duration].filter(Boolean).join(' · ') || d.deliverable_type}
                      </p>
                      {d.revision_note && (
                        <p style={{
                          marginTop: '0.25rem',
                          padding: '0.2rem 0.5rem',
                          background: 'rgba(251,191,36,0.06)',
                          border: '1px solid rgba(251,191,36,0.2)',
                          borderRadius: 6,
                          fontSize: '0.65rem',
                          color: 'rgba(251,191,36,0.85)',
                          display: 'inline-block',
                        }}>
                          Revision: {d.revision_note}
                        </p>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                        {d.format ?? d.deliverable_type}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem' }}>
                      <DeliverableStatusBadge status={d.status} />
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {d.drive_link && (
                          <a
                            href={d.drive_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                              padding: '0.22rem 0.55rem',
                              background: 'rgba(66,133,244,0.08)',
                              border: '1px solid rgba(66,133,244,0.22)',
                              borderRadius: 6, fontSize: '0.62rem', fontWeight: 600,
                              color: 'rgba(99,163,250,0.90)', textDecoration: 'none',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Drive ↗
                          </a>
                        )}
                        {d.status !== 'delivered' && d.status !== 'approved' && (
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => {
                              setMarkError('')
                              startTransition(async () => {
                                try {
                                  await markDeliveredTeam(d.id, projectId)
                                } catch (err: unknown) {
                                  setMarkError(err instanceof Error ? err.message : 'Failed to mark as delivered')
                                }
                              })
                            }}
                            style={{
                              background: 'rgba(52,211,153,0.07)',
                              border: '1px solid rgba(52,211,153,0.22)',
                              borderRadius: 6,
                              padding: '0.22rem 0.55rem',
                              fontSize: '0.62rem',
                              fontWeight: 600,
                              color: '#6ee7b7',
                              cursor: isPending ? 'not-allowed' : 'pointer',
                              fontFamily: 'inherit',
                              opacity: isPending ? 0.5 : 1,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
