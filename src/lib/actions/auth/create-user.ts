'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { requireAdmin } from '@/lib/auth/require-role'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/actions/activity'
import { revalidatePath } from 'next/cache'

const CreateUserSchema = z.object({
  full_name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  role: z.enum(['team_member', 'client']),
  company_name: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
  temporary_password: z.string().min(8),
})

export async function createUserAccount(input: unknown) {
  const user = await requireAdmin()
  const data = CreateUserSchema.parse(input)
  const adminClient = createAdminClient()

  // Step 1: Create auth user (service role — bypasses email confirmation)
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: data.email,
    password: data.temporary_password,
    email_confirm: true,
    user_metadata: {
      full_name: data.full_name,
      role: data.role,
    },
  })

  if (authError) {
    if (authError.message.toLowerCase().includes('already registered')) {
      throw new Error('A user with this email already exists.')
    }
    throw new Error(authError.message)
  }

  const userId = authData.user.id

  // Step 2: Upsert profile directly with service role — never depends on trigger
  const { error: profileError } = await adminClient
    .from('profiles')
    .upsert({
      id: userId,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      company_name: data.company_name ?? null,
      phone: data.phone ?? null,
      is_active: true,
      created_by: user.id,
    }, { onConflict: 'id' })

  if (profileError) {
    // Roll back the auth user so no orphan is left
    await adminClient.auth.admin.deleteUser(userId)
    throw new Error('Failed to create user profile: ' + profileError.message)
  }

  // Step 3: Send welcome email (non-blocking — don't fail user creation if email fails)
  try {
    await sendWelcomeEmail({
      name: data.full_name,
      email: data.email,
      password: data.temporary_password,
      role: data.role,
    })
  } catch (emailErr) {
    console.error('Welcome email failed (user still created):', emailErr)
  }

  // Step 4: Log activity
  await logActivity({
    actor_id: user.id,
    actor_role: 'admin',
    action: 'created_user',
    entity_type: 'user',
    entity_id: userId,
    entity_name: data.full_name,
    metadata: { role: data.role, email: data.email },
  })

  revalidatePath('/admin/users')
  return { success: true, userId }
}

async function sendWelcomeEmail({
  name, email, password, role,
}: {
  name: string
  email: string
  password: string
  role: 'team_member' | 'client'
}) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${role === 'team_member' ? 'team' : 'portal'}/login`

  await resend.emails.send({
    from: 'Elevique <hello@elevique.in>',
    to: email,
    subject: 'Welcome to Elevique Portal — Your Login Details',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <h2 style="color:#1A1A2E;">Welcome to Elevique, ${name}!</h2>
        <p>Your ${role === 'team_member' ? 'team member' : 'client'} account is ready.</p>
        <div style="background:#F7F6F3;border-radius:8px;padding:16px;margin:20px 0;">
          <p style="margin:0 0 8px;"><strong>Login URL:</strong><br>
            <a href="${loginUrl}">${loginUrl}</a></p>
          <p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
          <p style="margin:0;color:#D85A30;"><strong>Temporary Password:</strong> ${password}</p>
        </div>
        <p style="color:#D85A30;font-size:14px;">⚠️ Please change your password after first login.</p>
        <hr style="border:none;border-top:1px solid #E2E0DA;margin:20px 0;">
        <p style="color:#888;font-size:12px;">© 2026 Elevique · elevique.in</p>
      </div>
    `,
  })
}
