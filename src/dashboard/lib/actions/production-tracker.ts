'use server'

import { z } from 'zod'
import { createServerClient } from '@/shared/lib/supabase/server'
import { requireAdmin } from '@/dashboard/lib/auth/require-role'
import { logActivity } from '@/dashboard/lib/actions/activity'
import { notifyUser, notifyUsers } from '@/dashboard/lib/actions/notifications/notify'
import { revalidatePath } from 'next/cache'

const UpdateProductionDeliverableSchema = z.object({
  comments: z.string().optional(),
  priority: z.enum(['P1', 'P2', 'P3']).optional(),
  delivery_date: z.string().nullable().optional(),
  status: z.enum(['pending', 'in_progress', 'revision_pending', 'completed', 'paused']).optional(),
})

export async function updateProductionDeliverable(deliverableId: string, projectId: string, input: unknown) {
  const user = await requireAdmin()
  const parsed = UpdateProductionDeliverableSchema.parse(input)
  const supabase = await createServerClient()

  const { data: deliverable, error } = await supabase
    .from('production_deliverables')
    .update(parsed)
    .eq('id', deliverableId)
    .select('brand_name')
    .single()
  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: user.id,
    actor_role: 'admin',
    action: 'production_deliverable.updated',
    project_id: projectId,
    entity_type: 'production_deliverable',
    entity_id: deliverableId,
  })

  if (parsed.status) {
    try {
      const { data: assignees } = await supabase
        .from('production_deliverable_assignees')
        .select('user_id')
        .eq('deliverable_id', deliverableId)

      await notifyUsers((assignees ?? []).map(a => a.user_id), {
        actorId: user.id,
        type: 'status_update',
        title: 'Production deliverable updated',
        body: `${deliverable.brand_name} is now ${parsed.status.replace('_', ' ')}.`,
        link: `/team/work`,
        projectId,
        entityType: 'production_deliverable',
        entityId: deliverableId,
      })
      await notifyUser(user.id, {
        actorId: user.id,
        type: 'status_update',
        title: 'Production deliverable updated',
        body: `You updated ${deliverable.brand_name} to ${parsed.status.replace('_', ' ')}.`,
        link: `/admin/production-tracker`,
        projectId,
        entityType: 'production_deliverable',
        entityId: deliverableId,
      })
    } catch (notifyErr) {
      console.error('Production deliverable notification failed (deliverable still updated):', notifyErr)
    }
  }

  revalidatePath('/admin/production-tracker')
}
