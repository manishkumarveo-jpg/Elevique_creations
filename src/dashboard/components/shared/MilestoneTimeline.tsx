import type { Database } from '@/lib/types/database'

type Milestone = Database['public']['Tables']['milestones']['Row']

const statusDot = {
  done: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 11, height: 11, color: '#07080c' }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  ),
  in_progress: <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#07080c' }} />,
  pending: null,
}

const dotBg: Record<string, React.CSSProperties> = {
  done:        { background: '#14B8A6', borderColor: '#14B8A6' },
  in_progress: { background: '#14B8A6', borderColor: '#14B8A6', animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' },
  pending:     { background: '#1a2035', borderColor: 'rgba(255,255,255,0.18)' },
}

const statusChip: Record<string, React.CSSProperties> = {
  done:        { background: 'rgba(52,211,153,0.10)',  color: '#34d399', border: '1px solid rgba(52,211,153,0.22)' },
  in_progress: { background: 'rgba(20,184,166,0.10)',  color: '#14B8A6', border: '1px solid rgba(20,184,166,0.25)' },
  pending:     { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.09)' },
}

const statusLabel: Record<string, string> = {
  done: 'Done', in_progress: 'In Progress', pending: 'Pending',
}

const pendingApprovalDot: React.CSSProperties = {
  background: 'rgba(251,146,60,0.15)',
  borderColor: 'rgba(251,146,60,0.5)',
}

const pendingApprovalChip: React.CSSProperties = {
  background: 'rgba(251,146,60,0.10)',
  color: '#fb923c',
  border: '1px solid rgba(251,146,60,0.22)',
}

export function MilestoneTimeline({
  milestones,
  adminApproved,
  projectStatus,
}: {
  milestones: Milestone[]
  adminApproved?: boolean
  projectStatus?: string
}) {
  return (
    <ol style={{ position: 'relative', borderLeft: '2px solid rgba(255,255,255,0.08)', marginLeft: '0.875rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {milestones.map(m => {
        const isDone = m.status === 'done'
        const pendingApproval = isDone && projectStatus === 'final_review' && !adminApproved

        return (
          <li key={m.id} style={{ marginLeft: '1.5rem', position: 'relative' }}>
            {/* Timeline dot */}
            <span style={{
              position: 'absolute',
              left: -27,
              top: 2,
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: '2px solid',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...(pendingApproval ? pendingApprovalDot : dotBg[m.status]),
            }}>
              {pendingApproval
                ? <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fb923c' }} />
                : statusDot[m.status]
              }
            </span>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  color: isDone && !pendingApproval ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.85)',
                  textDecoration: isDone && !pendingApproval ? 'line-through' : 'none',
                  margin: 0,
                }}>
                  {m.icon && <span style={{ marginRight: '0.4rem' }}>{m.icon}</span>}
                  Phase {m.phase_number}: {m.phase_name}
                </p>
                {m.scheduled_date && (
                  <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.28)', margin: '0.2rem 0 0' }}>
                    {isDone && !pendingApproval ? `Completed ${m.completed_date}` : `Due ${m.scheduled_date}`}
                  </p>
                )}
                {m.notes && (
                  <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.22)', margin: '0.25rem 0 0', fontStyle: 'italic' }}>
                    {m.notes}
                  </p>
                )}
              </div>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderRadius: 20,
                padding: '0.2rem 0.6rem',
                flexShrink: 0,
                ...(pendingApproval ? pendingApprovalChip : statusChip[m.status]),
              }}>
                {pendingApproval ? 'Pending Approval' : statusLabel[m.status]}
              </span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
