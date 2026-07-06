'use server'

import { z } from 'zod'
import { requireAdmin } from '@/dashboard/lib/auth/require-role'
import { createServerClient } from '@/shared/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  package: z.string().optional(),
  internal_deadline: z.string().nullable().optional(),
  client_deadline: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  status: z.enum(['briefing', 'in_progress', 'final_review', 'completed', 'paused']).optional(),
}).refine(
  data => {
    if (data.internal_deadline && data.client_deadline) {
      const internalTime = new Date(data.internal_deadline).getTime()
      const clientTime = new Date(data.client_deadline).getTime()
      if (isNaN(internalTime) || isNaN(clientTime)) return true
      return internalTime <= clientTime
    }
    return true
  },
  { message: 'Internal deadline must be on or before the client deadline', path: ['internal_deadline'] }
)

export async function updateProject(id: string, input: unknown) {
  await requireAdmin()
  const parsed = UpdateProjectSchema.parse(input)
  const supabase = await createServerClient()

  const update: typeof parsed & { work_started_date?: string } = { ...parsed }
  if (parsed.status === 'in_progress') {
    const { data: current, error: fetchError } = await supabase.from('projects').select('work_started_date').eq('id', id).single()
    if (fetchError || !current) throw new Error('Project not found: ' + (fetchError?.message ?? id))
    if (!current.work_started_date) {
      update.work_started_date = new Date().toISOString().split('T')[0]
    }
  }

  const { error } = await supabase.from('projects').update(update).eq('id', id)
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
