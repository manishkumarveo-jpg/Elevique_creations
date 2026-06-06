'use client'

import { useTransition } from 'react'
import { AssetChecklist } from '@/components/shared/AssetChecklist'
import { toggleChecklistItem } from '@/lib/actions/checklist/update-checklist'
import type { Database } from '@/lib/types/database'

type ChecklistItem = Database['public']['Tables']['asset_checklist']['Row']

export function ClientChecklistSection({ items, projectId }: { items: ChecklistItem[]; projectId: string }) {
  const [, startTransition] = useTransition()

  return (
    <div style={{
      background: '#0f1220',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 16,
      padding: '1.5rem',
    }}>
      <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', margin: '0 0 0.35rem' }}>
        Asset Checklist
      </p>
      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.28)', marginBottom: '1.125rem' }}>
        Check off items as you prepare your brand assets. You can also upload links in the Files tab.
      </p>
      <AssetChecklist
        items={items}
        onToggle={async (itemId, checked) => {
          startTransition(() => toggleChecklistItem(itemId, projectId, checked))
        }}
      />
    </div>
  )
}
