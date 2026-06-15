import { createServerClient } from '@/lib/supabase/server'
import { getRecentActivity } from '@/lib/queries/activity'
import { getProjectsWithTeam } from '@/lib/queries/projects'
import { getUpcomingMeetings, getMissedMeetings } from '@/lib/queries/meetings'
import DashboardViews from './DashboardViews'
import Link from 'next/link'

async function getStats() {
  const supabase = await createServerClient()
  const [clientsRes, teamRes, deliveredRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'client'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'team_member'),
    supabase.from('deliverables').select('id', { count: 'exact', head: true }).eq('status', 'delivered'),
  ])
  return {
    totalClients: clientsRes.count ?? 0,
    totalTeam: teamRes.count ?? 0,
    awaitingApproval: deliveredRes.count ?? 0,
  }
}

const STATUS_ORDER = ['in_progress', 'final_review', 'briefing', 'paused', 'completed'] as const

export default async function AdminDashboardPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('full_name').eq('id', user.id).single()
    : { data: null }

  const [stats, projects, activity, upcomingMeetings, missedMeetings] = await Promise.all([
    getStats(),
    getProjectsWithTeam(),
    getRecentActivity(8),
    getUpcomingMeetings(),
    getMissedMeetings(),
  ])

  const activeProjects = projects.filter(p => p.status !== 'completed')
  const noTeam  = projects.filter(p => p.team.length === 0 && p.status !== 'completed')
  const overdue = projects.filter(p =>
    p.client_deadline && new Date(p.client_deadline) < new Date() && p.status !== 'completed'
  )
  const attention = noTeam.length + overdue.length

  const totalMilestones = projects.reduce((s, p) => s + p.milestone_total, 0)
  const doneMilestones  = projects.reduce((s, p) => s + p.milestone_done, 0)
  const globalPct = totalMilestones > 0 ? Math.round((doneMilestones / totalMilestones) * 100) : 0

  const sorted = [...projects].sort((a, b) =>
    STATUS_ORDER.indexOf(a.status as typeof STATUS_ORDER[number]) -
    STATUS_ORDER.indexOf(b.status as typeof STATUS_ORDER[number])
  )

  const displayName = profile?.full_name?.split(' ')[0] ?? 'Admin'

  return (
    <div className="p-content-wrap">
      {/* Greeting */}
      <div style={{ marginBottom: '1.75rem' }}>
        <p className="p-eyebrow">Admin Dashboard</p>
        <h1 className="p-page-title">Good morning, {displayName}.</h1>
        <p className="p-page-sub">
          {activeProjects.length} active project{activeProjects.length !== 1 ? 's' : ''} ·{' '}
          {stats.awaitingApproval} awaiting approval{stats.awaitingApproval !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Alerts */}
      {(noTeam.length > 0 || overdue.length > 0 || missedMeetings.length > 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.75rem' }}>
          {missedMeetings.length > 0 && (
            <div className="p-alert p-alert--warn">
              <span className="p-alert-dot" />
              {missedMeetings.length} meeting{missedMeetings.length > 1 ? 's were' : ' was'} not attended by team
              <div className="p-alert-links">
                {missedMeetings.slice(0, 3).map(m => (
                  <span key={m.id} className="p-alert-link" style={{ cursor: 'default' }}>{m.title}</span>
                ))}
              </div>
            </div>
          )}
          {noTeam.length > 0 && (
            <div className="p-alert p-alert--warn">
              <span className="p-alert-dot" />
              {noTeam.length} project{noTeam.length > 1 ? 's have' : ' has'} no team assigned
              <div className="p-alert-links">
                {noTeam.slice(0, 3).map(p => (
                  <Link key={p.id} href={`/admin/projects/${p.id}`} className="p-alert-link">{p.name}</Link>
                ))}
              </div>
            </div>
          )}
          {overdue.length > 0 && (
            <div className="p-alert p-alert--danger">
              <span className="p-alert-dot" />
              {overdue.length} project{overdue.length > 1 ? 's are' : ' is'} past deadline
              <div className="p-alert-links">
                {overdue.slice(0, 3).map(p => (
                  <Link key={p.id} href={`/admin/projects/${p.id}`} className="p-alert-link">{p.name}</Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Segmented control + views */}
      <DashboardViews
        globalPct={globalPct}
        awaitingApproval={stats.awaitingApproval}
        attention={attention}
        activeCount={activeProjects.length}
        doneMilestones={doneMilestones}
        totalMilestones={totalMilestones}
        projects={sorted.map(p => ({
          id: p.id,
          name: p.name,
          status: p.status,
          clientName: p.client?.company_name ?? p.client?.full_name ?? '—',
          clientDeadline: p.client_deadline ?? null,
          internalDeadline: p.internal_deadline ?? null,
          milestoneDone: p.milestone_done,
          milestoneTotal: p.milestone_total,
          team: p.team,
        }))}
        activity={activity.map(log => ({
          id: log.id,
          actorName: (log.actor as { full_name?: string } | null)?.full_name ?? 'Unknown',
          actorInitial: (log.actor as { full_name?: string } | null)?.full_name?.[0]?.toUpperCase() ?? '?',
          actorRole: log.actor_role,
          action: log.action,
          entityName: log.entity_name ?? null,
          createdAt: log.created_at,
        }))}
        upcomingMeetings={upcomingMeetings.map(m => ({
          id: m.id,
          title: m.title,
          scheduled_at: m.scheduled_at,
          notes: m.notes,
          attended_by_team: m.attended_by_team,
          attended_at: m.attended_at,
          clientName: m.client ? (m.client.company_name ?? m.client.full_name) : null,
          teamMemberName: m.team_member?.full_name ?? null,
          teamMemberId: m.team_member?.id ?? null,
          missed: false,
        }))}
        missedMeetings={missedMeetings.map(m => ({
          id: m.id,
          title: m.title,
          scheduled_at: m.scheduled_at,
          notes: m.notes,
          attended_by_team: m.attended_by_team,
          attended_at: m.attended_at,
          clientName: m.client ? (m.client.company_name ?? m.client.full_name) : null,
          teamMemberName: m.team_member?.full_name ?? null,
          teamMemberId: m.team_member?.id ?? null,
          missed: true,
        }))}
      />
    </div>
  )
}
