import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getProjectById } from '@/lib/queries/projects'
import { getMilestonesForProject } from '@/lib/queries/milestones'
import { getFoldersForProject, getFilesForProject } from '@/lib/queries/files'
import { getChecklistForProject } from '@/lib/queries/checklist'
import { Tabs } from '@/components/ui/Tabs'
import { ProjectStatusBadge } from '@/components/shared/StatusBadge'
import { MilestoneTimeline } from '@/components/shared/MilestoneTimeline'
import { TeamMilestoneControls } from './TeamMilestoneControls'
import { FilesSection } from '@/app/admin/projects/[id]/FilesSection'
import { AssetChecklist } from '@/components/shared/AssetChecklist'

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

export default async function TeamProjectPage({ params }: Props) {
  const { id } = await params
  const supabase = await createServerClient()
  await supabase.auth.getUser()

  const [project, milestones, folders, files, checklist] = await Promise.all([
    getProjectById(id).catch(() => null),
    getMilestonesForProject(id),
    getFoldersForProject(id),
    getFilesForProject(id),
    getChecklistForProject(id),
  ])

  if (!project) notFound()

  const client = project.client as { full_name?: string; company_name?: string } | null

  const tabs = [
    {
      key: 'milestones',
      label: 'Milestones',
      content: (
        <div style={panel}>
          <p style={panelLabel}>Milestones</p>
          <MilestoneTimeline milestones={milestones} />
          <TeamMilestoneControls milestones={milestones} projectId={id} />
        </div>
      ),
    },
    {
      key: 'files',
      label: 'Files',
      content: <FilesSection folders={folders} files={files} projectId={id} userRole="team_member" />,
    },
    {
      key: 'checklist',
      label: 'Asset Checklist',
      content: (
        <div style={panel}>
          <p style={panelLabel}>Asset Checklist</p>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', marginBottom: '1rem', fontStyle: 'italic' }}>
            View only — client manages this checklist
          </p>
          <AssetChecklist items={checklist} readOnly />
        </div>
      ),
    },
  ]

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#14B8A6', margin: '0 0 0.3rem' }}>
            Team · Projects
          </p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em', margin: 0 }}>
            {project.name}
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.32)', marginTop: '0.2rem' }}>
            {client?.company_name ?? client?.full_name ?? '—'}
          </p>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>
      <Tabs tabs={tabs} />
    </div>
  )
}
