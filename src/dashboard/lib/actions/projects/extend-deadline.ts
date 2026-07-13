'use server'

import { z } from 'zod'
import { requireAdmin } from '@/dashboard/lib/auth/require-role'
import { createServerClient } from '@/shared/lib/supabase/server'
import { logActivity } from '@/dashboard/lib/actions/activity'
import { notifyUser, notifyUsers } from '@/dashboard/lib/actions/notifications/notify'
import { revalidatePath } from 'next/cache'

const ExtendDeadlineSchema = z.object({
  deadline_type: z.enum(['internal', 'client']),
  new_date: z.string().min(1),
  reason: z.string().optional(),
})

export async function extendDeadline(projectId: string, input: unknown) {
  const user = await requireAdmin()
  const { deadline_type, new_date, reason } = ExtendDeadlineSchema.parse(input)

  const supabase = await createServerClient()

  const { data: project, error: fetchError } = await supabase
    .from('projects')
    .select('internal_deadline, client_deadline')
    .eq('id', projectId)
    .single()

  if (fetchError || !project) throw new Error('Project not found')

  const old_date = deadline_type === 'internal' ? project.internal_deadline : project.client_deadline
  const other_internal = deadline_type === 'internal' ? new_date : (project.internal_deadline ?? null)
  const other_client   = deadline_type === 'client'   ? new_date : (project.client_deadline   ?? null)

  if (other_internal && other_client) {
    const internalTime = new Date(other_internal).getTime()
    const clientTime = new Date(other_client).getTime()
    if (!isNaN(internalTime) && !isNaN(clientTime) && internalTime > clientTime) {
      throw new Error('Internal deadline cannot be later than the client deadline')
    }
  }

  const updatePayload = deadline_type === 'internal'
    ? { internal_deadline: new_date }
    : { client_deadline: new_date }

  const { error: updateError } = await supabase
    .from('projects')
    .update(updatePayload)
    .eq('id', projectId)

  if (updateError) throw new Error(updateError.message)

  const { error: extError } = await supabase
    .from('deadline_extensions')
    .insert({
      project_id: projectId,
      deadline_type,
      old_date: old_date ?? null,
      new_date,
      reason: reason ?? null,
      extended_by: user.id,
    })

  if (extError) throw new Error(extError.message)

  await logActivity({
    actor_id: user.id,
    actor_role: 'admin',
    action: 'deadline_extended',
    project_id: projectId,
    entity_type: 'project',
    entity_id: projectId,
    metadata: { deadline_type, old_date: old_date ?? null, new_date },
  })

  try {
    const { data: assignments, error: assignmentsError } = await supabase.from('project_assignments').select('user_id').eq('project_id', projectId)
    if (assignmentsError) throw new Error(assignmentsError.message)

    await notifyUsers((assignments ?? []).map(a => a.user_id), {
      actorId: user.id,
      type: 'status_update',
      title: 'Deadline extended',
      body: `The ${deadline_type} deadline moved to ${new Date(new_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.`,
      link: `/team/projects/${projectId}`,
      projectId,
      entityType: 'project',
      entityId: projectId,
    })
    await notifyUser(user.id, {
      actorId: user.id,
      type: 'status_update',
      title: 'Deadline extended',
      body: `You moved the ${deadline_type} deadline to ${new Date(new_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.`,
      link: `/admin/projects/${projectId}`,
      projectId,
      entityType: 'project',
      entityId: projectId,
    })
  } catch (notifyErr) {
    console.error('Deadline extension notification failed (deadline still extended):', notifyErr)
  }

  revalidatePath(`/admin/projects/${projectId}`)
}
