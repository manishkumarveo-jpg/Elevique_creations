import { ProgressBar } from './ProgressBar'

interface StatTileProps {
  label: string
  value: string | number
  foot?: string
  progress?: number
  warn?: boolean
  className?: string
}

export function StatTile({ label, value, foot, progress, warn, className = '' }: StatTileProps) {
  return (
    <div className={`p-stat${className ? ` ${className}` : ''}`}>
      <div className="p-stat-label">{label}</div>
      <div className={`p-stat-value${warn ? ' p-stat-value--warn' : ''}`}>{value}</div>
      {progress !== undefined && (
        <div style={{ marginTop: '0.625rem' }}>
          <ProgressBar value={progress} />
        </div>
      )}
      {foot && <div className="p-stat-foot">{foot}</div>}
    </div>
  )
}
