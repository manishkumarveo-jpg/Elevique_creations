'use server'

import { createServerClient } from '@/shared/lib/supabase/server'
import { requireAdmin, requireTeamMember } from '@/dashboard/lib/auth/require-role'
import { logActivity } from '@/dashboard/lib/actions/activity'
import { notifyUser, notifyUsers, notifyAdmins } from '@/dashboard/lib/actions/notifications/notify'
import { revalidatePath } from 'next/cache'

function revalidateProject(projectId: string) {
  revalidatePath(`/admin/projects/${projectId}`)
  revalidatePath(`/team/projects/${projectId}`)
  revalidatePath('/admin/projects')
}

async function notifyProjectTeam(actorId: string, projectId: string, title: string, body: string, selfBody: string) {
  try {
    const supabase = await createServerClient()
    const [{ data: assignments }, { data: project }] = await Promise.all([
      supabase.from('project_assignments').select('user_id').eq('project_id', projectId),
      supabase.from('projects').select('name').eq('id', projectId).single(),
    ])

    await notifyUsers((assignments ?? []).map(a => a.user_id), {
      actorId,
      type: 'status_update',
      title,
      body: `${project?.name ?? 'Project'}: ${body}`,
      link: `/team/projects/${projectId}`,
      projectId,
      entityType: 'project',
      entityId: projectId,
    })
    await notifyUser(actorId, {
      actorId,
      type: 'status_update',
      title,
      body: `${project?.name ?? 'Project'}: ${selfBody}`,
      link: `/admin/projects/${projectId}`,
      projectId,
      entityType: 'project',
      entityId: projectId,
    })
  } catch (notifyErr) {
    console.error('Project notification failed (project state already committed):', notifyErr)
  }
}

export async function giveAdminApproval(projectId: string) {
  const user = await requireAdmin()
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('projects')
    .update({
      admin_approved: true,
      approved_by_admin: user.id,
      admin_approved_at: new Date().toISOString(),
    })
    .eq('id', projectId)
    .eq('status', 'final_review')
    .select('id')

  if (error) throw new Error(error.message)
  if (!data || data.length === 0) throw new Error('Project is not pending final review')

  await logActivity({
    actor_id: user.id,
    actor_role: 'admin',
    action: 'admin_final_approval',
    project_id: projectId,
    entity_type: 'project',
    entity_id: projectId,
  })

  await notifyProjectTeam(user.id, projectId, 'Project approved', 'approved for final review — ready to finalize.', 'You approved this project for final review — ready to finalize.')

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

  await notifyProjectTeam(
    user.id,
    projectId,
    'Final approval declined',
    reason?.trim() ? `needs rework — ${reason.trim()}` : 'needs rework before it can be finalized.',
    reason?.trim() ? `You declined final approval — needs rework: ${reason.trim()}` : 'You declined final approval — needs rework before it can be finalized.'
  )

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

  await notifyProjectTeam(user.id, projectId, 'Final approval revoked', 'final approval was revoked.', 'You revoked final approval for this project.')

  revalidateProject(projectId)
}

export async function adminApproveAndFinalize(projectId: string) {
  const user = await requireAdmin()
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('projects')
    .update({
      admin_approved: true,
      approved_by_admin: user.id,
      admin_approved_at: new Date().toISOString(),
      status: 'completed',
    })
    .eq('id', projectId)
    .eq('status', 'final_review')
    .select('id')

  if (error) throw new Error(error.message)
  if (!data || data.length === 0) throw new Error('Project is not pending final review')

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

  await notifyProjectTeam(user.id, projectId, 'Project completed', 'approved and marked complete.', 'You approved and marked this project complete.')

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

  const { data: updated, error } = await supabase
    .from('projects')
    .update({ status: 'completed' })
    .eq('id', projectId)
    .eq('status', 'final_review')
    .select('id')

  if (error) throw new Error(error.message)
  if (!updated || updated.length === 0) throw new Error('Project is no longer pending final review')

  await logActivity({
    actor_id: user.id,
    actor_role: 'team_member',
    action: 'project_finalized',
    project_id: projectId,
    entity_type: 'project',
    entity_id: projectId,
  })

  try {
    const { data: projectRow } = await supabase.from('projects').select('name').eq('id', projectId).single()
    await notifyAdmins({
      actorId: user.id,
      type: 'status_update',
      title: 'Project finalized by team',
      body: `${projectRow?.name ?? 'A project'} was marked complete by a team member.`,
      link: `/admin/projects/${projectId}`,
      projectId,
      entityType: 'project',
      entityId: projectId,
    })
    await notifyUser(user.id, {
      actorId: user.id,
      type: 'status_update',
      title: 'Project finalized',
      body: `You marked ${projectRow?.name ?? 'the project'} complete.`,
      link: `/team/projects/${projectId}`,
      projectId,
      entityType: 'project',
      entityId: projectId,
    })
  } catch (notifyErr) {
    console.error('Project notification failed (project already finalized):', notifyErr)
  }

  revalidateProject(projectId)
}
