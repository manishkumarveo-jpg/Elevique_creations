import { cache } from 'react'
import { createServerClient } from '@/lib/supabase/server'

export type ProjectRevision = {
  id: string
  project_id: string
  submitted_by: string
  note: string
  status: 'open' | 'resolved'
  resolved_by: string | null
  resolved_at: string | null
  created_at: string
  submitter: { full_name: string } | null
}

export const getRevisionsForProject = cache(async (projectId: string): Promise<ProjectRevision[]> => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('project_revisions')
    .select('*, submitter:profiles!project_revisions_submitted_by_fkey(full_name)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as ProjectRevision[]
})
