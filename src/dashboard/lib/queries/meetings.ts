import { createServerClient } from '@/shared/lib/supabase/server'

export type MeetingRow = {
  id: string
  title: string
  scheduled_at: string
  notes: string | null
  attended_by_team: boolean
  attended_at: string | null
  client: { id: string; full_name: string; company_name: string | null } | null
  team_member: { id: string; full_name: string } | null
  project: { id: string; name: string } | null
}

const MEETING_SELECT = `
  id, title, scheduled_at, notes, attended_by_team, attended_at,
  client:client_id(id, full_name, company_name),
  team_member:assigned_team_member_id(id, full_name),
  project:project_id(id, name)
`

// Admin: all upcoming meetings (next 30 days), soonest first
export async function getUpcomingMeetings(): Promise<MeetingRow[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('meetings')
    .select(MEETING_SELECT)
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(20)
  if (error) throw error
  return (data ?? []) as unknown as MeetingRow[]
}

// Admin: meetings past their time with no team attendance (grace: 30 min)
export async function getMissedMeetings(): Promise<MeetingRow[]> {
  const supabase = await createServerClient()
  const grace = new Date(Date.now() - 30 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('meetings')
    .select(MEETING_SELECT)
    .lt('scheduled_at', grace)
    .eq('attended_by_team', false)
    .order('scheduled_at', { ascending: false })
    .limit(10)
  if (error) throw error
  return (data ?? []) as unknown as MeetingRow[]
}

// Team: upcoming meetings assigned to this member
export async function getUpcomingMeetingsForTeam(userId: string): Promise<MeetingRow[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('meetings')
    .select(MEETING_SELECT)
    .eq('assigned_team_member_id', userId)
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(10)
  if (error) throw error
  return (data ?? []) as unknown as MeetingRow[]
}

// Team: missed meetings for this member
export async function getMissedMeetingsForTeam(userId: string): Promise<MeetingRow[]> {
  const supabase = await createServerClient()
  const grace = new Date(Date.now() - 30 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('meetings')
    .select(MEETING_SELECT)
    .eq('assigned_team_member_id', userId)
    .lt('scheduled_at', grace)
    .eq('attended_by_team', false)
    .order('scheduled_at', { ascending: false })
    .limit(5)
  if (error) throw error
  return (data ?? []) as unknown as MeetingRow[]
}

// Client portal: upcoming meetings for this client
export async function getUpcomingMeetingsForClient(clientId: string): Promise<MeetingRow[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('meetings')
    .select(MEETING_SELECT)
    .eq('client_id', clientId)
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(10)
  if (error) throw error
  return (data ?? []) as unknown as MeetingRow[]
}

// Client portal: missed meetings for this client
export async function getMissedMeetingsForClient(clientId: string): Promise<MeetingRow[]> {
  const supabase = await createServerClient()
  const grace = new Date(Date.now() - 30 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('meetings')
    .select(MEETING_SELECT)
    .eq('client_id', clientId)
    .lt('scheduled_at', grace)
    .eq('attended_by_team', false)
    .order('scheduled_at', { ascending: false })
    .limit(5)
  if (error) throw error
  return (data ?? []) as unknown as MeetingRow[]
}

// Admin project page: all meetings linked to a project
export async function getMeetingsForProject(projectId: string): Promise<MeetingRow[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('meetings')
    .select(MEETING_SELECT)
    .eq('project_id', projectId)
    .order('scheduled_at', { ascending: true })
    .limit(50)
  if (error) throw error
  return (data ?? []) as unknown as MeetingRow[]
}

// Admin team member page: all meetings for a given team member
export async function getMeetingsForTeamMember(userId: string): Promise<MeetingRow[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('meetings')
    .select(MEETING_SELECT)
    .eq('assigned_team_member_id', userId)
    .order('scheduled_at', { ascending: true })
    .limit(20)
  if (error) throw error
  return (data ?? []) as unknown as MeetingRow[]
}
