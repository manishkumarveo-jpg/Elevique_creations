import { Check } from 'lucide-react'

export interface Phase {
  label: string
  status: 'done' | 'active' | 'pending'
}

interface PhaseTrackProps {
  phases: Phase[]
}

export function PhaseTrack({ phases }: PhaseTrackProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 0,
        overflowX: 'auto',
      }}
    >
      {phases.map((phase, i) => {
        const isDone   = phase.status === 'done'
        const isActive = phase.status === 'active'
        const isLast   = i === phases.length - 1

        return (
          <div
            key={phase.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: isLast ? '0 0 auto' : 1,
              minWidth: 80,
            }}
          >
            {/* Node + connector row */}
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              {/* Left connector */}
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: i === 0 ? 'transparent' : isDone ? 'var(--ds-green)' : 'var(--ds-border)',
                }}
              />

              {/* Node */}
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: `2px solid ${isDone ? 'var(--ds-green)' : isActive ? 'var(--ds-amber)' : 'var(--ds-border-2)'}`,
                  background: isDone
                    ? 'rgba(78,199,127,0.15)'
                    : isActive
                    ? 'rgba(217,164,65,0.12)'
                    : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {isDone ? (
                  <Check size={13} color="var(--ds-green)" />
                ) : isActive ? (
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'var(--ds-amber)',
                    }}
                  />
                ) : null}
              </div>

              {/* Right connector */}
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: isLast ? 'transparent' : 'var(--ds-border)',
                }}
              />
            </div>

            {/* Label */}
            <div
              style={{
                marginTop: '0.5rem',
                fontSize: 12,
                fontWeight: 500,
                color: isDone
                  ? 'var(--ds-green)'
                  : isActive
                  ? 'var(--ds-amber)'
                  : 'var(--ds-text-3)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {phase.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
