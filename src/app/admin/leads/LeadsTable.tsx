'use client'

import { useMemo, useState, useTransition } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { classifyAllUnprocessed, classifySubmission } from '@/lib/actions/ai/classify-submission'
import { Mail, Phone, MapPin, Video, DollarSign, Globe, Building, Briefcase, Calendar, Sparkles } from 'lucide-react'

type SocialLead = {
  id: string
  full_name: string
  email: string
  phone?: string | null
  service_type?: string | null
  videos_count?: string | null
  budget_per_video?: string | null
  requirement_brief?: string | null
  city?: string | null
  company_name?: string | null
  website?: string | null
  created_at: string
  ai_summary?: string | null
  ai_priority?: string | null
  ai_category?: string | null
  ai_processed_at?: string | null
}

const priorityBadgeVariant: Record<string, 'red' | 'yellow' | 'gray'> = {
  hot: 'red',
  warm: 'yellow',
  cold: 'gray',
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

export function LeadsTable({ leads }: { leads: SocialLead[] }) {
  const [search, setSearch] = useState('')
  const [service, setService] = useState('All')
  const [page, setPage] = useState(1)
  const [analyzingId, setAnalyzingId] = useState<string | null>(null)
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function analyzeRow(id: string) {
    setAnalyzingId(id)
    setAnalyzeError(null)
    startTransition(async () => {
      try {
        await classifySubmission({ table: 'social_leads', id })
      } catch (err) {
        setAnalyzeError(err instanceof Error ? err.message : 'Failed to analyze lead.')
      } finally {
        setAnalyzingId(null)
      }
    })
  }

  function analyzeAll() {
    setAnalyzingId('__bulk__')
    setAnalyzeError(null)
    startTransition(async () => {
      try {
        await classifyAllUnprocessed('social_leads')
      } catch (err) {
        setAnalyzeError(err instanceof Error ? err.message : 'Failed to analyze leads.')
      } finally {
        setAnalyzingId(null)
      }
    })
  }

  const serviceOptions = useMemo(() => {
    const set = new Set(leads.map(l => l.service_type).filter((s): s is string => !!s))
    return ['All', ...Array.from(set)]
  }, [leads])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return leads.filter(l => {
      if (service !== 'All' && l.service_type !== service) return false
      if (!q) return true
      return l.full_name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.company_name ?? '').toLowerCase().includes(q)
    })
  }, [leads, search, service])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function updateSearch(v: string) { setSearch(v); setPage(1) }
  function updateService(v: string) { setService(v); setPage(1) }

  return (
    <>
      <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by name, email, or company…"
          value={search}
          onChange={e => updateSearch(e.target.value)}
          style={{ ...inputStyle, minWidth: 240 }}
        />
        <select className="p-select" value={service} onChange={e => updateService(e.target.value)} style={{ width: 'auto' }}>
          {serviceOptions.map(s => <option key={s} value={s}>{s === 'All' ? 'All Services' : s}</option>)}
        </select>
        <span style={{ fontSize: '0.78rem', color: 'var(--ds-text-3)', alignSelf: 'center', marginLeft: 'auto' }}>
          {filtered.length} of {leads.length} leads
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled
          loading={isPending && analyzingId === '__bulk__'}
          title="AI analysis is temporarily disabled"
          onClick={analyzeAll}
        >
          <Sparkles size={13} /> Analyze All New
        </Button>
      </div>

      {analyzeError && (
        <p style={{ fontSize: '0.78rem', color: 'var(--ds-red)', marginBottom: '1rem' }}>{analyzeError}</p>
      )}

      {filtered.length === 0 ? (
        <div className="p-empty">
          <p className="p-empty-title">No leads match these filters</p>
        </div>
      ) : (
        <div className="p-table-wrap">
          <table className="p-table">
            <thead>
              <tr>
                <th>Lead / Contact</th>
                <th>Service</th>
                <th>Budget</th>
                <th>Brief</th>
                <th>Location</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((lead) => (
                <tr key={lead.id}>
                  <td style={{ verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Avatar name={lead.full_name} size="sm" />
                        <span className="p-table-name">{lead.full_name}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', paddingLeft: '2rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '12px' }} className="mono">
                          <Mail size={11} style={{ color: 'var(--ds-text-3)', flexShrink: 0 }} />
                          <a href={`mailto:${lead.email}`} style={{ color: 'var(--ds-text-3)', textDecoration: 'none' }}>
                            {lead.email}
                          </a>
                        </span>
                        {lead.phone && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '12px' }} className="mono">
                            <Phone size={11} style={{ color: 'var(--ds-text-3)', flexShrink: 0 }} />
                            <a href={`tel:${lead.phone}`} style={{ color: 'var(--ds-text-3)', textDecoration: 'none' }}>
                              {lead.phone}
                            </a>
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td style={{ verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '13px', color: 'var(--ds-text)', fontWeight: 500 }}>
                        <Briefcase size={12} style={{ color: 'var(--ds-text-3)', flexShrink: 0 }} />
                        {lead.service_type || '—'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '12px' }} className="mono">
                        <Video size={11} style={{ color: 'var(--ds-text-3)', flexShrink: 0 }} />
                        <span style={{ color: 'var(--ds-text-3)' }}>{lead.videos_count || '—'}</span>
                      </span>
                    </div>
                  </td>

                  <td style={{ verticalAlign: 'top' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }} className="mono">
                      <DollarSign size={13} style={{ color: 'var(--ds-text-3)', flexShrink: 0 }} />
                      {lead.budget_per_video || '—'}
                    </span>
                  </td>

                  <td style={{ verticalAlign: 'top', maxWidth: 280 }}>
                    <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--ds-text-2)', margin: 0, whiteSpace: 'pre-wrap' }}>
                      {lead.requirement_brief || <span style={{ color: 'var(--ds-text-3)', fontStyle: 'italic' }}>No brief provided</span>}
                    </p>
                    {lead.ai_summary ? (
                      <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <p style={{ fontSize: '12px', lineHeight: '1.4', color: 'var(--ds-text-3)', margin: 0, fontStyle: 'italic' }}>
                          {lead.ai_summary}
                        </p>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {lead.ai_priority && (
                            <Badge variant={priorityBadgeVariant[lead.ai_priority] ?? 'gray'}>{lead.ai_priority}</Badge>
                          )}
                          {lead.ai_category && <Badge variant="gray">{lead.ai_category}</Badge>}
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled
                        loading={isPending && analyzingId === lead.id}
                        title="AI analysis is temporarily disabled"
                        onClick={() => analyzeRow(lead.id)}
                        style={{ marginTop: '0.4rem', padding: 0, height: 'auto' }}
                      >
                        <Sparkles size={12} /> Analyze
                      </Button>
                    )}
                  </td>

                  <td style={{ verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {lead.city && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '13px', color: 'var(--ds-text-2)' }}>
                          <MapPin size={12} style={{ color: 'var(--ds-text-3)', flexShrink: 0 }} />
                          {lead.city}
                        </span>
                      )}
                      {lead.company_name && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '13px', color: 'var(--ds-text-2)' }}>
                          <Building size={12} style={{ color: 'var(--ds-text-3)', flexShrink: 0 }} />
                          {lead.company_name}
                        </span>
                      )}
                      {lead.website && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '13px', color: 'var(--ds-text-2)' }}>
                          <Globe size={12} style={{ color: 'var(--ds-text-3)', flexShrink: 0 }} />
                          <a href={lead.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ds-text-2)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                            Website
                          </a>
                        </span>
                      )}
                    </div>
                  </td>

                  <td style={{ verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '12px', color: 'var(--ds-text-3)' }} className="mono">
                      <Calendar size={11} style={{ flexShrink: 0 }} />
                      {new Date(lead.created_at).toLocaleDateString('en-US', {
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
