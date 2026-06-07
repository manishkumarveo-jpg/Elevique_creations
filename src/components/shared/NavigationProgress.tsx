'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type Phase = 'idle' | 'running' | 'done'

export function NavigationProgress() {
  const pathname = usePathname()
  const [phase, setPhase] = useState<Phase>('idle')
  const [width, setWidth] = useState(0)
  const prevPath = useRef(pathname)
  const doneTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Start bar on any internal link click
  useEffect(() => {
    const onLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest('a[href]')
      if (!anchor) return
      const href = anchor.getAttribute('href') ?? ''
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto')) return

      clearTimeout(doneTimer.current)
      clearTimeout(hideTimer.current)
      setPhase('running')
      setWidth(0)
      requestAnimationFrame(() => requestAnimationFrame(() => setWidth(65)))
    }

    document.addEventListener('click', onLinkClick)
    return () => document.removeEventListener('click', onLinkClick)
  }, [])

  // Complete bar when route actually changes
  useEffect(() => {
    if (pathname === prevPath.current) return
    prevPath.current = pathname

    setPhase('done')
    setWidth(100)

    // After bar reaches 100%, fade it out
    doneTimer.current = setTimeout(() => setPhase('idle'), 500)

    return () => {
      clearTimeout(doneTimer.current)
      clearTimeout(hideTimer.current)
    }
  }, [pathname])

  if (phase === 'idle') return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: 2,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${width}%`,
          background: 'linear-gradient(90deg, #7C3AED 0%, #14B8A6 100%)',
          boxShadow: '0 0 12px rgba(124,58,237,0.7), 0 0 24px rgba(20,184,166,0.4)',
          transition:
            phase === 'done'
              ? 'width 0.2s ease-out, opacity 0.35s ease 0.15s'
              : 'width 1.4s cubic-bezier(0.05, 0.1, 0, 1)',
          opacity: phase === 'done' ? 0 : 1,
          borderRadius: '0 2px 2px 0',
        }}
      />
    </div>
  )
}
