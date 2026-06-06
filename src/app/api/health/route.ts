import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { error } = await supabase.from('profiles').select('id').limit(1)

    if (error) throw error

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'elevique-portal',
    })
  } catch {
    return NextResponse.json(
      { status: 'error', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
