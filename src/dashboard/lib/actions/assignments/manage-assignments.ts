'use server'

import { requireAdmin } from '@/dashboard/lib/auth/require-role'
import { createServerClient } from '@/shared/lib/supabase/server'
import { getProjectById } from '@/dashboard/lib/queries/projects'
import { notifyUser } from '@/dashboard/lib/actions/notifications/notify'
import { revalidatePath } from 'next/cache'

export async function assignUser(projectId: string, userId: string) {
  const user = await requireAdmin()
  const supabase = await createServerClient()

  const { error } = await supabase.from('project_assignments').insert({
    project_id: projectId,
    user_id: userId,
    assigned_by: user.id,
  })

  if (error) {
    if (error.code === '23505') return { success: true }
    throw new Error(error.message)
  }

  try {
    const project = await getProjectById(projectId)
    await notifyUser(userId, {
      actorId: user.id,
      type: 'assignment',
      title: 'New project assignment',
      body: `You've been assigned to ${project.name}.`,
      link: `/team/projects/${projectId}`,
      projectId,
      entityType: 'project',
      entityId: projectId,
    })
    await notifyUser(user.id, {
      actorId: user.id,
      type: 'assignment',
      title: 'Assignment confirmed',
      body: `You assigned a team member to ${project.name}.`,
      link: `/admin/projects/${projectId}`,
      projectId,
      entityType: 'project',
      entityId: projectId,
    })
  } catch (notifyErr) {
    console.error('Assignment notification failed (assignment still made):', notifyErr)
  }

  revalidatePath(`/admin/projects/${projectId}`)
}

export async function removeAssignment(assignmentId: string, projectId: string) {
  await requireAdmin()
  const supabase = await createServerClient()

  const { error } = await supabase.from('project_assignments').delete().eq('id', assignmentId)
  if (error) throw new Error(error.message)

  revalidatePath(`/admin/projects/${projectId}`)
}
