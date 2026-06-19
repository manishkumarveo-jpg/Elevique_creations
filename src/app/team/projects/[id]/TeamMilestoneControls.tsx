'use client'

import { useState, useTransition } from 'react'
import { updateMilestoneStatusTeam } from '@/lib/actions/milestones/update-milestone'
import type { Database } from '@/lib/types/database'

type Milestone = Database['public']['Tables']['milestones']['Row']

const statusOptions = [
  { value: 'pending',     label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done',        label: 'Done' },
]

const selStyle: React.CSSProperties = {
  background: '#161d2e',
  border: '1px solid rgba(255,255,255,0.11)',
  borderRadius: 9,
  padding: '0.55rem 2rem 0.55rem 0.8rem',
  fontSize: '0.78rem',
  color: 'rgba(255,255,255,0.82)',
  outline: 'none',
  fontFamily: 'inherit',
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 8l4 4 4-4' stroke='rgba(255,255,255,0.35)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.6rem center',
  backgroundSize: '1rem',
}

export function TeamMilestoneControls({ milestones, projectId }: { milestones: Milestone[]; projectId: string }) {
  const [selected, setSelected] = useState(milestones[0]?.id ?? '')
  const [status, setStatus] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)

  const currentMilestone = milestones.find(m => m.id === selected)
  const priorPhasesIncomplete = currentMilestone
    ? milestones.some(m => m.phase_number < currentMilestone.phase_number && m.status !== 'done')
    : false

  function handleSave() {
    if (!selected || !status) return
    setSuccess(false)
    startTransition(async () => {
      await updateMilestoneStatusTeam(selected, projectId, { status })
      setStatus('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    })
  }

  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
      <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '0.875rem' }}>
        Update Milestone
      </p>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
            Milestone
          </label>
          <select style={{ ...selStyle, minWidth: 210 }} value={selected} onChange={e => setSelected(e.target.value)}>
            {milestones.map(m => (
              <option key={m.id} value={m.id}>Phase {m.phase_number}: {m.phase_name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
            New Status
          </label>
          <select style={{ ...selStyle, minWidth: 150 }} value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">Select status…</option>
            {statusOptions
              .filter(o => o.value !== currentMilestone?.status)
              .filter(o => o.value !== 'done' || !priorPhasesIncomplete)
              .map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!selected || !status || isPending}
          style={{
            padding: '0.55rem 1.25rem',
            background: (!selected || !status || isPending) ? 'rgba(20,184,166,0.3)' : 'var(--ds-white)',
            color: '#07080c',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            border: 'none',
            borderRadius: 8,
            cursor: (!selected || !status || isPending) ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            transition: 'background 0.18s ease',
          }}
        >
          {isPending ? 'Saving…' : 'Save'}
        </button>
      </div>

      {priorPhasesIncomplete && (
        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.625rem' }}>
          Earlier phases must be marked Done before this one can be completed.
        </p>
      )}

      {success && (
        <p style={{ fontSize: '0.73rem', color: '#34d399', marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 13, height: 13 }}>
            <circle cx="8" cy="8" r="7" fill="rgba(52,211,153,0.15)" stroke="#34d399" strokeWidth="1" />
            <path d="M5 8l2 2 4-4" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Milestone updated
        </p>
      )}
    </div>
  )
}
