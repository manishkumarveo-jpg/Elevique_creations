# 00 — Claude Code Prompts
> Elevique Client Portal · Step-by-Step Build Sequence
> Read this file FIRST. Use one prompt at a time. Never skip a checkpoint.

---

## HOW TO USE THIS FILE

1. Open Claude Code in your terminal (`claude` command)
2. Copy **one prompt block** at a time
3. Paste it into Claude Code
4. Wait for it to finish
5. Run the **checkpoint** tests listed at the end of each step
6. Only move to the next prompt after ALL checkpoints pass
7. If a checkpoint fails — fix it before continuing

**Never paste two prompts at once. Order matters.**

---

## PHASE 0 — ACCOUNTS & SERVICES SETUP
> Do this manually before running any Claude Code prompts

### 0A — Create Supabase project
1. Go to supabase.com → New Project → `elevique-portal-prod`
2. Region: `ap-south-1` (Mumbai)
3. Save your password
4. Note your: Project URL, anon key, service_role key

### 0B — Create Upstash Redis
1. Go to console.upstash.com → Create Database → `elevique-ratelimit`
2. Note your: REST URL, REST Token

### 0C — Create Resend account
1. Go to resend.com → Sign up → Add domain `elevique.in`
2. Verify DNS, create API key
3. Note your: API Key

### 0D — Create GitHub repo
1. Create a new empty repo called `elevique-portal`
2. Note the repo URL

**⛔ CHECKPOINT 0:** Do NOT proceed until you have all 7 environment variable values ready.

---

## PHASE 1 — PROJECT BOOTSTRAP

### PROMPT 1A — Initialize Next.js Project

```
Create a new Next.js 14 project called "elevique-portal" using the exact command from 03_TECH_STACK.md. Use these flags: --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack

After creating the project, cd into it and install all runtime dependencies listed in 03_TECH_STACK.md under "Step 2 — Install Runtime Dependencies".

Then install all dev dependencies from "Step 3 — Install Dev Dependencies".

Then initialize shadcn/ui using "Step 4 — Initialize shadcn/ui". When prompted: choose Default style, Slate base color, CSS variables: yes.

Then add all shadcn components listed in "Step 5 — Add shadcn Components".

Do not create any application files yet. Only bootstrap the project.
```

**✅ CHECKPOINT 1A:**

---

### PROMPT 1B — Environment Setup

```
Create the following files in the project root:

1. .env.example — with all 7 variable names from 20_DEPLOYMENT.md but NO values
2. .env.local — I will fill in the values manually. Just create the file with the same structure as .env.example but add a comment saying "# Fill in your values here"
3. src/lib/env.ts — the full environment validation file from 04_CODE_STANDARDS.md (the requireEnv function and env export)

Also replace tsconfig.json with the exact content from 03_TECH_STACK.md.
Replace .prettierrc with the exact content from 03_TECH_STACK.md.
Add the scripts from 03_TECH_STACK.md to package.json (merge with existing scripts, do not replace).
```

**✅ CHECKPOINT 1B:**
- Open `.env.local` and fill in your 7 values from Phase 0
- Then run: `npx tsc --noEmit` → 0 errors
- The env.ts file should exist at `src/lib/env.ts`

---

## PHASE 2 — DATABASE

### PROMPT 2 — Run Database Migrations

```
I need to run the SQL from 05_DATABASE_SCHEMA.md in my Supabase project.

Create a folder called supabase/migrations/ and split the SQL from 05_DATABASE_SCHEMA.md into individual migration files using these exact names:
- 20260601_01_enums_and_functions.sql  → Step 1 + Step 2 from the schema doc
- 20260601_02_profiles.sql             → Step 3
- 20260601_03_projects.sql             → Step 4
- 20260601_04_assignments.sql          → Step 5
- 20260601_05_milestones.sql           → Step 6
- 20260601_06_folders.sql              → Step 7
- 20260601_07_files.sql                → Step 8
- 20260601_08_deliverables.sql         → Step 9
- 20260601_09_checklist.sql            → Step 10
- 20260601_10_activity_log.sql         → Step 11
- 20260601_11_seed_trigger.sql         → Step 12 + Step 13
- 20260601_12_rls.sql                  → All content from 06_RLS_POLICIES.md
- 20260601_13_indexes.sql              → All CREATE INDEX statements from 19_PERFORMANCE.md

Do not run these yet — just create the files.
```

**✅ CHECKPOINT 2 (manual):**
1. Open Supabase SQL Editor
2. Paste and run each .sql file in order (01 first, 13 last)
3. After all 13: verify in Supabase → Table Editor you can see all 9 tables
4. Run this verification query:
All 9 rows should show `rowsecurity = true`.

