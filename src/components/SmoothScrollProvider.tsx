"use client";

import { ReactLenis } from "lenis/react";

const EASING = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis
      root
      options={{
        duration: 0.8,
        easing: EASING,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
