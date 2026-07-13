self.addEventListener('push', event => {
  if (!event.data) return

  let payload
  try {
    payload = event.data.json()
  } catch {
    payload = { title: 'Elevique', body: event.data.text() }
  }

  const { title, body, url } = payload

  event.waitUntil(
    self.registration.showNotification(title ?? 'Elevique', {
      body: body ?? '',
      icon: '/logo.png',
      badge: '/logo.png',
      data: { url: url ?? '/' },
    })
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data?.url ?? '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) return client.focus()
      }
      for (const client of clientList) {
        if ('focus' in client) return client.focus().then(() => client.navigate?.(url))
      }
      if (self.clients.openWindow) return self.clients.openWindow(url)
    })
  )
})
