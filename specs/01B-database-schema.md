# 01B — Database Schema
> Elevique Client Portal · Database Schema, Enums, Triggers, and RLS Policies

This specification details the complete database design, PostgreSQL schemas, table constraints, automated trigger flows, and Row-Level Security (RLS) rules that secure the Elevique Client Portal.

---

## 1. Custom Types & Enums

The application defines custom domain enums to enforce data integrity:
- `user_role`:: `'admin' | 'team_member' | 'client'`
- `milestone_status`:: `'pending' | 'in_progress' | 'completed'`
- `milestone_phase`:: `'briefing' | 'scripting' | 'production' | 'delivery'`
- `deliverable_status`:: `'pending_review' | 'approved' | 'revision_requested'`

---

## 2. Table Specifications

### `profiles`
Stores system users across all three roles.
- `id` (UUID, PK) -> Links to `auth.users(id)`
- `email` (TEXT, UNIQUE, NOT NULL)
- `full_name` (TEXT)
- `role` (user_role, DEFAULT 'client')
- `is_active` (BOOLEAN, DEFAULT TRUE)
- `created_at` (TIMESTAMPTZ, DEFAULT now())

### `projects`
Core project record belonging to a client.
- `id` (UUID, PK, DEFAULT gen_random_uuid())
- `name` (TEXT, NOT NULL)
- `client_id` (UUID, FK -> `profiles(id)`)
- `status` (TEXT, DEFAULT 'active')
- `created_at` (TIMESTAMPTZ, DEFAULT now())

### `project_assignments`
Junction table mapping Team Members to Projects.
- `project_id` (UUID, FK -> `projects(id)`, ON DELETE CASCADE)
- `user_id` (UUID, FK -> `profiles(id)`, ON DELETE CASCADE)
- *Composite Primary Key*: `(project_id, user_id)`

### `milestones`
Project milestones tracking completion state.
- `id` (UUID, PK)
- `project_id` (UUID, FK -> `projects(id)`, ON DELETE CASCADE)
- `phase` (milestone_phase, NOT NULL)
- `status` (milestone_status, DEFAULT 'pending')
- `updated_at` (TIMESTAMPTZ, DEFAULT now())

### `folders`
Organizes files inside a project.
- `id` (UUID, PK)
- `project_id` (UUID, FK -> `projects(id)`, ON DELETE CASCADE)
- `name` (TEXT, NOT NULL)
- `upload_roles` (user_role[], NOT NULL) -> Roles allowed to upload to this folder

### `files`
External URL resource references.
- `id` (UUID, PK)
- `project_id` (UUID, FK -> `projects(id)`)
- `folder_id` (UUID, FK -> `folders(id)`)
- `name` (TEXT, NOT NULL)
- `file_url` (TEXT, NOT NULL)
- `added_by` (UUID, FK -> `profiles(id)`)
- `is_deleted` (BOOLEAN, DEFAULT FALSE) -> Soft deletes
- `created_at` (TIMESTAMPTZ, DEFAULT now())

### `deliverables`
Delivered assets (videos/images) presented for client approval.
- `id` (UUID, PK)
- `project_id` (UUID, FK -> `projects(id)`)
- `file_id` (UUID, FK -> `files(id)`)
- `name` (TEXT, NOT NULL)
- `status` (deliverable_status, DEFAULT 'pending_review')
- `created_at` (TIMESTAMPTZ, DEFAULT now())

### `asset_checklist`
Actionable files requested from the Client.
- `id` (UUID, PK)
- `project_id` (UUID, FK -> `projects(id)`)
- `item_name` (TEXT, NOT NULL)
- `is_completed` (BOOLEAN, DEFAULT FALSE)

### `activity_log`
Immutable system audit trail.
- `id` (UUID, PK)
- `project_id` (UUID, FK -> `projects(id)`)
- `user_id` (UUID, FK -> `profiles(id)`)
- `action` (TEXT, NOT NULL)
- `created_at` (TIMESTAMPTZ, DEFAULT now())

---

## 3. Database Triggers & Automation

### Project Auto-Seeding Flow
Upon project creation, a Postgres trigger executes to auto-populate default project assets:
1. Seeds 4 default **Milestones** in order:
   - Briefing
   - Scripting
   - Production
   - Delivery
2. Seeds 6 core **Folders** with role permissions:
   - `Agreements` (Upload: Admin)
   - `Assets` (Upload: Admin, Client)
   - `References` (Upload: Admin, Team, Client)
   - `Scripts` (Upload: Admin, Team)
   - `Videos` (Upload: Admin, Team)
   - `Images` (Upload: Admin, Team)
3. Seeds default client asset requirements into the **Asset Checklist**.

---

## 4. Row Level Security (RLS) Overview

All database tables (excluding migration logs) enforce strict Row Level Security (RLS) at the database layer.

| Table | SELECT Access | INSERT / UPDATE / DELETE Access |
|---|---|---|
| `profiles` | Own profile (Clients/Team); All profiles (Admins) | Admins only |
| `projects` | Client owner, Assigned Team Members, Admins | Admins only |
| `project_assignments` | Own assignments (Team); All (Admins) | Admins only |
| `milestones` | Project stakeholders (Clients, Assigned Team, Admins) | Team (Update status); Admins (All) |
| `folders` | Project stakeholders (Clients, Assigned Team, Admins) | Admins only |
| `files` | Project stakeholders (only if `is_deleted` is FALSE) | Stakeholders with role in `folder.upload_roles` |
| `deliverables` | Project stakeholders | Team (Create); Client (Update status); Admins (All) |
| `asset_checklist` | Project stakeholders | Client (Update completion status); Admins (All) |
| `activity_log` | Project stakeholders | Admins only (System inserts run via service role) |
