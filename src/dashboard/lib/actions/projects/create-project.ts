'use server'

import { z } from 'zod'
import { requireAdmin } from '@/dashboard/lib/auth/require-role'
import { createServerClient } from '@/shared/lib/supabase/server'
import { logActivity } from '@/dashboard/lib/actions/activity'
import { notifyUser, notifyUsers } from '@/dashboard/lib/actions/notifications/notify'
import { revalidatePath } from 'next/cache'

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(200),
  client_id: z.string().uuid(),
  team_member_ids: z.array(z.string().uuid()).optional().default([]),
  package: z.string().optional(),
  internal_deadline: z.string().optional(),
  client_deadline: z.string().optional(),
  description: z.string().optional(),
}).refine(
  data => {
    if (data.internal_deadline && data.client_deadline) {
      const internalTime = new Date(data.internal_deadline).getTime()
      const clientTime = new Date(data.client_deadline).getTime()
      if (isNaN(internalTime) || isNaN(clientTime)) return true
      return internalTime <= clientTime
    }
    return true
  },
  { message: 'Internal deadline must be on or before the client deadline', path: ['internal_deadline'] }
)

export async function createProject(input: unknown) {
  const user = await requireAdmin()
  const { team_member_ids, ...projectData } = CreateProjectSchema.parse(input)

  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('projects')
    .insert({ ...projectData, created_by: user.id })
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Assign team members immediately if provided
  if (team_member_ids.length > 0) {
    const { error: assignmentError } = await supabase.from('project_assignments').insert(
      team_member_ids.map(userId => ({
        project_id: data.id,
        user_id: userId,
        assigned_by: user.id,
      }))
    )
    if (assignmentError) throw new Error(assignmentError.message)
  }

  await logActivity({
    actor_id: user.id,
    actor_role: 'admin',
    action: 'project.created',
    project_id: data.id,
    entity_type: 'project',
    entity_id: data.id,
    entity_name: data.name,
    metadata: { team_member_count: team_member_ids.length },
  })

  if (team_member_ids.length > 0) {
    try {
      await notifyUsers(team_member_ids, {
        actorId: user.id,
        type: 'assignment',
        title: 'New project assignment',
        body: `You've been assigned to ${data.name}.`,
        link: `/team/projects/${data.id}`,
        projectId: data.id,
        entityType: 'project',
        entityId: data.id,
      })
    } catch (notifyErr) {
      console.error('Project assignment notification failed (project still created):', notifyErr)
    }
  }

  try {
    await notifyUser(user.id, {
      actorId: user.id,
      type: 'assignment',
      title: 'Project created',
      body: team_member_ids.length > 0
        ? `You created ${data.name} and assigned ${team_member_ids.length} team member${team_member_ids.length === 1 ? '' : 's'}.`
        : `You created ${data.name}.`,
      link: `/admin/projects/${data.id}`,
      projectId: data.id,
      entityType: 'project',
      entityId: data.id,
    })
  } catch (notifyErr) {
    console.error('Project creation self-notification failed (project still created):', notifyErr)
  }

  revalidatePath('/admin/projects')
  return { success: true, id: data.id }
}
