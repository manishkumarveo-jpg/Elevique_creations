'use server'

import { z } from 'zod'
import { createServerClient } from '@/shared/lib/supabase/server'
import { logActivity } from '@/dashboard/lib/actions/activity'
import { notifyUser, notifyUsers, notifyAdmins } from '@/dashboard/lib/actions/notifications/notify'
import { revalidatePath } from 'next/cache'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/shared/lib/types/database'

async function notifyProjectTeamOfDeliverable(supabase: SupabaseClient<Database>, actorId: string, projectId: string, deliverableId: string, title: string, body: string, selfBody: string) {
  try {
    const { data: assignments } = await supabase.from('project_assignments').select('user_id').eq('project_id', projectId)
    await notifyUsers((assignments ?? []).map(a => a.user_id), {
      actorId,
      type: 'status_update',
      title,
      body,
      link: `/team/projects/${projectId}`,
      projectId,
      entityType: 'deliverable',
      entityId: deliverableId,
    })
    await notifyUser(actorId, {
      actorId,
      type: 'status_update',
      title,
      body: selfBody,
      link: `/admin/projects/${projectId}`,
      projectId,
      entityType: 'deliverable',
      entityId: deliverableId,
    })
  } catch (notifyErr) {
    console.error('Deliverable notification failed (deliverable still updated):', notifyErr)
  }
}

const AddDeliverableSchema = z.object({
  project_id: z.string().uuid(),
  deliverable_type: z.enum(['video', 'image']),
  file_name: z.string().min(1),
  duration: z.string().optional(),
  dimensions: z.string().optional(),
  resolution: z.string().optional(),
  format: z.string().optional(),
  drive_link: z.string().url().optional().or(z.literal('')),
})

export async function addDeliverable(input: unknown) {
  const user = await (await import('@/dashboard/lib/auth/require-role')).requireAdmin()
  const parsed = AddDeliverableSchema.parse(input)
  const supabase = await createServerClient()

  const { data, error } = await supabase.from('deliverables').insert(parsed).select().single()
  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: user.id,
    actor_role: 'admin',
    action: 'deliverable.added',
    project_id: parsed.project_id,
    entity_type: 'deliverable',
    entity_id: data.id,
    entity_name: parsed.file_name,
  })

  await notifyProjectTeamOfDeliverable(supabase, user.id, parsed.project_id, data.id, 'New deliverable added', `${parsed.file_name} was added.`, `You added ${parsed.file_name}.`)

  revalidatePath(`/admin/projects/${parsed.project_id}`)
  revalidatePath(`/portal/projects/${parsed.project_id}`)
}

export async function markDelivered(deliverableId: string, projectId: string) {
  const user = await (await import('@/dashboard/lib/auth/require-role')).requireAdmin()
  const supabase = await createServerClient()

  const { error } = await supabase.from('deliverables').update({
    status: 'delivered',
    delivered_on: new Date().toISOString().split('T')[0],
    revision_note: null,
  }).eq('id', deliverableId)

  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: user.id,
    actor_role: 'admin',
    action: 'deliverable.delivered',
    project_id: projectId,
    entity_type: 'deliverable',
    entity_id: deliverableId,
  })

  await notifyProjectTeamOfDeliverable(supabase, user.id, projectId, deliverableId, 'Deliverable delivered', 'A deliverable was marked delivered for client review.', 'You marked a deliverable delivered for client review.')

  revalidatePath(`/admin/projects/${projectId}`)
  revalidatePath(`/portal/projects/${projectId}`)
}

export async function addDeliverableTeam(input: unknown) {
  const user = await (await import('@/dashboard/lib/auth/require-role')).requireTeamMember()
  const parsed = AddDeliverableSchema.parse(input)
  const supabase = await createServerClient()

  const { data: assignment } = await supabase
    .from('project_assignments')
    .select('project_id')
    .eq('project_id', parsed.project_id)
    .eq('user_id', user.id)
    .maybeSingle()
  if (!assignment) throw new Error('You are not assigned to this project')

  const { data, error } = await supabase.from('deliverables').insert(parsed).select().single()
  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: user.id,
    actor_role: 'team_member',
    action: 'deliverable.added',
    project_id: parsed.project_id,
    entity_type: 'deliverable',
    entity_id: data.id,
    entity_name: parsed.file_name,
  })

  try {
    await notifyAdmins({
      actorId: user.id,
      type: 'status_update',
      title: 'Team added a deliverable',
      body: `${parsed.file_name} was added by a team member.`,
      link: `/admin/projects/${parsed.project_id}`,
      projectId: parsed.project_id,
      entityType: 'deliverable',
      entityId: data.id,
    })
    await notifyUser(user.id, {
      actorId: user.id,
      type: 'status_update',
      title: 'Deliverable added',
      body: `You added ${parsed.file_name}.`,
      link: `/team/projects/${parsed.project_id}`,
      projectId: parsed.project_id,
      entityType: 'deliverable',
      entityId: data.id,
    })
  } catch (notifyErr) {
    console.error('Deliverable notification failed (deliverable still added):', notifyErr)
  }

  revalidatePath(`/team/projects/${parsed.project_id}`)
  revalidatePath(`/admin/projects/${parsed.project_id}`)
  revalidatePath(`/portal/projects/${parsed.project_id}`)
}

