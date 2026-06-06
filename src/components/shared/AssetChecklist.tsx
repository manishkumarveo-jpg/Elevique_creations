'use client'

import { useTransition } from 'react'
import type { Database } from '@/lib/types/database'

type ChecklistItem = Database['public']['Tables']['asset_checklist']['Row']

interface AssetChecklistProps {
  items: ChecklistItem[]
  onToggle?: (itemId: string, checked: boolean) => Promise<void>
  readOnly?: boolean
}

export function AssetChecklist({ items, onToggle, readOnly = false }: AssetChecklistProps) {
  const [isPending, startTransition] = useTransition()
  const completed = items.filter(i => i.is_completed).length

  if (items.length === 0) {
    return (
      <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.22)', fontStyle: 'italic' }}>
        No checklist items yet.
      </p>
    )
  }

  return (
    <div>
      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
        <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.30)', textTransform: 'uppercase' }}>
          {completed}/{items.length} completed
        </p>
        <div style={{ width: 80, height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            background: '#14B8A6',
            borderRadius: 99,
            transition: 'width 0.35s ease',
            width: `${items.length ? (completed / items.length) * 100 : 0}%`,
          }} />
        </div>
      </div>

      {/* Items */}
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map(item => (
          <li key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              disabled={readOnly || isPending}
              onClick={() => onToggle && startTransition(() => onToggle(item.id, !item.is_completed))}
              style={{
                flexShrink: 0,
                width: 18,
                height: 18,
                borderRadius: 5,
                border: item.is_completed ? '2px solid #14B8A6' : '2px solid rgba(255,255,255,0.20)',
                background: item.is_completed ? '#14B8A6' : 'transparent',
                cursor: (readOnly || isPending) ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.18s ease, border-color 0.18s ease',
                padding: 0,
              }}
            >
              {item.is_completed && (
                <svg viewBox="0 0 12 12" fill="none" style={{ width: 9, height: 9 }}>
                  <path d="M2 6l3 3 5-5" stroke="#07080c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <span style={{
              fontSize: '0.82rem',
              color: item.is_completed ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.78)',
              textDecoration: item.is_completed ? 'line-through' : 'none',
              transition: 'color 0.18s ease',
            }}>
              {item.item_label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