---

## PHASE 3 — SUPABASE CLIENTS & AUTH FOUNDATION

### PROMPT 3A — Supabase Client Files

```
Create the following files with the EXACT code from 08_AUTH_SYSTEM.md:

1. src/lib/supabase/server.ts   → "Supabase Client Instances" → createServerClient
2. src/lib/supabase/client.ts   → "Supabase Client Instances" → createClientSupabase
3. src/lib/supabase/admin.ts    → "Supabase Client Instances" → createAdminClient

Then generate Supabase TypeScript types and save to src/lib/types/database.ts using:
npx supabase gen types typescript --project-id [PROJECT_ID] > src/lib/types/database.ts

Replace [PROJECT_ID] with the actual Supabase project ID from NEXT_PUBLIC_SUPABASE_URL
(it's the subdomain part: https://[PROJECT_ID].supabase.co)
```

**✅ CHECKPOINT 3A:**

---

### PROMPT 3B — Auth Helpers

```
Create the following files with EXACT code from the documentation:

From 08_AUTH_SYSTEM.md:
1. src/lib/auth/require-role.ts → "Require Role Helpers" section (full file)
2. src/lib/actions/auth/logout.ts → "Logout Action" section

From 09_ROLES_PERMISSIONS.md:
3. src/lib/auth/routes.ts → "Role-Based Route Constants" section
4. src/lib/auth/permissions.ts → "Permission Check Utilities" section
5. src/hooks/use-current-user.ts → "Current User Hook" section

From 08_AUTH_SYSTEM.md:
6. src/lib/actions/auth/create-user.ts → "Create User Account" section (full file)
7. src/lib/actions/auth/reset-password.ts → "Reset Password" section
8. src/lib/actions/auth/deactivate-user.ts → "Deactivate / Reactivate User" section
```

**✅ CHECKPOINT 3B:**

---

## PHASE 4 — MIDDLEWARE

### PROMPT 4 — Middleware + Next Config

```
Create the following files with EXACT code from 12_MIDDLEWARE.md:

1. src/middleware.ts → the full middleware.ts file including the config export
2. src/app/api/health/route.ts → "Health Check Route" section
3. src/app/unauthorized/page.tsx → "Unauthorized Page" section

Replace next.config.ts with the exact content from 12_MIDDLEWARE.md → "next.config.ts" section.

IMPORTANT: middleware.ts must be at src/middleware.ts (not src/app/middleware.ts).
```

**✅ CHECKPOINT 4:**

---

## PHASE 5 — LOGIN PAGES

### PROMPT 5 — Three Login Pages

```
Create three login pages following the pattern in 08_AUTH_SYSTEM.md → "Login Pages" section.

Each page is a Client Component. Create:

1. src/app/(auth)/admin/login/page.tsx
   - Title: "Admin Portal"
   - After successful login: redirect to /admin/dashboard

2. src/app/(auth)/team/login/page.tsx
   - Title: "Team Portal"
   - After successful login: redirect to /team/dashboard

3. src/app/(auth)/portal/login/page.tsx
   - Title: "Client Portal"
   - After successful login: redirect to /portal/dashboard

All three pages:
- Use createClientSupabase() from @/lib/supabase/client
- Use supabase.auth.signInWithPassword()
- Show "Invalid email or password." on auth error
- Use shadcn Input, Label, Button components
- Are clean, minimal, Elevique-branded (use the color #6C47FF for the button)
```

**✅ CHECKPOINT 5:**

