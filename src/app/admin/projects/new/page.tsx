'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createProject } from '@/lib/actions/projects/create-project'
import { Avatar } from '@/components/ui/Avatar'
import { createClientSupabase } from '@/lib/supabase/client'
import { Check } from 'lucide-react'

interface Profile { id: string; full_name: string; company_name: string | null }
interface TeamMember { id: string; full_name: string; email: string }

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
    if (form.internal_deadline && form.client_deadline) {
      const internalDate = new Date(form.internal_deadline)
      // Compare only the date portion so a same-day internal time still passes
      const internalDay = new Date(internalDate.getFullYear(), internalDate.getMonth(), internalDate.getDate())
      const clientDay = new Date(form.client_deadline + 'T00:00:00')
      if (internalDay > clientDay) {
        setDeadlineError('Internal deadline must be on or before the client deadline')
        return
      }
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
    <div className="p-content-wrap" style={{ maxWidth: 600 }}>
      <button
        type="button"
        onClick={() => router.back()}
        className="p-back-btn"
      >
        ← Back to Projects
      </button>

      <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
        <p className="p-eyebrow">Admin · Projects</p>
        <h1 className="p-page-title">New Project</h1>
        <p className="p-page-sub">Set up the project, assign a client and your team.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-form-card">
        <div className="p-form-card-header">
          <p className="p-form-card-title">Project details</p>
          <p className="p-form-card-desc">Fill in the core information to get the project started.</p>
        </div>

        <div className="p-form-body">
          <div className="p-field">
            <label className="p-field-label">Project Name *</label>
            <input
              className="p-field-input"
              value={form.name}
              onChange={set('name')}
              placeholder="Brand Campaign Q3"
              required
              autoComplete="off"
            />
          </div>

          <div className="p-field">
            <label className="p-field-label">Client *</label>
            <select
              className="p-field-select"
              value={form.client_id}
              onChange={set('client_id')}
              required
            >
              <option value="">Select a client…</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.company_name || c.full_name || 'Unnamed Client'}
                </option>
              ))}
            </select>
          </div>

          <div className="p-field">
            <label className="p-field-label">Package</label>
            <input
              className="p-field-input"
              value={form.package}
              onChange={set('package')}
              placeholder="Starter / Growth / Enterprise"
              autoComplete="off"
            />
          </div>

          <div className="p-form-row">
            <div className="p-field">
              <label className="p-field-label">Internal Deadline <span style={{ fontSize: '0.7em', color: 'var(--ds-text-3)', fontWeight: 400 }}>(team only · date &amp; time)</span></label>
              <input
                className="p-field-input"
                type="datetime-local"
                value={form.internal_deadline}
                onChange={set('internal_deadline')}
              />
            </div>
            <div className="p-field">
              <label className="p-field-label">Client Deadline</label>
              <input
                className="p-field-input"
                type="date"
                value={form.client_deadline}
                onChange={set('client_deadline')}
              />
            </div>
          </div>

          {deadlineError && <p className="auth-error">{deadlineError}</p>}

          <div className="p-field">
            <label className="p-field-label">Description</label>
            <textarea
              className="p-field-input"
              style={{ resize: 'vertical', minHeight: 90 }}
              value={form.description}
              onChange={set('description')}
              placeholder="Brief description of the project scope…"
            />
          </div>

          <div className="p-form-divider" />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
              <span className="p-form-section-label">Assign Team Members</span>
              {selectedTeam.length > 0 && (
                <span className="p-badge p-badge--green">{selectedTeam.length} selected</span>
              )}
            </div>

            {teamMembers.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--ds-text-3)', fontStyle: 'italic' }}>
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
                        borderRadius: 'var(--ds-radius-sm)',
                        border: picked ? '1px solid var(--ds-border-strong)' : '1px solid var(--ds-border)',
                        background: picked ? 'var(--ds-active)' : 'var(--ds-panel)',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        textAlign: 'left',
                        transition: 'all 0.12s var(--ds-ease)',
                      }}
                    >
                      <Avatar name={m.full_name} size="sm" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: 500, color: picked ? 'var(--ds-white)' : 'var(--ds-text-2)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {m.full_name}
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--ds-text-3)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {m.email}
                        </p>
                      </div>
                      {picked && <Check size={13} color="var(--ds-white)" style={{ flexShrink: 0 }} />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {error && <p className="auth-error">{error}</p>}
        </div>

        <div className="p-form-footer">
          <button
            type="submit"
            disabled={loading}
            className="p-btn-primary"
          >
            {loading ? 'Creating…' : 'Create Project'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="p-btn-ghost"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
