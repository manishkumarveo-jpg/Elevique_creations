'use client'

interface Props {
  roleLabel: string
}

export function MobileHeader({ roleLabel }: Props) {
  function openSidebar() {
    window.dispatchEvent(new CustomEvent('p:open-sidebar'))
  }

  return (
    <header className="p-mobile-header">
      <button type="button" className="p-hamburger" onClick={openSidebar} aria-label="Open menu">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </button>

      <div className="p-sidebar-logo-box" style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0 }}>
        <span className="p-sidebar-logo-letter" style={{ fontSize: '0.72rem' }}>E</span>
      </div>

      <div>
        <p className="p-sidebar-brand-name" style={{ fontSize: '0.825rem' }}>Elevique</p>
        <p className="p-sidebar-role-tag">{roleLabel}</p>
      </div>
    </header>
  )
}
