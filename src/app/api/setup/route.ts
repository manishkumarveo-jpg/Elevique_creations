import { NextResponse } from 'next/server'
import { createAdminClient } from '@/shared/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    // Kill switch: setup is only reachable when SETUP_TOKEN is explicitly
    // configured, and the caller must present it. Unset the env var in
    // production once the first admin account has been created.
    const setupToken = process.env.SETUP_TOKEN
    const providedToken = request.headers.get('x-setup-token')
    if (!setupToken || providedToken !== setupToken) {
      return NextResponse.json({ error: 'Setup is not available.' }, { status: 403 })
    }

    const { full_name, email, password } = await request.json()

    if (!full_name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Block setup if any admin already exists
    const { count, error: countError } = await adminClient
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'admin')

    if (countError) {
      console.error('[API Setup] Admin count check failed:', countError)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    if (count && count > 0) {
      return NextResponse.json(
        { error: 'Setup already complete. An admin account already exists.' },
        { status: 403 }
      )
    }

    // Create auth user with service role (bypasses email confirmation)
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, role: 'admin' },
    })

    if (authError) {
      console.error('[API Setup] createUser failed:', authError)
      return NextResponse.json({ error: 'Failed to create admin account.' }, { status: 400 })
    }

    // Update the auto-created profile to admin role
    const { error: profileError } = await adminClient
      .from('profiles')
      .update({ full_name, role: 'admin', is_active: true })
      .eq('id', authData.user.id)

    if (profileError) {
      // Profile row might not exist if trigger failed — insert it
      const { error: insertError } = await adminClient
        .from('profiles')
        .insert({ id: authData.user.id, email, full_name, role: 'admin', is_active: true })

      if (insertError) {
        console.error('[API Setup] Profile creation failed:', insertError)
        return NextResponse.json({ error: 'User created but profile setup failed.' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('[API Setup] Uncaught handler error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
