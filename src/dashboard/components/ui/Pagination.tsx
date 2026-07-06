'use client'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems: number
  pageSize: number
}

function pageWindow(page: number, totalPages: number): (number | 'ellipsis')[] {
  const window = new Set([1, totalPages, page, page - 1, page + 1])
  const pages = [...window].filter(p => p >= 1 && p <= totalPages).sort((a, b) => a - b)

  const result: (number | 'ellipsis')[] = []
  let prev = 0
  for (const p of pages) {
    if (prev && p - prev > 1) result.push('ellipsis')
    result.push(p)
    prev = p
  }
  return result
}

export function Pagination({ page, totalPages, onPageChange, totalItems, pageSize }: PaginationProps) {
  if (totalPages <= 1) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  const btnStyle = (active = false, disabled = false): React.CSSProperties => ({
    minWidth: 28,
    height: 28,
    padding: '0 0.5rem',
    fontSize: '0.75rem',
    fontWeight: active ? 700 : 500,
    borderRadius: 7,
    border: '1px solid',
    borderColor: active ? 'var(--ds-white)' : 'rgba(255,255,255,0.11)',
    background: active ? 'var(--ds-white)' : 'transparent',
    color: active ? '#07080c' : disabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
  })

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--ds-text-3)' }}>
        Showing {start}–{end} of {totalItems}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        <button type="button" disabled={page === 1} onClick={() => onPageChange(page - 1)} style={btnStyle(false, page === 1)}>
          ‹
        </button>
        {pageWindow(page, totalPages).map((p, idx) =>
          p === 'ellipsis' ? (
            <span key={`e-${idx}`} style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', padding: '0 0.2rem' }}>…</span>
          ) : (
            <button key={p} type="button" onClick={() => onPageChange(p)} style={btnStyle(p === page)}>
              {p}
            </button>
          )
        )}
        <button type="button" disabled={page === totalPages} onClick={() => onPageChange(page + 1)} style={btnStyle(false, page === totalPages)}>
          ›
        </button>
      </div>
    </div>
  )
}
