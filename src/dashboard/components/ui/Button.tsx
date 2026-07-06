import { ButtonHTMLAttributes, type Ref } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  ref?: Ref<HTMLButtonElement>
}


export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  className = '',
  style,
  children,
  ref,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: '6px',
    fontWeight: 500,
    fontFamily: 'inherit',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.4 : 1,
    transition: 'all 0.13s cubic-bezier(0.4,0,0.2,1)',
    outline: 'none',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
    ...(size === 'sm'
      ? { padding: '0 0.75rem', height: '28px', fontSize: '12px' }
      : size === 'lg'
      ? { padding: '0 1.5rem', height: '40px', fontSize: '14px' }
      : { padding: '0 1.25rem', height: '34px', fontSize: '13.5px' }),
    ...(variant === 'primary'
      ? { background: 'var(--ds-white)', color: '#0a0a0a', border: 'none' }
      : variant === 'secondary'
      ? {
          background: 'var(--ds-bg-elevated)',
          color: 'var(--ds-text-2)',
          border: '1px solid var(--ds-border-2)',
        }
      : variant === 'danger'
      ? {
          background: 'rgba(239,106,94,0.08)',
          color: 'var(--ds-red)',
          border: '1px solid rgba(239,106,94,0.20)',
        }
      : {
          background: 'transparent',
          color: 'var(--ds-text-2)',
          border: 'none',
        }),
    ...style,
  }

  return (
    <button
      type="button"
      ref={ref}
      disabled={disabled || loading}
      style={baseStyle}
      className={className}
      {...props}
    >
      {loading && <span className="p-spinner" />}
      {children}
    </button>
  )
}
