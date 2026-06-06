import type { Database } from '@/lib/types/database'

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
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.35)' }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  )
}

interface FileLinkRowProps {
  file: FileRow & { uploader?: { full_name: string } | null }
  onDelete?: (id: string) => void
  canDelete?: boolean
}

export function FileLinkRow({ file, onDelete, canDelete }: FileLinkRowProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.6rem 0.75rem',
      borderRadius: 9,
      transition: 'background 0.15s ease',
    }}
    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Icon */}
      <div style={{
        width: 28,
        height: 28,
        borderRadius: 7,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
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
            color: 'rgba(255,255,255,0.80)',
            textDecoration: 'none',
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#14B8A6')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.80)')}
        >
          {file.file_name}
        </a>
        {file.uploader && (
          <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', margin: 0 }}>
            Added by {file.uploader.full_name}
          </p>
        )}
      </div>

      {canDelete && onDelete && (
        <button
          onClick={() => onDelete(file.id)}
          aria-label="Delete file"
          style={{
            background: 'none',
            border: 'none',
            padding: '0.25rem',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.20)',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(248,113,113,0.70)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.20)')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 15, height: 15 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
