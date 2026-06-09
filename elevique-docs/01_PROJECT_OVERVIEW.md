# 01 — Project Overview
> Elevique Client Portal · v2.0 · Three-Role System

---

## What We Are Building

A **custom-branded client collaboration portal** for Elevique (a Creative AI Visuals Studio) that replaces Notion as the project tracking tool.

The system has three types of users:
- **Admin** — Elevique owner/manager. Creates all accounts, manages everything.
- **Team Member** — Elevique staff (designers, editors). Works on assigned projects only.
- **Client** — Elevique's customers. Views and interacts with their own projects only.

---

## The Problem It Solves

Currently Elevique shares project progress via Notion pages manually. This causes:
- No login security — anyone with the link can see the page
- No role separation — clients can see things they shouldn't
- No file access control — deliverables are not protected
- Manual work — admin has to update Notion manually with no automation
- No audit trail — no record of who did what and when

---

## Core Modules

| Module | Description |
|--------|-------------|
| **Auth** | Admin-only account creation. No public signup. Three separate login portals. |
| **Projects** | Each client has one or more projects with full status tracking. |
| **Milestones** | Phase-by-phase progress: Briefing → Scripting → Production → Delivery. |
| **Folders** | Six organized folders per project: Agreements, Assets, References, Scripts, Videos, Images. |
| **Files** | Link-based file references (no local storage); role-based access enforced on external link metadata per folder. |
| **Deliverables** | Structured table of all videos and images delivered to the client. |
| **Asset Checklist** | Client-facing checklist for uploading required brand assets. |
| **Activity Log** | Immutable audit trail of every action across the system. |
| **Notifications** | Email on account creation and milestone updates via Resend. |
| **Realtime** | Live project updates via Supabase Realtime websockets. |

---

## Three Portals

```
/admin/*    →  Admin Panel       (Elevique team only)
/team/*     →  Team Portal       (Assigned staff only)
/portal/*   →  Client Portal     (Clients only)
/{role}/login → Login pages      (Public)
```

---

## What Each Role Can Do

### Admin (`/admin/*`)
- Create, edit, delete projects
- Create user accounts for team members and clients
- Set and reset passwords
- Assign team members to specific projects
- Upload any file to any folder
- Manage milestones, deliverables, and asset checklists
- View all activity across all projects and users

### Team Member (`/team/*`)
- See only projects they are assigned to
- Update milestone statuses on assigned projects
- Upload files to allowed folders on assigned projects
- View deliverables on assigned projects
- Cannot create projects, manage users, or see other clients

### Client (`/portal/*`)
- See only their own projects
- Upload brand assets and references
- Tick off asset checklist items
- View and download deliverables
- Approve delivered work
- Cannot see other clients or team members

---

## Project Data Flow

```
Admin creates project
    ↓
DB trigger seeds: 4 milestones + 6 folders + 6 checklist items
    ↓
Admin assigns team members
    ↓
Admin uploads agreements
    ↓
Client uploads assets / references
    ↓
Team updates milestones as work progresses
    ↓
Team uploads final videos / images as deliverables
    ↓
Client approves deliverables
    ↓
Project marked complete
```

---

## Key Business Rules

1. **No self-signup** — Admin creates every account manually.
2. **Admin sets passwords** — Users receive credentials via email.
3. **Clients are isolated** — Client A cannot see Client B's data under any circumstance.
4. **Team members are scoped** — A team member only sees projects they are explicitly assigned to.
5. **Files are external links** — No storage buckets. No signed URLs. Files are served via external links (Google Drive, Dropbox, etc.) that open directly in new tabs.
6. **Soft deletes** — Files are never permanently deleted. They are flagged `is_deleted = true`.
7. **Audit everything** — Every create, update, upload, and login event is logged.

---

## Success Criteria

- [ ] Admin can create a client account and they receive a welcome email with credentials
- [ ] Admin can create a project and all milestones/folders/checklist auto-seed
- [ ] Admin can assign a team member to a project
- [ ] Team member logs in and sees only their assigned projects
- [ ] Client logs in and sees only their own project
- [ ] Client cannot access any URL belonging to another client (tested manually)
- [ ] Team member cannot access admin routes (tested manually)
- [ ] Files open correctly via external links (Google Drive, Dropbox)
- [ ] Milestone updates appear in real-time on the client portal without refresh
- [ ] Activity log records every action correctly
