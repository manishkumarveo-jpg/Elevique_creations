'use server'

import { createServerClient } from '@/lib/supabase/server'
import { requireAdmin, requireTeamMember } from '@/lib/auth/require-role'
import { logActivity } from '@/lib/actions/activity'
import { revalidatePath } from 'next/cache'

function revalidateProject(projectId: string) {
  revalidatePath(`/admin/projects/${projectId}`)
  revalidatePath(`/team/projects/${projectId}`)
  revalidatePath('/admin/projects')
}

export async function giveAdminApproval(projectId: string) {
  const user = await requireAdmin()
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('projects')
    .update({
      admin_approved: true,
      approved_by_admin: user.id,
      admin_approved_at: new Date().toISOString(),
    })
    .eq('id', projectId)

  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: user.id,
    actor_role: 'admin',
    action: 'admin_final_approval',
    project_id: projectId,
    entity_type: 'project',
    entity_id: projectId,
  })

  revalidateProject(projectId)
}

export async function revokeAdminApproval(projectId: string) {
  const user = await requireAdmin()
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('projects')
    .update({
      admin_approved: false,
      approved_by_admin: null,
      admin_approved_at: null,
    })
    .eq('id', projectId)

  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: user.id,
    actor_role: 'admin',
    action: 'admin_approval_revoked',
    project_id: projectId,
    entity_type: 'project',
    entity_id: projectId,
  })

  revalidateProject(projectId)
}

export async function adminApproveAndFinalize(projectId: string) {
  const user = await requireAdmin()
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('projects')
    .update({
      admin_approved: true,
      approved_by_admin: user.id,
      admin_approved_at: new Date().toISOString(),
      status: 'completed',
    })
    .eq('id', projectId)

  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: user.id,
    actor_role: 'admin',
    action: 'admin_final_approval',
    project_id: projectId,
    entity_type: 'project',
    entity_id: projectId,
  })
  await logActivity({
    actor_id: user.id,
    actor_role: 'admin',
    action: 'project_finalized',
    project_id: projectId,
    entity_type: 'project',
    entity_id: projectId,
  })

  revalidateProject(projectId)
}

export async function finalizeProject(projectId: string) {
  const user = await requireTeamMember()
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('projects')
    .update({ status: 'completed' })
    .eq('id', projectId)

  if (error) throw new Error(error.message)

  await logActivity({
    actor_id: user.id,
    actor_role: 'team_member',
    action: 'project_finalized',
    project_id: projectId,
    entity_type: 'project',
    entity_id: projectId,
  })

  revalidateProject(projectId)
}
