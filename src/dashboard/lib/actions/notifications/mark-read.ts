'use server'

import { createServerClient } from '@/shared/lib/supabase/server'
import { requireAnyAuth } from '@/dashboard/lib/auth/require-role'
import { revalidatePath } from 'next/cache'

export async function markNotificationRead(notificationId: string) {
  const user = await requireAnyAuth()
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .eq('recipient_id', user.id)
  if (error) throw new Error(error.message)

  revalidatePath('/team', 'layout')
  revalidatePath('/admin', 'layout')
}

export async function markAllNotificationsRead() {
  const user = await requireAnyAuth()
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('recipient_id', user.id)
    .is('read_at', null)
  if (error) throw new Error(error.message)

  revalidatePath('/team', 'layout')
  revalidatePath('/admin', 'layout')
}
