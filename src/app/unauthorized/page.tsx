import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#07080c',
    }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <p style={{ fontSize: 48, lineHeight: 1 }}>🔒</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0 }}>Wrong role selected</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: 0, maxWidth: 300 }}>
          Your account doesn&apos;t have access to that section. Please sign in again and select the correct role.
        </p>
        <Link
          href="/login"
          style={{
            marginTop: 8, padding: '10px 24px', background: '#14b8a6',
            color: '#07080c', borderRadius: 10, fontSize: 13, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none',
          }}
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}
