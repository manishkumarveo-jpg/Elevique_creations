import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ label, error, id, options, placeholder, className = '', ...props }, ref) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {label && (
          <label htmlFor={id} className="auth-label">{label}</label>
        )}
        <select
          ref={ref}
          id={id}
          className={`p-select ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {error && <p style={{ fontSize: '0.7rem', color: 'var(--p-red)' }}>{error}</p>}
      </div>
    )
  }
)
