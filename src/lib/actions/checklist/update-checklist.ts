'use server'

import { createServerClient } from '@/lib/supabase/server'
import { logActivity } from '@/lib/actions/activity'
import { revalidatePath } from 'next/cache'

export async function toggleChecklistItem(itemId: string, projectId: string, checked: boolean) {
  const user = await (await import('@/lib/auth/require-role')).requireClient()
  const supabase = await createServerClient()

  const { error } = await supabase.from('asset_checklist').update({
    is_completed: checked,
    completed_by: checked ? user.id : null,
    completed_at: checked ? new Date().toISOString() : null,
  }).eq('id', itemId)

  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: user.id,
    actor_role: 'client',
    action: checked ? 'checklist.checked' : 'checklist.unchecked',
    project_id: projectId,
    entity_type: 'checklist_item',
    entity_id: itemId,
  })

  revalidatePath(`/portal/projects/${projectId}`)
  revalidatePath(`/admin/projects/${projectId}`)
}
