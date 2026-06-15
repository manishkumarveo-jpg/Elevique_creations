# ROADMAP
> Elevique Client Portal · Categorized Work Queue from Spec Review

All items below are derived directly from the existing spec files. Each entry references its source spec so it can be cross-checked before implementation.

---

## 🟢 NEW FEATURES — Not Yet Built

### 1. Admin Final Approval Gate (`07A`)
Full implementation plan already written in `07A-admin-final-approval-gate-for project-finslization`. Nothing in this plan has been shipped yet.

**Database (migration `20260612_21_admin_approval_gate.sql`)**
- [ ] Add columns `admin_approved` (bool), `approved_by_admin` (uuid), `admin_approved_at` (timestamptz) to `projects`
- [ ] Add DB constraint: `CHECK (status <> 'completed' OR admin_approved = true)`
- [ ] Create `enforce_admin_approval()` trigger — blocks clients from updating, blocks non-admins from toggling approval columns, blocks `completed` without approval
- [ ] Fix `sync_project_status()` trigger to advance to `final_review` instead of directly to `completed` when all milestones are done
- [ ] Add RLS UPDATE policy for team members on `projects`

**TypeScript Types (`src/lib/types/database.ts`)**
- [ ] Add `admin_approved`, `approved_by_admin`, `admin_approved_at` to `projects` Row and Update types

**Server Actions (`src/lib/actions/projects/approval.ts`)**
- [ ] `giveAdminApproval(projectId)` — sets approval fields, logs `admin_final_approval`
- [ ] `revokeAdminApproval(projectId)` — clears approval fields (trigger auto-reverts status), logs `admin_approval_revoked`
- [ ] `adminApproveAndFinalize(projectId)` — sets approval + `status='completed'` in one UPDATE
- [ ] `finalizeProject(projectId)` — team member calls this; trigger blocks if not yet approved

**Query Update (`src/lib/queries/projects.ts`)**
- [ ] Extend `getProjectById` select to join approver profile: `approver:profiles!projects_approved_by_admin_fkey(id, full_name)`

**Admin UI (`src/app/admin/projects/[id]/AdminApprovalPanel.tsx`)**
- [ ] `final_review` + not approved → show "Give Final Approval" + "Approve & Finalize" buttons, badge `Pending Admin Approval` (orange)
- [ ] `final_review` + approved → show "Finalize Project" + "Revoke Approval" buttons, badge `Approved by {name}` (green)
- [ ] `completed` → show "Revoke Approval" button, green badge
- [ ] Wire into `src/app/admin/projects/[id]/page.tsx` Overview tab

**Team UI (`src/app/team/projects/[id]/FinalizeProjectPanel.tsx`)**
- [ ] `final_review` + not approved → disabled Finalize button, orange badge
- [ ] `final_review` + approved → active Finalize button, green badge
- [ ] Wire into `src/app/team/projects/[id]/page.tsx` header area

---

### 2. Admin Inquiries — Mark as Addressed / Soft-Delete (`06C`)
The spec states: *"Admin can mark inquiries as addressed or soft-delete them from the inbox."* Current `/admin/inquiries` page only renders a read-only table.

- [ ] Add `is_read` and `is_archived` (or `is_deleted`) boolean columns to `contact_submissions` via migration
- [ ] Add RLS UPDATE policy for admins on `contact_submissions`
- [ ] Server Action: `markInquiryRead(id)` and `archiveInquiry(id)` in `src/lib/actions/contact/`
- [ ] UI: Add "Mark Read" / "Archive" buttons on each inquiry row in `/admin/inquiries`
- [ ] Filter: Default view shows unread; add toggle for archived view

---

### 3. Social Leads — Admin Inbox Actions (`06C` extension)
Same pattern as inquiries — the `/admin/leads` page is read-only. Leads should have status management.

- [ ] Add `is_contacted` boolean column to `social_leads` via migration
- [ ] Server Action: `markLeadContacted(id)` in `src/lib/actions/leads/`
- [ ] UI: Add "Mark Contacted" badge/button per lead row

---

### 4. Unspecced Routes — Write Specs and Implement
These routes exist in the build output but have no spec file and appear to be stub or incomplete pages:

| Route | Status | Action Needed |
|---|---|---|
| `/admin/analytics` | Compiles, unknown content | Write `08A-analytics.md` spec; implement dashboard with project/lead metrics |
| `/admin/communications` | Compiles, unknown content | Write `08B-admin-communications.md`; likely the same chat interface scoped for admin |
| `/portal/communications` | Compiles | Confirm this mirrors `04B` realtime chat for clients |
| `/admin/documents` | Compiles | Spec and implement document management view |

---

### 5. Testimonials Section — Data-Driven (`02A`)
The `TestimonialsEditorial` component currently uses hardcoded data. Per the landing page spec it should reflect "verified brand feedback".

- [ ] Decide: keep static or pull from a `testimonials` table
- [ ] If DB-driven: create table, seed initial records, update component to fetch via RSC

---

## 🔴 FIXES & TECH DEBT

### 1. Sentry Removed — Update Stale Specs
Sentry was fully removed in commit `d4a0ba2` (deleted `sentry.edge.config.ts`, `sentry.server.config.ts`, example pages). Three spec files still reference Sentry:

