import { createServerClient } from '@/lib/supabase/server'

export async function getDeliverablesForProject(projectId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('deliverables')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
