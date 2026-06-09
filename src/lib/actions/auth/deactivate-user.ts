'use server'

import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/require-role'
import { createAdminClient } from '@/lib/supabase/admin'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const UserIdSchema = z.object({ user_id: z.string().uuid() })

export async function deactivateUser(input: unknown) {
  await requireAdmin()
  const { user_id } = UserIdSchema.parse(input)

  const adminClient = createAdminClient()
  const supabase = await createServerClient()

  await adminClient.auth.admin.updateUserById(user_id, { ban_duration: '876000h' })
  await supabase.from('profiles').update({ is_active: false }).eq('id', user_id)

  revalidatePath('/admin/users')
  revalidatePath('/admin/clients')
  return { success: true }
}

export async function reactivateUser(input: unknown) {
  await requireAdmin()
  const { user_id } = UserIdSchema.parse(input)

  const adminClient = createAdminClient()
  const supabase = await createServerClient()

  await adminClient.auth.admin.updateUserById(user_id, { ban_duration: 'none' })
  await supabase.from('profiles').update({ is_active: true }).eq('id', user_id)

  revalidatePath('/admin/users')
  revalidatePath('/admin/clients')
  return { success: true }
}
