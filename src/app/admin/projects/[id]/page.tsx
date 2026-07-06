import { notFound } from 'next/navigation'
import { getProjectById, getDeadlineExtensions } from '@/dashboard/lib/queries/projects'
import { getMilestonesForProject } from '@/dashboard/lib/queries/milestones'
import { getFoldersForProject, getFilesForProject } from '@/dashboard/lib/queries/files'
import { getDeliverablesForProject } from '@/dashboard/lib/queries/deliverables'
import { getChecklistForProject } from '@/dashboard/lib/queries/checklist'
import { getAssignmentsForProject } from '@/dashboard/lib/queries/assignments'
import { getRevisionsForProject } from '@/dashboard/lib/queries/revisions'
import { getMeetingsForProject } from '@/dashboard/lib/queries/meetings'
import { Tabs } from '@/dashboard/components/ui/Tabs'
import { ProjectStatusBadge } from '@/dashboard/components/shared/StatusBadge'
import { PipelineSteps } from '@/dashboard/components/shared/PipelineSteps'
import { MilestoneControls } from './MilestoneControls'
import { FilesSection } from './FilesSection'
import { AssignmentsSection } from './AssignmentsSection'
import { DeliverablesSection } from './DeliverablesSection'
import { ClientNoteAlert } from './ClientNoteAlert'
import { AdminApprovalPanel } from './AdminApprovalPanel'
import { AdminDeadlinePanel } from './AdminDeadlinePanel'
import { ProjectMeetingsSection } from './ProjectMeetingsSection'

interface Props { params: Promise<{ id: string }> }

