"use client";

import { cn } from "@/shared/lib/utils";
import { motion, type MotionStyle, type Transition } from "motion/react";

interface BorderBeamProps {
  className?: string;
  size?: number;
  thickness?: number;
  radius?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  transition?: Transition;
  style?: React.CSSProperties;
  reverse?: boolean;
  initialOffset?: number;
}

export const BorderBeam = ({
  className,
  size = 50,
  thickness = 14,
  radius = 20,
  delay = 0,
  duration = 6,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  transition,
  style,
  reverse = false,
  initialOffset = 0,
}: BorderBeamProps) => {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
      <motion.div
        className={cn("absolute", className)}
        style={
          {
            width: size,
            height: thickness,
            offsetPath: `rect(0 auto auto 0 round ${radius}px)`,
            background: `linear-gradient(to left, ${colorFrom} 0%, ${colorTo} 55%, transparent 100%)`,
            filter: `drop-shadow(0 0 1px ${colorFrom})`,
            ...style,
          } as MotionStyle
        }
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `-${initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
          ...transition,
        }}
      />
    </div>
  );
};
