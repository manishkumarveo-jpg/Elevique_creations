// SERVER ONLY — never import this in components or client files
import { createClient } from '@supabase/supabase-js'
import { env } from '@/shared/lib/env'
import type { Database } from '@/shared/lib/types/database'

export function createAdminClient() {
  return createClient<Database>(
    env.supabaseUrl,
    env.supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
