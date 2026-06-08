import { createServerClient } from '@/lib/supabase/server'

async function getAnalyticsData() {
  const supabase = await createServerClient()

  const [
    projectsRes,
    clientsRes,
    teamRes,
    milestonesRes,
    deliverablesRes,
  ] = await Promise.all([
    supabase.from('projects').select('id, status, created_at').eq('is_archived', false),
    supabase.from('profiles').select('id, created_at').eq('role', 'client'),
    supabase.from('profiles').select('id').eq('role', 'team_member'),
    supabase.from('milestones').select('status'),
    supabase.from('deliverables').select('status'),
  ])

  const projects     = projectsRes.data ?? []
  const clients      = clientsRes.data ?? []
  const team         = teamRes.data ?? []
  const milestones   = milestonesRes.data ?? []
  const deliverables = deliverablesRes.data ?? []

  const byStatus = {
    briefing:     projects.filter(p => p.status === 'briefing').length,
    in_progress:  projects.filter(p => p.status === 'in_progress').length,
    final_review: projects.filter(p => p.status === 'final_review').length,
    completed:    projects.filter(p => p.status === 'completed').length,
    paused:       projects.filter(p => p.status === 'paused').length,
  }

  const milestonesDone    = milestones.filter(m => m.status === 'done').length
  const milestonesTotal   = milestones.length
  const completionRate    = milestonesTotal > 0 ? Math.round((milestonesDone / milestonesTotal) * 100) : 0

  const delivApproved = deliverables.filter(d => d.status === 'approved').length
  const delivTotal    = deliverables.length
  const approvalRate  = delivTotal > 0 ? Math.round((delivApproved / delivTotal) * 100) : 0

  // Monthly project creation (last 6 months)
  const now    = new Date()
  const months: { label: string; count: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = d.toLocaleString('en-US', { month: 'short' })
    const count = projects.filter(p => {
      const c = new Date(p.created_at)
      return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth()
    }).length
    months.push({ label, count })
  }

  return {
    totalProjects:  projects.length,
    activeProjects: projects.filter(p => p.status !== 'completed' && p.status !== 'paused').length,
    totalClients:   clients.length,
    teamSize:       team.length,
    byStatus,
    completionRate,
    approvalRate,
    months,
    milestonesTotal,
    milestonesDone,
    delivTotal,
    delivApproved,
  }
}

const STATUS_COLORS: Record<string, string> = {
  briefing:     '#7C3AED',
  in_progress:  '#14B8A6',
  final_review: '#F59E0B',
  completed:    '#34D399',
  paused:       '#6B7280',
}

