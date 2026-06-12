'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createProject } from '@/lib/actions/projects/create-project'
import { Avatar } from '@/components/ui/Avatar'
import { createClientSupabase } from '@/lib/supabase/client'

interface Profile { id: string; full_name: string; company_name: string | null }
interface TeamMember { id: string; full_name: string; email: string }

/* ── Shared styles ─────────────────────────────────────────────── */
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

const twoCol: React.CSSProperties = {
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

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: 90,
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
  transition: 'opacity 0.18s ease',
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

/* ── Helpers ───────────────────────────────────────────────────── */
function Field({ label, required, children }: {
  label: string; required?: boolean; children: React.ReactNode
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

function focusOn(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = 'rgba(20,184,166,0.5)'
  e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(20,184,166,0.09)'
}
function focusOff(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.11)'
  e.currentTarget.style.boxShadow   = 'none'
}

/* ════════════════════════════════════════════════════════════════ */
export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [clients, setClients] = useState<Profile[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [selectedTeam, setSelectedTeam] = useState<string[]>([])
  const [form, setForm] = useState({
    name: '', client_id: '', package: '', internal_deadline: '', client_deadline: '', description: '',
  })
  const [deadlineError, setDeadlineError] = useState('')

  useEffect(() => {
    const supabase = createClientSupabase()
    Promise.all([
      supabase.from('profiles').select('id, full_name, company_name').eq('role', 'client').eq('is_active', true),
      supabase.from('profiles').select('id, full_name, email').eq('role', 'team_member').eq('is_active', true).order('full_name'),
    ]).then(([clientsRes, teamRes]) => {
      setClients(clientsRes.data ?? [])
      setTeamMembers(teamRes.data ?? [])
    })
  }, [])

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }))
  }

  function toggleTeam(id: string) {
    setSelectedTeam(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setDeadlineError('')
    if (form.internal_deadline && form.client_deadline && form.internal_deadline > form.client_deadline) {
      setDeadlineError('Internal deadline must be on or before the client deadline')
      return
    }
    setLoading(true)
    try {
      const result = await createProject({ ...form, team_member_ids: selectedTeam })
      router.push(`/admin/projects/${result.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>

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
        Back to Projects
      </button>

      {/* Page header */}
      <div style={{ marginTop: '0.875rem' }}>
        <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#14B8A6', marginBottom: '0.3rem' }}>
          Admin · Projects
        </p>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em', margin: 0 }}>
          New Project
        </h1>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.32)', marginTop: '0.25rem' }}>
          Set up the project, assign a client and your team.
        </p>
      </div>

      {/* Form card */}
      <form onSubmit={handleSubmit} style={card}>

        {/* Card header */}
        <div style={cardHeader}>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.88)', margin: 0 }}>
            Project details
          </p>
          <p style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.32)', margin: '0.2rem 0 0' }}>
            Fill in the core information to get the project started.
          </p>
        </div>

        <div style={body}>

          {/* Name */}
          <Field label="Project Name" required>
            <input
              style={inputStyle}
              value={form.name}
              onChange={set('name')}
              placeholder="Brand Campaign Q3"
              required
              autoComplete="off"
              onFocus={focusOn}
              onBlur={focusOff}
            />
          </Field>

          {/* Client */}
          <Field label="Client" required>
            <select
              style={selectStyle}
              value={form.client_id}
              onChange={set('client_id')}
              required
              onFocus={focusOn}
              onBlur={focusOff}
            >
              <option value="">Select a client…</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.company_name || c.full_name || 'Unnamed Client'}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Package">
            <input
              style={inputStyle}
              value={form.package}
              onChange={set('package')}
              placeholder="Starter / Growth / Enterprise"
              autoComplete="off"
              onFocus={focusOn}
              onBlur={focusOff}
            />
          </Field>

          <div style={twoCol}>
            {/* Internal deadline */}
            <Field label="Internal Deadline (Team)">
              <input
                style={inputStyle}
                type="date"
                value={form.internal_deadline}
                onChange={set('internal_deadline')}
                onFocus={focusOn}
                onBlur={focusOff}
              />
            </Field>

            {/* Client deadline */}
            <Field label="Final Deadline (Client)">
              <input
                style={inputStyle}
                type="date"
                value={form.client_deadline}
                onChange={set('client_deadline')}
                onFocus={focusOn}
                onBlur={focusOff}
              />
            </Field>
          </div>
          {deadlineError && (
            <p style={{
              fontSize: '0.73rem',
              color: 'rgba(248,113,113,0.90)',
              background: 'rgba(248,113,113,0.07)',
              border: '1px solid rgba(248,113,113,0.16)',
              borderRadius: 10,
              padding: '0.5rem 0.875rem',
              margin: 0,
            }}>
              {deadlineError}
            </p>
          )}

          {/* Description */}
          <Field label="Description">
            <textarea
              style={textareaStyle}
              value={form.description}
              onChange={set('description')}
              placeholder="Brief description of the project scope…"
              onFocus={focusOn}
              onBlur={focusOff}
            />
          </Field>

          <div style={divider} />

          {/* Team picker */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
              <p style={labelStyle}>Assign Team Members</p>
              {selectedTeam.length > 0 && (
                <span style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  background: 'rgba(20,184,166,0.12)',
                  color: '#14B8A6',
                  border: '1px solid rgba(20,184,166,0.25)',
                  borderRadius: 20,
                  padding: '0.15rem 0.55rem',
                }}>
                  {selectedTeam.length} selected
                </span>
              )}
            </div>

            {teamMembers.length === 0 ? (
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.22)', fontStyle: 'italic' }}>
                No team members yet — create them in Users first.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {teamMembers.map(m => {
                  const picked = selectedTeam.includes(m.id)
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleTeam(m.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        padding: '0.625rem 0.75rem',
                        borderRadius: 10,
                        border: picked
                          ? '1px solid rgba(20,184,166,0.45)'
                          : '1px solid rgba(255,255,255,0.09)',
                        background: picked
                          ? 'rgba(20,184,166,0.07)'
                          : 'rgba(255,255,255,0.025)',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        textAlign: 'left',
                        transition: 'border-color 0.18s ease, background 0.18s ease',
                        boxShadow: picked ? '0 0 0 2px rgba(20,184,166,0.08)' : 'none',
                      }}
                    >
                      <Avatar name={m.full_name} size="sm" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 500, color: picked ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.65)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {m.full_name}
                        </p>
                        <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.28)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {m.email}
                        </p>
                      </div>
                      {picked && (
                        <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14, flexShrink: 0 }}>
                          <circle cx="8" cy="8" r="7" fill="rgba(20,184,166,0.18)" stroke="#14B8A6" strokeWidth="1" />
                          <path d="M5 8l2 2 4-4" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {error && (
            <p style={{
              fontSize: '0.73rem',
              color: 'rgba(248,113,113,0.90)',
              background: 'rgba(248,113,113,0.07)',
              border: '1px solid rgba(248,113,113,0.16)',
              borderRadius: 10,
              padding: '0.625rem 0.875rem',
              margin: 0,
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
            {loading ? 'Creating…' : 'Create Project'}
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
