'use client'

import { useTransition, useState } from 'react'
import { FileLinkRow } from '@/dashboard/components/shared/FileLinkRow'
import { AddLinkForm } from '@/dashboard/components/shared/AddLinkForm'
import { addFileLink } from '@/dashboard/lib/actions/files/add-file-link'
import { softDeleteFile } from '@/dashboard/lib/actions/files/delete-file'
import type { Database } from '@/shared/lib/types/database'
import type { FileWithMeta } from '@/dashboard/lib/queries/files'
import { FileText, Box, FolderOpen, Scroll, Film, Image as ImageIcon, Folder } from 'lucide-react'

type FolderRow = Database['public']['Tables']['folders']['Row']
type FileRow = FileWithMeta

interface FilesSectionProps {
  folders: FolderRow[]
  files: FileRow[]
  projectId: string
  isAdmin?: boolean
  userRole?: string
}

const panel: React.CSSProperties = {
  borderRadius: 16,
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '140px',
  boxSizing: 'border-box',
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '1rem',
  width: '100%',
}

const iconContainerStyle: React.CSSProperties = {
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}

function getFolderIcon(folderName: string) {
  const name = folderName.toLowerCase();
  if (name.includes('agreement')) return <FileText size={18} />;
  if (name.includes('asset')) return <Box size={18} />;
  if (name.includes('reference')) return <FolderOpen size={18} />;
  if (name.includes('script') || name.includes('moodboard')) return <Scroll size={18} />;
  if (name.includes('video')) return <Film size={18} />;
  if (name.includes('image') || name.includes('photo')) return <ImageIcon size={18} />;
  return <Folder size={18} />;
}

interface FolderCardProps {
  folder: FolderRow
  folderFiles: FileRow[]
  canUpload: boolean
  isAdmin?: boolean
  projectId: string
  startTransition: React.TransitionStartFunction
}

function FolderCard({ folder, folderFiles, canUpload, isAdmin, projectId, startTransition }: FolderCardProps) {
  const [hovered, setHovered] = useState(false)
  const FolderIcon = getFolderIcon(folder.name)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...panel,
        background: hovered ? '#090b15' : '#05070e',
        border: '1px solid',
        borderColor: hovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered 
          ? '0 12px 30px rgba(0, 0, 0, 0.55), 0 0 1px rgba(255, 255, 255, 0.1) inset' 
          : '0 4px 16px rgba(0, 0, 0, 0.35)',
        transition: 'background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div style={{ width: '100%' }}>
        {/* Folder Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
          <div style={{
            ...iconContainerStyle,
            background: hovered ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.02)',
            border: '1px solid',
            borderColor: hovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.06)',
            color: hovered ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            {FolderIcon}
          </div>
          <h3 style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: hovered ? '#ffffff' : 'rgba(255, 255, 255, 0.9)',
            margin: 0,
            transition: 'color 0.3s ease',
          }}>
            {folder.name}
          </h3>
          <span style={{
            marginLeft: 'auto',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: hovered ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)',
            transition: 'color 0.3s ease',
          }}>
            {folderFiles.length} file{folderFiles.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Files List */}
        {folderFiles.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '1rem' }}>
            {folderFiles.map(file => (
              <FileLinkRow
                key={file.id}
                file={file}
                canDelete={isAdmin}
                onDelete={(fileId: string) => startTransition(() => softDeleteFile(fileId, projectId))}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Link Form at bottom */}
      {canUpload && (
        <div style={{ marginTop: 'auto', paddingTop: folderFiles.length > 0 ? '0.5rem' : 0 }}>
          <AddLinkForm
            onSubmit={async (data) => {
              await addFileLink({ ...data, folder_id: folder.id, project_id: projectId })
            }}
          />
        </div>
      )}
    </div>
  )
}

export function FilesSection({ folders, files, projectId, isAdmin, userRole }: FilesSectionProps) {
  const [, startTransition] = useTransition()

  function getFilesForFolder(folderId: string) {
    return files.filter(f => f.folder_id === folderId)
  }

  function canUploadToFolder(folder: FolderRow) {
    if (isAdmin) return true
    if (!userRole) return false
    return folder.upload_roles.includes(userRole)
  }

  if (folders.length === 0) {
    return (
      <div style={{ ...panel, background: '#05070e', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.22)', fontStyle: 'italic', margin: 0 }}>
          No folders created yet.
        </p>
      </div>
    )
  }

  return (
    <div style={gridStyle}>
      {folders.map(folder => {
        const folderFiles = getFilesForFolder(folder.id)
        const canUpload = canUploadToFolder(folder)

        return (
          <FolderCard
            key={folder.id}
            folder={folder}
            folderFiles={folderFiles}
            canUpload={canUpload}
            isAdmin={isAdmin}
            projectId={projectId}
            startTransition={startTransition}
          />
        )
      })}
    </div>
  )
}
