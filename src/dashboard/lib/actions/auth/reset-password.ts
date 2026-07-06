'use server'

import { z } from 'zod'
import { requireAdmin } from '@/dashboard/lib/auth/require-role'
import { createAdminClient } from '@/shared/lib/supabase/admin'

const ResetPasswordSchema = z.object({
  user_id: z.string().uuid(),
  new_password: z.string().min(12),
})

export async function adminResetPassword(input: unknown) {
  await requireAdmin()
  const { user_id, new_password } = ResetPasswordSchema.parse(input)

  const adminClient = createAdminClient()
  const { error } = await adminClient.auth.admin.updateUserById(user_id, {
    password: new_password,
  })

  if (error) throw new Error('Password reset failed. Please try again.')
  return { success: true }
}
