'use server'

import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { requireAdmin, requireTeamMember } from '@/lib/auth/require-role'
import { logActivity } from '@/lib/actions/activity'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/lib/types/database'

type MilestoneUpdate = Database['public']['Tables']['milestones']['Update']

const UpdateMilestoneSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'done']),
  notes: z.string().optional(),
  scheduled_date: z.string().nullable().optional(),
})

async function applyMilestoneUpdate(milestoneId: string, projectId: string, input: unknown, actorId: string, actorRole: 'admin' | 'team_member') {
  const parsed = UpdateMilestoneSchema.parse(input)
  const supabase = await createServerClient()

  const update: MilestoneUpdate = {
    ...parsed,
    updated_by: actorId,
    ...(parsed.status === 'done' ? { completed_date: new Date().toISOString().split('T')[0] } : {}),
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
