'use server'

import { requireTeamMember } from '@/lib/auth/require-role'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markMeetingAttended(meetingId: string): Promise<{ success: boolean; error?: string }> {
  const user = await requireTeamMember()
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('meetings')
    .update({ attended_by_team: true, attended_at: new Date().toISOString() })
    .eq('id', meetingId)
    .eq('assigned_team_member_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/team/dashboard')
  revalidatePath('/admin/dashboard')

  return { success: true }
}
