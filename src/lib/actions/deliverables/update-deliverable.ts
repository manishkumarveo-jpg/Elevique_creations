'use server'

import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { logActivity } from '@/lib/actions/activity'
import { revalidatePath } from 'next/cache'

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
  const user = await (await import('@/lib/auth/require-role')).requireAdmin()
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

  revalidatePath(`/admin/projects/${parsed.project_id}`)
  revalidatePath(`/portal/projects/${parsed.project_id}`)
}

export async function markDelivered(deliverableId: string, projectId: string) {
  const user = await (await import('@/lib/auth/require-role')).requireAdmin()
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

  revalidatePath(`/admin/projects/${projectId}`)
  revalidatePath(`/portal/projects/${projectId}`)
}

export async function approveDeliverable(deliverableId: string, projectId: string) {
  const user = await (await import('@/lib/auth/require-role')).requireClient()
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

  revalidatePath(`/portal/projects/${projectId}`)
  revalidatePath(`/admin/projects/${projectId}`)
}

export async function requestRevision(deliverableId: string, projectId: string, note: string) {
  const user = await (await import('@/lib/auth/require-role')).requireClient()
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

  revalidatePath(`/portal/projects/${projectId}`)
  revalidatePath(`/admin/projects/${projectId}`)
}
