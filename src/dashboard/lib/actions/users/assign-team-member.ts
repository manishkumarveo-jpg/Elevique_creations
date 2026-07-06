'use server'

import { requireAdmin } from '@/dashboard/lib/auth/require-role'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function assignTeamMemberToClient(clientId: string, teamMemberId: string | null) {
  await requireAdmin()
  const adminClient = createAdminClient()

  if (teamMemberId) {
    const { data: teamMember, error: teamMemberError } = await adminClient
      .from('profiles')
      .select('id')
      .eq('id', teamMemberId)
      .eq('role', 'team_member')
      .maybeSingle()

    if (teamMemberError) throw new Error(teamMemberError.message)
    if (!teamMember) throw new Error('Invalid team member id')
  }

  const { data, error } = await adminClient
    .from('profiles')
    .update({ assigned_team_member_id: teamMemberId })
    .eq('id', clientId)
    .eq('role', 'client')
    .select('id')

  if (error) throw new Error(error.message)
  if (!data || data.length === 0) {
    throw new Error('Client not found or is not assignable')
  }

  revalidatePath('/admin/clients')
}
