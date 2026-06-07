import type { Database } from '@/lib/types/database'

type Milestone = Database['public']['Tables']['milestones']['Row']

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 11, height: 11, color: '#fff' }}>
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}

export function PipelineSteps({
  milestones,
  teamInitials,
}: {
  milestones: Milestone[]
  teamInitials?: string[]
}) {
  return (
    <div className="p-pipeline">
      {milestones.map((m) => {
        const isDone   = m.status === 'done'
        const isActive = m.status === 'in_progress'

        return (
          <div key={m.id} className="p-pipeline-step">
            {/* Icon */}
            <div className={`p-pipeline-icon ${isDone ? 'p-pipeline-icon--done' : isActive ? 'p-pipeline-icon--active' : 'p-pipeline-icon--pending'}`}>
              {isDone && <CheckIcon />}
              {isActive && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--p-purple)' }} />}
            </div>

            {/* Body */}
            <div className="p-pipeline-body">
              <p className={`p-pipeline-name${!isDone && !isActive ? ' p-pipeline-name--pending' : ''}`}>
                Phase {m.phase_number}: {m.phase_name}
              </p>

              {m.notes && (
                <p className={`p-pipeline-desc${!isDone && !isActive ? ' p-pipeline-desc--pending' : ''}`}>
                  {m.notes}
                </p>
              )}

              {isDone && m.completed_date && (
                <p className="p-pipeline-meta">
                  Completed on {new Date(m.completed_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.
                </p>
              )}

              {!isDone && m.scheduled_date && (
                <p className="p-pipeline-meta">
                  Due {new Date(m.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              )}

              {isDone && (
                <div className="p-pipeline-tags">
                  <span className="p-pipeline-tag" style={{ background: 'rgba(20,184,166,0.10)', color: '#5eead4', border: '1px solid rgba(20,184,166,0.22)' }}>Approved</span>
                </div>
              )}

              {isActive && teamInitials && teamInitials.length > 0 && (
                <div className="p-pipeline-team">
                  <div className="p-avatar-stack">
                    {teamInitials.slice(0, 3).map((init, idx) => (
                      <div key={idx} className="p-avatar-sm">{init}</div>
                    ))}
                  </div>
                  <span className="p-pipeline-team-label">Active Team</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
