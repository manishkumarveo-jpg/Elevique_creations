import { cache } from 'react'
import { createServerClient } from '@/lib/supabase/server'

export const getMilestonesForProject = cache(async (projectId: string) => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('project_id', projectId)
    .order('phase_number')
  if (error) throw error
  return data
})

export type MilestoneWithDetails = {
  id: string
  project_id: string
  phase_number: number
  phase_name: string
  status: 'pending' | 'in_progress' | 'done'
  scheduled_date: string | null
  completed_date: string | null
  notes: string | null
  updated_by: string | null
  project: { id: string; name: string } | null
  updater: { id: string; full_name: string } | null
}

// Admin: every milestone across every project, with project name + who last updated it
export const getAllMilestonesWithDetails = cache(async (): Promise<MilestoneWithDetails[]> => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('milestones')
    .select(`
      id, project_id, phase_number, phase_name, status, scheduled_date, completed_date, notes, updated_by,
      project:projects!milestones_project_id_fkey(id, name),
      updater:profiles!milestones_updated_by_fkey(id, full_name)
    `)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data as unknown as MilestoneWithDetails[]
})
