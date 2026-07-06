import { cache } from 'react'
import { createServerClient } from '@/shared/lib/supabase/server'

export type VideoGenerationTask = {
  id: string
  project_id: string
  brand_name: string
  content_type: string
  script_number: number
  assigned_to_id: string | null
  assigned_at: string
  completed_at: string | null
  status: 'pending' | 'in_progress' | 'revision_pending' | 'completed' | 'paused'
  checks_performed: string[]
  created_at: string
  assignee: { id: string; full_name: string } | null
}

const SELECT = `
  id, project_id, brand_name, content_type, script_number, assigned_to_id,
  assigned_at, completed_at, status, checks_performed, created_at,
  assignee:profiles!video_generation_tasks_assigned_to_id_fkey(id, full_name)
`

export const getVideoGenerationTasks = cache(async (): Promise<VideoGenerationTask[]> => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('video_generation_tasks')
    .select(SELECT)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as VideoGenerationTask[]
})

export const getVideoGenerationTasksForTeamMember = cache(async (userId: string): Promise<VideoGenerationTask[]> => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('video_generation_tasks')
    .select(SELECT)
    .eq('assigned_to_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as VideoGenerationTask[]
})
