'use client'

import { useState, useEffect, useTransition } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { assignUser, removeAssignment } from '@/lib/actions/assignments/manage-assignments'
import { createClientSupabase } from '@/lib/supabase/client'
import type { AssignmentWithUser } from '@/lib/queries/assignments'

type Assignment = AssignmentWithUser
interface TeamMember { id: string; full_name: string; email: string }

const panel: React.CSSProperties = {
  background: '#0f1220',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 16,
  padding: '1.5rem',
}

const selStyle: React.CSSProperties = {
  flex: 1,
  background: '#161d2e',
  border: '1px solid rgba(255,255,255,0.11)',
  borderRadius: 9,
  padding: '0.6rem 2rem 0.6rem 0.85rem',
  fontSize: '0.8rem',
  color: 'rgba(255,255,255,0.82)',
  outline: 'none',
  fontFamily: 'inherit',
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 8l4 4 4-4' stroke='rgba(255,255,255,0.35)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.65rem center',
  backgroundSize: '1rem',
}

export function AssignmentsSection({ assignments, projectId }: { assignments: Assignment[]; projectId: string }) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClientSupabase()
    supabase.from('profiles').select('id, full_name, email').eq('role', 'team_member').eq('is_active', true)
      .then(({ data }) => setTeamMembers(data ?? []))
  }, [])

  const assignedIds = assignments.map(a => a.user?.id).filter(Boolean)
  const available = teamMembers.filter(m => !assignedIds.includes(m.id))

  return (
    <div style={panel}>
      <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '1rem' }}>
        Team Assignments
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.25rem' }}>
        {assignments.length === 0 ? (
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.22)', fontStyle: 'italic' }}>
            No team members assigned yet.
          </p>
        ) : (
          assignments.map(a => (
            <div key={a.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.625rem 0.875rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10,
            }}>
              {a.user && <Avatar name={a.user.full_name} size="sm" />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 500, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                  {a.user?.full_name}
                </p>
                <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.28)', margin: 0 }}>
                  {a.user?.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => startTransition(() => removeAssignment(a.id, projectId))}
                disabled={isPending}
                style={{
                  background: 'none',
                  border: '1px solid rgba(248,113,113,0.22)',
                  borderRadius: 7,
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(248,113,113,0.70)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  opacity: isPending ? 0.5 : 1,
                }}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {available.length > 0 && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1.125rem' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '0.625rem' }}>
            Add Team Member
          </p>
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <select style={selStyle} value={selectedId} onChange={e => setSelectedId(e.target.value)}>
              <option value="">Select…</option>
              {available.map(m => (
                <option key={m.id} value={m.id}>{m.full_name}</option>
              ))}
            </select>
            <button
              type="button"
              disabled={!selectedId || isPending}
              onClick={() => startTransition(async () => {
                await assignUser(projectId, selectedId)
                setSelectedId('')
              })}
              style={{
                padding: '0.6rem 1.125rem',
                background: (!selectedId || isPending) ? 'rgba(20,184,166,0.3)' : '#14B8A6',
                color: '#07080c',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: 8,
                cursor: (!selectedId || isPending) ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              {isPending ? '…' : 'Assign'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
