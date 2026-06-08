# 02 — Architecture
> Elevique Client Portal · System Design

---

## Overview

The system uses a **layered security architecture** with five independent security layers. Removing any single layer does not compromise the system — defence in depth.

```
Browser / Mobile
      │
      ▼
┌─────────────────────────────────────────────┐
│             Cloudflare (Free)               │
│   DDoS protection · Bot mitigation · CDN   │
└─────────────────────────┬───────────────────┘
                          │
┌─────────────────────────▼───────────────────┐
│              Vercel (Hosting)               │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │         Next.js 14 App               │   │
│  │                                      │   │
│  │  /admin/*   /team/*   /portal/*      │   │
│  │       │         │         │          │   │
│  │       └────┬────┘         │          │   │
│  │            │              │          │   │
│  │    ┌───────▼──────┐       │          │   │
│  │    │  middleware  │◄──────┘          │   │
│  │    │  .ts         │                  │   │
│  │    │  Rate limit  │                  │   │
│  │    │  Role check  │                  │   │
│  │    └───────┬──────┘                  │   │
│  │            │                         │   │
│  │    ┌───────▼──────────────┐          │   │
│  │    │  Server Actions      │          │   │
│  │    │  + API Routes        │          │   │
│  │    │  Zod validation      │          │   │
│  │    │  requireRole()       │          │   │
│  │    └───────┬──────────────┘          │   │
│  └────────────┼────────────────────────-┘   │
└───────────────┼─────────────────────────────┘
                │
┌───────────────▼─────────────────────────────┐
│                 SUPABASE                    │
│                                             │
│  ┌─────────────┐  ┌──────────┐  ┌────────┐ │
│  │ PostgreSQL  │  │   Auth   │  │Storage │ │
│  │  + RLS      │  │          │  │Buckets │ │
│  └─────────────┘  └──────────┘  └────────┘ │
│  ┌─────────────┐  ┌──────────────────────┐  │
│  │  Realtime   │  │   Edge Functions     │  │
│  │  Websockets │  │   (email triggers)   │  │
│  └─────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────┐
│           External Services                 │
│                                             │
│  Upstash Redis        Resend                │
│  (rate limiting)      (transactional email) │
└─────────────────────────────────────────────┘
```

---

## The Five Security Layers

| Layer | Where | What It Does |
|-------|-------|--------------|
| **1 — Cloudflare** | DNS/CDN | DDoS protection, bot mitigation, SSL termination |
| **2 — Middleware** | Next.js Edge | Route auth check + role verification + rate limiting |
| **3 — Server Actions** | Next.js Server | Zod input validation + requireRole() function calls |
| **4 — RLS Policies** | Supabase DB | Row-level access enforcement — cannot be bypassed by app code |
| **5 — Storage Policies** | Supabase Storage | Private buckets, signed URL access, role-based upload rules |

---

## Request Lifecycle

### Authenticated Page Request (e.g. Team member visits `/team/projects/abc`)

```
1. Request hits Cloudflare edge → DDoS check passes
2. Request hits Vercel → Next.js middleware runs
3. Middleware calls Upstash Redis → rate limit check (100 req/60s per IP)
4. Middleware calls Supabase Auth → validates session cookie
5. Middleware fetches profiles row → checks role = 'team_member' and is_active = true
6. Middleware checks: does /team/* match role 'team_member'? Yes → allow
7. Next.js server component runs → calls Supabase with user's session token
8. Supabase RLS evaluates: is this user assigned to this project? 
   → YES: returns data
   → NO: returns empty (not an error, just no rows)
9. Page renders with only data the user is allowed to see
```

### Add File Link Request

```
1. Admin or team member pastes an external URL (Google Drive, Dropbox, etc.) into AddLinkForm
2. Browser calls saveLinkRecord() server action with { project_id, folder_id, file_url, file_name }
3. Server validates session and role (requireAdmin / requireTeamMember)
4. Server calls isValidUrl(file_url) → rejects malformed URLs
5. Server checks folder upload_roles[] contains the user's role
6. Server inserts row into files table (storing file_url, file_name, folder_id, added_by)
7. Supabase RLS enforces read access — only authorised roles see the row
8. Supabase Realtime broadcasts change → other viewers update live
9. Clients open the external link directly in a new tab (no signed URL, no download proxy)
```

---

## Data Architecture

### How Roles Connect to Data

```
profiles (id, role)
    │
    ├── role = 'admin'
    │       └── Can query everything (RLS bypassed for admin)
    │
    ├── role = 'team_member'
    │       └── project_assignments (user_id, project_id)
    │                   └── Can only query projects WHERE id IN (assigned project_ids)
    │
    └── role = 'client'
            └── projects (client_id = auth.uid())
                        └── Can only query projects WHERE client_id = auth.uid()
```

### Project Data Ownership

```
projects
    ├── client_id → profiles (the client who owns this project)
    ├── created_by → profiles (the admin who created it)
    │
    ├── project_assignments → profiles (team members assigned)
    ├── milestones (auto-seeded: 4 phases)
    ├── folders (auto-seeded: 6 folders)
    │       └── files (uploaded by admin/team/client per upload_roles[])
    │               └── storage object (Supabase Storage)
    ├── deliverables (linked to files)
    └── asset_checklist (auto-seeded: 6 items)
```

---

## Environment Separation

| Environment | URL | Supabase Project | Notes |
|-------------|-----|-----------------|-------|
| Development | localhost:3000 | Separate dev project | `npx supabase start` for local |
| Preview | auto.vercel.app | Dev project | Auto-deployed per PR |
| Production | portal.elevique.in | Production project | Main project, PITR backups on |

---

## Key Architectural Decisions

### Why Supabase over custom backend?
- Auth, DB, Storage, Realtime all in one — no separate services to maintain
- RLS enforces security at DB level — cannot be accidentally bypassed
- Edge Functions for lightweight tasks (email triggers)
- Admin SDK available server-side via service role key

### Why Next.js App Router?
- Server Components fetch data without API routes — less code, better performance
- Server Actions replace REST endpoints for mutations — type-safe end-to-end
- Middleware runs at Edge — rate limiting and auth checks with zero cold start
- ISR caching built in — fast page loads, automatic revalidation

### Why Upstash Redis for rate limiting?
- Serverless-compatible (REST API, not TCP connection)
- Works in Vercel Edge middleware (where you cannot open TCP connections)
- Free tier is sufficient for early scale

### Why no client-side Supabase calls for mutations?
- All mutations (create, update, delete) go through Server Actions
- Server Actions run server-side — service role key stays on server
- Zod validation and role checks happen before any DB write
- Client only calls Supabase directly for: session management + Realtime subscriptions
