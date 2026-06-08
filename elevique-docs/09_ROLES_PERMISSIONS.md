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

---

## Permission Check Utilities

---

## Current User Hook (Client Components)

