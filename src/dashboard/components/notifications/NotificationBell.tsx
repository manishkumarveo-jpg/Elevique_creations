'use client'

import { useRouter } from 'next/navigation'
import { Popover, Switch } from 'radix-ui'
import { Bell } from 'lucide-react'
import { useNotifications } from '@/dashboard/components/notifications/NotificationProvider'
import { NotificationItem } from '@/dashboard/components/notifications/NotificationItem'
import type { NotificationRow } from '@/dashboard/lib/queries/notifications'

export function NotificationBell() {
  const router = useRouter()
  const { notifications, unreadCount, markRead, markAllRead, notifySelf, toggleNotifySelf } = useNotifications()

  function handleSelect(notification: NotificationRow) {
    // Fire-and-forget: markRead handles its own optimistic update + rollback,
    // and navigation must proceed even if the mark-read call fails.
    void markRead(notification)
    if (notification.link) router.push(notification.link)
  }

  function handleMarkAllRead() {
    void markAllRead()
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            color: 'var(--ds-text-2)',
            cursor: 'pointer',
          }}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                minWidth: 15,
                height: 15,
                borderRadius: '50%',
                background: 'var(--ds-red)',
                color: '#fff',
                fontSize: 10,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 3px',
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          style={{
            width: 320,
            maxHeight: 420,
            overflowY: 'auto',
            background: 'var(--ds-bg-1)',
            border: '1px solid var(--ds-border-2)',
            borderRadius: 'var(--ds-radius)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.24)',
            zIndex: 50,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0.875rem', borderBottom: '1px solid var(--ds-border-2)' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ds-text-1)' }}>Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                style={{ background: 'none', border: 'none', padding: 0, fontSize: '12px', color: 'var(--ds-text-3)', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Mark all read
              </button>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0.875rem', borderBottom: '1px solid var(--ds-border-2)' }}>
            <label htmlFor="notify-self-toggle" style={{ fontSize: '12px', color: 'var(--ds-text-3)' }}>
              Notify me about my own actions
            </label>
            <Switch.Root
              id="notify-self-toggle"
              type="button"
              checked={notifySelf}
              onCheckedChange={() => toggleNotifySelf()}
              style={{
                width: 32,
                height: 18,
                borderRadius: 999,
                background: notifySelf ? 'var(--ds-blue)' : 'var(--ds-border-2)',
                position: 'relative',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'background 0.15s',
              }}
            >
              <Switch.Thumb
                style={{
                  display: 'block',
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: '#fff',
                  transform: notifySelf ? 'translateX(16px)' : 'translateX(2px)',
                  transition: 'transform 0.15s',
                }}
              />
            </Switch.Root>
          </div>
          {notifications.length === 0 ? (
            <div style={{ padding: '1.5rem 0.875rem', textAlign: 'center', fontSize: '12.5px', color: 'var(--ds-text-3)' }}>
              You&apos;re all caught up.
            </div>
          ) : (
            notifications.map(notification => (
              <Popover.Close key={notification.id} asChild>
                <NotificationItem notification={notification} onClick={handleSelect} />
              </Popover.Close>
            ))
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
