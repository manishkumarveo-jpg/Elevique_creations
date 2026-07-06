import { cache } from 'react'
import { createServerClient } from '@/shared/lib/supabase/server'

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

export const getMessagesForProject = cache(async (projectId: string): Promise<MessageWithSender[]> => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('messages')
    .select('id, project_id, body, created_at, sender:profiles!messages_sender_id_fkey(id, full_name, role)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as unknown as MessageWithSender[]
})

function buildConversationSummaries(
  projects: { id: string; name: string }[],
  messages: { project_id: string; body: string; created_at: string }[]
): ConversationSummary[] {
  const lastMessageMap = new Map<string, { body: string; created_at: string }>()
  for (const msg of messages) {
    if (!lastMessageMap.has(msg.project_id)) {
      lastMessageMap.set(msg.project_id, { body: msg.body, created_at: msg.created_at })
    }
  }

  return projects.map(project => ({
    project_id: project.id,
    project_name: project.name,
    last_message: lastMessageMap.get(project.id)?.body ?? '',
    last_message_at: lastMessageMap.get(project.id)?.created_at ?? '',
    unread: false,
  }))
}

export const getConversationsForAdmin = cache(async (): Promise<ConversationSummary[]> => {
  const supabase = await createServerClient()
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name')
    .eq('is_archived', false)
    .order('created_at', { ascending: false })
  if (error) throw error
  if (!projects || projects.length === 0) return []

  const projectIds = projects.map(p => p.id)
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('project_id, body, created_at')
    .in('project_id', projectIds)
    .order('created_at', { ascending: false })
  if (messagesError) throw messagesError

  return buildConversationSummaries(projects, messages ?? [])
})

export const getConversationsForClient = cache(async (userId: string): Promise<ConversationSummary[]> => {
  const supabase = await createServerClient()
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name')
    .eq('client_id', userId)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })
  if (error) throw error
  if (!projects || projects.length === 0) return []

  const projectIds = projects.map(p => p.id)
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('project_id, body, created_at')
    .in('project_id', projectIds)
    .order('created_at', { ascending: false })
  if (messagesError) throw messagesError

  return buildConversationSummaries(projects, messages ?? [])
})

export const getConversationsForTeamMember = cache(async (userId: string): Promise<ConversationSummary[]> => {
  const supabase = await createServerClient()
  const { data: assignments, error } = await supabase
    .from('project_assignments')
    .select('project_id')
    .eq('user_id', userId)
  if (error) throw error

  const projectIds = (assignments ?? []).map(a => a.project_id)
  if (projectIds.length === 0) return []

  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, name')
    .in('id', projectIds)
    .eq('is_archived', false)
  if (projectsError) throw projectsError

  if (!projects || projects.length === 0) return []

  const activeProjectIds = projects.map(p => p.id)
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('project_id, body, created_at')
    .in('project_id', activeProjectIds)
    .order('created_at', { ascending: false })
  if (messagesError) throw messagesError

  return buildConversationSummaries(projects, messages ?? [])
})
