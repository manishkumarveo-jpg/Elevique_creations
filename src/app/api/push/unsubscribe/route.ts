import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/shared/lib/supabase/server'
import { getCurrentUserAndProfile } from '@/dashboard/lib/auth/require-role'

const UnsubscribeSchema = z.object({
  endpoint: z.string().url(),
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
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })
  }
  const parsed = UnsubscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })
  }

  const supabase = await createServerClient()
  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('endpoint', parsed.data.endpoint)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
