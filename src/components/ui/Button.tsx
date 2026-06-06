import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variants = {
  primary:   'bg-[#14B8A6] text-[#020203] font-semibold hover:bg-[#0fa697] focus:ring-[#14B8A6]',
  secondary: 'bg-white/[0.06] text-white/80 border border-white/10 hover:bg-white/10 hover:text-white focus:ring-white/20',
  ghost:     'text-white/60 hover:bg-white/[0.06] hover:text-white/90 focus:ring-white/20',
  danger:    'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 focus:ring-red-500/40',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-sm',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#020203] disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  )
)
Button.displayName = 'Button'
