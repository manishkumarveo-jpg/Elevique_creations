"use client";

import { motion } from "framer-motion";
import type { RevealDirection, Margin } from "./ScrollReveal";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

interface StaggerContainerProps {
  children: React.ReactNode;
  amount?: number;
  margin?: Margin;
  staggerChildren?: number;
  delayChildren?: number;
  className?: string;
}

// Same approach as ScrollReveal: a single stable <motion.div> using
// whileInView/viewport, matching the codebase's existing proven pattern.
export function StaggerContainer({
  children,
  amount = 0.12,
  margin = "-6% 0px",
  staggerChildren = 0.08,
  delayChildren = 0.03,
  className,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount, margin }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren, delayChildren } },
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  distance?: number;
  scaleFrom?: number;
  duration?: number;
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

export function StaggerItem({
  children,
  direction = "up",
  distance = 18,
  scaleFrom = 0.94,
  duration = 0.5,
  className,
}: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={getVariants(direction, distance, scaleFrom)}
      transition={{ duration, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