const STATUS_LABELS: Record<string, string> = {
  briefing:     'Briefing',
  in_progress:  'In Progress',
  final_review: 'Final Review',
  completed:    'Completed',
  paused:       'Paused',
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData()

  const maxMonthCount = Math.max(...data.months.map(m => m.count), 1)

  // Donut segments for project status
  const statusEntries = Object.entries(data.byStatus).filter(([, v]) => v > 0)
  const donutTotal    = statusEntries.reduce((s, [, v]) => s + v, 0)
  const r = 54, circ = 2 * Math.PI * r
  let donutOffset = 0
  const segments = statusEntries.map(([key, count]) => {
    const pct  = count / (donutTotal || 1)
    const dash = pct * circ
    const seg  = { key, count, dash, offset: donutOffset, color: STATUS_COLORS[key] }
    donutOffset += dash
    return seg
  })

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Header */}
      <div>
        <p className="p-eyebrow">Admin</p>
        <h1 className="p-page-title">Intelligence Overview</h1>
        <p className="p-page-sub">Real-time performance metrics across all agency verticals.</p>
      </div>

      {/* Top metrics */}
      <div className="p-analytics-grid">
        <div className="p-analytics-metric">
          <p className="p-analytics-metric-label">Total Projects</p>
          <p className="p-analytics-metric-value">{data.totalProjects}</p>
          <span className="p-analytics-delta p-analytics-delta--up">
            {data.activeProjects} active
          </span>
        </div>
        <div className="p-analytics-metric">
          <p className="p-analytics-metric-label">Total Clients</p>
          <p className="p-analytics-metric-value">{data.totalClients}</p>
          <span className="p-analytics-delta p-analytics-delta--flat">Stable</span>
        </div>
        <div className="p-analytics-metric">
          <p className="p-analytics-metric-label">Team Size</p>
          <p className="p-analytics-metric-value">{data.teamSize}</p>
          <span className="p-analytics-delta p-analytics-delta--flat">Members</span>
        </div>
        <div className="p-analytics-metric">
          <p className="p-analytics-metric-label">Milestone Rate</p>
          <p className="p-analytics-metric-value">{data.completionRate}<span style={{ fontSize: '1.1rem' }}>%</span></p>
          <div className="p-analytics-bar-track">
            <div className="p-analytics-bar-fill" style={{ width: `${data.completionRate}%` }} />
          </div>
        </div>
        <div className="p-analytics-metric">
          <p className="p-analytics-metric-label">Deliverable Approval</p>
          <p className="p-analytics-metric-value">{data.approvalRate}<span style={{ fontSize: '1.1rem' }}>%</span></p>
          <div className="p-analytics-bar-track">
            <div className="p-analytics-bar-fill" style={{ width: `${data.approvalRate}%`, background: 'linear-gradient(90deg, var(--p-purple), var(--p-purple-l))' }} />
          </div>
        </div>
        <div className="p-analytics-metric">
          <p className="p-analytics-metric-label">Milestones Done</p>
          <p className="p-analytics-metric-value">{data.milestonesDone}<span style={{ fontSize: '1rem', color: 'var(--p-t3)', fontWeight: 300 }}>/{data.milestonesTotal}</span></p>
          <span className="p-analytics-delta p-analytics-delta--up">{data.delivApproved} deliverables approved</span>
        </div>
      </div>

      {/* Charts row */}
      <div className="p-analytics-charts-grid">

        {/* Bar chart: projects per month */}
        <div className="p-analytics-chart-card">
          <h2 className="p-analytics-chart-title">Project Activity</h2>
          <p className="p-analytics-chart-sub">New projects per month (last 6 months)</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.625rem', height: 160 }}>
            {data.months.map(m => {
              const h = maxMonthCount > 0 ? Math.round((m.count / maxMonthCount) * 140) : 0
              return (
                <div key={m.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--p-t2)', fontWeight: 600 }}>{m.count > 0 ? m.count : ''}</span>
                  <div style={{
                    width: '100%',
                    height: Math.max(h, 4),
                    borderRadius: '4px 4px 0 0',
                    background: m.count > 0
                      ? 'linear-gradient(180deg, var(--p-purple-l) 0%, var(--p-purple) 100%)'
                      : 'rgba(255,255,255,0.06)',
                    transition: 'height 0.3s ease',
                  }} />
                  <span style={{ fontSize: '0.62rem', color: 'var(--p-t3)' }}>{m.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Donut: project status breakdown */}
        <div className="p-analytics-chart-card">
          <h2 className="p-analytics-chart-title">Project Status</h2>
          <p className="p-analytics-chart-sub">Composition by status</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {donutTotal > 0 ? (
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <svg width="130" height="130" viewBox="0 0 130 130">
                  <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="16" />
                  {segments.map(seg => (
                    <circle
                      key={seg.key}
                      cx="65" cy="65" r={r}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="16"
                      strokeDasharray={`${seg.dash} ${circ}`}
                      strokeDashoffset={-seg.offset + circ * 0.25}
                      transform="rotate(-90 65 65)"
                    />
                  ))}
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--p-t1)' }}>{donutTotal}</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--p-t3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Total</span>
                </div>
              </div>
            ) : (
              <div style={{ width: 130, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--p-t3)', fontSize: '0.75rem' }}>
                No data yet
              </div>
            )}

            <div className="p-donut-legend" style={{ flex: 1 }}>
              {statusEntries.map(([key, count]) => (
                <div key={key} className="p-donut-legend-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div className="p-donut-legend-dot" style={{ background: STATUS_COLORS[key] }} />
                    <span>{STATUS_LABELS[key]}</span>
                  </div>
                  <span className="p-donut-legend-pct">
                    {donutTotal > 0 ? Math.round((count / donutTotal) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue placeholder */}
      <div className="p-analytics-chart-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
        <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--p-t3)', marginBottom: '0.5rem' }}>Revenue Tracking</p>
        <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--p-t2)', marginBottom: '0.5rem' }}>Configure billing integration</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--p-t3)' }}>Connect a billing provider (e.g. Stripe) to see revenue metrics here.</p>
      </div>
    </div>
  )
}
