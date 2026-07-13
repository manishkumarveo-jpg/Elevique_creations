'use server'

import { createAdminClient } from '@/shared/lib/supabase/admin'
import { logActivity } from '@/dashboard/lib/actions/activity'
import { notifyAdmins } from '@/dashboard/lib/actions/notifications/notify'
import { revalidatePath } from 'next/cache'

export async function addRevision(projectId: string, note: string) {
  const user = await (await import('@/dashboard/lib/auth/require-role')).requireClient()
  const supabase = createAdminClient()

  const trimmed = note.trim()
  if (!trimmed) throw new Error('Please describe your concern.')

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('client_id', user.id)
    .single()

  if (!project) throw new Error('Project not found or access denied.')

  const { error } = await supabase
    .from('project_revisions')
    .insert({ project_id: projectId, submitted_by: user.id, note: trimmed, status: 'open' })

  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: user.id,
    actor_role: 'client',
    action: 'project.revision_requested',
    project_id: projectId,
    entity_type: 'project_revision',
    metadata: { note: trimmed },
  })

  try {
    await notifyAdmins({
      actorId: user.id,
      type: 'status_update',
      title: 'Client revision requested',
      body: trimmed,
      link: `/admin/projects/${projectId}`,
      projectId,
      entityType: 'project_revision',
    })
  } catch (notifyErr) {
    console.error('Revision notification failed (revision still submitted):', notifyErr)
  }

  revalidatePath(`/portal/projects/${projectId}`)
  revalidatePath(`/admin/projects/${projectId}`)
  revalidatePath(`/team/projects/${projectId}`)
}

export async function resolveRevision(revisionId: string, projectId: string) {
  const user = await (await import('@/dashboard/lib/auth/require-role')).requireAdmin()
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('project_revisions')
    .update({
      status: 'resolved',
      resolved_by: user.id,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', revisionId)
    .eq('project_id', projectId)

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/projects/${projectId}`)
  revalidatePath(`/portal/projects/${projectId}`)
  revalidatePath(`/team/projects/${projectId}`)
}
