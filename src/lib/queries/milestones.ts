import { createServerClient } from '@/lib/supabase/server'

export async function getMilestonesForProject(projectId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('project_id', projectId)
    .order('phase_number')
  if (error) throw error
  return data
}
