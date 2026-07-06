'use client'

import { useState, useTransition } from 'react'
import { Check } from 'lucide-react'
import { markMeetingAttended } from '@/dashboard/lib/actions/meetings/mark-attended'

export function MeetingAttendButton({ meetingId }: { meetingId: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const onClick = () => {
    setError(null)
    startTransition(async () => {
      try {
        const result = await markMeetingAttended(meetingId)
        if (!result.success) setError(result.error ?? 'Failed to mark attended')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to mark attended')
      }
    })
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.2rem' }}>
      <button
        onClick={onClick}
        disabled={isPending}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          fontSize: '11.5px',
          fontWeight: 500,
          color: '#0ED2BD',
          background: 'rgba(14,210,189,0.08)',
          border: '1px solid rgba(14,210,189,0.22)',
          borderRadius: '6px',
          padding: '0.3rem 0.625rem',
          cursor: isPending ? 'not-allowed' : 'pointer',
          flexShrink: 0,
          opacity: isPending ? 0.6 : 1,
          transition: 'opacity 0.15s',
        }}
      >
        <Check size={11} />
        {isPending ? 'Saving…' : 'Mark attended'}
      </button>
      {error && (
        <span style={{ fontSize: '11px', color: '#ef6a5e' }}>{error}</span>
      )}
    </div>
  )
}
