'use client'

import { useState, useTransition } from 'react'
import { finalizeProject } from '@/lib/actions/projects/approval'

type Project = {
  id: string
  status: string
  admin_approved: boolean
  approver?: { id: string; full_name: string } | null
}

interface Props {
  project: Project
}

export function FinalizeProjectPanel({ project }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  if (project.status !== 'final_review') return null

  const isApproved = project.admin_approved
  const approverName = project.approver?.full_name ?? 'Admin'

  return (
    <div style={{
      background: '#0f1220',
      border: `1px solid ${isApproved ? 'rgba(20,184,166,0.22)' : 'rgba(251,146,60,0.22)'}`,
      borderRadius: 16,
      padding: '1rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.65rem',
            borderRadius: 20,
            background: isApproved ? 'rgba(20,184,166,0.12)' : 'rgba(251,146,60,0.12)',
            color: isApproved ? '#2dd4bf' : '#fb923c',
            border: `1px solid ${isApproved ? 'rgba(20,184,166,0.22)' : 'rgba(251,146,60,0.22)'}`,
          }}>
            {isApproved ? `Approved by ${approverName}` : 'Pending Admin Approval'}
          </span>
          {!isApproved && (
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
              Waiting for admin sign-off before you can finalize
            </span>
          )}
        </div>

        <button
          disabled={!isApproved || isPending}
          title={!isApproved ? 'Waiting for admin final approval' : undefined}
          onClick={() => {
            setError('')
            startTransition(async () => {
              try {
                await finalizeProject(project.id)
              } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to finalize project')
              }
            })
          }}
          style={{
            padding: '0.5rem 1.25rem', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600,
            background: isApproved ? '#14B8A6' : 'rgba(255,255,255,0.04)',
            color: isApproved ? '#07080c' : 'rgba(255,255,255,0.2)',
            border: isApproved ? '1px solid #14B8A6' : '1px solid rgba(255,255,255,0.08)',
            cursor: isApproved && !isPending ? 'pointer' : 'not-allowed',
            opacity: isPending ? 0.6 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {isPending ? 'Finalizing…' : 'Finalize Project'}
        </button>
      </div>
      {error && (
        <p style={{ fontSize: '0.72rem', color: 'rgba(248,113,113,0.85)', margin: 0 }}>{error}</p>
      )}
    </div>
  )
}
