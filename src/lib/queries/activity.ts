import { createServerClient } from '@/lib/supabase/server'

export async function getRecentActivity(limit = 10) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('activity_log')
    .select('*, actor:profiles!activity_log_actor_id_fkey(id, full_name, role)')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function getActivityForProject(projectId: string, limit = 20) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('activity_log')
    .select('*, actor:profiles!activity_log_actor_id_fkey(id, full_name, role)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}
