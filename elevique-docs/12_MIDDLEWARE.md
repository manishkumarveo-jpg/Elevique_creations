# 12 — Middleware & Route Guard
> Elevique Client Portal · Edge Middleware, Rate Limiting, Security Headers

---

## middleware.ts (root of src/)

File: `src/middleware.ts`. Runs at the Vercel Edge before every request.

**Function signature:**
```ts
export async function middleware(request: NextRequest): Promise<NextResponse>
```

**Flow:**
1. Skip public paths (`/admin/login`, `/team/login`, `/portal/login`, `/api/health`, `/_next/*`, `/favicon.ico`)
2. Call Upstash Redis rate limiter — 100 requests per 60 s per IP. Return `429` on breach.
3. Call `createServerClient()` and `supabase.auth.getUser()` — redirect to the matching `/[role]/login` if no session
4. Fetch `profiles` row for `user.id` — check `is_active = true`, else redirect to `/unauthorized`
5. Verify path prefix matches `ROLE_ROUTES[profile.role].base` — redirect to `/unauthorized` on mismatch
6. Call `setSecurityHeaders(response)` before returning

**Matcher config:**
```ts
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### Rate Limiting

Algorithm: **fixed window** — 100 requests per 60 s per IP.  
Storage: Upstash Redis (REST API — works in Edge runtime).  
Utility: `@upstash/ratelimit` with `Ratelimit.fixedWindow(100, '60 s')`.  
Key: `ratelimit:${ip}`.  
On limit exceeded: return `NextResponse.json({ error: 'Too many requests' }, { status: 429 })`.

### Security Headers

Set via a `setSecurityHeaders(response: NextResponse): NextResponse` helper in `src/lib/middleware/headers.ts`:

| Header | Value |
|--------|-------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co; frame-ancestors 'none'` (inject a per-request nonce via `crypto.randomUUID()` for any inline scripts) |

---

## Health Check Route

File: `src/app/api/health/route.ts`

```
GET /api/health
```

Response shape:
```json
{ "status": "ok", "timestamp": "2026-06-08T00:00:00.000Z" }
```

Performs a lightweight DB ping (`SELECT 1`) via `createServerClient()` — returns `503` if Supabase is unreachable.  
This route is excluded from the middleware auth check (public path).

---

## Unauthorized Page

File: `src/app/unauthorized/page.tsx`

Rendered when middleware denies access. Static Server Component — no data fetching.  
Shows: "You don't have permission to view this page." with links back to each login portal.  
HTTP status is set by middleware returning `NextResponse.rewrite(new URL('/unauthorized', request.url))` with status 403.

---

## next.config.ts

Required settings:

```ts
const nextConfig = {
  // Restrict external image origins if any images are served from Supabase
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
  },
  // Ensure Edge middleware runs correctly
  experimental: {
    serverActions: { allowedOrigins: ['portal.elevique.in'] },
  },
}
```

No custom `headers()` config needed — security headers are set inside `middleware.ts`.

