import { cache } from 'react'
import { createServerClient } from '@/lib/supabase/server'

export const getRecentActivity = cache(async (limit = 10) => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('activity_log')
    .select('*, actor:profiles!activity_log_actor_id_fkey(id, full_name, role)')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
})

export const getActivityForProject = cache(async (projectId: string, limit = 20) => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('activity_log')
    .select('*, actor:profiles!activity_log_actor_id_fkey(id, full_name, role)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
})
