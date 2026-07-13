import { cache } from 'react'
import { createServerClient } from '@/shared/lib/supabase/server'
import type { Database } from '@/shared/lib/types/database'

export type NotificationRow = Database['public']['Tables']['notifications']['Row']

export const getRecentNotifications = cache(async (userId: string, limit = 20): Promise<NotificationRow[]> => {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('recipient_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
})

export const getUnreadCount = cache(async (userId: string): Promise<number> => {
  const supabase = await createServerClient()
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('recipient_id', userId)
    .is('read_at', null)
  if (error) throw error
  return count ?? 0
})
