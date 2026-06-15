'use server'

import { requireAdmin } from '@/lib/auth/require-role'
import { createServerClient } from '@/lib/supabase/server'
import { logActivity } from '@/lib/actions/activity'
import { revalidatePath } from 'next/cache'

export async function scheduleMeeting(formData: {
  title: string
  scheduled_at: string
  client_id: string | null
  assigned_team_member_id: string | null
  project_id: string | null
  notes: string | null
}): Promise<{ success: boolean; error?: string }> {
  const user = await requireAdmin()
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('meetings')
    .insert({
      title: formData.title,
      scheduled_at: formData.scheduled_at,
      client_id: formData.client_id || null,
      assigned_team_member_id: formData.assigned_team_member_id || null,
      project_id: formData.project_id || null,
      notes: formData.notes || null,
      created_by: user.id,
    })
    .select('id')
    .single()

  if (error || !data) return { success: false, error: error?.message }

  await logActivity({
    actor_id: user.id,
    actor_role: 'admin',
    action: 'scheduled_meeting',
    entity_type: 'meeting',
    entity_id: data.id,
    entity_name: formData.title,
    metadata: { scheduled_at: formData.scheduled_at },
  })

  revalidatePath('/admin/dashboard')
  revalidatePath('/team/dashboard')
  revalidatePath('/portal/dashboard')
  if (formData.assigned_team_member_id) {
    revalidatePath(`/admin/team/${formData.assigned_team_member_id}`)
  }

  return { success: true }
}

export async function deleteMeeting(meetingId: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  const supabase = await createServerClient()

  const { error } = await supabase.from('meetings').delete().eq('id', meetingId)
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/dashboard')
  revalidatePath('/team/dashboard')
  revalidatePath('/portal/dashboard')

  return { success: true }
}
