# 13 — Server Actions
> Elevique Client Portal · All Mutations with Signatures

---

## Activity Logger (used by all actions)

Located at `src/lib/actions/activity.ts`. Imported and called at the end of every mutating action.

```ts
logActivity(
  actorId: string,
  action: string,           // e.g. 'project.created', 'milestone.updated'
  meta: Record<string, unknown>
): Promise<void>
```

Inserts a row into `activity_log` using `createAdminClient()` (bypasses RLS — always succeeds).  
Never throws — wraps insert in try/catch and silently drops failures to avoid blocking the main action.

---

## Projects Actions

Located at `src/lib/actions/projects.ts`. All functions start with `'use server'`.

```ts
createProject(params: {
  name: string
  client_id: string
  package: string
  deadline: string   // ISO date string
  description?: string
}): Promise<{ success: true; projectId: string } | { error: string }>
```
1. `requireAdmin()`
2. Zod: `name` non-empty, `client_id` UUID, `deadline` valid date
3. Insert into `projects`; DB trigger auto-seeds 4 milestones + 6 folders + 6 checklist items
4. `logActivity(adminId, 'project.created', { project_id })`
5. `revalidatePath('/admin/projects')`

```ts
updateProjectStatus(projectId: string, status: ProjectStatus): Promise<ActionResult>
archiveProject(projectId: string): Promise<ActionResult>
```

Both call `requireAdmin()`, validate inputs, update `projects`, log activity, and `revalidatePath`.

---

## Milestones Actions

Located at `src/lib/actions/milestones.ts`.

```ts
updateMilestone(milestoneId: string, changes: {
  status?: MilestoneStatus
  notes?: string
  scheduled_date?: string
}): Promise<ActionResult>
```
1. `requireAdmin()` or `requireTeamMember()` — team members must also be assigned to the project
2. Zod: validate each field; `status` must be one of the enum values
3. `UPDATE milestones SET ... WHERE id = milestoneId`
4. If `status = 'completed'`: call `notifyMilestoneComplete(milestone)` helper (sends Resend email to client)
5. `logActivity(userId, 'milestone.updated', { milestone_id, changes })`
6. `revalidatePath('/[role]/projects/[id]/milestones')`

```ts
notifyMilestoneComplete(milestone: Milestone): Promise<void>
```
Internal helper — fetches project + client email, calls Resend, never throws.

---

## Checklist Actions

Located at `src/lib/actions/checklist.ts`.

```ts
toggleChecklistItem(itemId: string, completed: boolean): Promise<ActionResult>
```
1. `requireAdmin()` or `requireTeamMember()` or `requireClient()` — client must own the project
2. `UPDATE asset_checklist SET completed = $completed WHERE id = itemId`
3. `logActivity(userId, 'checklist.toggled', { item_id: itemId, completed })`
4. `revalidatePath('/portal/projects/[id]')`

---

## Deliverables Actions

Located at `src/lib/actions/deliverables.ts`.

```ts
addDeliverable(params: {
  project_id: string
  type: 'video' | 'image'
  file_name: string
  dimensions?: string
  resolution?: string
  format?: string
  duration?: string
  file_id?: string   // optional — links to an existing files row
}): Promise<ActionResult>
```
1. `requireAdmin()` — admin or team member (check permission matrix)
2. Zod validation on all fields
3. Insert into `deliverables`; `logActivity`; `revalidatePath`

```ts
approveDeliverable(deliverableId: string): Promise<ActionResult>
```
1. `requireClient()` — must own the parent project (checked via RLS + explicit query)
2. `UPDATE deliverables SET status = 'approved', approved_at = now() WHERE id = deliverableId`
3. `logActivity(clientId, 'deliverable.approved', { deliverable_id })`
4. `revalidatePath('/portal/projects/[id]/deliverables')`

