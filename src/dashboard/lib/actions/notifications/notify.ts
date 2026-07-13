// Deliberately not a Server Action module: every exported function here is
// an internal dispatcher meant to be called only from other server actions
// (which already enforce their own requireAdmin()/requireTeamMember()/etc.
// authorization) — 'use server' at module scope would expose notifyUser/
// notifyUsers/notifyAdmins as independently, publicly invocable endpoints
// with no auth check of their own, letting any caller spam arbitrary
// recipients with attacker-controlled notification/push content. This file
// is still never bundled to the client: it's only ever imported from other
// server-only ('use server') files, and imports service-role-only modules
// (createAdminClient, web-push) that couldn't run client-side regardless.

import webpush from 'web-push'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { env } from '@/shared/lib/env'
import { isAllowedPushEndpoint } from '@/shared/lib/webpush-endpoint'

interface NotifyPayload {
  actorId: string
  type: string
  title: string
  body: string
  link?: string
  projectId?: string
  entityType?: string
  entityId?: string
}

let vapidConfigured = false

function ensureVapidConfigured() {
  if (vapidConfigured) return
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  if (!publicKey) return
  webpush.setVapidDetails(env.vapidSubject, publicKey, env.vapidPrivateKey)
  vapidConfigured = true
}

async function sendPushToUser(recipientId: string, payload: NotifyPayload) {
  try {
    ensureVapidConfigured()
    if (!vapidConfigured) return

    const adminClient = createAdminClient()
    const { data: subscriptions, error: subscriptionsError } = await adminClient
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth')
      .eq('user_id', recipientId)

    if (subscriptionsError) throw subscriptionsError

    for (const sub of subscriptions ?? []) {
      if (!isAllowedPushEndpoint(sub.endpoint)) {
        console.error('Skipping push to unrecognized endpoint host:', sub.endpoint)
        continue
      }
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({ title: payload.title, body: payload.body, url: payload.link ?? '/team/dashboard' }),
          { timeout: 5000 }
        )
      } catch (error) {
        const statusCode = (error as { statusCode?: number }).statusCode
        if (statusCode === 404 || statusCode === 410) {
          await adminClient.from('push_subscriptions').delete().eq('id', sub.id)
        } else {
          console.error('Failed to send push notification:', error)
        }
      }
    }
  } catch (error) {
    console.error('Push delivery failed (in-app notification still delivered):', error)
  }
}

async function notifyOne(recipientId: string, payload: NotifyPayload) {
  const adminClient = createAdminClient()

  if (recipientId === payload.actorId) {
    const { data: profile } = await adminClient.from('profiles').select('notify_self').eq('id', recipientId).single()
    if (profile?.notify_self === false) return
  }

  const { error } = await adminClient.from('notifications').insert({
    recipient_id: recipientId,
    actor_id: payload.actorId,
    type: payload.type,
    title: payload.title,
    body: payload.body,
    link: payload.link ?? null,
    project_id: payload.projectId ?? null,
    entity_type: payload.entityType ?? null,
    entity_id: payload.entityId ?? null,
  })

  if (error) {
    console.error('Failed to insert notification:', error.message)
    return
  }

  await sendPushToUser(recipientId, payload)
}

export async function notifyUser(recipientId: string, payload: NotifyPayload) {
  await notifyOne(recipientId, payload)
}

export async function notifyUsers(recipientIds: string[], payload: NotifyPayload) {
  await Promise.all(recipientIds.map(recipientId => notifyOne(recipientId, payload)))
}

export async function notifyAdmins(payload: NotifyPayload) {
  const adminClient = createAdminClient()
  const { data: admins } = await adminClient
    .from('profiles')
    .select('id')
    .eq('role', 'admin')
    .eq('is_active', true)

  await notifyUsers((admins ?? []).map(a => a.id), payload)
}
