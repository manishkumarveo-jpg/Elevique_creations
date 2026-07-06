import { cache } from 'react'
import { createServerClient } from '@/shared/lib/supabase/server'

export const getDeliverablesForProject = cache(async (projectId: string) => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('deliverables')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
})
