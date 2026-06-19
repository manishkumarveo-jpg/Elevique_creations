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
  pending_with: { id: string; full_name: string } | null
}

const SELECT = `
  id, project_id, brand_name, deliverable_type, details, assets_location,
  status, comments, pending_with_id, delivery_date, priority, completed_at, created_at,
  pending_with:profiles!production_deliverables_pending_with_id_fkey(id, full_name)
`

export const getProductionDeliverables = cache(async (): Promise<ProductionDeliverable[]> => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('production_deliverables')
    .select(SELECT)
    .order('priority')
    .order('delivery_date')
  if (error) throw error
  return data as unknown as ProductionDeliverable[]
})

export const getProductionDeliverablesForTeamMember = cache(async (userId: string): Promise<ProductionDeliverable[]> => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('production_deliverables')
    .select(SELECT)
    .eq('pending_with_id', userId)
    .order('priority')
    .order('delivery_date')
  if (error) throw error
  return data as unknown as ProductionDeliverable[]
})
