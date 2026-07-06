'use client'

import { useState, useTransition } from 'react'
import { giveAdminApproval, revokeAdminApproval, adminApproveAndFinalize, declineAdminApproval } from '@/dashboard/lib/actions/projects/approval'

type Project = {
  id: string
  status: string
  admin_approved: boolean
  approved_by_admin: string | null
  approver?: { id: string; full_name: string } | null
}

interface Props {
  project: Project
}

export function AdminApprovalPanel({ project }: Props) {
  const [isPending, startTransition] = useTransition()
  const [showDecline, setShowDecline] = useState(false)
  const [declineReason, setDeclineReason] = useState('')
  const [declineError, setDeclineError] = useState('')

  if (project.status !== 'final_review' && project.status !== 'completed') return null

  const approverName = project.approver?.full_name ?? 'Admin'
  const isApproved = project.admin_approved

  return (
    <div style={{
      background: '#0f1220',
      border: `1px solid ${isApproved ? 'rgba(20,184,166,0.22)' : 'rgba(251,146,60,0.22)'}`,
      borderRadius: 16,
      padding: '1.25rem 1.5rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <p style={{
          fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', margin: 0,
        }}>
          Admin Approval Gate
        </p>
        <span style={{
          fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.65rem',
          borderRadius: 20,
          background: isApproved ? 'var(--ds-hover)' : 'rgba(251,146,60,0.12)',
          color: isApproved ? '#2dd4bf' : '#fb923c',
          border: `1px solid ${isApproved ? 'rgba(20,184,166,0.22)' : 'rgba(251,146,60,0.22)'}`,
        }}>
          {isApproved ? `Approved by ${approverName}` : 'Pending Admin Approval'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
        {project.status === 'final_review' && !isApproved && (
          <>
            <button
              disabled={isPending}
              onClick={() => startTransition(() => giveAdminApproval(project.id))}
              style={{
                padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600,
                background: 'var(--ds-hover)', color: '#2dd4bf',
                border: '1px solid rgba(20,184,166,0.28)', cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.6 : 1,
              }}
            >
              {isPending ? 'Working…' : 'Give Final Approval'}
            </button>
            <button
              disabled={isPending}
              onClick={() => setShowDecline(v => !v)}
              style={{
                padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600,
                background: 'rgba(239,68,68,0.1)', color: '#f87171',
                border: '1px solid rgba(239,68,68,0.22)', cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.6 : 1,
              }}
            >
              Decline Approval
            </button>
          </>
        )}

        {showDecline && project.status === 'final_review' && !isApproved && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
            <textarea
              value={declineReason}
              onChange={e => setDeclineReason(e.target.value)}
              placeholder="Optional: tell the team why this is being sent back…"
              rows={2}
              style={{
                background: '#161d2e',
                border: '1px solid rgba(255,255,255,0.11)',
                borderRadius: 9,
                padding: '0.6rem 0.8rem',
                fontSize: '0.78rem',
                color: 'rgba(255,255,255,0.82)',
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                maxWidth: 420,
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                disabled={isPending}
                onClick={() => {
                  setDeclineError('')
                  startTransition(async () => {
                    try {
                      await declineAdminApproval(project.id, declineReason)
                      setShowDecline(false)
                      setDeclineReason('')
                    } catch (err: unknown) {
                      setDeclineError(err instanceof Error ? err.message : 'Failed to decline approval')
                    }
                  })
                }}
                style={{
                  padding: '0.45rem 1rem', borderRadius: 8, fontSize: '0.74rem', fontWeight: 600,
                  background: 'rgba(239,68,68,0.16)', color: '#f87171',
                  border: '1px solid rgba(239,68,68,0.3)', cursor: isPending ? 'not-allowed' : 'pointer',
                  opacity: isPending ? 0.6 : 1,
                }}
              >
                {isPending ? 'Working…' : 'Confirm Decline'}
              </button>
              <button
                disabled={isPending}
                onClick={() => { setShowDecline(false); setDeclineReason(''); setDeclineError('') }}
                style={{
                  padding: '0.45rem 1rem', borderRadius: 8, fontSize: '0.74rem', fontWeight: 600,
                  background: 'none', color: 'rgba(255,255,255,0.4)',
                  border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
            {declineError && (
              <p style={{ fontSize: '0.72rem', color: 'rgba(248,113,113,0.85)', margin: 0 }}>{declineError}</p>
            )}
          </div>
        )}

        {project.status === 'final_review' && isApproved && (
          <>
            <button
              disabled={isPending}
              onClick={() => startTransition(() => adminApproveAndFinalize(project.id))}
              style={{
                padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600,
                background: 'var(--ds-white)', color: '#07080c',
                border: '1px solid var(--ds-white)', cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.6 : 1,
              }}
            >
              {isPending ? 'Working…' : 'Finalize Project'}
            </button>
            <button
              disabled={isPending}
              onClick={() => startTransition(() => revokeAdminApproval(project.id))}
              style={{
                padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600,
                background: 'rgba(239,68,68,0.1)', color: '#f87171',
                border: '1px solid rgba(239,68,68,0.22)', cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.6 : 1,
              }}
            >
              {isPending ? 'Working…' : 'Revoke Approval'}
            </button>
          </>
        )}

        {project.status === 'completed' && (
          <button
            disabled={isPending}
            onClick={() => startTransition(() => revokeAdminApproval(project.id))}
            style={{
              padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600,
              background: 'rgba(239,68,68,0.1)', color: '#f87171',
              border: '1px solid rgba(239,68,68,0.22)', cursor: isPending ? 'not-allowed' : 'pointer',
              opacity: isPending ? 0.6 : 1,
            }}
          >
            {isPending ? 'Working…' : 'Revoke Approval'}
          </button>
        )}
      </div>
    </div>
  )
}
