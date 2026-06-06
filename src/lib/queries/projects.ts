import { createServerClient } from '@/lib/supabase/server'

export async function getProjectsForAdmin() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*, client:profiles!projects_client_id_fkey(id, full_name, email, company_name)')
    .eq('is_archived', false)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export type ProjectWithTeam = {
  id: string
  name: string
  status: 'briefing' | 'in_progress' | 'final_review' | 'completed' | 'paused'
  package: string | null
  deadline: string | null
  created_at: string
  client: { id: string; full_name: string; company_name: string | null } | null
  team: { id: string; full_name: string }[]
  milestone_total: number
  milestone_done: number
}

export async function getProjectsWithTeam(): Promise<ProjectWithTeam[]> {
  const supabase = await createServerClient()

  const [projectsRes, assignmentsRes, milestonesRes] = await Promise.all([
    supabase
      .from('projects')
      .select('id, name, status, package, deadline, created_at, client_id')
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

  // Collect all unique user ids (clients + team members)
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
      deadline: p.deadline,
      created_at: p.created_at,
      client: clientProfile
        ? { id: p.client_id, full_name: clientProfile.full_name, company_name: clientProfile.company_name ?? null }
        : null,
      team: teamUserIds.map(id => profileMap.get(id)).filter(Boolean).map(m => ({ id: m!.id, full_name: m!.full_name })),
      milestone_total: projectMilestones.length,
      milestone_done: projectMilestones.filter(m => m.status === 'done').length,
    }
  })
}

export async function getProjectsForTeam(userId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*, client:profiles!projects_client_id_fkey(id, full_name, email)')
    .eq('is_archived', false)
    .in('id', (
      await supabase
        .from('project_assignments')
        .select('project_id')
        .eq('user_id', userId)
    ).data?.map(a => a.project_id) ?? [])
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getProjectsForClient(userId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', userId)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getProjectById(id: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*, client:profiles!projects_client_id_fkey(id, full_name, email, company_name)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}
