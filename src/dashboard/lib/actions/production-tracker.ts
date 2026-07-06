'use server'

import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/require-role'
import { logActivity } from '@/lib/actions/activity'
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

  const { error } = await supabase
    .from('production_deliverables')
    .update(parsed)
    .eq('id', deliverableId)
  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: user.id,
    actor_role: 'admin',
    action: 'production_deliverable.updated',
    project_id: projectId,
    entity_type: 'production_deliverable',
    entity_id: deliverableId,
  })

  revalidatePath('/admin/production-tracker')
}
