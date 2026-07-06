import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface FeaturedProjectCardProps {
  id: string
  name: string
  clientName: string
  status: string
  dueDate?: string | null
  milestoneDone: number
  milestoneTotal: number
  href: string
}

function statusToBadgeVariant(status: string): 'green' | 'yellow' | 'gray' | 'blue' | 'red' {
  if (status === 'in_progress')  return 'blue'
  if (status === 'final_review') return 'yellow'
  if (status === 'completed')    return 'green'
  if (status === 'paused')       return 'red'
  return 'gray'
}

function statusLabel(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export function FeaturedProjectCard({
  name,
  clientName,
  status,
  dueDate,
  milestoneDone,
  milestoneTotal,
  href,
}: FeaturedProjectCardProps) {
  const letter = name.charAt(0).toUpperCase()
  const pct = milestoneTotal > 0 ? Math.round((milestoneDone / milestoneTotal) * 100) : 0

  return (
    <Link href={href} className="p-project-card">
      {/* Canvas */}
      <div className="p-project-thumb">
        <span className="p-project-thumb-letter">{letter}</span>
        <div className="p-project-thumb-badge">
          <Badge variant={statusToBadgeVariant(status)}>
            {statusLabel(status)}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="p-project-card-body">
        <div className="p-project-card-header">
          <div>
            <div className="p-project-card-name">{name}</div>
            <div className="p-project-card-client mono">{clientName}</div>
          </div>
        </div>

        {/* Progress */}
        <div className="p-project-card-progress-row">
          <span className="p-project-card-progress-label">Progress</span>
          <span className="p-project-card-progress-pct">{pct}%</span>
        </div>
        <ProgressBar value={pct} />

        {/* Footer */}
        <div className="p-project-card-footer">
          <span className="p-project-card-date mono">
            {dueDate ? `Due ${new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : 'No deadline'}
          </span>
          <span className="p-project-card-link">
            View details
            <span className="p-project-card-link-arrow">→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
