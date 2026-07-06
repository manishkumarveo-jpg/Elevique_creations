import type { Database } from '@/lib/types/database'

type UserRole = Database['public']['Enums']['user_role']

export function canUploadToFolder(role: UserRole, uploadRoles: string[]): boolean {
  return uploadRoles.includes(role)
}

export function canUpdateMilestone(role: UserRole): boolean {
  return role === 'admin' || role === 'team_member'
}

export function canApproveDeliverable(role: UserRole): boolean {
  return role === 'admin' || role === 'client'
}

export function canManageUsers(role: UserRole): boolean {
  return role === 'admin'
}

export function canCreateProjects(role: UserRole): boolean {
  return role === 'admin'
}
