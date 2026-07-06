'use client'

import { useState, useTransition } from 'react'
import { DeliverableStatusBadge } from '@/dashboard/components/shared/StatusBadge'
import { addDeliverable, markDelivered } from '@/dashboard/lib/actions/deliverables/update-deliverable'
import type { Database } from '@/shared/lib/types/database'

type Deliverable = Database['public']['Tables']['deliverables']['Row']
type ChecklistItem = Database['public']['Tables']['asset_checklist']['Row']

interface Props {
  deliverables: Deliverable[]
  checklist: ChecklistItem[]
  projectId: string
  isAdmin?: boolean
}

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

export function DeliverablesSection({ deliverables, projectId, isAdmin }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({ file_name: '', deliverable_type: 'video', format: '', duration: '', dimensions: '', drive_link: '' })
  const [error, setError] = useState('')

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }))
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      try {
        await addDeliverable({ ...form, project_id: projectId, deliverable_type: form.deliverable_type as 'video' | 'image' })
        setForm({ file_name: '', deliverable_type: 'video', format: '', duration: '', dimensions: '', drive_link: '' })
        setShowForm(false)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed')
      }
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Add new form */}
      <div className="p-info-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showForm ? '1.125rem' : 0 }}>
          <p className="p-info-panel-label" style={{ margin: 0 }}>Add New Deliverable</p>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowForm(v => !v)}
              style={{
                background: showForm ? 'none' : 'rgba(20,184,166,0.1)',
                border: '1px solid var(--ds-border-2)',
                borderRadius: 8,
                padding: '0.3rem 0.875rem',
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--ds-white)',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {showForm ? 'Cancel' : '+ Add'}
            </button>
          )}
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
              className="p-btn-primary"
              style={{ alignSelf: 'flex-end' }}
            >
              {isPending ? 'Adding…' : 'Create Item'}
            </button>
          </form>
        )}
      </div>

      {/* Active deliverables table */}
      <div className="p-info-panel" style={{ padding: 0 }}>
        <div style={{ padding: '1.125rem 1.25rem', borderBottom: '1px solid var(--p-b2)' }}>
          <p className="p-info-panel-label" style={{ margin: 0 }}>Active Deliverables</p>
        </div>

        {deliverables.length === 0 ? (
          <p style={{ padding: '1.5rem', fontSize: '0.78rem', color: 'var(--p-t3)', fontStyle: 'italic' }}>No deliverables yet.</p>
        ) : (
          <div className="p-table-wrap" style={{ borderRadius: 0, border: 'none' }}>
            <table className="p-table">
              <thead>
                <tr>
                  <th>Deliverable</th>
                  <th>Format</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliverables.map(d => (
                  <tr key={d.id}>
                    <td>
                      <p className="p-table-name">{d.file_name}</p>
                      <p className="p-table-sub">
                        {d.deliverable_type === 'video' ? '🎬' : '🖼'}{' '}
                        {[d.format, d.dimensions, d.duration].filter(Boolean).join(' · ') || d.deliverable_type}
                      </p>
                      {d.revision_note && (
                        <p style={{
                          marginTop: '0.25rem',
                          padding: '0.2rem 0.5rem',
                          background: 'var(--p-amber-dim)',
                          border: '1px solid var(--p-amber-b)',
                          borderRadius: 6,
                          fontSize: '0.65rem',
                          color: 'var(--p-amber)',
                          display: 'inline-block',
                        }}>
                          Revision: {d.revision_note}
                        </p>
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--p-t2)' }}>
                        {d.format ?? d.deliverable_type}
                      </span>
                    </td>
                    <td>
                      <DeliverableStatusBadge status={d.status} />
                    </td>
                    <td>
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
                        {isAdmin && d.status !== 'delivered' && d.status !== 'approved' && (
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => startTransition(() => markDelivered(d.id, projectId))}
                            style={{
                              background: 'rgba(52,211,153,0.07)',
                              border: '1px solid rgba(52,211,153,0.22)',
                              borderRadius: 6,
                              padding: '0.22rem 0.55rem',
                              fontSize: '0.62rem',
                              fontWeight: 600,
                              color: '#6ee7b7',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              opacity: isPending ? 0.5 : 1,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Mark Delivered
                          </button>
                        )}
                        <button
                          className="p-dot-menu"
                          type="button"
                          title="More options"
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14 }}>
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
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
