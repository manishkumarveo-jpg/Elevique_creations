'use server'

import { createAdminClient } from '@/shared/lib/supabase/admin'
import type { Database, Json } from '@/shared/lib/types/database'

type UserRole = Database['public']['Enums']['user_role']

interface LogActivityInput {
  actor_id: string
  actor_role: UserRole
  action: string
  project_id?: string
  entity_type?: string
  entity_id?: string
  entity_name?: string
  metadata?: Record<string, Json>
}

export async function logActivity(input: LogActivityInput) {
  const adminClient = createAdminClient()

  const { error } = await adminClient.from('activity_log').insert({
    actor_id: input.actor_id,
    actor_role: input.actor_role,
    action: input.action,
    project_id: input.project_id ?? null,
    entity_type: input.entity_type ?? null,
    entity_id: input.entity_id ?? null,
    entity_name: input.entity_name ?? null,
    metadata: input.metadata ?? {},
  })

  if (error) {
    console.error('Failed to log activity:', error.message)
  }
}
