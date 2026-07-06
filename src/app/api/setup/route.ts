import { NextResponse } from 'next/server'
import { createAdminClient } from '@/shared/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { full_name, email, password } = await request.json()

    if (!full_name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Block setup if any admin already exists
    const { count } = await adminClient
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'admin')

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
      return NextResponse.json({ error: authError.message }, { status: 400 })
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
        return NextResponse.json({ error: 'User created but profile failed: ' + insertError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
