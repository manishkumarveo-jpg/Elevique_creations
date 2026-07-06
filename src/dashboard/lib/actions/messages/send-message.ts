'use server'

import { createServerClient } from '@/shared/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendMessage(projectId: string, body: string) {
  const trimmed = body.trim()
  if (!trimmed) return

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('messages')
    .insert({ project_id: projectId, sender_id: user.id, body: trimmed })
  if (error) throw error

  revalidatePath('/admin/communications')
  revalidatePath('/portal/communications')
  revalidatePath('/team/communications')
}
