'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
  const [redirecting, setRedirecting] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedRole) return
    setError('')
    setLoading(true)
    try {
      const supabase = createClientSupabase()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw authError

      // Profile role/active check happens in middleware on the dashboard route.
      // Navigating immediately saves a round-trip DB call here.
      const dashboard = ROLES.find(r => r.value === selectedRole)!.dashboard
      setRedirecting(true)
      router.replace(dashboard)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
      setLoading(false)
    }
  }

  const selected = ROLES.find(r => r.value === selectedRole)

  return (
    <>
      {redirecting && (
        <>
          <style>{`
            @keyframes _progress { from { width: 0% } to { width: 88% } }
            @keyframes _fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
            @keyframes _fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes _logoPop { 0% { opacity:0; transform:scale(0.7) } 60% { transform:scale(1.06) } 100% { opacity:1; transform:scale(1) } }
            @keyframes _pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(20,184,166,0.4) } 50% { box-shadow: 0 0 0 12px rgba(20,184,166,0) } }
          `}</style>
          <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#07080c',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            animation: '_fadeIn 0.25s ease forwards',
          }}>
            {/* Progress bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.06)' }}>
              <div style={{
                height: '100%', background: 'linear-gradient(90deg, #14b8a6, #2dd4bf)',
                animation: '_progress 2.2s cubic-bezier(0.4,0,0.2,1) forwards',
                borderRadius: '0 2px 2px 0',
              }} />
            </div>

            {/* Logo */}
            <div style={{
              animation: '_logoPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both',
              marginBottom: 20,
            }}>
              <Image
                src="/Elevique (7).png"
                alt="Elevique"
                width={180}
                height={68}
                style={{
                  objectFit: 'contain',
                  borderRadius: 12,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                }}
                priority
              />
            </div>

            {/* Text */}
            <p style={{
              color: '#fff', fontSize: 18, fontWeight: 600, margin: 0,
              animation: '_fadeUp 0.4s ease 0.3s both',
            }}>
              Welcome back, {selected?.label}
            </p>
            <p style={{
              color: 'rgba(255,255,255,0.38)', fontSize: 13, margin: '6px 0 0',
              animation: '_fadeUp 0.4s ease 0.4s both',
            }}>
              Loading your dashboard…
            </p>

            {/* Dots */}
            <div style={{
              display: 'flex', gap: 6, marginTop: 32,
              animation: '_fadeUp 0.4s ease 0.5s both',
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: '50%', background: '#14b8a6',
                  animation: `_pulse 1.2s ease ${i * 0.2}s infinite`,
                  opacity: 0.7,
                }} />
              ))}
            </div>
          </div>
        </>
      )}

      <div className="auth-card" style={{ opacity: redirecting ? 0 : 1, transition: 'opacity 0.2s' }}>
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

            <button type="submit" disabled={loading || redirecting} className="auth-btn">
              {loading && <span className="p-spinner" aria-hidden="true" />}
              {loading ? 'Signing in…' : `Sign in as ${selected?.label}`}
            </button>
          </form>
        )}
      </div>
    </>
  )
}
