"use client";

import { motion } from "framer-motion";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

type MarginValue = `${number}px` | `${number}%`;
export type Margin =
  | MarginValue
  | `${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`;

export type RevealDirection = "up" | "down" | "left" | "right" | "scale" | "fade";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  scaleFrom?: number;
  amount?: number;
  margin?: Margin;
  className?: string;
}

function getVariants(direction: RevealDirection, distance: number, scaleFrom: number) {
  switch (direction) {
    case "up":
      return { hidden: { opacity: 0, y: distance }, visible: { opacity: 1, y: 0 } };
    case "down":
      return { hidden: { opacity: 0, y: -distance }, visible: { opacity: 1, y: 0 } };
    case "left":
      return { hidden: { opacity: 0, x: -distance }, visible: { opacity: 1, x: 0 } };
    case "right":
      return { hidden: { opacity: 0, x: distance }, visible: { opacity: 1, x: 0 } };
    case "scale":
      return { hidden: { opacity: 0, scale: scaleFrom }, visible: { opacity: 1, scale: 1 } };
    case "fade":
    default:
      return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  }
}

// Always renders the same <motion.div> using Framer's built-in
// whileInView/viewport (matching the pattern already used in
// ProcessSection.tsx/ui/demo.tsx), so SSR output and the first client
// paint always match — no conditional branching on OS/client-only state.
export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 20,
  scaleFrom = 0.94,
  amount = 0.12,
  margin = "-6% 0px",
  className,
}: ScrollRevealProps) {
  const variants = getVariants(direction, distance, scaleFrom);

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount, margin }}
      variants={variants}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
