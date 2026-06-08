# 11 — Folder Structure
> Elevique Client Portal · Complete Next.js App Directory

---

## Full Directory Tree

```
elevique-portal/
├── public/
│   └── elevique-logo.svg
│
├── src/
│   ├── app/
│   │   │
│   │   ├── (auth)/                          # Route group — no URL prefix
│   │   │   ├── admin/
│   │   │   │   └── login/
│   │   │   │       └── page.tsx             # /admin/login
│   │   │   ├── team/
│   │   │   │   └── login/
│   │   │   │       └── page.tsx             # /team/login
│   │   │   └── portal/
│   │   │       └── login/
│   │   │           └── page.tsx             # /portal/login
│   │   │
│   │   ├── admin/                           # ADMIN PANEL
│   │   │   ├── layout.tsx                   # Sidebar + topbar layout
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx                 # /admin/dashboard
│   │   │   ├── users/
│   │   │   │   ├── page.tsx                 # /admin/users (list)
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx             # /admin/users/new
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx             # /admin/users/[id]
│   │   │   └── projects/
│   │   │       ├── page.tsx                 # /admin/projects (list)
│   │   │       ├── new/
│   │   │       │   └── page.tsx             # /admin/projects/new
│   │   │       └── [id]/
│   │   │           ├── page.tsx             # /admin/projects/[id] (overview)
│   │   │           ├── team/
│   │   │           │   └── page.tsx         # /admin/projects/[id]/team
│   │   │           ├── milestones/
│   │   │           │   └── page.tsx         # /admin/projects/[id]/milestones
│   │   │           ├── files/
│   │   │           │   └── page.tsx         # /admin/projects/[id]/files
│   │   │           └── deliverables/
│   │   │               └── page.tsx         # /admin/projects/[id]/deliverables
│   │   │
│   │   ├── team/                            # TEAM PORTAL
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx                 # /team/dashboard
│   │   │   └── projects/
│   │   │       └── [id]/
│   │   │           ├── page.tsx             # /team/projects/[id] (overview)
│   │   │           ├── milestones/
│   │   │           │   └── page.tsx         # /team/projects/[id]/milestones
│   │   │           └── files/
│   │   │               └── page.tsx         # /team/projects/[id]/files
│   │   │
│   │   ├── portal/                          # CLIENT PORTAL
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx                 # /portal/dashboard
│   │   │   └── projects/
│   │   │       └── [id]/
│   │   │           ├── page.tsx             # /portal/projects/[id] (tracker)
│   │   │           ├── upload/
│   │   │           │   └── page.tsx         # /portal/projects/[id]/upload
│   │   │           └── deliverables/
│   │   │               └── page.tsx         # /portal/projects/[id]/deliverables
│   │   │
│   │   ├── api/
│   │   │   ├── upload/
│   │   │   │   └── route.ts                 # POST /api/upload (signed URL)
│   │   │   └── health/
│   │   │       └── route.ts                 # GET /api/health
│   │   │
│   │   ├── unauthorized/
│   │   │   └── page.tsx                     # /unauthorized
│   │   │
│   │   ├── layout.tsx                       # Root layout (fonts, metadata)
│   │   └── globals.css                      # Tailwind base + global styles
│   │
│   ├── components/
│   │   ├── ui/                              # shadcn/ui — DO NOT EDIT
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── avatar.tsx
│   │   │   └── alert.tsx
│   │   │
│   │   ├── shared/                          # Used across multiple portals
│   │   │   ├── MilestoneTimeline.tsx        # Read-only milestone display
│   │   │   ├── AddLinkForm.tsx              # Paste external link (Google Drive etc.)
│   │   │   ├── FileLinkRow.tsx              # Single link row — opens URL in new tab
│   │   │   ├── FolderFilesSection.tsx       # Folder card with link list + AddLinkForm
│   │   │   ├── FileList.tsx                 # List of files in a folder
│   │   │   ├── DeliverableTable.tsx         # Table of delivered files
│   │   │   ├── ActivityFeed.tsx             # Activity log timeline
│   │   │   ├── StatusBadge.tsx              # Colored status pill
│   │   │   └── ConfirmDialog.tsx            # Reusable confirm modal
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── CreateUserForm.tsx
│   │   │   ├── AssignTeamForm.tsx
│   │   │   ├── MilestoneEditor.tsx          # Editable milestone with status dropdown
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── DeliverableForm.tsx          # Add new deliverable
│   │   │   └── ProjectStats.tsx             # Dashboard stat cards
│   │   │
│   │   ├── team/
│   │   │   ├── TeamSidebar.tsx
│   │   │   └── MilestoneUpdateRow.tsx       # Inline milestone status update
│   │   │
│   │   └── portal/
│   │       ├── PortalLayout.tsx
│   │       ├── ProjectTracker.tsx           # Main client tracker view
│   │       ├── FolderGrid.tsx               # Clickable folder cards
│   │       ├── AssetChecklist.tsx           # Checklist with tick + upload
│   │       └── DeliverableApproveRow.tsx    # Row with approve button
│   │
│   ├── lib/
│   │   ├── actions/                         # Server Actions
│   │   │   ├── auth/
│   │   │   │   ├── create-user.ts
│   │   │   │   ├── reset-password.ts
│   │   │   │   ├── deactivate-user.ts
│   │   │   │   └── logout.ts
│   │   │   ├── projects.ts
│   │   │   ├── assignments.ts
│   │   │   ├── milestones.ts
│   │   │   ├── files.ts
│   │   │   ├── deliverables.ts
│   │   │   ├── checklist.ts
│   │   │   └── activity.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── require-role.ts              # requireAdmin() etc.
│   │   │   ├── permissions.ts               # canUpload(), canApprove() etc.
│   │   │   └── routes.ts                    # ROLE_ROUTES constant
│   │   │
│   │   ├── supabase/
│   │   │   ├── client.ts                    # Browser client
│   │   │   ├── server.ts                    # Server client (cookie-based)
│   │   │   ├── admin.ts                     # Admin client (service role)
│   │   │   └── storage.ts                   # Storage helpers
│   │   │
│   │   ├── queries/                         # Read-only DB queries
│   │   │   ├── projects.ts
│   │   │   ├── assignments.ts
│   │   │   ├── milestones.ts
│   │   │   └── files.ts
│   │   │
│   │   ├── validations/                     # Zod schemas
│   │   │   ├── user.ts
│   │   │   ├── project.ts
│   │   │   ├── milestone.ts
│   │   │   └── file.ts
│   │   │
│   │   ├── types/
│   │   │   └── database.ts                  # Generated by Supabase CLI
│   │   │
│   │   ├── utils/
│   │   │   ├── format-date.ts
│   │   │   ├── format-file-size.ts
│   │   │   └── file-validation.ts
│   │   │
│   │   └── env.ts                           # Env var validation
│   │
│   └── hooks/
│       ├── use-current-user.ts
│       └── use-project-realtime.ts
│
├── supabase/
│   └── migrations/
│       ├── 20260601_01_enums_and_functions.sql
│       ├── 20260601_02_profiles.sql
│       ├── 20260601_03_projects.sql
│       ├── 20260601_04_assignments.sql
│       ├── 20260601_05_milestones.sql
│       ├── 20260601_06_folders.sql
│       ├── 20260601_07_files.sql
│       ├── 20260601_08_deliverables.sql
│       ├── 20260601_09_checklist.sql
│       ├── 20260601_10_activity_log.sql
│       ├── 20260601_11_seed_trigger.sql
│       ├── 20260601_12_rls.sql
│       └── 20260601_13_indexes.sql
│
├── .env.local                               # Never commit this
├── .env.example                             # Commit this (no values)
├── middleware.ts                            # MUST be at root of src/ or project root
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── .prettierrc
├── .eslintrc.json
└── package.json
```

---

## Key Files — Exact Locations

| File | Purpose |
|------|---------|
| `src/middleware.ts` | Route protection + rate limiting — runs on every request |
| `src/lib/supabase/admin.ts` | Service role client — server-only |
| `src/lib/auth/require-role.ts` | requireAdmin() / requireTeamMember() / requireClient() |
| `src/lib/env.ts` | All env vars validated at startup |
| `src/lib/types/database.ts` | Auto-generated Supabase types — never edit manually |
| `supabase/migrations/` | All SQL migrations in order |

---

## What NOT to Create

- Do not create `/api/projects` or other REST endpoints — use Server Actions instead
- Do not create a `/signup` page — admin creates all accounts
- Do not put business logic in `page.tsx` files — only in `lib/`
- Do not edit files in `components/ui/` — they are managed by shadcn CLI
- Do not import `admin.ts` in any file under `app/` directly — always through a Server Action
