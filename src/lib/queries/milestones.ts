import { cache } from 'react'
import { createServerClient } from '@/lib/supabase/server'

export const getMilestonesForProject = cache(async (projectId: string) => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('project_id', projectId)
    .order('phase_number')
  if (error) throw error
  return data
})
