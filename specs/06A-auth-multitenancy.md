# 06A — Auth & Multitenancy
> Elevique Client Portal · Role Boundaries, Next.js Middleware, and Cookie-Based Sessions

This specification defines the multi-role authentication and tenant boundaries that isolate Admin, Team, and Client users.

---

## 1. Authentication Strategy

Elevique implements **Cookie-Based Sessions** using `@supabase/ssr` to securely maintain user states on both server-side components and edge middleware.
- **No Self-Signup**: Admin manually creates all accounts. Signups through public forms are disabled at the Supabase project configuration level.
- **Login Routes**:
  - `/admin/login` (For studio administrators)
  - `/team/login` (For creative staff)
  - `/portal/login` (For clients)
- **Shared Redirect Point**: If a session drops or a user visits a protected URL without authorization, the portal redirects to `/login` or `/unauthorized`.

---

## 2. Next.js Edge Middleware Protection

All requests targeting `/admin/*`, `/team/*`, `/portal/*`, or `/api/*` pass through `src/middleware.ts` before rendering or routing occurs.

### Authorization Workflow

```
Request Hits Endpoint (e.g. `/team/projects`)
            │
            ▼
Refresh and Parse Auth Cookies via `@supabase/ssr`
            │
            ├─► No User Session? ──► Redirect to `/login`
            │
            ▼
Fetch profile record for `auth.uid()` from `profiles`
            │
            ├─► Profile `is_active` = FALSE? ─► Redirect to `/unauthorized`
            │
            ├─► Role Mismatch for Route? ──────► Redirect to `/unauthorized`
            │
            ▼
Allow page render + Inject Security Headers (X-Frame-Options: DENY, etc.)
```

- **Active Check**: Even with a valid session, the middleware validates that `profiles.is_active` is explicitly `true` to allow instant suspension of accounts by Admins.
- **Performance**: Middleware runs on Vercel's Edge runtime with zero cold starts, querying profile rows via optimized API calls.

---

## 3. Security Boundary Invariants

- **Tenant Isolation**: Row Level Security (RLS) is applied at the database table level, matching `projects.client_id = auth.uid()` for client routes. If a client attempts to browse Client B's project ID `/portal/projects/client-b-id`, Supabase returns zero rows, preventing data leakage.
- **JWT Expiry**: Configured to 1 hour (3600 seconds), ensuring inactive tabs force validation checks at periodic intervals.
