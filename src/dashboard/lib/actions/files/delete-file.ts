'use server'

import { createServerClient } from '@/shared/lib/supabase/server'
import { requireAdmin } from '@/dashboard/lib/auth/require-role'
import { logActivity } from '@/dashboard/lib/actions/activity'
import { notifyUser, notifyUsers } from '@/dashboard/lib/actions/notifications/notify'
import { revalidatePath } from 'next/cache'

export async function softDeleteFile(fileId: string, projectId: string) {
  const user = await requireAdmin()
  const supabase = await createServerClient()

  const { data: file, error } = await supabase.from('files').update({
    is_deleted: true,
    deleted_by: user.id,
    deleted_at: new Date().toISOString(),
  }).eq('id', fileId).select('file_name').single()

  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: user.id,
    actor_role: 'admin',
    action: 'file.deleted',
    project_id: projectId,
    entity_type: 'file',
    entity_id: fileId,
  })

  try {
    const { data: assignments } = await supabase.from('project_assignments').select('user_id').eq('project_id', projectId)
    await notifyUsers((assignments ?? []).map(a => a.user_id), {
      actorId: user.id,
      type: 'status_update',
      title: 'File removed',
      body: `${file.file_name} was removed from the project.`,
      link: `/team/projects/${projectId}`,
      projectId,
      entityType: 'file',
      entityId: fileId,
    })
    await notifyUser(user.id, {
      actorId: user.id,
      type: 'status_update',
      title: 'File removed',
      body: `You removed ${file.file_name} from the project.`,
      link: `/admin/projects/${projectId}`,
      projectId,
      entityType: 'file',
      entityId: fileId,
    })
  } catch (notifyErr) {
    console.error('File notification failed (file still deleted):', notifyErr)
  }

  revalidatePath(`/admin/projects/${projectId}`)
}
