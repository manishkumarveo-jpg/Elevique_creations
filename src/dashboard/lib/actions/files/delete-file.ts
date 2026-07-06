'use server'

import { createServerClient } from '@/shared/lib/supabase/server'
import { requireAdmin } from '@/dashboard/lib/auth/require-role'
import { logActivity } from '@/dashboard/lib/actions/activity'
import { revalidatePath } from 'next/cache'

export async function softDeleteFile(fileId: string, projectId: string) {
  const user = await requireAdmin()
  const supabase = await createServerClient()

  const { error } = await supabase.from('files').update({
    is_deleted: true,
    deleted_by: user.id,
    deleted_at: new Date().toISOString(),
  }).eq('id', fileId)

  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: user.id,
    actor_role: 'admin',
    action: 'file.deleted',
    project_id: projectId,
    entity_type: 'file',
    entity_id: fileId,
  })

  revalidatePath(`/admin/projects/${projectId}`)
}
