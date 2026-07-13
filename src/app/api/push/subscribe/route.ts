import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/shared/lib/supabase/server'
import { getCurrentUserAndProfile } from '@/dashboard/lib/auth/require-role'
import { isAllowedPushEndpoint } from '@/shared/lib/webpush-endpoint'

const SubscribeSchema = z.object({
  endpoint: z.string().url().refine(isAllowedPushEndpoint, 'Unrecognized push service endpoint.'),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
})

export async function POST(request: Request) {
  const { user, profile } = await getCurrentUserAndProfile()
  if (!user || !profile || !profile.is_active || (profile.role !== 'team_member' && profile.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid subscription payload.' }, { status: 400 })
  }
  const parsed = SubscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid subscription payload.' }, { status: 400 })
  }

  const supabase = await createServerClient()
  const { error } = await supabase.from('push_subscriptions').upsert({
    user_id: user.id,
    endpoint: parsed.data.endpoint,
    p256dh: parsed.data.keys.p256dh,
    auth: parsed.data.keys.auth,
    user_agent: request.headers.get('user-agent'),
  }, { onConflict: 'endpoint' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
