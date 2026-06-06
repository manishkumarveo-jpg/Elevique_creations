'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientSupabase } from '@/lib/supabase/client'

type Role = 'admin' | 'team_member' | 'client'

const ROLES: {
  value: Role
  label: string
  description: string
  dashboard: string
  icon: React.ReactNode
}[] = [
  {
    value: 'admin',
    label: 'Admin',
    description: 'Manage projects, clients & team',
    dashboard: '/admin/dashboard',
    icon: (
      <svg className="auth-role-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    value: 'team_member',
    label: 'Team',
    description: 'View and update assigned projects',
    dashboard: '/team/dashboard',
    icon: (
      <svg className="auth-role-icon" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
    ),
  },
  {
    value: 'client',
    label: 'Client',
    description: 'Track your project progress',
    dashboard: '/portal/dashboard',
    icon: (
      <svg className="auth-role-icon" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
      </svg>
    ),
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedRole) return
    setError('')
    setLoading(true)
    try {
      const supabase = createClientSupabase()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw authError

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Login failed')

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_active')
        .eq('id', user.id)
        .single()

      if (!profile || !profile.is_active) {
        await supabase.auth.signOut()
        throw new Error('Your account is inactive. Contact your administrator.')
      }

      if (profile.role !== selectedRole) {
        await supabase.auth.signOut()
        const roleLabel = ROLES.find(r => r.value === profile.role)?.label ?? profile.role
        throw new Error(`This account has ${roleLabel} access. Please select the correct role.`)
      }

      const dashboard = ROLES.find(r => r.value === selectedRole)!.dashboard
      router.push(dashboard)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const selected = ROLES.find(r => r.value === selectedRole)

  return (
    <div className="auth-card">
      <h2 className="auth-title">Sign in</h2>
      <p className="auth-sub">Select your role to continue</p>

      {/* Role pills */}
      <div className="auth-roles">
        {ROLES.map(role => (
          <button
            key={role.value}
            type="button"
            onClick={() => { setSelectedRole(role.value); setError('') }}
            className={`auth-role-btn${selectedRole === role.value ? ' active' : ''}`}
          >
            {role.icon}
            {role.label}
          </button>
        ))}
      </div>

      <p className="auth-role-desc">{selected?.description ?? ''}</p>

      {/* Login form */}
      {selectedRole && (
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email" className="auth-label">Email</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password" className="auth-label">Password</label>
            <input
              id="password"
              className="auth-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading} className="auth-btn">
            {loading && <span className="p-spinner" aria-hidden="true" />}
            Sign in as {selected?.label}
          </button>
        </form>
      )}
    </div>
  )
}
