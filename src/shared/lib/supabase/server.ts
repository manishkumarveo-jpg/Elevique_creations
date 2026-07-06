import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { env } from '@/shared/lib/env'
import type { Database } from '@/shared/lib/types/database'

export async function createServerClient() {
  const cookieStore = await cookies()
  return createSupabaseServerClient<Database>(
    env.supabaseUrl,
    env.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore: called from Server Component (read-only cookies)
          }
        },
      },
    }
  )
}
