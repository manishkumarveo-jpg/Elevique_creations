import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="p-empty">
      {icon && <div className="p-empty-icon-wrap">{icon}</div>}
      <p className="p-empty-title">{title}</p>
      {description && <p className="p-empty-sub">{description}</p>}
      {action}
    </div>
  )
}
