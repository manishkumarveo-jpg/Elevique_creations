'use server'

import { requireTeamMember } from '@/dashboard/lib/auth/require-role'
import { createServerClient } from '@/shared/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markMeetingAttended(meetingId: string): Promise<{ success: boolean; error?: string }> {
  const user = await requireTeamMember()
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('meetings')
    .update({ attended_by_team: true, attended_at: new Date().toISOString() })
    .eq('id', meetingId)
    .eq('assigned_team_member_id', user.id)
    .select('id')

  if (error) return { success: false, error: error.message }
  if (!data || data.length === 0) {
    return { success: false, error: 'Meeting not found or not assigned to you' }
  }

  revalidatePath('/team/dashboard')
  revalidatePath('/admin/dashboard')

  return { success: true }
}
