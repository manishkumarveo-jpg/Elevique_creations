import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getProjectByIdForClient } from '@/lib/queries/projects'
import { getMilestonesForProject } from '@/lib/queries/milestones'
import { getFoldersForProject, getFilesForProject } from '@/lib/queries/files'
import { getDeliverablesForProject } from '@/lib/queries/deliverables'
import { getChecklistForProject } from '@/lib/queries/checklist'
import { getRevisionsForProject } from '@/lib/queries/revisions'
import { getAssignmentsForProject } from '@/lib/queries/assignments'
import { Tabs } from '@/components/ui/Tabs'
import { ProjectStatusBadge } from '@/components/shared/StatusBadge'
import { PipelineSteps } from '@/components/shared/PipelineSteps'
import { FilesSection } from '@/app/admin/projects/[id]/FilesSection'
import { ClientChecklistSection } from './ClientChecklistSection'
import { ClientDeliverablesSection } from './ClientDeliverablesSection'
import { ProjectFeedbackPanel } from './ProjectFeedbackPanel'

interface Props { params: Promise<{ id: string }> }

export default async function ClientProjectPage({ params }: Props) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) notFound()

  const [project, milestones, folders, files, deliverables, checklist, revisions, assignments] = await Promise.all([
    getProjectByIdForClient(id).catch(() => null),
    getMilestonesForProject(id),
    getFoldersForProject(id),
    getFilesForProject(id),
    getDeliverablesForProject(id),
    getChecklistForProject(id),
    getRevisionsForProject(id),
    getAssignmentsForProject(id),
  ])

  if (!project || project.client_id !== user.id) notFound()

  const teamInitials = assignments
    .map(a => (a.user as { full_name: string } | null)?.full_name?.[0]?.toUpperCase() ?? '?')

  const openRevision = revisions.find(r => r.status === 'open')

  const progressTab = (
    <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
      {/* Left: milestone pipeline */}
      <div className="p-info-panel">
        <p className="p-info-panel-label">Project Progress</p>
        {milestones.length === 0 ? (
          <p style={{ fontSize: '0.78rem', color: 'var(--p-t3)', fontStyle: 'italic' }}>No milestones set yet.</p>
        ) : (
          <PipelineSteps
            milestones={milestones}
            teamInitials={teamInitials}
            adminApproved={project.admin_approved}
            projectStatus={project.status}
          />
        )}
      </div>

      {/* Right: project info + feedback */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Project info */}
        <div className="p-info-panel">
          <p className="p-info-panel-label">Project Info</p>
          <div>
            <div className="p-info-row">
              <span className="p-info-key">Start Date</span>
              <span className="p-info-val">
                {project.created_at
                  ? new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '—'}
              </span>
            </div>
            <div className="p-info-row">
              <span className="p-info-key">Delivery Date</span>
              <span className="p-info-val">
                {project.client_deadline
                  ? new Date(project.client_deadline + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '—'}
              </span>
            </div>
            <div className="p-info-row">
              <span className="p-info-key">Package</span>
              <span className="p-info-val">{project.package ?? '—'}</span>
            </div>
            <div className="p-info-row">
              <span className="p-info-key">Status</span>
              <span className="p-info-val">
                <ProjectStatusBadge status={project.status} />
              </span>
            </div>
          </div>
          <div style={{ marginTop: '1.125rem' }}>
            <a
              href="#deliverables"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '0.65rem',
                background: 'var(--p-purple)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.72rem',
                letterSpacing: '0.06em',
                borderRadius: 8,
                textDecoration: 'none',
                transition: 'background 0.16s',
              }}
            >
              Review Deliverables
            </a>
          </div>
        </div>

        {/* Recent feedback */}
        {openRevision && (
          <div className="p-feedback-card">
            <p className="p-feedback-label">Recent Feedback</p>
            <blockquote className="p-feedback-quote">
              &ldquo;{openRevision.note}&rdquo;
            </blockquote>
            <p className="p-feedback-author">— Client</p>
          </div>
        )}

        {/* Feedback panel for submitting new revisions */}
        <ProjectFeedbackPanel projectId={id} revisions={revisions} />
      </div>
    </div>
  )

  const tabs = [
    {
      key: 'progress',
      label: 'Progress',
      content: progressTab,
    },
    {
      key: 'checklist',
      label: 'Asset Checklist',
      content: <ClientChecklistSection items={checklist} projectId={id} />,
    },
    {
      key: 'files',
      label: 'Files',
      content: <FilesSection folders={folders} files={files} projectId={id} userRole="client" />,
    },
    {
      key: 'deliverables',
      label: 'Deliverables',
      content: (
        <div id="deliverables">
          <ClientDeliverablesSection deliverables={deliverables} projectId={id} />
        </div>
      ),
    },
  ]

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--p-teal)', margin: '0 0 0.3rem' }}>
            Portal · Projects
          </p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--p-t1)', letterSpacing: '-0.01em', margin: 0 }}>
            {project.name}
          </h1>
          {project.package && (
            <p style={{ fontSize: '0.75rem', color: 'var(--p-teal)', marginTop: '0.2rem', fontWeight: 500 }}>
              {project.package}
            </p>
          )}
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>
      <Tabs tabs={tabs} />
    </div>
  )
}
