'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { createClientSupabase } from '@/shared/lib/supabase/client'
import { markNotificationRead, markAllNotificationsRead } from '@/dashboard/lib/actions/notifications/mark-read'
import { updateNotifySelf } from '@/dashboard/lib/actions/notifications/preferences'
import type { NotificationRow } from '@/dashboard/lib/queries/notifications'

interface NotificationContextValue {
  notifications: NotificationRow[]
  unreadCount: number
  markRead: (notification: NotificationRow) => Promise<void>
  markAllRead: () => Promise<void>
  notifySelf: boolean
  toggleNotifySelf: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

// Singleton state for a given user's notifications, shared by every
// NotificationBell instance mounted at once (desktop sidebar + mobile
// header) so read/mark-all-read stay in sync instead of each bell holding
// its own desynced copy.
export function NotificationProvider({ userId, initialNotifications, initialUnreadCount, initialNotifySelf, children }: {
  userId: string
  initialNotifications: NotificationRow[]
  initialUnreadCount: number
  initialNotifySelf: boolean
  children: React.ReactNode
}) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount)
  const [notifySelf, setNotifySelf] = useState(initialNotifySelf)

  // useState(initial) only seeds state on first mount — if this provider is
  // reused for a different signed-in user without remounting (same userId
  // prop identity's parent re-rendering with new initial* props), the
  // previous user's notifications/unreadCount/notifySelf would otherwise
  // persist. Reset synchronously during render (React's documented pattern
  // for this) rather than in an effect, so a stale account's data is never
  // painted even for one frame.
  const [prevUserId, setPrevUserId] = useState(userId)
  if (userId !== prevUserId) {
    setPrevUserId(userId)
    setNotifications(initialNotifications)
    setUnreadCount(initialUnreadCount)
    setNotifySelf(initialNotifySelf)
  }

  const notificationsRef = useRef(notifications)
  useEffect(() => {
    notificationsRef.current = notifications
  }, [notifications])

  useEffect(() => {
    const supabase = createClientSupabase()
    const topic = `notifications:${userId}`

    // createClientSupabase() returns a singleton browser client, so its channel
    // registry survives React Strict Mode's dev-only mount→cleanup→remount cycle.
    // If the previous mount's cleanup hasn't finished removing this topic yet,
    // reusing it here would throw "cannot add postgres_changes callbacks after
    // subscribe()" — so force-clear any stale channel with the same topic first.
    supabase.getChannels().filter(c => c.topic === `realtime:${topic}`).forEach(c => supabase.removeChannel(c))

    const channel = supabase
      .channel(topic)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${userId}` },
        payload => {
          const row = payload.new as NotificationRow
          setNotifications(current => [row, ...current].slice(0, 20))
          setUnreadCount(count => count + 1)
        }
      )
      .on(
        // Catches read/mark-all-read done from another tab or device, so
        // this tab's bell doesn't show stale unread state until a reload.
        // payload.old isn't reliable here (no REPLICA IDENTITY FULL on this
        // table, so Realtime only guarantees the primary key on UPDATE) —
        // use the ref'd local copy instead of payload.old to detect the
        // unread→read transition.
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${userId}` },
        payload => {
          const row = payload.new as NotificationRow
          const existing = notificationsRef.current.find(n => n.id === row.id)
          const wasUnread = existing ? !existing.read_at : false
          setNotifications(current => current.map(n => (n.id === row.id ? row : n)))
          if (wasUnread && row.read_at) {
            setUnreadCount(count => Math.max(0, count - 1))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  async function markRead(notification: NotificationRow) {
    if (notification.read_at) return
    setNotifications(current => current.map(n => (n.id === notification.id ? { ...n, read_at: new Date().toISOString() } : n)))
    setUnreadCount(count => Math.max(0, count - 1))
    try {
      await markNotificationRead(notification.id)
    } catch (error) {
      console.error('Failed to mark notification read:', error)
      setNotifications(current => current.map(n => (n.id === notification.id ? { ...n, read_at: null } : n)))
      setUnreadCount(count => count + 1)
    }
  }

  async function markAllRead() {
    const previousNotifications = notifications
    const previousUnreadCount = unreadCount
    setNotifications(current => current.map(n => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })))
    setUnreadCount(0)
    try {
      await markAllNotificationsRead()
    } catch (error) {
      console.error('Failed to mark all notifications read:', error)
      setNotifications(previousNotifications)
      setUnreadCount(previousUnreadCount)
    }
  }

  async function toggleNotifySelf() {
    const next = !notifySelf
    setNotifySelf(next)
    try {
      await updateNotifySelf(next)
    } catch (error) {
      console.error('Failed to update notification preference:', error)
      setNotifySelf(!next)
    }
  }

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, notifySelf, toggleNotifySelf }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within a NotificationProvider')
  return ctx
}
