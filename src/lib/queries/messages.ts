import { createServerClient } from '@/lib/supabase/server'

export type MessageWithSender = {
  id: string
  project_id: string
  body: string
  created_at: string
  sender: {
    id: string
    full_name: string
    role: string
  } | null
}

export type ConversationSummary = {
  project_id: string
  project_name: string
  last_message: string
  last_message_at: string
  unread: boolean
}

export async function getMessagesForProject(projectId: string): Promise<MessageWithSender[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('messages')
    .select('id, project_id, body, created_at, sender:profiles!messages_sender_id_fkey(id, full_name, role)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as unknown as MessageWithSender[]
}

export async function getConversationsForAdmin(): Promise<ConversationSummary[]> {
  const supabase = await createServerClient()
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name')
    .eq('is_archived', false)
    .order('created_at', { ascending: false })
  if (error) throw error

  if (!projects || projects.length === 0) return []

  const results: ConversationSummary[] = []
  for (const project of projects) {
    const { data: lastMsg } = await supabase
      .from('messages')
      .select('body, created_at')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    results.push({
      project_id: project.id,
      project_name: project.name,
      last_message: lastMsg?.body ?? '',
      last_message_at: lastMsg?.created_at ?? '',
      unread: false,
    })
  }
  return results
}

export async function getConversationsForClient(userId: string): Promise<ConversationSummary[]> {
  const supabase = await createServerClient()
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name')
    .eq('client_id', userId)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })
  if (error) throw error

  if (!projects || projects.length === 0) return []

  const results: ConversationSummary[] = []
  for (const project of projects) {
    const { data: lastMsg } = await supabase
      .from('messages')
      .select('body, created_at')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    results.push({
      project_id: project.id,
      project_name: project.name,
      last_message: lastMsg?.body ?? '',
      last_message_at: lastMsg?.created_at ?? '',
      unread: false,
    })
  }
  return results
}

export async function getConversationsForTeamMember(userId: string): Promise<ConversationSummary[]> {
  const supabase = await createServerClient()
  const { data: assignments, error } = await supabase
    .from('project_assignments')
    .select('project_id')
    .eq('user_id', userId)
  if (error) throw error

  const projectIds = (assignments ?? []).map(a => a.project_id)
  if (projectIds.length === 0) return []

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, is_archived')
    .in('id', projectIds)
    .eq('is_archived', false)

  const results: ConversationSummary[] = []
  for (const project of projects ?? []) {
    const { data: lastMsg } = await supabase
      .from('messages')
      .select('body, created_at')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    results.push({
      project_id: project.id,
      project_name: project.name,
      last_message: lastMsg?.body ?? '',
      last_message_at: lastMsg?.created_at ?? '',
      unread: false,
    })
  }
  return results
}
