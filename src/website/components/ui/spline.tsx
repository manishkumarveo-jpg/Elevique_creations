'use client'

import { Suspense, lazy, useEffect, useState } from 'react'
import type { Application } from '@splinetool/runtime'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
  onLoad?: (spline: Application) => void
}

export function SplineScene({ scene, className, onLoad }: SplineSceneProps) {
  const [loaded, setLoaded] = useState(false)

  // Kick off the scene file fetch in parallel with the lazy runtime chunk
  // instead of waiting for the chunk to resolve before the network request starts.
  useEffect(() => {
    const preconnect = document.createElement('link')
    preconnect.rel = 'preconnect'
    preconnect.href = new URL(scene).origin
    preconnect.crossOrigin = 'anonymous'

    const preload = document.createElement('link')
    preload.rel = 'preload'
    preload.as = 'fetch'
    preload.href = scene
    preload.crossOrigin = 'anonymous'

    document.head.appendChild(preconnect)
    document.head.appendChild(preload)

    return () => {
      if (document.head.contains(preconnect)) document.head.removeChild(preconnect)
      if (document.head.contains(preload)) document.head.removeChild(preload)
    }
  }, [scene])

  return (
    <div className="relative w-full h-full">
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
        style={{ opacity: loaded ? 0 : 1, pointerEvents: loaded ? 'none' : 'auto' }}
      >
        <span className="loader"></span>
      </div>

      <Suspense fallback={null}>
        <Spline
          scene={scene}
          className={className}
          onLoad={(spline) => {
            setLoaded(true)
            onLoad?.(spline)
          }}
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
      </Suspense>
    </div>
  )
}
