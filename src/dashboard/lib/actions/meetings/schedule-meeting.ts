'use server'

import { z } from 'zod'
import { requireAdmin } from '@/dashboard/lib/auth/require-role'
import { createServerClient } from '@/shared/lib/supabase/server'
import { logActivity } from '@/dashboard/lib/actions/activity'
import { notifyUser } from '@/dashboard/lib/actions/notifications/notify'
import { revalidatePath } from 'next/cache'
import { PRODUCT_TIMEZONE } from '@/shared/lib/env'

const ScheduleMeetingSchema = z.object({
  title: z.string().min(1).max(200),
  scheduled_at: z.string().min(1),
  client_id: z.string().uuid().nullable(),
  assigned_team_member_id: z.string().uuid().nullable(),
  project_id: z.string().uuid().nullable(),
  notes: z.string().nullable(),
})

export async function scheduleMeeting(input: unknown): Promise<{ success: boolean; error?: string }> {
  const user = await requireAdmin()
  const parseResult = ScheduleMeetingSchema.safeParse(input)
  if (!parseResult.success) {
    return { success: false, error: parseResult.error.issues[0]?.message ?? 'Invalid meeting data' }
  }
  const formData = parseResult.data
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

  if (formData.assigned_team_member_id) {
    try {
      await notifyUser(formData.assigned_team_member_id, {
        actorId: user.id,
        type: 'assignment',
        title: 'New meeting scheduled',
        body: `${formData.title} — ${new Date(formData.scheduled_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: PRODUCT_TIMEZONE })}`,
        link: '/team/dashboard',
        entityType: 'meeting',
        entityId: data.id,
      })
    } catch (notifyErr) {
      console.error('Meeting notification failed (meeting still scheduled):', notifyErr)
    }
  }

  try {
    await notifyUser(user.id, {
      actorId: user.id,
      type: 'assignment',
      title: 'Meeting scheduled',
      body: `You scheduled "${formData.title}" for ${new Date(formData.scheduled_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: PRODUCT_TIMEZONE })}.`,
      link: '/admin/dashboard',
      entityType: 'meeting',
      entityId: data.id,
    })
  } catch (notifyErr) {
    console.error('Meeting self-notification failed (meeting still scheduled):', notifyErr)
  }

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
