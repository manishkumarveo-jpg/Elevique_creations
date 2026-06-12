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

  const { data: { user } } = await supabase.auth.getUser()

  // Route protection
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
    const { data: profile } = await supabase
      .from('profiles').select('role, is_active').eq('id', user.id).single()
    if (!profile || !profile.is_active || profile.role !== 'admin')
      return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  if (pathname.startsWith('/team') && !pathname.startsWith('/team/login')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
    const { data: profile } = await supabase
      .from('profiles').select('role, is_active').eq('id', user.id).single()
    if (!profile || !profile.is_active || profile.role !== 'team_member')
      return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  if (pathname.startsWith('/portal') && !pathname.startsWith('/portal/login')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
    const { data: profile } = await supabase
      .from('profiles').select('role, is_active').eq('id', user.id).single()
    if (!profile || !profile.is_active || profile.role !== 'client')
      return NextResponse.redirect(new URL('/unauthorized', request.url))
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