- [ ] **`01A-foundation-setup.md`** — Dev checklist item `"Configured Sentry Next.js configuration profiles"` is checked but Sentry is gone. Either uncheck and note removal, or replace with an alternative error tracker.
- [ ] **`06D-system-reliability.md` §2** — Remove "Sentry Integration" from Global Error Boundaries description. Update `global-error.tsx` fallback approach.
- [ ] **`06B-transactional-email.md` §3** — Pattern code comment `// Sentry capture exception` should be removed or replaced with a logging alternative.
- [ ] **`progress-tracker.md` Phase 2** — `"Add Sentry error profiling"` is marked `[x]` but Sentry is removed — mark as removed/replaced.

---

### 2. `global-error.tsx` — Minimal Fallback
The component renders `<NextError statusCode={0} />` which is the default Next.js error page with no Elevique branding. Now that Sentry is removed, there is no error capture either.

- [ ] Replace `<NextError statusCode={0} />` with a branded Elevique error UI
- [ ] Add a "Return Home" button linking to `/`
- [ ] Add client-side `console.error(error)` until a proper error tracker is integrated

---

### 3. `07A` Spec File — Filename Typo
The file is named `07A-admin-final-approval-gate-for project-finslization` (space in name, "finslization" typo).

- [ ] Rename to `07A-admin-approval-gate.md`

---

### 4. Logout Function Signature Break Risk
`src/lib/actions/auth/logout.ts` had its `role` parameter removed in the ESLint cleanup. Confirm no callers still pass the argument.

- [ ] Grep for `logout(` calls across admin, team, and portal logout actions
- [ ] If any caller passes a role string argument, update the signature or the call sites

---

### 5. `code-standards-nextjs-styling.md` — Font Stack Outdated
The spec says the project uses **Outfit** typeface but `src/app/layout.tsx` was updated in commit `e539034` to reduce font weights (Syne, Space Grotesk, Geist Mono). The spec does not reflect the current font configuration.

- [ ] Update `code-standards-nextjs-styling.md §2` to match the actual fonts and weights declared in `layout.tsx`

---

### 6. `06C-contact-leads-handling.md` — Zod Schema Mismatch
The spec shows a `contactSchema` with Zod validators in the admin action. However, the actual `src/app/api/contact/route.ts` is a plain API route (not a Server Action) that does basic field presence checks — no Zod. The spec also says "Actions: Admin can mark inquiries as addressed or soft-delete" which is not implemented.

- [ ] Either add Zod validation to the `/api/contact` route, or update the spec to reflect the current implementation
- [ ] Implement the missing mark-as-addressed/soft-delete actions (see New Features §2 above)

---

### 7. `architecture-invariants.md` §2 — Mutation Invariant vs. API Routes
The invariant states: *"All database changes must execute through Next.js Server Actions. Client-side database client operations are forbidden."* However, `/api/contact` and `/api/leads` are API route handlers (not Server Actions) that write directly via `createAdminClient`.

- [ ] Either: migrate contact/leads writes to Server Actions and delete the API routes
- [ ] Or: update the invariant to acknowledge public-facing API routes as the exception for anonymous submissions
- [ ] Document the exception clearly so agents don't incorrectly refactor the routes

---

## 🔵 MANAGEMENT & HOUSEKEEPING

### 1. Demo Verification — Complete the Checklist (`05A`)
All demo steps in `05A-polish-and-demo.md` are unchecked. Run these manually before launch:

- [ ] Step 1: Admin login at `/admin/login`
- [ ] Step 2: Create Client → verify Resend welcome email fires
- [ ] Step 3: Create Project → verify 4 milestones, 6 folders, 6 checklist items are seeded
- [ ] Step 4: Role boundary audit — Client cannot reach `/admin/*` or `/team/*`
- [ ] Step 5: Realtime sync — milestone update reflects instantly in both Admin and Client windows
- [ ] Step 6: File link + deliverable approval loop

---

### 2. Polish Audit Queue (`progress-tracker.md §2`)
- [ ] Run React Doctor: `npm run doctor` — full regression check
- [ ] Accessibility audit on client forms — ARIA tags, keyboard navigation, focus management
- [ ] Performance audit on heavy visual layers — `AboutScene3D`, `PortfolioReels`, `LocationMap`

---

### 3. Spec Index — Rename and Re-Number
The `07A` file has a filename with a space and a typo, and several spec slots are missing:

| Current File | Issue | Proposed Name |
|---|---|---|
| `07A-admin-final-approval-gate-for project-finslization` | Space + typo | `07A-admin-approval-gate.md` |
| *(missing)* | No spec for analytics | `08A-analytics.md` |
| *(missing)* | No spec for communications | `08B-communications.md` |
| *(missing)* | No spec for documents tab | `08C-documents.md` |

---

### 4. Archive Completed Plan Files
Once `07A` is fully implemented and verified, move it to `specs/archive/` so it does not clutter the active spec list.

---

### 5. CLAUDE.md / AGENTS.md Alignment
Verify the project instructions in `AGENTS.md` and `CLAUDE.md` reflect all the patterns added to `code-standards-general.md` in the ESLint cleanup (sections 4–8: error handling, row typing, hooks rules, component extraction, ref typing).
