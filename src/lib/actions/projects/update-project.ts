'use server'

import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/require-role'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  package: z.string().optional(),
  deadline: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  status: z.enum(['briefing', 'in_progress', 'final_review', 'completed', 'paused']).optional(),
})

export async function updateProject(id: string, input: unknown) {
  await requireAdmin()
  const parsed = UpdateProjectSchema.parse(input)
  const supabase = await createServerClient()
  const { error } = await supabase.from('projects').update(parsed).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/projects/${id}`)
  revalidatePath('/admin/projects')
}

export async function archiveProject(id: string) {
  await requireAdmin()
  const supabase = await createServerClient()
  const { error } = await supabase.from('projects').update({ is_archived: true }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/projects')
}