**Manual test:**
1. Go to Supabase → Auth → Users → Create admin user manually
2. Then run: `UPDATE profiles SET role = 'admin', full_name = 'Admin' WHERE email = 'your@email.com';`
3. Login at `/admin/login` with those credentials
4. Should redirect to `/admin/dashboard` (404 is fine — page doesn't exist yet)

---

## PHASE 6 — SERVER ACTIONS

### PROMPT 6 — All Server Actions + Activity Logger

```
Create all server action files with EXACT code from the documentation:

From 13_SERVER_ACTIONS.md:
1. src/lib/actions/activity.ts → "Activity Logger" section
2. src/lib/actions/projects.ts → "Projects Actions" section (createProject, updateProjectStatus, archiveProject)
3. src/lib/actions/milestones.ts → "Milestones Actions" section (updateMilestone, notifyMilestoneComplete helper)
4. src/lib/actions/checklist.ts → "Checklist Actions" section (toggleChecklistItem)
5. src/lib/actions/deliverables.ts → "Deliverables Actions" section (addDeliverable, approveDeliverable)

From 10_PROJECT_ASSIGNMENTS.md:
6. src/lib/actions/assignments.ts → "Server Actions" section (assignTeamMember, removeTeamMember)

Also create utility files:
From 14_FILE_UPLOAD.md:
7. src/lib/utils/format-date.ts → formatDate function

From 10_PROJECT_ASSIGNMENTS.md:
8. src/lib/queries/assignments.ts → "Query Functions" section (getProjectTeam, getAssignedProjects, getTeamMembers, isUserAssigned)

Do NOT create:
- src/lib/actions/files.ts (replaced by saveLinkRecord in 14_FILE_UPLOAD.md)
- src/lib/utils/file-validation.ts (no file uploads in this project)
- src/lib/supabase/storage.ts (no storage buckets in this project)
- src/lib/utils/format-file-size.ts (created in Phase 7)
```

**✅ CHECKPOINT 6:**

---

## PHASE 7 — LINK VALIDATION UTILITY

### PROMPT 7 — File Link Utilities

```
This project uses NO file storage. Files are external links (Google Drive, Dropbox, etc.) pasted by the admin or team.

Create these utility files:

From 07_STORAGE.md:
1. src/lib/utils/link-validation.ts → the full isValidUrl, getLinkProvider, getProviderIcon functions

From 14_FILE_UPLOAD.md:
2. src/lib/utils/format-file-size.ts → the formatFileSize function (kept for displaying optional size strings)
3. src/lib/utils/format-date.ts → the formatDate function

Do NOT create:
- /api/upload route
- /api/download route
- src/lib/supabase/storage.ts
- FileUploader component
- FileDownloadButton component
```

**✅ CHECKPOINT 7:**

---

## PHASE 8 — SHARED COMPONENTS

### PROMPT 8 — Shared Components

```
Create these shared components:

From 18_CLIENT_PORTAL.md:
1. src/components/shared/MilestoneTimeline.tsx → "Milestone Timeline Component" section
2. src/components/portal/AssetChecklist.tsx → "Asset Checklist Component" section

From 07_STORAGE.md (the new link-based file system):
3. src/components/shared/AddLinkForm.tsx → "AddLinkForm Component" section
4. src/components/shared/FileLinkRow.tsx → "FileLinkRow Component" section

From 14_FILE_UPLOAD.md:
5. src/components/shared/FolderFilesSection.tsx → "FolderFilesSection Component" section

From 10_PROJECT_ASSIGNMENTS.md:
6. src/components/admin/AssignTeamForm.tsx → "Assign Team Members Component" section

From 15_REALTIME_NOTIFICATIONS.md:
7. src/hooks/use-project-realtime.ts → "Realtime Hook" section
8. src/lib/email/templates.ts → "Email Templates" section

Do NOT create FileUploader.tsx or FileDownloadButton.tsx — those are replaced by AddLinkForm and FileLinkRow.
```

**✅ CHECKPOINT 8:**

---

## PHASE 9 — ADMIN PANEL

### PROMPT 9A — Admin Layout + Dashboard

```
Create the admin portal pages and layout with EXACT code from 16_ADMIN_PANEL.md:

1. src/app/admin/layout.tsx → "Admin Layout" section
2. src/components/admin/AdminSidebar.tsx → "Admin Sidebar" section
3. src/app/admin/dashboard/page.tsx → "Admin Dashboard Page" section (includes the inline StatusBadgeInline function)

The dashboard page fetches:
- Total projects count (non-archived)
- Active projects count (status in_progress or final_review)
- Active clients count
- Active team members count
- 5 most recent projects

Run all these as parallel Promise.all() queries.
```

**✅ CHECKPOINT 9A:**

---

### PROMPT 9B — Admin Users Pages

```
Create these user management pages with EXACT code from 16_ADMIN_PANEL.md:

1. src/app/admin/users/page.tsx → a list page that shows all profiles
   - Fetch all profiles sorted by created_at DESC
   - Show: full_name, email, role badge, is_active status, created_at
   - Link to /admin/users/new for creating new user
   - Each row links to /admin/users/[id]

2. src/app/admin/users/new/page.tsx → "Create User Page" section

3. src/components/admin/CreateUserForm.tsx → "CreateUserForm Component" section (full component)
   - Uses createUserAccount() server action from lib/actions/auth/create-user.ts
   - Shows success state after creation
   - Redirects to /admin/users after 2 seconds

4. src/app/admin/users/[id]/page.tsx → a user detail page showing:
   - Profile info (name, email, role, phone, company)
   - Reset password form (uses adminResetPassword server action)
   - Deactivate/Reactivate button (uses deactivateUser / reactivateUser)
   - List of projects associated with this user
```

**✅ CHECKPOINT 9B:**

---

### PROMPT 9C — Admin Projects Pages

```
Create the projects section of the admin panel:

1. src/app/admin/projects/page.tsx → project list
   - Fetch all non-archived projects with client name
   - Search input that filters by project name (client-side filter)
   - Status filter dropdown
   - Each row links to /admin/projects/[id]
   - "New Project" button links to /admin/projects/new

2. src/app/admin/projects/new/page.tsx → new project form
   - Fetch all active client profiles for the dropdown
   - Form fields: name, client (dropdown), package, deadline, description
   - Uses createProject() server action
   - On success: redirect to /admin/projects/[id]

3. src/app/admin/projects/[id]/page.tsx → project overview
   - Shows: project name, status, client, package, deadline
   - Admin can update project status via dropdown
   - Shows assigned team members (AssignTeamForm component)
   - Shows milestone summary (4 milestones with status)
   - Links to /milestones, /files, /deliverables sub-pages

4. src/app/admin/projects/[id]/milestones/page.tsx
   - List of 4 milestones with MilestoneEditor inline editing
   - Admin can update: status, notes, scheduled_date

5. src/app/admin/projects/[id]/files/page.tsx
   - Show all 6 folders as cards
   - Click a folder → expand to show links in that folder
   - AddLinkForm component for each folder
   - FileLinkRow for each link (opens external URL)

6. src/app/admin/projects/[id]/team/page.tsx
   - AssignTeamForm component
   - List of currently assigned team members with remove button
```

**✅ CHECKPOINT 9C:**

---

## PHASE 10 — TEAM PORTAL

### PROMPT 10 — Team Portal (All Pages)

```
Create the team portal with EXACT code from 17_TEAM_PORTAL.md:

1. src/app/team/layout.tsx → "Team Layout" section
2. src/app/team/dashboard/page.tsx → "Team Dashboard" section (includes StatusPill)
3. src/app/team/projects/[id]/page.tsx → project overview for team members
   - Show: project name, status, client name
   - Show: milestone progress summary
   - Links to /milestones and /files sub-pages
4. src/app/team/projects/[id]/milestones/page.tsx → "Team Project Milestones Page"
5. src/components/team/MilestoneUpdateRow.tsx → "MilestoneUpdateRow Component"
6. src/app/team/projects/[id]/files/page.tsx → files page for team members
   - Same 6-folder layout as admin but only shows folders where upload_roles includes 'team_member'
   - AddLinkForm for allowed folders
   - FileLinkRow for all links (opens external URL)
```

**✅ CHECKPOINT 10:**

---

## PHASE 11 — CLIENT PORTAL

### PROMPT 11 — Client Portal (All Pages)

```
Create the client portal with EXACT code from 18_CLIENT_PORTAL.md:

1. src/app/portal/layout.tsx → "Client Layout" section
2. src/app/portal/dashboard/page.tsx → "Client Dashboard" section
3. src/app/portal/projects/[id]/page.tsx → "Project Tracker Page" section (full page with all imports)
4. src/components/portal/FolderGrid.tsx → a grid of folder cards
   - Show each folder as a card with icon, name, description
   - Click a folder → link to /portal/projects/[id]?folder=[folder_id] or expand inline
   - Only show "Add Link" button on folders where upload_roles includes 'client'
5. src/app/portal/projects/[id]/deliverables/page.tsx → deliverables page
   - Table: file_name, type, dimensions, format, duration, status
   - "Approve" button on rows with status 'delivered' (uses approveDeliverable action)
   - FileLinkRow for each deliverable link (opens external URL)

Now add Realtime to the client project page:
6. In src/app/portal/projects/[id]/page.tsx: extract client-side interaction into a Client Component wrapper that uses the useProjectRealtime hook from 15_REALTIME_NOTIFICATIONS.md
   - On any realtime event: call router.refresh() to reload server data
```

**✅ CHECKPOINT 11:**

---

## PHASE 12 — ENABLE REALTIME (manual step)

### PROMPT 12 — Enable Supabase Realtime

```
No storage buckets are needed in this project. Files are pasted as external links (Google Drive etc.).

Please provide me with the SQL from 15_REALTIME_NOTIFICATIONS.md → "Enable Realtime in Supabase" section so I can run it manually in Supabase SQL Editor.
```

**✅ CHECKPOINT 12 (manual):**

---

## PHASE 13 — FINAL POLISH

### PROMPT 13A — Deliverables + Activity Log

```
Complete the remaining features:

1. src/app/admin/projects/[id]/deliverables/page.tsx → admin deliverables management
   - Show deliverables table with all columns
   - "Add Deliverable" form using addDeliverable() server action
   - Fields: type (video/image), file_name, dimensions, resolution, format, duration, status
   - Option to link to an existing file in the project
   - FileDownloadButton for each deliverable

2. A basic activity log viewer for admins:
   src/app/admin/projects/[id]/activity/page.tsx
   - Fetch last 50 activity_log rows for this project
   - Show: timestamp, actor name, action, entity name
   - Simple list, newest first
   - No pagination needed for now
```

**✅ CHECKPOINT 13A:**

---

### PROMPT 13B — Error States + Loading

```
Add proper empty states and loading to every page that can have them:

1. All list pages (projects, users, files, deliverables) should show a friendly empty state card when there is no data.

2. Add a simple loading.tsx next to every page.tsx using Next.js loading convention:
   - src/app/admin/dashboard/loading.tsx
   - src/app/admin/projects/loading.tsx
   - src/app/team/dashboard/loading.tsx
   - src/app/portal/dashboard/loading.tsx
   - src/app/portal/projects/[id]/loading.tsx

   Each loading.tsx should show a simple skeleton or spinner appropriate to that page.

3. Add a global error.tsx:
   - src/app/error.tsx
   Shows a friendly "Something went wrong" message with a "Try again" button.

4. Add a custom 404 page:
   - src/app/not-found.tsx
   Shows "Page not found" with links back to the portals.
```

**✅ CHECKPOINT 13B:**

---

## PHASE 14 — PRE-DEPLOYMENT

### PROMPT 14 — Final Type Check + Build

```
Run a complete audit of the codebase:

1. Run: npx tsc --noEmit
   Fix ALL TypeScript errors before continuing.

2. Run: npm run lint
   Fix ALL ESLint errors before continuing.

3. Run: npm run build
   Fix ALL build errors before continuing.

4. Check every server action file starts with 'use server'
5. Check every client component that uses hooks or browser APIs starts with 'use client'
6. Check that admin.ts is never imported in any file under src/app/ directly
   (it should only be imported in files under src/lib/actions/)
7. Check that no component imports from src/lib/supabase/admin.ts
```

**✅ CHECKPOINT 14 (all must pass):**

---

## PHASE 15 — DEPLOYMENT

### PROMPT 15 — Deploy to Vercel

```
Help me deploy this Next.js project to Vercel.

1. Create a .gitignore if one doesn't exist — make sure .env.local is in it
2. Show me the exact git commands to push to GitHub
3. Walk me through adding all environment variables in the Vercel dashboard
4. After deployment, provide a checklist of all URLs to test on the live domain
5. Provide the SQL to create the first admin user in the production Supabase project
```

**✅ CHECKPOINT 15 — FINAL:**
```
Live site tests (replace with your actual domain):

✅ https://portal.elevique.in/api/health → {"status":"ok"}
✅ https://portal.elevique.in/admin/login → renders
✅ https://portal.elevique.in/team/login → renders
✅ https://portal.elevique.in/portal/login → renders
✅ Admin login → dashboard loads
✅ Admin: create team member → welcome email arrives
✅ Admin: create client → welcome email arrives
✅ Admin: create project → milestones/folders/checklist auto-seeded
✅ Admin: assign team member
✅ Team: login → sees only assigned project
✅ Team: update milestone
✅ Client: login → sees only own project
✅ Client: milestone update reflects in real-time
✅ Client cannot access other client's project URL (test manually)
✅ Admin: add external link to a folder → FileLinkRow renders with correct provider icon
✅ Client: external link opens in new tab
✅ Deliverable added + client can approve
```

---

## TROUBLESHOOTING

### "Invalid API key" or "Could not find anon key"
→ Check .env.local values. Make sure there are no extra spaces or quotes.

### TypeScript errors mentioning `Database` type
→ Regenerate types: `npm run db:types`

### Middleware redirecting logged-in users
→ Check that the profile row exists for the user in Supabase → profiles table

### Rate limit errors in development
→ Normal if you're making many requests quickly. Wait 60 seconds.

### External link 403 / access denied error
→ This project uses no file storage. If an external link (Google Drive, Dropbox, etc.) returns 403, check the sharing settings on the external file — it must be set to "Anyone with the link can view". There are no storage bucket policies in this project.

### Realtime not working
→ Check Supabase → Database → Replication has the tables enabled

### Email not sending
→ Check Resend domain is verified + RESEND_API_KEY is correct in env vars

### RLS blocking admin
→ Check the admin profile row has `role = 'admin'` and `is_active = true`
