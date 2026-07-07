'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClientSupabase } from '@/shared/lib/supabase/client'

const ROLE_DASHBOARDS: Record<string, string> = {
  admin: '/admin/dashboard',
  team_member: '/team/dashboard',
  client: '/portal/dashboard',
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const supabase = createClientSupabase()
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw authError

      setRedirecting(true)

      const userId = data.user?.id
      const { data: profile } = userId
        ? await supabase.from('profiles').select('role, is_active').eq('id', userId).single()
        : { data: null }

      if (!profile || !profile.is_active) {
        router.replace('/unauthorized')
      } else {
        router.replace(ROLE_DASHBOARDS[profile.role] ?? '/login')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
      setLoading(false)
    }
  }

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
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.06)' }}>
              <div style={{
                height: '100%', background: 'linear-gradient(90deg, #14b8a6, #2dd4bf)',
                animation: '_progress 2.2s cubic-bezier(0.4,0,0.2,1) forwards',
                borderRadius: '0 2px 2px 0',
              }} />
            </div>

            <div style={{ animation: '_logoPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both', marginBottom: 20 }}>
              <Image
                src="/logo.png"
                alt="Elevique"
                width={180}
                height={68}
                style={{ objectFit: 'contain', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
                priority
              />
            </div>

            <p style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: 0, animation: '_fadeUp 0.4s ease 0.3s both' }}>
              Welcome back
            </p>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, margin: '6px 0 0', animation: '_fadeUp 0.4s ease 0.4s both' }}>
              Loading your dashboard…
            </p>

            <div style={{ display: 'flex', gap: 6, marginTop: 32, animation: '_fadeUp 0.4s ease 0.5s both' }}>
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
        <p className="auth-sub">Enter your credentials to continue</p>

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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </>
  )
}
