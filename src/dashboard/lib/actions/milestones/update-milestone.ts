'use server'

import { z } from 'zod'
import { createServerClient } from '@/shared/lib/supabase/server'
import { requireAdmin, requireTeamMember } from '@/dashboard/lib/auth/require-role'
import { logActivity } from '@/dashboard/lib/actions/activity'
import { notifyUser, notifyUsers, notifyAdmins } from '@/dashboard/lib/actions/notifications/notify'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/shared/lib/types/database'

type MilestoneUpdate = Database['public']['Tables']['milestones']['Update']

const UpdateMilestoneSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'done']),
  notes: z.string().optional(),
  scheduled_date: z.string().nullable().optional(),
})

async function applyMilestoneUpdate(milestoneId: string, projectId: string, input: unknown, actorId: string, actorRole: 'admin' | 'team_member') {
  const parsed = UpdateMilestoneSchema.parse(input)
  const supabase = await createServerClient()

  const { data: current, error: currentError } = await supabase
    .from('milestones')
    .select('phase_number, phase_name, status')
    .eq('id', milestoneId)
    .single()
  if (currentError) throw new Error(currentError.message)

  if (parsed.status === 'done') {
    const { data: priorPhases, error: priorError } = await supabase
      .from('milestones')
      .select('status')
      .eq('project_id', projectId)
      .lt('phase_number', current.phase_number)
    if (priorError) throw new Error(priorError.message)

    if ((priorPhases ?? []).some(m => m.status !== 'done')) {
      throw new Error('Complete earlier phases before marking this one as done.')
    }
  }

  const update: MilestoneUpdate = {
    ...parsed,
    updated_by: actorId,
    completed_date: parsed.status === 'done' ? new Date().toISOString().split('T')[0] : null,
  }

  const { error } = await supabase.from('milestones').update(update).eq('id', milestoneId)
  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: actorId,
    actor_role: actorRole,
    action: 'milestone.updated',
    project_id: projectId,
    entity_type: 'milestone',
    entity_id: milestoneId,
  })

  if (parsed.status !== current.status) {
    try {
      const { data: assignments } = await supabase
        .from('project_assignments')
        .select('user_id')
        .eq('project_id', projectId)

      await notifyUsers((assignments ?? []).map(a => a.user_id), {
        actorId,
        type: 'status_update',
        title: 'Milestone updated',
        body: `${current.phase_name} is now ${parsed.status.replace('_', ' ')}.`,
        link: `/team/projects/${projectId}`,
        projectId,
        entityType: 'milestone',
        entityId: milestoneId,
      })

      if (actorRole === 'admin') {
        await notifyUser(actorId, {
          actorId,
          type: 'status_update',
          title: 'Milestone updated',
          body: `You marked ${current.phase_name} as ${parsed.status.replace('_', ' ')}.`,
          link: `/admin/projects/${projectId}`,
          projectId,
          entityType: 'milestone',
          entityId: milestoneId,
        })
      } else {
        await notifyAdmins({
          actorId,
          type: 'status_update',
          title: 'Milestone updated by team',
          body: `${current.phase_name} is now ${parsed.status.replace('_', ' ')}.`,
          link: `/admin/projects/${projectId}`,
          projectId,
          entityType: 'milestone',
          entityId: milestoneId,
        })
      }
    } catch (notifyErr) {
      console.error('Milestone notification failed (milestone still updated):', notifyErr)
    }
  }

  revalidatePath(`/admin/projects/${projectId}`)
  revalidatePath(`/team/projects/${projectId}`)
}

export async function updateMilestoneStatus(milestoneId: string, projectId: string, input: unknown) {
  const user = await requireAdmin()
  await applyMilestoneUpdate(milestoneId, projectId, input, user.id, 'admin')
}

export async function updateMilestoneStatusTeam(milestoneId: string, projectId: string, input: unknown) {
  const user = await requireTeamMember()
  await applyMilestoneUpdate(milestoneId, projectId, input, user.id, 'team_member')
}
