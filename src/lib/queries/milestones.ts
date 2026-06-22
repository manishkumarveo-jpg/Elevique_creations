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
  icon: string | null
  status: 'pending' | 'in_progress' | 'done'
  scheduled_date: string | null
  completed_date: string | null
  notes: string | null
  updated_by: string | null
  project: { id: string; name: string } | null
  assignees: { id: string; full_name: string }[]
}

// Admin: every milestone across every project, with project name + the project's assigned team
export const getAllMilestonesWithDetails = cache(async (): Promise<MilestoneWithDetails[]> => {
  const supabase = await createServerClient()
  const [{ data: milestones, error: milestonesError }, { data: assignments, error: assignmentsError }] = await Promise.all([
    supabase
      .from('milestones')
      .select(`
        id, project_id, phase_number, phase_name, icon, status, scheduled_date, completed_date, notes, updated_by,
        project:projects!milestones_project_id_fkey(id, name)
      `)
      .order('updated_at', { ascending: false }),
    supabase
      .from('project_assignments')
      .select('project_id, user:profiles!project_assignments_user_id_fkey(id, full_name)'),
  ])
  if (milestonesError) throw milestonesError
  if (assignmentsError) throw assignmentsError

  const assigneesByProject = new Map<string, { id: string; full_name: string }[]>()
  for (const a of assignments as unknown as Array<{ project_id: string; user: { id: string; full_name: string } | null }>) {
    if (!a.user) continue
    const list = assigneesByProject.get(a.project_id) ?? []
    list.push(a.user)
    assigneesByProject.set(a.project_id, list)
  }

  return (milestones as unknown as Omit<MilestoneWithDetails, 'assignees'>[]).map(m => ({
    ...m,
    assignees: assigneesByProject.get(m.project_id) ?? [],
  }))
})
