'use server'

import { createServerClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/require-role'
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
  revalidatePath(`/admin/projects/${projectId}`)
}
