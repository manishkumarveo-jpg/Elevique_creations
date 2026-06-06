import { Badge } from '@/components/ui/Badge'

type ProjectStatus = 'briefing' | 'in_progress' | 'final_review' | 'completed' | 'paused'
type MilestoneStatus = 'pending' | 'in_progress' | 'done'
type DeliverableStatus = 'pending' | 'shared' | 'delivered' | 'approved'

const projectStatusMap: Record<ProjectStatus, { label: string; variant: 'gray' | 'blue' | 'yellow' | 'green' | 'orange' | 'purple' | 'red' }> = {
  briefing: { label: 'Briefing', variant: 'blue' },
  in_progress: { label: 'In Progress', variant: 'yellow' },
  final_review: { label: 'Final Review', variant: 'orange' },
  completed: { label: 'Completed', variant: 'green' },
  paused: { label: 'Paused', variant: 'gray' },
}

const milestoneStatusMap: Record<MilestoneStatus, { label: string; variant: 'gray' | 'blue' | 'green' }> = {
  pending: { label: 'Pending', variant: 'gray' },
  in_progress: { label: 'In Progress', variant: 'blue' },
  done: { label: 'Done', variant: 'green' },
}

const deliverableStatusMap: Record<DeliverableStatus, { label: string; variant: 'gray' | 'blue' | 'purple' | 'green' }> = {
  pending: { label: 'Pending', variant: 'gray' },
  shared: { label: 'Shared', variant: 'blue' },
  delivered: { label: 'Delivered', variant: 'purple' },
  approved: { label: 'Approved', variant: 'green' },
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const { label, variant } = projectStatusMap[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function MilestoneStatusBadge({ status }: { status: MilestoneStatus }) {
  const { label, variant } = milestoneStatusMap[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function DeliverableStatusBadge({ status }: { status: DeliverableStatus }) {
  const { label, variant } = deliverableStatusMap[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function RoleBadge({ role }: { role: 'admin' | 'team_member' | 'client' }) {
  const map = {
    admin: { label: 'Admin', variant: 'purple' as const },
    team_member: { label: 'Team Member', variant: 'blue' as const },
    client: { label: 'Client', variant: 'gray' as const },
  }
  const { label, variant } = map[role]
  return <Badge variant={variant}>{label}</Badge>
}
