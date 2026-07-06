interface ProgressBarProps {
  value: number
  dim?: boolean
  className?: string
}

export function ProgressBar({ value, dim = false, className = '' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div
      className={`p-progress-track${className ? ` ${className}` : ''}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`p-progress-fill${dim ? ' p-progress-fill--dim' : ''}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
