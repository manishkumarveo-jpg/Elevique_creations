'use server'

import { requireAdmin } from '@/lib/auth/require-role'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function assignTeamMemberToClient(clientId: string, teamMemberId: string | null) {
  await requireAdmin()
  const adminClient = createAdminClient()

  const { error } = await adminClient
    .from('profiles')
    .update({ assigned_team_member_id: teamMemberId })
    .eq('id', clientId)
    .eq('role', 'client')

  if (error) throw new Error(error.message)

  revalidatePath('/admin/clients')
}
