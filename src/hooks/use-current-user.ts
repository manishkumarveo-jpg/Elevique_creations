'use client'
import { useEffect, useState } from 'react'
import { createClientSupabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

export function useCurrentUser() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientSupabase()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data)
      setLoading(false)
    }
    load()
  }, [])

  return {
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    isTeamMember: profile?.role === 'team_member',
    isClient: profile?.role === 'client',
  }
}
