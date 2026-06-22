import { cache } from 'react'
import { createServerClient } from '@/lib/supabase/server'

export const getProjectsForAdmin = cache(async () => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*, client:profiles!projects_client_id_fkey(id, full_name, email, company_name)')
    .eq('is_archived', false)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
})

export type ProjectWithTeam = {
  id: string
  name: string
  status: 'briefing' | 'in_progress' | 'final_review' | 'completed' | 'paused'
  package: string | null
  internal_deadline: string | null
  client_deadline: string | null
  created_at: string
  client: { id: string; full_name: string; company_name: string | null } | null
  team: { id: string; full_name: string }[]
  milestone_total: number
  milestone_done: number
}

export const getProjectsWithTeam = cache(async (): Promise<ProjectWithTeam[]> => {
  const supabase = await createServerClient()

  const [projectsRes, assignmentsRes, milestonesRes] = await Promise.all([
    supabase
      .from('projects')
      .select('id, name, status, package, internal_deadline, client_deadline, created_at, client_id')
      .eq('is_archived', false)
      .order('created_at', { ascending: false }),
    supabase
      .from('project_assignments')
      .select('project_id, user_id'),
    supabase
      .from('milestones')
      .select('project_id, status'),
  ])

  if (projectsRes.error) throw projectsRes.error

  const projects = projectsRes.data ?? []
  const assignments = assignmentsRes.data ?? []
  const milestones = milestonesRes.data ?? []

  const clientIds = [...new Set(projects.map(p => p.client_id))]
  const teamIds = [...new Set(assignments.map(a => a.user_id))]
  const allIds = [...new Set([...clientIds, ...teamIds])]

  const profilesRes = allIds.length > 0
    ? await supabase.from('profiles').select('id, full_name, company_name').in('id', allIds)
    : { data: [] }

  const profileMap = new Map((profilesRes.data ?? []).map(p => [p.id, p]))

  return projects.map(p => {
    const teamUserIds = assignments.filter(a => a.project_id === p.id).map(a => a.user_id)
    const projectMilestones = milestones.filter(m => m.project_id === p.id)
    const clientProfile = profileMap.get(p.client_id)
    return {
      id: p.id,
      name: p.name,
      status: p.status as ProjectWithTeam['status'],
      package: p.package,
      internal_deadline: p.internal_deadline,
      client_deadline: p.client_deadline,
      created_at: p.created_at,
      client: clientProfile
        ? { id: p.client_id, full_name: clientProfile.full_name, company_name: clientProfile.company_name ?? null }
        : null,
      team: teamUserIds.map(id => profileMap.get(id)).filter(Boolean).map(m => ({ id: m!.id, full_name: m!.full_name })),
      milestone_total: projectMilestones.length,
      milestone_done: projectMilestones.filter(m => m.status === 'done').length,
    }
  })
})

// Team members: explicit column selection excludes client_deadline
export const getProjectsForTeam = cache(async (userId: string) => {
  const supabase = await createServerClient()
  const assignedIds = (
    await supabase
      .from('project_assignments')
      .select('project_id')
      .eq('user_id', userId)
  ).data?.map(a => a.project_id) ?? []

  if (assignedIds.length === 0) return []

  const [{ data, error }, { data: milestones, error: milestonesError }] = await Promise.all([
    supabase
      .from('projects')
      .select('id, name, client_id, package, status, priority, internal_deadline, start_date, work_started_date, completion_date, progress_percent, description, client_note, created_by, is_archived, admin_approved, created_at, updated_at, client:profiles!projects_client_id_fkey(id, full_name, email, company_name)')
      .eq('is_archived', false)
      .in('id', assignedIds)
      .order('created_at', { ascending: false }),
    supabase
      .from('milestones')
      .select('project_id, status')
      .in('project_id', assignedIds),
  ])
  if (error) throw error
  if (milestonesError) throw milestonesError

  return (data ?? []).map(p => {
    const projectMilestones = (milestones ?? []).filter(m => m.project_id === p.id)
    return {
      ...p,
      milestone_total: projectMilestones.length,
      milestone_done: projectMilestones.filter(m => m.status === 'done').length,
    }
  })
})

// Clients: explicit column selection excludes internal_deadline
export const getProjectsForClient = cache(async (userId: string) => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, client_id, package, status, client_deadline, description, is_archived, admin_approved, created_at, updated_at')
    .eq('client_id', userId)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
})

// Admin: full project data with both deadlines
export const getProjectById = cache(async (id: string) => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*, client:profiles!projects_client_id_fkey(id, full_name, email, company_name), approver:profiles!projects_approved_by_admin_fkey(id, full_name)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
})

// Team member: project detail without client_deadline
export const getProjectByIdForTeam = cache(async (id: string) => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, client_id, package, status, description, internal_deadline, start_date, work_started_date, completion_date, client_note, created_by, is_archived, admin_approved, created_at, updated_at, client:profiles!projects_client_id_fkey(id, full_name, email, company_name), approver:profiles!projects_approved_by_admin_fkey(id, full_name)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
})

// Client: project detail without internal_deadline
export const getProjectByIdForClient = cache(async (id: string) => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, client_id, package, status, description, client_deadline, client_note, is_archived, admin_approved, created_at, updated_at')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
})

export type DeadlineExtension = {
  id: string
  project_id: string
  deadline_type: 'internal' | 'client'
  old_date: string | null
  new_date: string
  reason: string | null
  extended_by: string
  created_at: string
}

export const getDeadlineExtensions = cache(async (projectId: string): Promise<DeadlineExtension[]> => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('deadline_extensions')
    .select('id, project_id, deadline_type, old_date, new_date, reason, extended_by, created_at')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as DeadlineExtension[]
})
