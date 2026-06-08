# 10 — Project Assignments
> Elevique Client Portal · Team Member ↔ Project Junction System

---

## Overview

The `project_assignments` table is a many-to-many junction between `profiles` (team members) and `projects`. It is the single source of truth for what a team member can see and do.

```
profiles (role = 'team_member')
        ↓
project_assignments (user_id, project_id)
        ↓
projects
```

When a team member logs in, every query they make is scoped by their assignment rows. RLS uses `is_assigned_to_project(project_id)` which checks this table.

---

## Server Actions

Located at `src/lib/actions/assignments.ts`. All actions start with `'use server'`.

```ts
assignTeamMember(projectId: string, userId: string): Promise<ActionResult>
```
1. `requireAdmin()`
2. Validate `projectId` and `userId` as UUIDs; verify the profile has `role = 'team_member'`
3. Upsert into `project_assignments (project_id, user_id)` — ignore conflict
4. `logActivity(adminId, 'team_member_assigned', { project_id, user_id })`
5. Return `{ success: true }` or `{ error: string }`

```ts
removeTeamMember(projectId: string, userId: string): Promise<ActionResult>
```
1. `requireAdmin()`
2. `DELETE FROM project_assignments WHERE project_id = $1 AND user_id = $2`
3. `logActivity(adminId, 'team_member_removed', { project_id, user_id })`
4. Return `{ success: true }` or `{ error: string }`

---

## Query Functions

Located at `src/lib/queries/assignments.ts`. Use `createServerClient()` (respects RLS).

```ts
// Returns all team members assigned to a project with their profile details
getProjectTeam(projectId: string): Promise<Profile[]>

// Returns all projects assigned to the calling team member
getAssignedProjects(userId: string): Promise<Project[]>

// Returns all active team_member profiles (for the assign dropdown)
getTeamMembers(): Promise<Profile[]>

// Returns true if userId has an assignment row for projectId
isUserAssigned(projectId: string, userId: string): Promise<boolean>
```

All queries select only required columns. `getAssignedProjects` filters by `project_assignments.user_id = userId`.

---

## Assign Team Members Component (Admin)

Located at `src/components/admin/AssignTeamForm.tsx`. Client Component (`'use client'`).

**Props:**
```ts
interface AssignTeamFormProps {
  projectId: string
  currentTeam: Profile[]   // pre-fetched; refreshed after mutations
}
```

**Behaviour:**
1. On mount: renders `currentTeam` as a list of member pills with a remove button each
2. Dropdown populated from `getTeamMembers()` (fetched via a Server Component parent or passed as prop)
3. "Assign" button calls `assignTeamMember(projectId, selectedUserId)` — shows inline error on failure
4. Remove button calls `removeTeamMember(projectId, userId)` with an optimistic UI update
5. On success: calls `router.refresh()` so the parent Server Component re-fetches `currentTeam`
6. Admin-only — rendered only inside `/admin/*` routes; `requireAdmin()` is enforced in the parent page

