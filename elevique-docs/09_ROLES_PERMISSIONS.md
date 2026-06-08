# 09 — Roles & Permissions
> Elevique Client Portal · Complete Permission Matrix + Enforcement

---

## Role Values

---

## Complete Permission Matrix

| Action | Admin | Team Member | Client |
|--------|:-----:|:-----------:|:------:|
| **Users** | | | |
| Create user accounts | ✅ | ❌ | ❌ |
| Reset any password | ✅ | ❌ | ❌ |
| Deactivate / reactivate users | ✅ | ❌ | ❌ |
| View all users | ✅ | ❌ | ❌ |
| Update own profile (avatar, phone) | ✅ | ✅ | ✅ |
| **Projects** | | | |
| Create projects | ✅ | ❌ | ❌ |
| View all projects | ✅ | ❌ (assigned only) | ❌ (own only) |
| Edit project status | ✅ | ❌ | ❌ |
| Edit project name / package / deadline | ✅ | ❌ | ❌ |
| Archive / delete projects | ✅ | ❌ | ❌ |
| **Assignments** | | | |
| Assign team member to project | ✅ | ❌ | ❌ |
| Remove team member from project | ✅ | ❌ | ❌ |
| View project team | ✅ | ✅ (own assignment) | ❌ |
| **Milestones** | | | |
| View milestones | ✅ | ✅ (assigned) | ✅ (read-only) |
| Update milestone status | ✅ | ✅ (assigned) | ❌ |
| Update milestone notes/dates | ✅ | ✅ (assigned) | ❌ |
| Add / delete milestones | ✅ | ❌ | ❌ |
| **Files & Folders** | | | |
| Upload to any folder | ✅ | ❌ | ❌ |
| Upload to Assets folder | ✅ | ✅ (assigned) | ✅ (own) |
| Upload to References folder | ✅ | ✅ (assigned) | ✅ (own) |
| Upload to Scripts folder | ✅ | ✅ (assigned) | ❌ |
| Upload to Final Videos folder | ✅ | ✅ (assigned) | ❌ |
| Upload to Final Images folder | ✅ | ✅ (assigned) | ❌ |
| Upload to Agreements folder | ✅ | ❌ | ❌ |
| Download / view files | ✅ | ✅ (assigned) | ✅ (own) |
| Delete files | ✅ | ❌ | ❌ |
| **Deliverables** | | | |
| Add deliverables | ✅ | ✅ (assigned) | ❌ |
| View deliverables | ✅ | ✅ (assigned) | ✅ (own) |
| Download deliverables | ✅ | ✅ (assigned) | ✅ (own) |
| Approve deliverables | ✅ | ❌ | ✅ (own) |
| **Checklist** | | | |
| View asset checklist | ✅ | ✅ (assigned) | ✅ (own) |
| Mark checklist item complete | ✅ | ✅ (assigned) | ✅ (own) |
| **Activity Log** | | | |
| View all activity | ✅ | ❌ | ❌ |
| View activity on assigned projects | ❌ | ✅ | ❌ |
| View activity on own projects | ❌ | ❌ | ✅ |

---

## Enforcement Layers

Permissions are enforced at **three independent layers**. All three must pass.

### Layer 1 — Middleware (route-level)

### Layer 2 — Server Action (action-level)

### Layer 3 — RLS (data-level)

---

## Role-Based Route Constants

Located at `src/lib/auth/routes.ts`.

```ts
export const ROLE_ROUTES: Record<Role, { base: string; login: string; dashboard: string }> = {
  admin:       { base: '/admin',  login: '/admin/login',  dashboard: '/admin/dashboard' },
  team_member: { base: '/team',   login: '/team/login',   dashboard: '/team/dashboard' },
  client:      { base: '/portal', login: '/portal/login', dashboard: '/portal/dashboard' },
}
```

Middleware uses `ROLE_ROUTES[role].base` to verify the request path prefix matches the user's role.

---

## Permission Check Utilities

Located at `src/lib/auth/permissions.ts`.

```ts
type Role = 'admin' | 'team_member' | 'client'

// Returns true if the role is allowed to perform the action
hasPermission(role: Role, action: string): boolean

// Returns true if the role may access the given route path
canAccessRoute(role: Role, pathname: string): boolean
```

`hasPermission` is backed by a static map derived from the Permission Matrix in this document.  
`canAccessRoute` compares `pathname` against each entry in `ROLE_ROUTES` and returns true only when the prefix matches.

Usage in a Server Action:
```ts
if (!hasPermission(profile.role, 'project.create')) {
  return { error: 'Forbidden' }
}
```

---

## Current User Hook (Client Components)

Located at `src/hooks/use-current-user.ts`.

```ts
interface CurrentUser {
  id: string
  email: string
  role: Role
  full_name: string
  is_active: boolean
}

function useCurrentUser(): {
  user: CurrentUser | null
  loading: boolean
  refresh(): Promise<void>
}
```

Calls `createClientSupabase().auth.getUser()` and then fetches the matching `profiles` row.  
`refresh()` re-fetches both — call it after a profile update.  
Never use this hook for permission gating of Server Actions; use `requireAdmin()` / `requireTeamMember()` / `requireClient()` instead.

