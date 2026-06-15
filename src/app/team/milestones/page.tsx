import { createServerClient } from '@/lib/supabase/server'
import { getProjectsForTeam } from '@/lib/queries/projects'
import MilestonesView from './MilestonesView'

export default async function TeamMilestonesPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const projects = user ? await getProjectsForTeam(user.id) : []
  const activeProjects = projects.filter(p => p.status !== 'completed')

  const milestoneRes = activeProjects.length > 0
    ? await supabase
        .from('milestones')
        .select('id, project_id, phase_number, phase_name, status, scheduled_date, notes')
        .in('project_id', activeProjects.map(p => p.id))
        .order('phase_number', { ascending: true })
    : { data: [] }

  const msData = milestoneRes.data ?? []

  const groups = activeProjects
    .map(p => {
      const client = (p as { client?: { full_name?: string; company_name?: string } | null }).client ?? null
      return {
        projectId: p.id,
        projectName: p.name,
        clientName: client?.company_name ?? client?.full_name ?? null,
        status: p.status,
        milestones: msData.filter(m => m.project_id === p.id),
      }
    })
    .filter(g => g.milestones.length > 0)

  const totalMs    = msData.length
  const doneMs     = msData.filter(m => m.status === 'done').length
  const inProgMs   = msData.filter(m => m.status === 'in_progress').length
  const pendingMs  = totalMs - doneMs - inProgMs

  return (
    <MilestonesView
      groups={groups}
      stats={{ total: totalMs, done: doneMs, inProgress: inProgMs, pending: pendingMs }}
    />
  )
}
