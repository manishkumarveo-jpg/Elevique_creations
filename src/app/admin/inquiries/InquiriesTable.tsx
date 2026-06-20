'use client'

import { useMemo, useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Pagination } from '@/components/ui/Pagination'
import { Mail, Phone, Calendar } from 'lucide-react'

type ContactSubmission = {
  id: string
  name: string
  email: string
  phone?: string | null
  message: string
  created_at: string
}

const PAGE_SIZE = 10

const inputStyle: React.CSSProperties = {
  background: '#161d2e',
  border: '1px solid rgba(255,255,255,0.11)',
  borderRadius: 9,
  padding: '0.5rem 0.8rem',
  fontSize: '0.78rem',
  color: 'rgba(255,255,255,0.82)',
  outline: 'none',
  fontFamily: 'inherit',
}

export function InquiriesTable({ submissions }: { submissions: ContactSubmission[] }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return submissions
    return submissions.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.message.toLowerCase().includes(q)
    )
  }, [submissions, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function updateSearch(v: string) { setSearch(v); setPage(1) }

  return (
    <>
      <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by name, email, or message…"
          value={search}
          onChange={e => updateSearch(e.target.value)}
          style={{ ...inputStyle, minWidth: 260 }}
        />
        <span style={{ fontSize: '0.78rem', color: 'var(--ds-text-3)', alignSelf: 'center', marginLeft: 'auto' }}>
          {filtered.length} of {submissions.length} inquiries
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="p-empty">
          <p className="p-empty-title">No inquiries match this search</p>
        </div>
      ) : (
        <div className="p-table-wrap">
          <table className="p-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Contact</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((sub) => (
                <tr key={sub.id}>
                  <td style={{ verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Avatar name={sub.name} size="sm" />
                      <span className="p-table-name">{sub.name}</span>
                    </div>
                  </td>
                  <td style={{ verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '12px' }} className="mono">
                        <Mail size={11} style={{ color: 'var(--ds-text-3)', flexShrink: 0 }} />
                        <a href={`mailto:${sub.email}`} style={{ color: 'var(--ds-text-3)', textDecoration: 'none' }}>
                          {sub.email}
                        </a>
                      </span>
                      {sub.phone && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '12px' }} className="mono">
                          <Phone size={11} style={{ color: 'var(--ds-text-3)', flexShrink: 0 }} />
                          <a href={`tel:${sub.phone}`} style={{ color: 'var(--ds-text-3)', textDecoration: 'none' }}>
                            {sub.phone}
                          </a>
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ verticalAlign: 'top', maxWidth: 400 }}>
                    <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--ds-text-2)', whiteSpace: 'pre-wrap', margin: 0 }}>
                      {sub.message}
                    </p>
                  </td>
                  <td style={{ verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '12px', color: 'var(--ds-text-3)' }} className="mono">
                      <Calendar size={11} style={{ flexShrink: 0 }} />
                      {new Date(sub.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
    </>
  )
}
