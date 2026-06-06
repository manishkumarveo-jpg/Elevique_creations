'use client'

import { useTransition } from 'react'
import { FileLinkRow } from '@/components/shared/FileLinkRow'
import { AddLinkForm } from '@/components/shared/AddLinkForm'
import { addFileLink } from '@/lib/actions/files/add-file-link'
import { softDeleteFile } from '@/lib/actions/files/delete-file'
import type { Database } from '@/lib/types/database'
import type { FileWithMeta } from '@/lib/queries/files'

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
  background: '#0f1220',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 16,
  padding: '1.25rem 1.5rem',
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
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.22)', fontStyle: 'italic' }}>No folders created yet.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {folders.map(folder => {
        const folderFiles = getFilesForFolder(folder.id)
        const canUpload = canUploadToFolder(folder)
        return (
          <div key={folder.id} style={panel}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem' }}>
              {folder.icon && (
                <span style={{ fontSize: '1rem' }}>{folder.icon}</span>
              )}
              <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                {folder.name}
              </h3>
              <span style={{
                marginLeft: 'auto',
                fontSize: '0.62rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.25)',
              }}>
                {folderFiles.length} file{folderFiles.length !== 1 ? 's' : ''}
              </span>
            </div>

            {folderFiles.length === 0 && !canUpload && (
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.22)', fontStyle: 'italic' }}>No files yet.</p>
            )}

            {folderFiles.map(file => (
              <FileLinkRow
                key={file.id}
                file={file}
                canDelete={isAdmin}
                onDelete={fileId => startTransition(() => softDeleteFile(fileId, projectId))}
              />
            ))}

            {canUpload && (
              <div style={{ marginTop: folderFiles.length > 0 ? '0.875rem' : 0 }}>
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