export default async function AdminProjectPage({ params }: Props) {
  const { id } = await params
  const [project, milestones, folders, files, deliverables, checklist, assignments, revisions, deadlineExtensions, projectMeetings] = await Promise.all([
    getProjectById(id).catch(() => null),
    getMilestonesForProject(id),
    getFoldersForProject(id),
    getFilesForProject(id),
    getDeliverablesForProject(id),
    getChecklistForProject(id),
    getAssignmentsForProject(id),
    getRevisionsForProject(id),
    getDeadlineExtensions(id).catch(() => []),
    getMeetingsForProject(id),
  ])

  if (!project) notFound()

  const client = project.client as { full_name?: string; company_name?: string; email?: string } | null
  const teamMembers = assignments.map(a => ({
    id: (a.user as { id: string; full_name: string } | null)?.id ?? '',
    full_name: (a.user as { id: string; full_name: string } | null)?.full_name ?? '',
  })).filter(m => m.id)
  const teamInitials = assignments.map(
    a => (a.user as { full_name: string } | null)?.full_name?.[0]?.toUpperCase() ?? '?'
  )
  const checklistDone  = checklist.filter(c => c.is_completed).length
  const checklistTotal = checklist.length

  const tabs = [
    {
      key: 'overview',
      label: 'Overview',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(project.status === 'final_review' || project.status === 'completed') && (
            <AdminApprovalPanel project={{
              id: project.id,
              status: project.status,
              admin_approved: project.admin_approved,
              approved_by_admin: project.approved_by_admin,
              approver: project.approver as unknown as { id: string; full_name: string } | null,
            }} />
          )}
          <AdminDeadlinePanel
            projectId={id}
            internal_deadline={project.internal_deadline ?? null}
            client_deadline={project.client_deadline ?? null}
            extensions={deadlineExtensions}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="p-info-panel">
            <p className="p-info-panel-label">Project Details</p>
            {[
              { key: 'Status',   val: <ProjectStatusBadge status={project.status} /> },
              { key: 'Client',   val: client?.company_name ?? client?.full_name ?? '—' },
              { key: 'Package',  val: project.package ?? '—' },
              { key: 'Started',  val: project.work_started_date
                  ? new Date(project.work_started_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : project.start_date
                    ? new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Not started yet' },
              { key: 'Internal Deadline', val: project.internal_deadline ?? '—' },
              { key: 'Client Deadline',   val: project.client_deadline ?? '—' },
              { key: 'Created',  val: new Date(project.created_at).toLocaleDateString('en-US') },
            ].map(row => (
              <div key={row.key} className="p-info-row">
                <span className="p-info-key">{row.key}</span>
                <span className="p-info-val">{row.val}</span>
              </div>
            ))}
            {assignments.length > 0 && (
              <div className="p-info-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span className="p-info-key">Team</span>
                <div className="p-avatar-stack">
                  {assignments.slice(0, 4).map(a => (
                    <div key={a.id} className="p-avatar-sm">
                      {(a.user as { full_name: string } | null)?.full_name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-info-panel">
            <p className="p-info-panel-label">Description</p>
            <p style={{ fontSize: '0.82rem', color: project.description ? 'var(--p-t2)' : 'var(--p-t3)', lineHeight: 1.6, fontStyle: project.description ? 'normal' : 'italic' }}>
              {project.description ?? 'No description provided.'}
            </p>
          </div>
          </div>
        </div>
      ),
    },
    {
      key: 'milestones',
      label: 'Milestones',
      content: (
        <div className="p-info-panel">
          <p className="p-info-panel-label">Project Pipeline</p>
          {milestones.length === 0 ? (
            <p style={{ fontSize: '0.78rem', color: 'var(--p-t3)', fontStyle: 'italic' }}>No milestones yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <PipelineSteps milestones={milestones} teamInitials={teamInitials} />
              <MilestoneControls milestones={milestones} projectId={id} />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'files',
      label: 'Files',
      content: <FilesSection folders={folders} files={files} projectId={id} isAdmin />,
    },
    {
      key: 'assignments',
      label: 'Team',
      content: <AssignmentsSection assignments={assignments} projectId={id} />,
    },
    {
      key: 'deliverables',
      label: 'Deliverables',
      content: (
        <div className="p-side-grid">
          {/* Main deliverables */}
          <DeliverablesSection deliverables={deliverables} checklist={checklist} projectId={id} isAdmin />

          {/* Right sidebar: pipeline + checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {milestones.length > 0 && (
              <div className="p-info-panel">
                <p className="p-info-panel-label">Project Pipeline</p>
                <PipelineSteps milestones={milestones} teamInitials={teamInitials} />
              </div>
            )}
            {checklistTotal > 0 && (
              <div className="p-info-panel">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                  <p className="p-info-panel-label" style={{ margin: 0 }}>Asset Checklist</p>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.18rem 0.55rem',
                    borderRadius: 20,
                    background: checklistDone === checklistTotal ? 'rgba(52,211,153,0.12)' : 'var(--p-s2)',
                    color: checklistDone === checklistTotal ? '#6ee7b7' : 'var(--p-t3)',
                    border: checklistDone === checklistTotal ? '1px solid rgba(52,211,153,0.22)' : '1px solid var(--p-b1)',
                  }}>
                    {checklistDone}/{checklistTotal} Complete
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {checklist.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                        background: item.is_completed ? 'var(--p-teal)' : 'rgba(255,255,255,0.05)',
                        border: item.is_completed ? '1px solid var(--p-teal)' : '1px solid var(--p-b1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {item.is_completed && (
                          <svg viewBox="0 0 12 12" fill="none" stroke="#07080c" style={{ width: 9, height: 9 }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2 6l3 3 5-5" />
                          </svg>
                        )}
                      </div>
                      <span style={{ fontSize: '0.73rem', color: item.is_completed ? 'var(--p-t3)' : 'var(--p-t2)', textDecoration: item.is_completed ? 'line-through' : 'none' }}>
                        {item.item_label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'meetings',
      label: 'Meetings',
      content: (
        <ProjectMeetingsSection
          projectId={id}
          teamMembers={teamMembers}
          meetings={projectMeetings}
        />
      ),
    },
  ]

  return (
    <div className="p-content-wrap">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
        <div>
          <p className="p-eyebrow" style={{ marginBottom: '0.3rem' }}>Admin · Projects</p>
          <h1 className="p-page-title">{project.name}</h1>
          <p className="p-page-sub">
            {client?.company_name ?? client?.full_name ?? 'No client'}
            {project.client_deadline ? ` · Client due ${project.client_deadline}` : ''}
          </p>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      <ClientNoteAlert projectId={id} revisions={revisions} />
      <Tabs tabs={tabs} />
    </div>
  )

}
