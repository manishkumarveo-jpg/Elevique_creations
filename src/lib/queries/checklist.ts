import { createServerClient } from '@/lib/supabase/server'

export async function getChecklistForProject(projectId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('asset_checklist')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order')
  if (error) throw error
  return data
}
