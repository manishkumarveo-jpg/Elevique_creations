'use server'

import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { requireAnyAuth } from '@/lib/auth/require-role'
import { logActivity } from '@/lib/actions/activity'
import { revalidatePath } from 'next/cache'

const AddFileLinkSchema = z.object({
  folder_id: z.string().uuid(),
  project_id: z.string().uuid(),
  file_name: z.string().min(1).max(300),
  file_url: z.string().url(),
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

  revalidatePath(`/admin/projects/${parsed.project_id}`)
  revalidatePath(`/team/projects/${parsed.project_id}`)
  revalidatePath(`/portal/projects/${parsed.project_id}`)
  return { success: true }
}
