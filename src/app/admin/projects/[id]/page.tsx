import { notFound } from 'next/navigation'
import { getProjectById } from '@/lib/queries/projects'
import { getMilestonesForProject } from '@/lib/queries/milestones'
import { getFoldersForProject, getFilesForProject } from '@/lib/queries/files'
import { getDeliverablesForProject } from '@/lib/queries/deliverables'
import { getChecklistForProject } from '@/lib/queries/checklist'
import { getAssignmentsForProject } from '@/lib/queries/assignments'
import { Tabs } from '@/components/ui/Tabs'
import { ProjectStatusBadge } from '@/components/shared/StatusBadge'
import { MilestoneTimeline } from '@/components/shared/MilestoneTimeline'
import { MilestoneControls } from './MilestoneControls'
import { FilesSection } from './FilesSection'
import { AssignmentsSection } from './AssignmentsSection'
import { DeliverablesSection } from './DeliverablesSection'

interface Props { params: Promise<{ id: string }> }

/* ── Reusable dark panel ──────────────────────────────────────── */
const panel: React.CSSProperties = {
  background: '#0f1220',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 16,
  padding: '1.5rem',
}

const panelLabel: React.CSSProperties = {
  fontSize: '0.6rem',
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.28)',
  marginBottom: '1rem',
}

const dtStyle: React.CSSProperties = {
  fontSize: '0.73rem',
  color: 'rgba(255,255,255,0.32)',
}

const ddStyle: React.CSSProperties = {
  fontSize: '0.73rem',
  color: 'rgba(255,255,255,0.82)',
  fontWeight: 500,
}

export default async function AdminProjectPage({ params }: Props) {
  const { id } = await params
  const [project, milestones, folders, files, deliverables, checklist, assignments] = await Promise.all([
    getProjectById(id).catch(() => null),
    getMilestonesForProject(id),
    getFoldersForProject(id),
    getFilesForProject(id),
    getDeliverablesForProject(id),
    getChecklistForProject(id),
    getAssignmentsForProject(id),
  ])

  if (!project) notFound()

  const client = project.client as { full_name?: string; company_name?: string } | null

  const tabs = [
    {
      key: 'overview',
      label: 'Overview',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Details panel */}
          <div style={panel}>
            <p style={panelLabel}>Project Details</p>
            <dl style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <dt style={dtStyle}>Status</dt>
                <dd><ProjectStatusBadge status={project.status} /></dd>
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <dt style={dtStyle}>Package</dt>
                <dd style={ddStyle}>{project.package ?? '—'}</dd>
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <dt style={dtStyle}>Deadline</dt>
                <dd style={ddStyle}>{project.deadline ?? '—'}</dd>
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <dt style={dtStyle}>Created</dt>
                <dd style={ddStyle}>{new Date(project.created_at).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>

          {/* Description panel */}
          <div style={panel}>
            <p style={panelLabel}>Description</p>
            <p style={{ fontSize: '0.82rem', color: project.description ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.22)', lineHeight: 1.6, fontStyle: project.description ? 'normal' : 'italic' }}>
              {project.description ?? 'No description provided.'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'milestones',
      label: 'Milestones',
      content: (
        <div style={panel}>
          <p style={panelLabel}>Milestones</p>
          {milestones.length === 0 ? (
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>No milestones yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <MilestoneTimeline milestones={milestones} />
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
      content: <DeliverablesSection deliverables={deliverables} checklist={checklist} projectId={id} isAdmin />,
    },
  ]

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#14B8A6', margin: '0 0 0.3rem' }}>
            Admin · Projects
          </p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em', margin: 0 }}>
            {project.name}
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.32)', marginTop: '0.25rem' }}>
            {client?.company_name ?? client?.full_name ?? 'No client'}
            {project.deadline ? ` · Due ${project.deadline}` : ''}
          </p>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      <Tabs tabs={tabs} />
    </div>
  )
}
