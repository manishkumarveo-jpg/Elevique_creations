'use client'

import { useState, useTransition } from 'react'
import { DeliverableStatusBadge } from '@/components/shared/StatusBadge'
import { AssetChecklist } from '@/components/shared/AssetChecklist'
import { addDeliverable, markDelivered } from '@/lib/actions/deliverables/update-deliverable'
import { toggleChecklistItem } from '@/lib/actions/checklist/update-checklist'
import type { Database } from '@/lib/types/database'

type Deliverable = Database['public']['Tables']['deliverables']['Row']
type ChecklistItem = Database['public']['Tables']['asset_checklist']['Row']

interface Props {
  deliverables: Deliverable[]
  checklist: ChecklistItem[]
  projectId: string
  isAdmin?: boolean
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

export function DeliverablesSection({ deliverables, checklist, projectId, isAdmin }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({ file_name: '', deliverable_type: 'video', format: '', duration: '', dimensions: '' })
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
        setForm({ file_name: '', deliverable_type: 'video', format: '', duration: '', dimensions: '' })
        setShowForm(false)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed')
      }
    })
  }

  const VideoIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 15, height: 15, color: '#14B8A6' }}>
      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
    </svg>
  )
  const ImageIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 15, height: 15, color: 'rgba(251,191,36,0.8)' }}>
      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Checklist */}
      <div style={panel}>
        <p style={panelLabel}>Asset Checklist</p>
        <AssetChecklist
          items={checklist}
          readOnly
          onToggle={async (itemId, checked) => {
            await toggleChecklistItem(itemId, projectId, checked)
          }}
        />
      </div>

      {/* Deliverables */}
      <div style={panel}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <p style={{ ...panelLabel, marginBottom: 0 }}>Deliverables</p>
          {isAdmin && (
            <button
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
          )}
        </div>

        {showForm && (
          <form onSubmit={handleAdd} style={{
            background: '#0c1018',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: '1.125rem',
            marginBottom: '1.125rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            <div>
              <label style={fieldLabel}>File Name *</label>
              <input style={inputStyle} value={form.file_name} onChange={set('file_name')} required placeholder="hero_video_v1" />
            </div>
            <div>
              <label style={fieldLabel}>Type</label>
              <select style={selStyle} value={form.deliverable_type} onChange={set('deliverable_type')}>
                <option value="video">Video</option>
                <option value="image">Image</option>
              </select>
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
            {error && <p style={{ fontSize: '0.72rem', color: 'rgba(248,113,113,0.85)', margin: 0 }}>{error}</p>}
            <button
              type="submit"
              disabled={isPending}
              style={{
                alignSelf: 'flex-start',
                padding: '0.5rem 1.125rem',
                background: '#14B8A6',
                color: '#07080c',
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: 7,
                cursor: 'pointer',
                fontFamily: 'inherit',
                opacity: isPending ? 0.5 : 1,
              }}
            >
              {isPending ? 'Adding…' : 'Add Deliverable'}
            </button>
          </form>
        )}

        {deliverables.length === 0 ? (
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.22)', fontStyle: 'italic' }}>No deliverables yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
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
                  <p style={{ fontSize: '0.82rem', fontWeight: 500, color: 'rgba(255,255,255,0.85)', margin: 0 }}>{d.file_name}</p>
                  <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.28)', margin: 0 }}>
                    {[d.format, d.dimensions, d.duration].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
                  <DeliverableStatusBadge status={d.status} />
                  {isAdmin && d.status !== 'delivered' && d.status !== 'approved' && (
                    <button
                      disabled={isPending}
                      onClick={() => startTransition(() => markDelivered(d.id, projectId))}
                      style={{
                        background: 'none',
                        border: '1px solid rgba(52,211,153,0.25)',
                        borderRadius: 7,
                        padding: '0.25rem 0.65rem',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'rgba(52,211,153,0.75)',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        opacity: isPending ? 0.5 : 1,
                      }}
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
