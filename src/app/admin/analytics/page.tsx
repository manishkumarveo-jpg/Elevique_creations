import { createServerClient } from '@/shared/lib/supabase/server'

async function getAnalyticsData() {
  const supabase = await createServerClient()

  const [projectsRes, clientsRes, teamRes, milestonesRes, deliverablesRes] = await Promise.all([
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

  const milestonesDone  = milestones.filter(m => m.status === 'done').length
  const milestonesTotal = milestones.length
  const completionRate  = milestonesTotal > 0 ? Math.round((milestonesDone / milestonesTotal) * 100) : 0
  const delivApproved   = deliverables.filter(d => d.status === 'approved').length
  const delivTotal      = deliverables.length
  const approvalRate    = delivTotal > 0 ? Math.round((delivApproved / delivTotal) * 100) : 0

  const now = new Date()
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
  briefing:     'var(--ds-blue)',
  in_progress:  'var(--ds-green)',
  final_review: 'var(--ds-amber)',
  completed:    '#fafafa',
  paused:       'var(--ds-text-4)',
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
    <div className="p-content-wrap">
      <div style={{ marginBottom: '1.75rem' }}>
        <p className="p-eyebrow">Admin</p>
        <h1 className="p-page-title">Analytics</h1>
        <p className="p-page-sub">Performance metrics across all agency verticals.</p>
      </div>

      {/* Metrics grid */}
      <div className="p-analytics-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="p-analytics-metric">
          <p className="p-analytics-metric-label">Total Projects</p>
          <p className="p-analytics-metric-value mono">{data.totalProjects}</p>
          <span className="p-analytics-delta p-analytics-delta--up">{data.activeProjects} active</span>
        </div>
        <div className="p-analytics-metric">
          <p className="p-analytics-metric-label">Total Clients</p>
          <p className="p-analytics-metric-value mono">{data.totalClients}</p>
          <span className="p-analytics-delta p-analytics-delta--flat">Stable</span>
        </div>
        <div className="p-analytics-metric">
          <p className="p-analytics-metric-label">Team Size</p>
          <p className="p-analytics-metric-value mono">{data.teamSize}</p>
          <span className="p-analytics-delta p-analytics-delta--flat">Members</span>
        </div>
        <div className="p-analytics-metric">
          <p className="p-analytics-metric-label">Milestone Rate</p>
          <p className="p-analytics-metric-value mono">{data.completionRate}<span style={{ fontSize: '1.1rem' }}>%</span></p>
          <div className="p-analytics-bar-track">
            <div className="p-analytics-bar-fill" style={{ width: `${data.completionRate}%` }} />
          </div>
        </div>
        <div className="p-analytics-metric">
          <p className="p-analytics-metric-label">Deliverable Approval</p>
          <p className="p-analytics-metric-value mono">{data.approvalRate}<span style={{ fontSize: '1.1rem' }}>%</span></p>
          <div className="p-analytics-bar-track">
            <div className="p-analytics-bar-fill" style={{ width: `${data.approvalRate}%` }} />
          </div>
        </div>
        <div className="p-analytics-metric">
          <p className="p-analytics-metric-label">Milestones Done</p>
          <p className="p-analytics-metric-value mono">
            {data.milestonesDone}
            <span style={{ fontSize: '1rem', color: 'var(--ds-text-3)', fontWeight: 300 }}>/{data.milestonesTotal}</span>
          </p>
          <span className="p-analytics-delta p-analytics-delta--up">{data.delivApproved} deliverables approved</span>
        </div>
      </div>

      {/* Charts */}
      <div className="p-analytics-charts-grid" style={{ marginBottom: '1.5rem' }}>
        {/* Bar chart */}
        <div className="p-analytics-chart-card">
          <h2 className="p-analytics-chart-title">Project Activity</h2>
          <p className="p-analytics-chart-sub">New projects per month (last 6 months)</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.625rem', height: 160 }}>
            {data.months.map(m => {
              const h = maxMonthCount > 0 ? Math.round((m.count / maxMonthCount) * 140) : 0
              return (
                <div key={m.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--ds-text-2)', fontWeight: 600 }}>
                    {m.count > 0 ? m.count : ''}
                  </span>
                  <div style={{
                    width: '100%',
                    height: Math.max(h, 4),
                    borderRadius: '3px 3px 0 0',
                    background: m.count > 0 ? 'var(--ds-white)' : 'var(--ds-border)',
                    transition: 'height 0.3s ease',
                  }} />
                  <span style={{ fontSize: '0.62rem', color: 'var(--ds-text-3)' }}>{m.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Donut */}
        <div className="p-analytics-chart-card">
          <h2 className="p-analytics-chart-title">Project Status</h2>
          <p className="p-analytics-chart-sub">Composition by status</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {donutTotal > 0 ? (
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <svg width="130" height="130" viewBox="0 0 130 130">
                  <circle cx="65" cy="65" r={r} fill="none" stroke="var(--ds-border)" strokeWidth="16" />
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
                  <span style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--ds-text)', fontFamily: 'var(--font-mono), ui-monospace, monospace' }}>
                    {donutTotal}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--ds-text-3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Total
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ width: 130, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ds-text-3)', fontSize: '0.75rem' }}>
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
        <p className="p-eyebrow" style={{ marginBottom: '0.5rem' }}>Revenue Tracking</p>
        <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--ds-text-2)', marginBottom: '0.375rem' }}>
          Configure billing integration
        </p>
        <p style={{ fontSize: '13px', color: 'var(--ds-text-3)' }}>
          Connect a billing provider to see revenue metrics here.
        </p>
      </div>
    </div>
  )
}
