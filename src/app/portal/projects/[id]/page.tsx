import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getProjectById } from '@/lib/queries/projects'
import { getMilestonesForProject } from '@/lib/queries/milestones'
import { getFoldersForProject, getFilesForProject } from '@/lib/queries/files'
import { getDeliverablesForProject } from '@/lib/queries/deliverables'
import { getChecklistForProject } from '@/lib/queries/checklist'
import { Tabs } from '@/components/ui/Tabs'
import { ProjectStatusBadge } from '@/components/shared/StatusBadge'
import { MilestoneTimeline } from '@/components/shared/MilestoneTimeline'
import { FilesSection } from '@/app/admin/projects/[id]/FilesSection'
import { ClientChecklistSection } from './ClientChecklistSection'
import { ClientDeliverablesSection } from './ClientDeliverablesSection'

interface Props { params: Promise<{ id: string }> }

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

export default async function ClientProjectPage({ params }: Props) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) notFound()

  const [project, milestones, folders, files, deliverables, checklist] = await Promise.all([
    getProjectById(id).catch(() => null),
    getMilestonesForProject(id),
    getFoldersForProject(id),
    getFilesForProject(id),
    getDeliverablesForProject(id),
    getChecklistForProject(id),
  ])

  if (!project || project.client_id !== user.id) notFound()

  const tabs = [
    {
      key: 'progress',
      label: 'Progress',
      content: (
        <div style={panel}>
          <p style={panelLabel}>Project Progress</p>
          {milestones.length === 0
            ? <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.22)', fontStyle: 'italic' }}>No milestones set yet.</p>
            : <MilestoneTimeline milestones={milestones} />
          }
        </div>
      ),
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
      content: <ClientDeliverablesSection deliverables={deliverables} projectId={id} />,
    },
  ]

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#14B8A6', margin: '0 0 0.3rem' }}>
            Portal · Projects
          </p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em', margin: 0 }}>
            {project.name}
          </h1>
          {project.package && (
            <p style={{ fontSize: '0.75rem', color: '#14B8A6', marginTop: '0.2rem', fontWeight: 500 }}>
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
