'use client'

import { useState } from 'react'
import type { Database } from '@/lib/types/database'
import { ExternalLink, Trash2, Link2 } from 'lucide-react'

type FileRow = Database['public']['Tables']['files']['Row']

function getFileIcon(url: string): React.ReactNode {
  if (url.includes('drive.google.com')) return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14, color: '#4285F4' }}>
      <path d="M6.5 20L1 11l4.5-8h13l4.5 8-5.5 9H6.5zm1.1-2h8.8l4-6.5L16 5H8L3.6 11.5 7.6 18z" />
    </svg>
  )
  if (url.includes('dropbox.com')) return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14, color: '#0061FF' }}>
      <path d="M12 2L6 6l6 4-6 4 6 4 6-4-6-4 6-4L12 2zM6 18l6-4 6 4-6 4-6-4z" />
    </svg>
  )
  if (url.includes('figma.com')) return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14, color: '#F24E1E' }}>
      <path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4zm0-20H4c-2.2 0-4 1.8-4 4s1.8 4 4 4h4V4zm4 0v8h4c2.2 0 4-1.8 4-4s-1.8-4-4-4h-4zm4 10h-4v4c0 2.2 1.8 4 4 4s4-1.8 4-4-1.8-4-4-4z" />
    </svg>
  )
  return <Link2 size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
}

const deleteButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '0.25rem',
  cursor: 'pointer',
  color: 'rgba(255, 255, 255, 0.20)',
  display: 'flex',
  alignItems: 'center',
  transition: 'color 0.2s ease',
}

const actionAreaStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  flexShrink: 0,
}

interface FileLinkRowProps {
  file: FileRow & { uploader?: { full_name: string } | null }
  onDelete?: (id: string) => void
  canDelete?: boolean
}

export function FileLinkRow({ file, onDelete, canDelete }: FileLinkRowProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.625rem 0.75rem',
        borderRadius: 8,
        background: hovered ? 'rgba(255,255,255,0.03)' : 'transparent',
        border: '1px solid',
        borderColor: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* Icon */}
      <div style={{
        width: 28,
        height: 28,
        borderRadius: 6,
        background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: '1px solid',
        borderColor: hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}>
        {getFileIcon(file.file_url)}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <a
          href={file.file_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '0.8rem',
            fontWeight: 500,
            color: hovered ? '#ffffff' : 'rgba(255,255,255,0.75)',
            textDecoration: 'none',
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            transition: 'color 0.2s ease',
          }}
        >
          {file.file_name}
        </a>
        {file.uploader && (
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', margin: '0.1rem 0 0' }}>
            Added by {file.uploader.full_name}
          </p>
        )}
      </div>

      {/* Action Area */}
      <div style={actionAreaStyle}>
        {/* External Link Indicator on hover */}
        {hovered && !canDelete && (
          <a
            href={file.file_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
          >
            <ExternalLink size={14} />
          </a>
        )}

        {canDelete && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(file.id)}
            aria-label="Delete file"
            style={deleteButtonStyle}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(248,113,113,0.85)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.20)')}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
