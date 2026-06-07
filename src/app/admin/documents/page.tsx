export default function AdminDocumentsPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--p-teal)', margin: '0 0 0.3rem' }}>
        Admin · Documents
      </p>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--p-t1)', letterSpacing: '-0.01em', margin: '0 0 0.25rem' }}>
        Documents
      </h1>
      <p style={{ fontSize: '0.75rem', color: 'var(--p-t3)', marginBottom: '2rem' }}>
        Centralized document storage and management.
      </p>

      <div className="p-info-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', gap: '0.75rem' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 40, height: 40, color: 'var(--p-t3)', opacity: 0.4 }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p style={{ fontSize: '0.85rem', color: 'var(--p-t3)', fontStyle: 'italic' }}>Documents feature coming soon.</p>
      </div>
    </div>
  )
}
