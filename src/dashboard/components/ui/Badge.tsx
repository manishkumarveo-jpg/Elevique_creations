interface BadgeProps {
  children: React.ReactNode
  variant?: 'gray' | 'purple' | 'green' | 'yellow' | 'red' | 'blue' | 'orange'
  className?: string
}

const variantClass: Record<string, string> = {
  gray:   'p-badge p-badge--gray',
  purple: 'p-badge p-badge--teal',
  green:  'p-badge p-badge--green',
  yellow: 'p-badge p-badge--yellow',
  red:    'p-badge p-badge--red',
  blue:   'p-badge p-badge--blue',
  orange: 'p-badge p-badge--orange',
}

export function Badge({ children, variant = 'gray', className = '' }: BadgeProps) {
  return (
    <span className={`${variantClass[variant] ?? variantClass.gray} ${className}`}>
      {children}
    </span>
  )
}
