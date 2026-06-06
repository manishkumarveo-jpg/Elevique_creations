'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createUserAccount } from '@/lib/actions/auth/create-user'

/* ── Shared style objects ─────────────────────────────────────── */
const card: React.CSSProperties = {
  background: '#0f1220',
  border: '1px solid rgba(255,255,255,0.11)',
  borderRadius: 18,
  overflow: 'hidden',
  boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
  marginTop: '1.75rem',
}

const cardHeader: React.CSSProperties = {
  padding: '1.25rem 1.75rem',
  borderBottom: '1px solid rgba(255,255,255,0.07)',
}

const body: React.CSSProperties = {
  padding: '1.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.125rem',
}

const row: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
}

const fieldWrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.6rem',
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.32)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#161d2e',
  border: '1px solid rgba(255,255,255,0.11)',
  borderRadius: 9,
  padding: '0.65rem 0.9rem',
  fontSize: '0.825rem',
  color: 'rgba(255,255,255,0.90)',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 8l4 4 4-4' stroke='rgba(255,255,255,0.35)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.75rem center',
  backgroundSize: '1.1rem',
  paddingRight: '2.25rem',
}

const divider: React.CSSProperties = {
  height: 1,
  background: 'rgba(255,255,255,0.06)',
  margin: '0.25rem 0',
}

const footer: React.CSSProperties = {
  padding: '1.25rem 1.75rem',
  borderTop: '1px solid rgba(255,255,255,0.07)',
  background: '#0c0f1a',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
}

const btnPrimary: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.65rem 1.5rem',
  background: '#14B8A6',
  color: '#07080c',
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 0.18s ease, box-shadow 0.18s ease',
}

const btnGhost: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.65rem 1.25rem',
  background: 'none',
  color: 'rgba(255,255,255,0.50)',
  fontSize: '0.72rem',
  fontWeight: 500,
  letterSpacing: '0.04em',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 8,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'color 0.18s ease, border-color 0.18s ease',
}

/* ── Tiny Field helper ────────────────────────────────────────── */
function Field({ label, required, children }: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div style={fieldWrap}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: '#14B8A6', marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

/* ── Focus ring helper (via event handlers) ───────────────────── */
function focusOn(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = 'rgba(20,184,166,0.5)'
  e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(20,184,166,0.09)'
}
function focusOff(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.11)'
  e.currentTarget.style.boxShadow   = 'none'
}

/* ════════════════════════════════════════════════════════════════ */
export default function NewUserPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    temporary_password: '',
    role: 'client' as 'admin' | 'team_member' | 'client',
    company_name: '',
    phone: '',
  })

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createUserAccount(form)
      router.push('/admin/users')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 540, margin: '0 auto' }}>

      {/* Back */}
      <button
        type="button"
        onClick={() => router.back()}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: 'none',
          border: 'none',
          padding: 0,
          color: 'rgba(255,255,255,0.30)',
          fontSize: '0.73rem',
          fontWeight: 500,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <svg viewBox="0 0 16 16" fill="currentColor" style={{ width: 12, height: 12 }}>
          <path fillRule="evenodd" d="M9.78 4.22a.75.75 0 010 1.06L7.06 8l2.72 2.72a.75.75 0 11-1.06 1.06L5.47 8.53a.75.75 0 010-1.06l3.25-3.25a.75.75 0 011.06 0z" clipRule="evenodd" />
        </svg>
        Back to Users
      </button>

      {/* Page header */}
      <div style={{ marginTop: '0.875rem' }}>
        <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#14B8A6', marginBottom: '0.3rem' }}>
          Admin · Users
        </p>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em', margin: 0 }}>
          Create User
        </h1>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.32)', marginTop: '0.25rem' }}>
          Add a new team member or client to the platform
        </p>
      </div>

      {/* Form card */}
      <form onSubmit={handleSubmit} style={card}>

        {/* Card header */}
        <div style={cardHeader}>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.88)', margin: 0 }}>
            Account details
          </p>
          <p style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.32)', marginTop: '0.2rem', margin: '0.2rem 0 0' }}>
            The user will receive access with the credentials you provide.
          </p>
        </div>

        <div style={body}>

          {/* Identity */}
          <Field label="Full Name" required>
            <input
              style={inputStyle}
              value={form.full_name}
              onChange={set('full_name')}
              placeholder="Jane Smith"
              required
              autoComplete="off"
              onFocus={focusOn}
              onBlur={focusOff}
            />
          </Field>

          <Field label="Email Address" required>
            <input
              style={inputStyle}
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="jane@company.com"
              required
              autoComplete="off"
              onFocus={focusOn}
              onBlur={focusOff}
            />
          </Field>

          <div style={divider} />

          {/* Access */}
          <Field label="Temporary Password" required>
            <input
              style={inputStyle}
              type="password"
              value={form.temporary_password}
              onChange={set('temporary_password')}
              placeholder="Min. 8 characters"
              required
              autoComplete="new-password"
              onFocus={focusOn}
              onBlur={focusOff}
            />
          </Field>

          <Field label="Role" required>
            <select
              style={selectStyle}
              value={form.role}
              onChange={set('role')}
              onFocus={focusOn}
              onBlur={focusOff}
            >
              <option value="client">Client</option>
              <option value="team_member">Team Member</option>
              <option value="admin">Admin</option>
            </select>
          </Field>

          <div style={divider} />

          {/* Optional */}
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>
            Optional Details
          </p>

          <div style={row}>
            <Field label="Company">
              <input
                style={inputStyle}
                value={form.company_name}
                onChange={set('company_name')}
                placeholder="Acme Inc."
                autoComplete="off"
                onFocus={focusOn}
                onBlur={focusOff}
              />
            </Field>
            <Field label="Phone">
              <input
                style={inputStyle}
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                placeholder="+91 98765 43210"
                autoComplete="off"
                onFocus={focusOn}
                onBlur={focusOff}
              />
            </Field>
          </div>

          {error && (
            <p style={{
              fontSize: '0.73rem',
              color: 'rgba(248,113,113,0.90)',
              background: 'rgba(248,113,113,0.07)',
              border: '1px solid rgba(248,113,113,0.16)',
              borderRadius: 10,
              padding: '0.625rem 0.875rem',
            }}>
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div style={footer}>
          <button
            type="submit"
            disabled={loading}
            style={{ ...btnPrimary, opacity: loading ? 0.5 : 1 }}
          >
            {loading ? 'Creating…' : 'Create User'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            style={btnGhost}
          >
            Cancel
          </button>
        </div>
      </form>

    </div>
  )
}
