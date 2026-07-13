'use client'

import { useEffect, useState } from 'react'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)))
}

export function PushPermissionPrompt() {
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) return
    setVisible(Notification.permission === 'default')

    // Permission may already be 'granted' from a previous account on this
    // browser/device — that doesn't mean the *current* account has a
    // push_subscriptions row. Re-associate any existing subscription with
    // whoever is logged in now, independent of whether the prompt is shown.
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready
        .then(registration => registration.pushManager.getSubscription())
        .then(subscription => {
          if (!subscription) return
          return fetch('/api/push/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription.toJSON()),
          })
        })
        .catch(error => console.error('Failed to re-sync existing push subscription:', error))
    }
  }, [])

  async function enableNotifications() {
    setBusy(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setVisible(false)
        return
      }

      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!publicKey) {
        console.error('NEXT_PUBLIC_VAPID_PUBLIC_KEY is not configured')
        return
      }

      await navigator.serviceWorker.register('/sw.js')
      // .register() can resolve before the worker reaches "active" — pushManager.subscribe()
      // needs an active worker, so wait on .ready rather than subscribing on the raw registration.
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })

      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription.toJSON()),
      })

      if (!response.ok) {
        console.error('Failed to persist push subscription:', response.status)
        return
      }

      setVisible(false)
    } catch (error) {
      console.error('Failed to enable push notifications:', error)
    } finally {
      setBusy(false)
    }
  }

  if (!visible) return null

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div className="p-alert p-alert--warn">
        <span className="p-alert-dot" />
        Get notified in your browser when you&apos;re assigned work or something updates.
        <div className="p-alert-links">
          <button type="button" className="p-alert-link" onClick={enableNotifications} disabled={busy} style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: busy ? 'default' : 'pointer' }}>
            {busy ? 'Enabling…' : 'Enable notifications'}
          </button>
          <button type="button" className="p-alert-link" onClick={() => setVisible(false)} style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}>
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
