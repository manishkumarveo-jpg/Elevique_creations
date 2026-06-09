'use client'

import { useState } from 'react'

interface AddLinkFormProps {
  onSubmit: (data: { file_name: string; file_url: string; notes?: string }) => Promise<void>
  placeholder?: string
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0c1018',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 8,
  padding: '0.55rem 0.8rem',
  fontSize: '0.78rem',
  color: 'rgba(255,255,255,0.85)',
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
  display: 'block',
  marginBottom: '0.3rem',
}

function focusOn(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = 'rgba(20,184,166,0.45)'
  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(20,184,166,0.08)'
}
function focusOff(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
  e.currentTarget.style.boxShadow = 'none'
}

export function AddLinkForm({ onSubmit, placeholder = 'https://drive.google.com/...' }: AddLinkFormProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !url.trim()) return setError('Name and URL are required')
    try { new URL(url) } catch { return setError('Enter a valid URL') }
    setLoading(true)
    try {
      await onSubmit({ file_name: name.trim(), file_url: url.trim(), notes: notes.trim() || undefined })
      setName(''); setUrl(''); setNotes(''); setOpen(false)
    } catch {
      setError('Failed to add link')
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'none',
          border: 'none',
          padding: '0.3rem 0',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#14B8A6',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 14, height: 14 }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        Add link
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: '#0c1018',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 12,
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.625rem',
    }}>
      <div>
        <label style={fieldLabel}>File Name *</label>
        <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Brand Logo.png" required onFocus={focusOn} onBlur={focusOff} />
      </div>
      <div>
        <label style={fieldLabel}>URL *</label>
        <input style={inputStyle} value={url} onChange={e => setUrl(e.target.value)} placeholder={placeholder} required onFocus={focusOn} onBlur={focusOff} />
      </div>
      <div>
        <label style={fieldLabel}>Notes (optional)</label>
        <input style={inputStyle} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any notes…" onFocus={focusOn} onBlur={focusOff} />
      </div>
      {error && (
        <p style={{ fontSize: '0.72rem', color: 'rgba(248,113,113,0.85)', margin: 0 }}>{error}</p>
      )}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.45rem 1rem',
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
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? 'Adding…' : 'Add'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          style={{
            padding: '0.45rem 0.875rem',
            background: 'none',
            color: 'rgba(255,255,255,0.45)',
            fontSize: '0.68rem',
            fontWeight: 500,
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 7,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
