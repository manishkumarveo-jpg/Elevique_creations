'use server'

import { createServerClient } from '@/shared/lib/supabase/server'
import { requireAnyAuth } from '@/dashboard/lib/auth/require-role'
import { revalidatePath } from 'next/cache'

export async function updateNotifySelf(enabled: boolean) {
  const user = await requireAnyAuth()
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('profiles')
    .update({ notify_self: enabled })
    .eq('id', user.id)
  if (error) throw new Error(error.message)

  revalidatePath('/team', 'layout')
  revalidatePath('/admin', 'layout')
}
