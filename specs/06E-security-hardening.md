# 06E — Security Hardening
> Elevique Client Portal · Defense-in-Depth, Security Headers, and Env Configuration

This specification maps the complete security blueprint of the Elevique system, detailing defense measures across all layers.

---

## 1. Edge-Injected HTTP Security Headers

Next.js Middleware injects strict security policy headers on all served HTML pages and API queries:

| Header | Value | Purpose |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Disables browser MIME sniffing, forcing files to match declared content types. |
| `X-Frame-Options` | `DENY` | Disables frame embedding to prevent clickjacking exploits. |
| `X-XSS-Protection` | `1; mode=block` | Instructs modern browsers to block pages if cross-site scripting is detected. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits page referrers to secure paths only. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Blocks access to device sensors. |

---

## 2. Server Action Sanitization & Zod Guards

No client variables are written directly to the database. All mutation parameters pass through strict Zod validators:

- **String Sanitization**: Inputs are stripped of HTML tags, trimmed of excess whitespace, and verified against character length thresholds.
- **Role Verification**: Server Actions execute `requireRole()` checks on the authenticated session before running query blocks. Even if a user bypasses client UI locks, the action halts if the authenticated role lacks permissions.
- **Example Guard Pattern**:
  ```ts
  const user = await getSessionUser()
  if (user.role !== 'admin') {
    throw new Error("Forbidden")
  }
  ```

---

## 3. Environment Protection & Secret Keys

- **Service Role Scope**: The administrative Supabase key (`SUPABASE_SERVICE_ROLE_KEY`) is stored strictly in server-side configuration profiles. It is never imported inside browser-bound layouts, hooks, or standard components.
- **Client Client Limits**: Browser clients (`createBrowserClient()`) connect using the anon public key only, ensuring query requests conform to RLS policies.
- **Git Protections**: `.env.local` is listed inside `.gitignore` to prevent secret leaks to public version control repositories.
