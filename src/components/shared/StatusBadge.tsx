import { Badge } from '@/components/ui/Badge'

type ProjectStatus = 'briefing' | 'in_progress' | 'final_review' | 'completed' | 'paused'
type MilestoneStatus = 'pending' | 'in_progress' | 'done'
type DeliverableStatus = 'pending' | 'shared' | 'delivered' | 'approved'
type TrackerStatus = 'pending' | 'in_progress' | 'revision_pending' | 'completed' | 'paused'
type TrackerPriority = 'P1' | 'P2' | 'P3'

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

const roleBadgeMap: Record<'admin' | 'team_member' | 'client', { label: string; variant: 'purple' | 'blue' | 'gray' }> = {
  admin: { label: 'Admin', variant: 'purple' },
  team_member: { label: 'Team Member', variant: 'blue' },
  client: { label: 'Client', variant: 'gray' },
}

const trackerStatusMap: Record<TrackerStatus, { label: string; variant: 'gray' | 'blue' | 'yellow' | 'green' | 'orange' }> = {
  pending: { label: 'Pending', variant: 'gray' },
  in_progress: { label: 'In Progress', variant: 'blue' },
  revision_pending: { label: 'Revision Pending', variant: 'orange' },
  completed: { label: 'Completed', variant: 'green' },
  paused: { label: 'Paused', variant: 'gray' },
}

const trackerPriorityMap: Record<TrackerPriority, { label: string; variant: 'red' | 'yellow' | 'gray' }> = {
  P1: { label: 'P1', variant: 'red' },
  P2: { label: 'P2', variant: 'yellow' },
  P3: { label: 'P3', variant: 'gray' },
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
  const { label, variant } = roleBadgeMap[role]
  return <Badge variant={variant}>{label}</Badge>
}

export function TrackerStatusBadge({ status }: { status: TrackerStatus }) {
  const { label, variant } = trackerStatusMap[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function TrackerPriorityBadge({ priority }: { priority: TrackerPriority }) {
  const { label, variant } = trackerPriorityMap[priority]
  return <Badge variant={variant}>{label}</Badge>
}
