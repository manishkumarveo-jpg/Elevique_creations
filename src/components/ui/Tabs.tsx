'use client'

import { useState } from 'react'

interface Tab {
  key: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.key)
  const current = tabs.find(t => t.key === active)

  return (
    <div>
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '1.75rem',
        display: 'flex',
        gap: '0.125rem',
      }}>
        {tabs.map(tab => {
          const isActive = active === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              style={{
                padding: '0.6rem 1.1rem',
                fontSize: '0.78rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#14B8A6' : 'rgba(255,255,255,0.38)',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid #14B8A6' : '2px solid transparent',
                marginBottom: -1,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'color 0.18s ease, border-color 0.18s ease',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      <div key={active}>
        {current?.content}
      </div>
    </div>
  )
}
