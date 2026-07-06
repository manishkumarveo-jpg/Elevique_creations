'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createUserAccount } from '@/dashboard/lib/actions/auth/create-user'

export default function NewUserPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    temporary_password: '',
    confirm_password: '',
    role: 'client' as 'team_member' | 'client',
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
    if (form.temporary_password !== form.confirm_password) {
      setError('Passwords do not match.')
      return
    }
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
    <div className="p-content-wrap" style={{ maxWidth: 540 }}>
      <button
        type="button"
        onClick={() => router.back()}
        className="p-back-btn"
      >
        ← Back to Users
      </button>

      <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
        <p className="p-eyebrow">Admin · Users</p>
        <h1 className="p-page-title">Create User</h1>
        <p className="p-page-sub">Add a new team member or client to the platform.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-form-card">
        <div className="p-form-card-header">
          <p className="p-form-card-title">Account details</p>
          <p className="p-form-card-desc">The user will receive access with the credentials you provide.</p>
        </div>

        <div className="p-form-body">
          <div className="p-field">
            <label className="p-field-label">Full Name *</label>
            <input
              className="p-field-input"
              value={form.full_name}
              onChange={set('full_name')}
              placeholder="Jane Smith"
              required
              autoComplete="off"
            />
          </div>

          <div className="p-field">
            <label className="p-field-label">Email Address *</label>
            <input
              className="p-field-input"
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="jane@company.com"
              required
              autoComplete="off"
            />
          </div>

          <div className="p-form-divider" />

          <div className="p-field">
            <label className="p-field-label">Temporary Password *</label>
            <input
              className="p-field-input"
              type="password"
              value={form.temporary_password}
              onChange={set('temporary_password')}
              placeholder="Min. 8 characters"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <div className="p-field">
            <label className="p-field-label">Confirm Password *</label>
            <input
              className="p-field-input"
              type="password"
              value={form.confirm_password}
              onChange={set('confirm_password')}
              placeholder="Re-enter password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <div className="p-field">
            <label className="p-field-label">Role *</label>
            <select
              className="p-field-select"
              value={form.role}
              onChange={set('role')}
            >
              <option value="client">Client</option>
              <option value="team_member">Team Member</option>
            </select>
          </div>

          <div className="p-form-divider" />

          <p className="p-form-section-label">Optional Details</p>

          <div className="p-form-row">
            <div className="p-field">
              <label className="p-field-label">Company</label>
              <input
                className="p-field-input"
                value={form.company_name}
                onChange={set('company_name')}
                placeholder="Acme Inc."
                autoComplete="off"
              />
            </div>
            <div className="p-field">
              <label className="p-field-label">Phone</label>
              <input
                className="p-field-input"
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                placeholder="+91 98765 43210"
                autoComplete="off"
              />
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}
        </div>

        <div className="p-form-footer">
          <button
            type="submit"
            disabled={loading}
            className="p-btn-primary"
          >
            {loading ? 'Creating…' : 'Create User'}
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
