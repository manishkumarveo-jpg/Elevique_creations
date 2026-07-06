import { cache } from 'react'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const getAllProfiles = cache(async () => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
})

export const getProfileById = cache(async (id: string) => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
})

export const getTeamMembers = cache(async () => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, is_active')
    .eq('role', 'team_member')
    .eq('is_active', true)
    .order('full_name')
  if (error) throw error
  return data
})

export const getClients = cache(async () => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, company_name, is_active')
    .eq('role', 'client')
    .eq('is_active', true)
    .order('full_name')
  if (error) throw error
  return data
})

export type ClientWithAssignment = {
  id: string
  full_name: string
  email: string
  company_name: string | null
  is_active: boolean
  assigned_team_member_id: string | null
}


export const getClientsWithAssignment = cache(async (): Promise<ClientWithAssignment[]> => {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, company_name, is_active, assigned_team_member_id')
    .eq('role', 'client')
    .order('full_name')
  if (error) throw error
  return (data ?? []) as ClientWithAssignment[]
})
