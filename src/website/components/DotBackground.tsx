"use client";

import { useEffect, useRef } from "react";

/* ─── Config — tweak freely with Tailwind or these constants ──── */
const DOT_RADIUS  = 1;    // px — dot size
const SPACING     = 22;   // px — grid cell size (gap between dots)
const DOT_COLOR   = "#cbd5e1"; // slate-300 — cool silver-white, neutral contrast
const OPACITY     = 0.09; // overall layer opacity
const PARALLAX    = 0.2;  // scroll multiplier (0 = static, 1 = full speed)

/* ════════════════════════════════════════════════════════════════ */
export default function DotBackground() {
  const patternRef = useRef<SVGPatternElement>(null);

  /* Parallax: directly mutate pattern y — zero React re-renders */
  useEffect(() => {
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        if (patternRef.current) {
          patternRef.current.setAttribute(
            "y",
            String(-(window.scrollY * PARALLAX) % SPACING)
          );
        }
        queued = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none select-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <pattern
            ref={patternRef}
            id="dotPattern"
            x="0"
            y="0"
            width={SPACING}
            height={SPACING}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={SPACING / 2}
              cy={SPACING / 2}
              r={DOT_RADIUS}
              fill={DOT_COLOR}
            />
          </pattern>
        </defs>

        <rect
          width="100%"
          height="100%"
          fill="url(#dotPattern)"
          opacity={OPACITY}
        />
      </svg>
    </div>
  );
}
