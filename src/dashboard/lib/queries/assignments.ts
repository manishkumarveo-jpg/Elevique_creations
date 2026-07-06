import { cache } from 'react'
import { createServerClient } from '@/shared/lib/supabase/server'
import type { Database } from '@/shared/lib/types/database'

type AssignmentRow = Database['public']['Tables']['project_assignments']['Row']

export type AssignmentWithUser = AssignmentRow & {
  user?: { id: string; full_name: string; email: string; role: string } | null
}

export const getAssignmentsForProject = cache(async (projectId: string): Promise<AssignmentWithUser[]> => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('project_assignments')
    .select('*, user:profiles!project_assignments_user_id_fkey(id, full_name, email, role)')
    .eq('project_id', projectId)
    .order('assigned_at')
  if (error) throw error
  return data as unknown as AssignmentWithUser[]
})
