export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-root">
      <div className="auth-glow" aria-hidden="true" />
      <div className="auth-inner">
        <div className="auth-brand">
          <div className="auth-logo-box">
            <span className="auth-logo-letter">E</span>
          </div>
          <h1 className="auth-brand-name">Elevique</h1>
          <p className="auth-brand-label">Agency Portal</p>
        </div>
        {children}
      </div>
    </div>
  )
}
