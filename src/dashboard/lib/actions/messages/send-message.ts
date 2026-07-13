'use server'

import { createServerClient } from '@/shared/lib/supabase/server'
import { notifyUsers, notifyAdmins } from '@/dashboard/lib/actions/notifications/notify'
import { revalidatePath } from 'next/cache'

export async function sendMessage(projectId: string, body: string) {
  const trimmed = body.trim()
  if (!trimmed) return

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: message, error } = await supabase
    .from('messages')
    .insert({ project_id: projectId, sender_id: user.id, body: trimmed })
    .select()
    .single()
  if (error) throw error

  const { data: project } = await supabase.from('projects').select('name').eq('id', projectId).single()
  const { data: assignments } = await supabase.from('project_assignments').select('user_id').eq('project_id', projectId)
  const notifyPayload = {
    actorId: user.id,
    type: 'message',
    title: `New message — ${project?.name ?? 'Project'}`,
    body: trimmed,
    projectId,
    entityType: 'message',
    entityId: message.id,
  }

  try {
    await notifyUsers((assignments ?? []).map(a => a.user_id), { ...notifyPayload, link: `/team/projects/${projectId}` })
    await notifyAdmins({ ...notifyPayload, link: `/admin/projects/${projectId}` })
  } catch (notifyErr) {
    console.error('Message notification failed (message still sent):', notifyErr)
  }

  revalidatePath('/admin/communications')
  revalidatePath('/portal/communications')
  revalidatePath('/team/communications')
}