export async function markDeliveredTeam(deliverableId: string, projectId: string) {
  const user = await (await import('@/dashboard/lib/auth/require-role')).requireTeamMember()
  const supabase = await createServerClient()

  const { data: assignment } = await supabase
    .from('project_assignments')
    .select('project_id')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .maybeSingle()
  if (!assignment) throw new Error('You are not assigned to this project')

  const { error } = await supabase.from('deliverables').update({
    status: 'delivered',
    delivered_on: new Date().toISOString().split('T')[0],
    revision_note: null,
  }).eq('id', deliverableId)

  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: user.id,
    actor_role: 'team_member',
    action: 'deliverable.delivered',
    project_id: projectId,
    entity_type: 'deliverable',
    entity_id: deliverableId,
  })

  try {
    await notifyAdmins({
      actorId: user.id,
      type: 'status_update',
      title: 'Team marked a deliverable delivered',
      body: 'A team member marked a deliverable delivered for client review.',
      link: `/admin/projects/${projectId}`,
      projectId,
      entityType: 'deliverable',
      entityId: deliverableId,
    })
    await notifyUser(user.id, {
      actorId: user.id,
      type: 'status_update',
      title: 'Deliverable marked delivered',
      body: 'You marked a deliverable delivered for client review.',
      link: `/team/projects/${projectId}`,
      projectId,
      entityType: 'deliverable',
      entityId: deliverableId,
    })
  } catch (notifyErr) {
    console.error('Deliverable notification failed (deliverable still updated):', notifyErr)
  }

  revalidatePath(`/team/projects/${projectId}`)
  revalidatePath(`/admin/projects/${projectId}`)
  revalidatePath(`/portal/projects/${projectId}`)
}

export async function approveDeliverable(deliverableId: string, projectId: string) {
  const user = await (await import('@/dashboard/lib/auth/require-role')).requireClient()
  const supabase = await createServerClient()

  const { error } = await supabase.from('deliverables').update({
    status: 'approved',
    approved_by: user.id,
    approved_at: new Date().toISOString(),
    revision_note: null,
  }).eq('id', deliverableId)

  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: user.id,
    actor_role: 'client',
    action: 'deliverable.approved',
    project_id: projectId,
    entity_type: 'deliverable',
    entity_id: deliverableId,
  })

  try {
    await notifyAdmins({
      actorId: user.id,
      type: 'status_update',
      title: 'Client approved a deliverable',
      body: 'A client approved a deliverable.',
      link: `/admin/projects/${projectId}`,
      projectId,
      entityType: 'deliverable',
      entityId: deliverableId,
    })
  } catch (notifyErr) {
    console.error('Deliverable notification failed (deliverable still approved):', notifyErr)
  }

  revalidatePath(`/portal/projects/${projectId}`)
  revalidatePath(`/admin/projects/${projectId}`)
}

export async function requestRevision(deliverableId: string, projectId: string, note: string) {
  const user = await (await import('@/dashboard/lib/auth/require-role')).requireClient()
  const supabase = await createServerClient()

  const trimmedNote = note.trim()
  if (!trimmedNote) throw new Error('Please describe what needs to change.')

  const { error } = await supabase.from('deliverables').update({
    status: 'shared',
    revision_note: trimmedNote,
  }).eq('id', deliverableId)

  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: user.id,
    actor_role: 'client',
    action: 'deliverable.revision_requested',
    project_id: projectId,
    entity_type: 'deliverable',
    entity_id: deliverableId,
    metadata: { note: trimmedNote },
  })

  try {
    await notifyAdmins({
      actorId: user.id,
      type: 'status_update',
      title: 'Client requested a deliverable revision',
      body: trimmedNote,
      link: `/admin/projects/${projectId}`,
      projectId,
      entityType: 'deliverable',
      entityId: deliverableId,
    })
  } catch (notifyErr) {
    console.error('Deliverable notification failed (revision still requested):', notifyErr)
  }

  revalidatePath(`/portal/projects/${projectId}`)
  revalidatePath(`/admin/projects/${projectId}`)
}
