'use client'

import { useTransition } from 'react'
import { FileLinkRow } from '@/components/shared/FileLinkRow'
import { AddLinkForm } from '@/components/shared/AddLinkForm'
import { addFileLink } from '@/lib/actions/files/add-file-link'
import { softDeleteFile } from '@/lib/actions/files/delete-file'
import type { Database } from '@/lib/types/database'
import type { FileWithMeta } from '@/lib/queries/files'
import { FileText, Box, FolderOpen, Scroll, Film, Image as ImageIcon, Folder } from 'lucide-react'

type Folder = Database['public']['Tables']['folders']['Row']
type FileRow = FileWithMeta

interface FilesSectionProps {
  folders: Folder[]
  files: FileRow[]
  projectId: string
  isAdmin?: boolean
  userRole?: string
}

const panel: React.CSSProperties = {
  background: '#060813',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 16,
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '140px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
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
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(255, 255, 255, 0.6)',
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

export function FilesSection({ folders, files, projectId, isAdmin, userRole }: FilesSectionProps) {
  const [, startTransition] = useTransition()

  function getFilesForFolder(folderId: string) {
    return files.filter(f => f.folder_id === folderId)
  }

  function canUploadToFolder(folder: Folder) {
    if (isAdmin) return true
    if (!userRole) return false
    return folder.upload_roles.includes(userRole)
  }

  if (folders.length === 0) {
    return (
      <div style={panel}>
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
        const FolderIcon = getFolderIcon(folder.name)

        return (
          <div key={folder.id} style={panel}>
            <div style={{ width: '100%' }}>
              {/* Folder Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
                <div style={iconContainerStyle}>
                  {FolderIcon}
                </div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                  {folder.name}
                </h3>
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.35)',
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
                      onDelete={fileId => startTransition(() => softDeleteFile(fileId, projectId))}
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
      })}
    </div>
  )
}
