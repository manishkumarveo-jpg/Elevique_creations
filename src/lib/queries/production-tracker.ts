import { cache } from 'react'
import { createServerClient } from '@/lib/supabase/server'

export type ProductionDeliverable = {
  id: string
  project_id: string
  brand_name: string
  deliverable_type: string
  details: string | null
  assets_location: string | null
  status: 'pending' | 'in_progress' | 'revision_pending' | 'completed' | 'paused'
  comments: string | null
  pending_with_id: string | null
  delivery_date: string | null
  priority: 'P1' | 'P2' | 'P3'
  completed_at: string | null
  created_at: string
  assignees: { id: string; full_name: string }[]
}

const SELECT = `
  id, project_id, brand_name, deliverable_type, details, assets_location,
  status, comments, pending_with_id, delivery_date, priority, completed_at, created_at,
  production_deliverable_assignees(user:profiles!production_deliverable_assignees_user_id_fkey(id, full_name))
`

function flattenAssignees(rows: unknown[]): ProductionDeliverable[] {
  return (rows as Array<Record<string, unknown>>).map(row => {
    const assigneeRows = (row.production_deliverable_assignees ?? []) as Array<{ user: { id: string; full_name: string } | null }>
    const { production_deliverable_assignees, ...rest } = row
    return {
      ...rest,
      assignees: assigneeRows.map(a => a.user).filter((u): u is { id: string; full_name: string } => u !== null),
    } as ProductionDeliverable
  })
}

export const getProductionDeliverables = cache(async (): Promise<ProductionDeliverable[]> => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('production_deliverables')
    .select(SELECT)
    .order('priority')
    .order('delivery_date')
  if (error) throw error
  return flattenAssignees(data as unknown[])
})

export const getProductionDeliverablesForTeamMember = cache(async (userId: string): Promise<ProductionDeliverable[]> => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('production_deliverables')
    .select(`
      id, project_id, brand_name, deliverable_type, details, assets_location,
      status, comments, pending_with_id, delivery_date, priority, completed_at, created_at,
      production_deliverable_assignees!inner(user:profiles!production_deliverable_assignees_user_id_fkey(id, full_name))
    `)
    .eq('production_deliverable_assignees.user_id', userId)
    .order('priority')
    .order('delivery_date')
  if (error) throw error
  return flattenAssignees(data as unknown[])
})
