'use client'

import type { NotificationRow } from '@/dashboard/lib/queries/notifications'

function timeAgo(isoDate: string) {
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function NotificationItem({ notification, onClick }: { notification: NotificationRow; onClick: (notification: NotificationRow) => void }) {
  const unread = !notification.read_at

  return (
    <button
      type="button"
      onClick={() => onClick(notification)}
      style={{
        display: 'flex',
        gap: '0.625rem',
        width: '100%',
        textAlign: 'left',
        padding: '0.625rem 0.875rem',
        background: unread ? 'var(--ds-bg-elevated)' : 'transparent',
        border: 'none',
        borderBottom: '1px solid var(--ds-border-2)',
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          marginTop: '0.4rem',
          flexShrink: 0,
          background: unread ? 'var(--ds-blue)' : 'transparent',
        }}
      />
      <span style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', minWidth: 0 }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ds-text-1)' }}>{notification.title}</span>
        <span style={{ fontSize: '12.5px', color: 'var(--ds-text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notification.body}</span>
        <span style={{ fontSize: '11px', color: 'var(--ds-text-3)', opacity: 0.7 }}>{timeAgo(notification.created_at)}</span>
      </span>
    </button>
  )
}
