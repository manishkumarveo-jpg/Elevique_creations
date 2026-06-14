'use server'

import { requireAdmin } from '@/lib/auth/require-role'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function assignUser(projectId: string, userId: string) {
  const user = await requireAdmin()
  const supabase = await createServerClient()

  const { error } = await supabase.from('project_assignments').insert({
    project_id: projectId,
    user_id: userId,
    assigned_by: user.id,
  })

  if (error) {
    if (error.code === '23505') return { success: true }
    throw new Error(error.message)
  }

  revalidatePath(`/admin/projects/${projectId}`)
}

export async function removeAssignment(assignmentId: string, projectId: string) {
  await requireAdmin()
  const supabase = await createServerClient()

  const { error } = await supabase.from('project_assignments').delete().eq('id', assignmentId)
  if (error) throw new Error(error.message)

  revalidatePath(`/admin/projects/${projectId}`)
}
