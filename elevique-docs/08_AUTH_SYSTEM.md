# 08 — Auth System
> Elevique Client Portal · Admin Creates All Accounts · No Public Signup

---

## Supabase Client Instances

Three separate clients cover every usage context:

- **`createServerClient()`** — `src/lib/supabase/server.ts` — reads cookies via `next/headers`; use in Server Components and Server Actions. Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **`createClientSupabase()`** — `src/lib/supabase/client.ts` — browser singleton via `@supabase/ssr`; use in Client Components for session management and Realtime subscriptions only.
- **`createAdminClient()`** — `src/lib/supabase/admin.ts` — service-role client; bypasses RLS. **Never import in `src/app/` directly** — only via `src/lib/actions/`.  Requires `SUPABASE_SERVICE_ROLE_KEY`.

Required env vars:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

---

## Require Role Helpers

Located at `src/lib/auth/require-role.ts`. Each helper calls `createServerClient()`, retrieves the session, then fetches the `profiles` row to verify `role` and `is_active = true`. On failure it throws a redirect to `/unauthorized`.

```ts
requireAdmin(): Promise<{ user: User; profile: Profile }>
requireTeamMember(): Promise<{ user: User; profile: Profile }>
requireClient(): Promise<{ user: User; profile: Profile }>
```

Usage inside a Server Action or page:
```ts
const { user, profile } = await requireAdmin()
```

---

## Create User Account (Admin Only)

Located at `src/lib/actions/auth/create-user.ts`. Uses `createAdminClient()`.

**Flow:**
1. `requireAdmin()` — aborts if caller is not admin
2. Zod validates: `email` (valid email), `full_name` (non-empty), `role` (`admin | team_member | client`), optional `phone` and `company`
3. `adminClient.auth.admin.createUser({ email, password, email_confirm: true })`
4. Insert row into `profiles` with `id = newUser.id`, `role`, `full_name`, etc.
5. Send welcome email via Resend with temporary password
6. Log action via `logActivity()`

Returns `{ success: true, userId }` or `{ error: string }`.

---

## Reset Password (Admin Only)

Located at `src/lib/actions/auth/reset-password.ts`.

**Flow:**
1. `requireAdmin()`
2. Validate `userId` (UUID) and `newPassword` (min 8 chars)
3. `adminClient.auth.admin.updateUserById(userId, { password: newPassword })`
4. Send password-reset notification email
5. `logActivity(adminId, 'password_reset', { target_user: userId })`

Returns `{ success: true }` or `{ error: string }`.

---

## Deactivate / Reactivate User (Admin Only)

Located at `src/lib/actions/auth/deactivate-user.ts`.

Uses a **soft-disable** approach — sets `profiles.is_active = false` (or `true`). Middleware checks `is_active` on every request and redirects inactive users to `/unauthorized`.

```ts
deactivateUser(userId: string): Promise<ActionResult>
reactivateUser(userId: string): Promise<ActionResult>
```

**Flow:**
1. `requireAdmin()`
2. Update `profiles SET is_active = false/true WHERE id = userId`
3. `logActivity()`

No hard deletion — all data is preserved.

---

## Login Pages (shared pattern)

Three separate pages, each a `'use client'` component:

| Path | Title | Redirect on success |
|------|-------|---------------------|
| `/admin/login` | Admin Portal | `/admin/dashboard` |
| `/team/login` | Team Portal | `/team/dashboard` |
| `/portal/login` | Client Portal | `/portal/dashboard` |

All three share the same implementation pattern:
1. Import `createClientSupabase` from `@/lib/supabase/client`
2. `supabase.auth.signInWithPassword({ email, password })`
3. On `AuthApiError`: display "Invalid email or password."
4. On success: `router.push(redirectPath)`
5. UI: shadcn `Input`, `Label`, `Button` (primary color `#6C47FF`)

---

## Logout Action

Located at `src/lib/actions/auth/logout.ts` (or per-role variants). Uses `createServerClient()`.

```ts
export async function logoutAdmin(): Promise<never>
export async function logoutTeam(): Promise<never>
export async function logoutClient(): Promise<never>
```

Each calls `supabase.auth.signOut()` then `redirect('/[role]/login')`. Used as a form action in sidebar components.

