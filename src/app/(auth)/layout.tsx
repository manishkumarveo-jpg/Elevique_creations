import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-root">
      <div className="auth-glow" aria-hidden="true" />
      <div className="auth-inner">
        <div className="auth-brand">
          <Image
            src="/Elevique (7).png"
            alt="Elevique"
            width={160}
            height={60}
            style={{
              objectFit: 'contain',
              borderRadius: 12,
              boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
            }}
            priority
          />
          <p className="auth-brand-label">Agency Portal</p>
        </div>
        {children}
      </div>
    </div>
  )
}
