'use server'

import { z } from 'zod'
import { createServerClient } from '@/shared/lib/supabase/server'
import { requireAdmin, requireTeamMember } from '@/dashboard/lib/auth/require-role'
import { logActivity } from '@/dashboard/lib/actions/activity'
import { notifyUser } from '@/dashboard/lib/actions/notifications/notify'
import { revalidatePath } from 'next/cache'

const VideoTaskStatusSchema = z.enum(['pending', 'in_progress', 'revision_pending', 'completed', 'paused'])

async function applyStatusUpdate(taskId: string, projectId: string, status: unknown, actorId: string, actorRole: 'admin' | 'team_member') {
  const parsedStatus = VideoTaskStatusSchema.parse(status)
  const supabase = await createServerClient()

  const { data: task, error } = await supabase
    .from('video_generation_tasks')
    .update({
      status: parsedStatus,
      completed_at: parsedStatus === 'completed' ? new Date().toISOString() : null,
    })
    .eq('id', taskId)
    .eq('project_id', projectId)
    .select('brand_name, script_number, assigned_to_id')
    .single()
  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: actorId,
    actor_role: actorRole,
    action: 'video_generation_task.status_updated',
    project_id: projectId,
    entity_type: 'video_generation_task',
    entity_id: taskId,
    metadata: { status: parsedStatus },
  })

  if (task.assigned_to_id) {
    try {
      await notifyUser(task.assigned_to_id, {
        actorId,
        type: 'status_update',
        title: 'Video task updated',
        body: `${task.brand_name} script #${task.script_number} is now ${parsedStatus.replace('_', ' ')}.`,
        link: '/team/video-tracker',
        projectId,
        entityType: 'video_generation_task',
        entityId: taskId,
      })
    } catch (notifyErr) {
      console.error('Video task notification failed (status still updated):', notifyErr)
    }
  }

  revalidatePath('/admin/video-tracker')
  revalidatePath('/team/video-tracker')
}

export async function updateVideoTaskStatus(taskId: string, projectId: string, status: unknown) {
  const user = await requireAdmin()
  await applyStatusUpdate(taskId, projectId, status, user.id, 'admin')
}

export async function updateVideoTaskStatusTeam(taskId: string, projectId: string, status: unknown) {
  const user = await requireTeamMember()
  await applyStatusUpdate(taskId, projectId, status, user.id, 'team_member')
}

export async function toggleVideoTaskCheck(taskId: string, projectId: string, checkLabel: string, checked: boolean) {
  const user = await requireTeamMember()
  const supabase = await createServerClient()

  const { data: task, error: fetchError } = await supabase
    .from('video_generation_tasks')
    .select('checks_performed')
    .eq('id', taskId)
    .eq('project_id', projectId)
    .single()
  if (fetchError) throw new Error(fetchError.message)

  const current = new Set(task.checks_performed)
  if (checked) current.add(checkLabel)
  else current.delete(checkLabel)

  const { error } = await supabase
    .from('video_generation_tasks')
    .update({ checks_performed: Array.from(current) })
    .eq('id', taskId)
    .eq('project_id', projectId)
  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: user.id,
    actor_role: 'team_member',
    action: checked ? 'video_generation_task.check_completed' : 'video_generation_task.check_unchecked',
    project_id: projectId,
    entity_type: 'video_generation_task',
    entity_id: taskId,
    metadata: { check: checkLabel },
  })

  revalidatePath('/team/video-tracker')
  revalidatePath('/admin/video-tracker')
}
