'use server'

import { createServerClient } from '@/shared/lib/supabase/server'
import { logActivity } from '@/dashboard/lib/actions/activity'
import { notifyAdmins } from '@/dashboard/lib/actions/notifications/notify'
import { revalidatePath } from 'next/cache'

export async function toggleChecklistItem(itemId: string, projectId: string, checked: boolean) {
  const user = await (await import('@/dashboard/lib/auth/require-role')).requireClient()
  const supabase = await createServerClient()

  const { data: item, error } = await supabase.from('asset_checklist').update({
    is_completed: checked,
    completed_by: checked ? user.id : null,
    completed_at: checked ? new Date().toISOString() : null,
  }).eq('id', itemId).select('item_label').single()

  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: user.id,
    actor_role: 'client',
    action: checked ? 'checklist.checked' : 'checklist.unchecked',
    project_id: projectId,
    entity_type: 'checklist_item',
    entity_id: itemId,
  })

  if (checked) {
    try {
      await notifyAdmins({
        actorId: user.id,
        type: 'status_update',
        title: 'Checklist item completed',
        body: `Client marked "${item.item_label}" done.`,
        link: `/admin/projects/${projectId}`,
        projectId,
        entityType: 'checklist_item',
        entityId: itemId,
      })
    } catch (notifyErr) {
      console.error('Checklist notification failed (checklist still updated):', notifyErr)
    }
  }

  revalidatePath(`/portal/projects/${projectId}`)
  revalidatePath(`/admin/projects/${projectId}`)
}
