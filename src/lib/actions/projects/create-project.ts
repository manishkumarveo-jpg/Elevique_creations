'use server'

import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/require-role'
import { createServerClient } from '@/lib/supabase/server'
import { logActivity } from '@/lib/actions/activity'
import { revalidatePath } from 'next/cache'

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(200),
  client_id: z.string().uuid(),
  team_member_ids: z.array(z.string().uuid()).optional().default([]),
  package: z.string().optional(),
  internal_deadline: z.string().optional(),
  client_deadline: z.string().optional(),
  description: z.string().optional(),
}).refine(
  data => {
    if (data.internal_deadline && data.client_deadline) {
      return data.internal_deadline <= data.client_deadline
    }
    return true
  },
  { message: 'Internal deadline must be on or before the client deadline', path: ['internal_deadline'] }
)

export async function createProject(input: unknown) {
  const user = await requireAdmin()
  const { team_member_ids, ...projectData } = CreateProjectSchema.parse(input)

  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('projects')
    .insert({ ...projectData, created_by: user.id })
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Assign team members immediately if provided
  if (team_member_ids.length > 0) {
    await supabase.from('project_assignments').insert(
      team_member_ids.map(userId => ({
        project_id: data.id,
        user_id: userId,
        assigned_by: user.id,
      }))
    )
  }

  await logActivity({
    actor_id: user.id,
    actor_role: 'admin',
    action: 'project.created',
    project_id: data.id,
    entity_type: 'project',
    entity_id: data.id,
    entity_name: data.name,
    metadata: { team_member_count: team_member_ids.length },
  })

  revalidatePath('/admin/projects')
  return { success: true, id: data.id }
}
