"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Search,
  Lightbulb,
  Cpu,
  RefreshCw,
  Rocket,
} from "lucide-react";

/* The Elevique Method */

/* ─── Data ─────────────────────────────────────────────────────── */
const STEPS = [
  {
    id: "discovery",
    number: "01",
    icon: <Search size={22} strokeWidth={1.5} />,
    title: "Discovery & Brief",
    description:
      "Share the goal, audience, product USPs, and any references. Brand logo/product shots would be required to proceed. We align on hooks, tone, and CTA so the ad is engineered for performance from the start.",
    tags: ["Brand Audit", "Goal Setting", "Creative Brief"],
  },
  {
    id: "strategy",
    number: "02",
    icon: <Lightbulb size={22} strokeWidth={1.5} />,
    title: "Script & Storyboard",
    description:
      "The most crucial step! We craft a scroll-stopping script or a visual storyboard tailored to the client's brand platform. After the script is thoroughly reviewed and approved by the client, it is sent for video generation.",
    tags: ["Moodboards", "Art Direction", "Storyboard"],
  },
  {
    id: "production",
    number: "03",
    icon: <Cpu size={22} strokeWidth={1.5} />,
    title: "AI Generation + Editing",
    description:
      "We generate realistic AI visuals and assemble scenes, then add pro voiceover/dialogues and music. Clean transitions, tasteful motion, and platform-native formats ensure it looks premium and performs.",
    tags: ["Neural Rendering", "Scene Composition", "Motion Grading"],
  },
  {
    id: "refinement",
    number: "04",
    icon: <RefreshCw size={22} strokeWidth={1.5} />,
    title: "Refinement & Review",
    description:
      "You receive a private review link within 48 hours. We collaborate through structured feedback rounds — each iteration sharpening the output until it exceeds the original vision. No detail is too small.",
    tags: ["48-Hour Delivery", "Revision Rounds", "QA Check"],
  },
  {
    id: "launch",
    number: "05",
    icon: <Rocket size={22} strokeWidth={1.5} />,
    title: "Delivery & Launch",
    description:
      "Final assets are packaged to platform spec — Meta, TikTok, YouTube, OTT — with full resolution masters and source files. We remain on-call for launch support, post-publish optimisation, and campaign iteration.",
    tags: ["Platform Export", "Source Files", "Launch Support"],
  },
];

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/* ─── Animated vertical line ───────────────────────────────────── */
function TimelineLine() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 20%"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={ref}
      className="absolute hidden lg:block left-1/2 top-0 bottom-0 -translate-x-1/2 w-px"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-white/6" />
      <motion.div
        className="absolute top-0 left-0 right-0 origin-top"
        style={{
          scaleY,
          background:
            "linear-gradient(to bottom, transparent, #14B8A6 30%, #14B8A6 70%, transparent)",
          bottom: 0,
        }}
      />
    </div>
  );
}

/* ─── Timeline dot ──────────────────────────────────────────────── */
function TimelineDot({ inView }: { inView: boolean }) {
  return (
    <div className="hidden lg:flex absolute left-1/2 top-8 -translate-x-1/2 items-center justify-center z-10">
      <motion.div
        className="w-3 h-3 rounded-full flex items-center justify-center"
        style={{ background: "var(--black)", border: "1px solid #14B8A6" }}
        animate={
          inView
            ? { scale: [1, 1.3, 1], boxShadow: ["0 0 0px #14B8A6", "0 0 12px #14B8A6", "0 0 6px #14B8A6"] }
            : {}
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "#14B8A6" }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        />
      </motion.div>
    </div>
  );
}

/* ─── Step Card ─────────────────────────────────────────────────── */
function StepCard({ step, index }: { step: (typeof STEPS)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const isRight = index % 2 === 0;

  const variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div ref={ref} className="relative grid lg:grid-cols-2 gap-0 items-start mb-8 lg:mb-12">
      <TimelineDot inView={inView} />

      {!isRight && <div className="hidden lg:block" />}

      <motion.div
        variants={variants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ duration: 0.72, ease: EASE_OUT, delay: 0.05 }}
        className={`relative group ${isRight ? "lg:pr-8" : "lg:pl-8"}`}
      >
        <div className="proc-card">
          <div className="proc-card-glow" aria-hidden="true" />

          <div className="flex items-start justify-between mb-8">
            <motion.div
              className="proc-icon-wrap"
              animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
              transition={{ delay: 0.18, duration: 0.5, ease: EASE_OUT }}
            >
              <span className="proc-icon-inner">{step.icon}</span>
            </motion.div>

            <motion.span
              className="proc-number"
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
              transition={{ delay: 0.25, duration: 0.5, ease: EASE_OUT }}
            >
              {step.number}
            </motion.span>
          </div>

          <motion.h3
            className="proc-title"
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ delay: 0.3, duration: 0.55, ease: EASE_OUT }}
          >
            {step.title}
          </motion.h3>

          <motion.p
            className="proc-desc"
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ delay: 0.38, duration: 0.55, ease: EASE_OUT }}
          >
            {step.description}
          </motion.p>

          <motion.div
            className="proc-tags"
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ delay: 0.46, duration: 0.5, ease: EASE_OUT }}
          >
            {step.tags.map((tag) => (
              <span key={tag} className="proc-tag">
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {isRight && <div className="hidden lg:block" />}
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────── */
export default function ProcessSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-10%" });

  return (
    <section
      id="process"
      className="proc-section"
      aria-labelledby="process-heading"
    >
      <div className="svc-grid-overlay" aria-hidden="true" />
      <div className="proc-bloom" aria-hidden="true" />

      <div className="proc-container">
        <div ref={headingRef} className="proc-header">
          <motion.span
            className="svc-eyebrow"
            animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
          >
            <span className="svc-eyebrow-line" />
            How It Works
          </motion.span>

          <motion.h2
            id="process-heading"
            className="svc-heading"
            animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ delay: 0.1, duration: 0.6, ease: EASE_OUT }}
          >
            The Elevique Method
          </motion.h2>

          <motion.p
            className="svc-subheading"
            animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ delay: 0.18, duration: 0.6, ease: EASE_OUT }}
          >
            A unified five-stage refined process— from first brief to final delivery, every step is built for precision and speed.
          </motion.p>
        </div>

        <div className="proc-timeline">
          <TimelineLine />
          {STEPS.map((step, i) => (
            <StepCard key={step.id} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
