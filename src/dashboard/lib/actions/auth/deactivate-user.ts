'use server'

import { z } from 'zod'
import { requireAdmin } from '@/dashboard/lib/auth/require-role'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

const UserIdSchema = z.object({ user_id: z.string().uuid() })

export async function deactivateUser(input: unknown) {
  await requireAdmin()
  const { user_id } = UserIdSchema.parse(input)

  const adminClient = createAdminClient()

  const { error: authError } = await adminClient.auth.admin.updateUserById(user_id, { ban_duration: '876000h' })
  if (authError) throw new Error(authError.message)

  const { error: profileError } = await adminClient.from('profiles').update({ is_active: false }).eq('id', user_id)
  if (profileError) throw new Error(profileError.message)

  revalidatePath('/admin/users')
  revalidatePath('/admin/clients')
  return { success: true }
}

export async function reactivateUser(input: unknown) {
  await requireAdmin()
  const { user_id } = UserIdSchema.parse(input)

  const adminClient = createAdminClient()

  const { error: authError } = await adminClient.auth.admin.updateUserById(user_id, { ban_duration: 'none' })
  if (authError) throw new Error(authError.message)

  const { error: profileError } = await adminClient.from('profiles').update({ is_active: true }).eq('id', user_id)
  if (profileError) throw new Error(profileError.message)

  revalidatePath('/admin/users')
  revalidatePath('/admin/clients')
  return { success: true }
}
