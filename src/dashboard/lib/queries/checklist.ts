import { cache } from 'react'
import { createServerClient } from '@/shared/lib/supabase/server'

export const getChecklistForProject = cache(async (projectId: string) => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('asset_checklist')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order')
  if (error) throw error
  return data
})
