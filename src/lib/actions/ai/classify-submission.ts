'use server'

import { z } from 'zod'
import Groq from 'groq-sdk'
import { requireAdmin } from '@/lib/auth/require-role'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/actions/activity'
import { revalidatePath } from 'next/cache'

const InputSchema = z.object({
  table: z.enum(['social_leads', 'contact_submissions']),
  id: z.string().uuid(),
})

type ClassificationResult = {
  summary: string
  priority: 'hot' | 'warm' | 'cold'
  category: string
}

export async function classifySubmission(input: unknown): Promise<{ success: true } & ClassificationResult> {
  throw new Error('AI classification is temporarily disabled.')
}

async function runClassification(input: unknown) {
  const user = await requireAdmin()
  const { table, id } = InputSchema.parse(input)
  const adminClient = createAdminClient()

  let text: string
  let entityName: string

  if (table === 'social_leads') {
    const { data: row, error } = await adminClient.from('social_leads').select('*').eq('id', id).single()
    if (error || !row) throw new Error('Submission not found.')
    text = [row.requirement_brief, row.service_type, row.budget_per_video].filter(Boolean).join(' | ')
    entityName = row.full_name
  } else {
    const { data: row, error } = await adminClient.from('contact_submissions').select('*').eq('id', id).single()
    if (error || !row) throw new Error('Submission not found.')
    text = row.message
    entityName = row.name
  }

  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY is not configured.')
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    response_format: { type: 'json_object' },
    max_tokens: 200,
    messages: [
      {
        role: 'system',
        content:
          'You triage incoming video-production leads/inquiries for a video agency admin. Reply ONLY with JSON: {"summary": string (<=200 chars), "priority": "hot"|"warm"|"cold", "category": string (2-3 words, e.g. "high-budget", "spam-like", "quick-question")}.',
      },
      { role: 'user', content: (text || 'No content provided.').slice(0, 2000) },
    ],
  })

  let parsed: ClassificationResult
  try {
    parsed = JSON.parse(completion.choices[0].message.content ?? '{}') as ClassificationResult
  } catch {
    throw new Error('AI returned an invalid response.')
  }

  const updatePayload = {
    ai_summary: parsed.summary ?? null,
    ai_priority: parsed.priority ?? null,
    ai_category: parsed.category ?? null,
    ai_processed_at: new Date().toISOString(),
  }

  const { error: updateError } = table === 'social_leads'
    ? await adminClient.from('social_leads').update(updatePayload).eq('id', id)
    : await adminClient.from('contact_submissions').update(updatePayload).eq('id', id)
  if (updateError) throw new Error('Failed to save AI analysis: ' + updateError.message)

  await logActivity({
    actor_id: user.id,
    actor_role: 'admin',
    action: 'ai_classified_submission',
    entity_type: table === 'social_leads' ? 'lead' : 'inquiry',
    entity_id: id,
    entity_name: entityName,
    metadata: { priority: parsed.priority, category: parsed.category },
  })

  revalidatePath(table === 'social_leads' ? '/admin/leads' : '/admin/inquiries')
  return { success: true, ...parsed }
}

export async function classifyAllUnprocessed(table: 'social_leads' | 'contact_submissions') {
  await requireAdmin()
  const adminClient = createAdminClient()
  const { data: rows } = await adminClient
    .from(table)
    .select('id')
    .is('ai_processed_at', null)
    .limit(25)

  for (const row of rows ?? []) {
    await classifySubmission({ table, id: row.id })
  }

  return { success: true, count: rows?.length ?? 0 }
}
