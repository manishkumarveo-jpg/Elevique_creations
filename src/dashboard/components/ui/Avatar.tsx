interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'p-avatar-sm',
  md: 'p-avatar-sm',
  lg: 'p-avatar-sm',
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  return (
    <div className={`${sizes[size]} ${className}`}>
      {initials(name)}
    </div>
  )
}
