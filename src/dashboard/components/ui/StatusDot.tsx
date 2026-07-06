interface StatusDotProps {
  tone: 'green' | 'amber' | 'blue' | 'red' | 'gray'
  size?: number
}

const colors: Record<string, string> = {
  green: 'var(--ds-green)',
  amber: 'var(--ds-amber)',
  blue:  'var(--ds-blue)',
  red:   'var(--ds-red)',
  gray:  'var(--ds-text-3)',
}

const halos: Record<string, string> = {
  green: 'rgba(78,199,127,0.2)',
  amber: 'rgba(217,164,65,0.2)',
  blue:  'rgba(90,155,246,0.2)',
  red:   'rgba(239,106,94,0.2)',
  gray:  'transparent',
}

export function StatusDot({ tone, size = 6 }: StatusDotProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        background: colors[tone] ?? colors.gray,
        boxShadow: `0 0 0 3px ${halos[tone] ?? 'transparent'}`,
        flexShrink: 0,
      }}
    />
  )
}
