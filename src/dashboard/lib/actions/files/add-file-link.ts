'use server'

import { z } from 'zod'
import { createServerClient } from '@/shared/lib/supabase/server'
import { requireAnyAuth } from '@/dashboard/lib/auth/require-role'
import { logActivity } from '@/dashboard/lib/actions/activity'
import { notifyUser, notifyUsers, notifyAdmins } from '@/dashboard/lib/actions/notifications/notify'
import { revalidatePath } from 'next/cache'

const AddFileLinkSchema = z.object({
  folder_id: z.string().uuid(),
  project_id: z.string().uuid(),
  file_name: z.string().min(1).max(300),
  file_url: z.string().url().refine((url) => /^https?:\/\//i.test(url), {
    message: 'File URL must use http or https',
  }),
  notes: z.string().optional(),
})

export async function addFileLink(input: unknown) {
  const user = await requireAnyAuth()
  const parsed = AddFileLinkSchema.parse(input)
  const supabase = await createServerClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const actorRole = profile?.role ?? 'client'
  const actorId = user.id

  const { data, error } = await supabase
    .from('files')
    .insert({ ...parsed, uploaded_by: actorId, file_type: 'link' })
    .select()
    .single()

  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: actorId,
    actor_role: actorRole,
    action: 'file.added',
    project_id: parsed.project_id,
    entity_type: 'file',
    entity_id: data.id,
    entity_name: parsed.file_name,
  })

  const notifyPayload = {
    actorId,
    type: 'status_update',
    title: 'New file added',
    body: `${parsed.file_name} was added to the project.`,
    projectId: parsed.project_id,
    entityType: 'file',
    entityId: data.id,
  }

  try {
    if (actorRole === 'admin') {
      const { data: assignments } = await supabase.from('project_assignments').select('user_id').eq('project_id', parsed.project_id)
      await notifyUsers((assignments ?? []).map(a => a.user_id), { ...notifyPayload, link: `/team/projects/${parsed.project_id}` })
    } else {
      await notifyAdmins({ ...notifyPayload, link: `/admin/projects/${parsed.project_id}` })
    }

    if (actorRole === 'admin' || actorRole === 'team_member') {
      await notifyUser(actorId, {
        ...notifyPayload,
        title: 'File added',
        body: `You added ${parsed.file_name}.`,
        link: actorRole === 'admin' ? `/admin/projects/${parsed.project_id}` : `/team/projects/${parsed.project_id}`,
      })
    }
  } catch (notifyErr) {
    console.error('File notification failed (file still added):', notifyErr)
  }

  revalidatePath(`/admin/projects/${parsed.project_id}`)
  revalidatePath(`/team/projects/${parsed.project_id}`)
  revalidatePath(`/portal/projects/${parsed.project_id}`)
  return { success: true }
}
