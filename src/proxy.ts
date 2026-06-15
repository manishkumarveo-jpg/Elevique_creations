import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let ratelimit: Ratelimit | null = null

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100, '60 s'),
    analytics: true,
    prefix: 'elevique_rl',
  })
  return ratelimit
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Rate limiting on all API routes
  if (pathname.startsWith('/api/')) {
    const limiter = getRatelimit()
    if (limiter) {
      const ip =
        request.headers.get('x-real-ip') ??
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
        '127.0.0.1'

      const { success, remaining, reset } = await limiter.limit(ip)

      if (!success) {
        return new NextResponse(
          JSON.stringify({ error: 'Too many requests. Please slow down.' }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
              'Retry-After': '60',
            },
          }
        )
      }
    }
  }

  // Supabase client — refreshes session cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  // Stale or invalid refresh token — clear session and send to login
  // Stale or invalid refresh token — clear session and either return 401 for API routes or redirect to login for pages
if (authError?.name === 'AuthApiError') {
  const isApi = pathname.startsWith('/api/')
  const sbCookies = request.cookies.getAll().filter(c => c.name.startsWith('sb-'))

  if (isApi) {
    const res = new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
    sbCookies.forEach(c => res.cookies.delete(c.name))
    return res
  }

  const loginUrl = new URL('/login', request.url)
  const redirect = NextResponse.redirect(loginUrl)
  sbCookies.forEach(c => redirect.cookies.delete(c.name))
  return redirect
}

  // Coarse-grained auth gate: just ensure a session exists.
  // Fine-grained role/active checks are done inside each page via require-role.ts.
  const isProtected =
    (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) ||
    (pathname.startsWith('/team')  && !pathname.startsWith('/team/login'))  ||
    (pathname.startsWith('/portal') && !pathname.startsWith('/portal/login'))

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/team/:path*',
    '/portal/:path*',
    '/api/:path*',
  ],
}
