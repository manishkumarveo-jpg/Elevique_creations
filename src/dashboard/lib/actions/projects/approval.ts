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

export async function declineAdminApproval(projectId: string, reason?: string) {
  const user = await requireAdmin()
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('projects')
    .update({
      status: 'in_progress',
      admin_approved: false,
      approved_by_admin: null,
      admin_approved_at: null,
    })
    .eq('id', projectId)
    .eq('status', 'final_review')
    .select('id')

  if (error) throw new Error(error.message)
  if (!data || data.length === 0) throw new Error('Project is not pending final review')

  await logActivity({
    actor_id: user.id,
    actor_role: 'admin',
    action: 'admin_approval_declined',
    project_id: projectId,
    entity_type: 'project',
    entity_id: projectId,
    metadata: reason?.trim() ? { reason: reason.trim() } : {},
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

  const { data: project, error: fetchError } = await supabase
    .from('projects')
    .select('id, status, admin_approved')
    .eq('id', projectId)
    .single()

  if (fetchError || !project) throw new Error('Project not found')
  if (project.status !== 'final_review') throw new Error('Project is not in final review')
  if (!project.admin_approved) throw new Error('Project has not been approved by admin')

  const { data: assignment } = await supabase
    .from('project_assignments')
    .select('project_id')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .maybeSingle()
  if (!assignment) throw new Error('You are not assigned to this project')

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
