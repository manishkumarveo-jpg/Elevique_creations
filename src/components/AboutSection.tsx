"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";

const AboutScene3D = dynamic(() => import("./AboutScene3D"), { ssr: false });

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const pillars = [
  {
    number: "01",
    title: "AI-First Production",
    body: "We don't retrofit AI into a legacy workflow. Every project is conceived, directed, and refined with AI as the primary creative instrument — unlocking visual possibilities that traditional production simply cannot reach.",
  },
  {
    number: "02",
    title: "Cinematic by Default",
    body: "Quality is non-negotiable. We hold every frame to the same standard as a feature-film production — precise lighting, colour science, motion dynamics — because your brand deserves nothing less.",
  },
  {
    number: "03",
    title: "Speed Without Compromise",
    body: "Our AI-native pipeline delivers campaign-ready visuals in days, not months. Faster turnarounds mean you move at the speed of culture, not the speed of a traditional post-production house.",
  },
];

export default function AboutSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-8%" });
  const pillarsInView = useInView(pillarsRef, { once: true, margin: "-8%" });

  return (
    <section
      id="about"
      className="svc-section"
      aria-labelledby="about-heading"
      style={{ background: "var(--black)", overflow: "visible" }}
    >
      <div className="svc-bloom svc-bloom--title" aria-hidden="true" />
      <div className="svc-grid-overlay" aria-hidden="true" />

      <div className="svc-container">

        {/* ════════════════════════════════════════════════════════
            HERO — split layout: text left, 3D right
            ════════════════════════════════════════════════════════ */}
        <div
          ref={heroRef}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
            marginBottom: "6rem",
          }}
          className="about-hero-grid"
        >
          {/* ── Left: text ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          >
            <span className="svc-eyebrow" style={{ justifyContent: "flex-start" }}>
              <span className="svc-eyebrow-line" aria-hidden="true" />
              Our Story
            </span>

            <h1
              id="about-heading"
              className="svc-heading"
              style={{ textAlign: "left", marginBottom: "1.8rem" }}
            >
              Crafting Seamless User<br />Experiences With Intelligent.
            </h1>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginBottom: "2.4rem" }}>
              <p className="svc-subheading" style={{ maxWidth: "100%", textAlign: "left" }}>
                At <strong>Elevique</strong>, we blend <strong>AI innovation and cinematic storytelling</strong> to create ads that are <strong>smarter, faster, and more impactful</strong>. Our mission is simple—deliver <strong>cost-efficient, creative, and ROI-driven campaigns</strong> that help brands stand out and grow.
              </p>
            </div>

            <Link href="/contact" className="btn-primary" style={{ display: "inline-flex" }}>
              <span>Start a Project</span>
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </motion.div>

          {/* ── Right: 3D scene ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: EASE_OUT }}
            style={{
              height: "520px",
              position: "relative",
              borderRadius: "24px",
              overflow: "hidden",
            }}
            className="about-scene-wrapper"
          >
            {/* Subtle gold border glow */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "24px",
                border: "1px solid rgba(201,169,110,0.12)",
                background: "radial-gradient(ellipse at 50% 30%, rgba(201,169,110,0.06) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
            <AboutScene3D />
          </motion.div>
        </div>

        {/* ════════════════════════════════════════════════════════
            PILLARS — 3-column grid
            ════════════════════════════════════════════════════════ */}
        <div ref={pillarsRef}>
          <motion.div
            className="svc-diff-grid"
            initial={{ opacity: 0, y: 24 }}
            animate={pillarsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          >
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.number}
                className={`svc-diff-card svc-diff-card--${i}`}
                initial={{ opacity: 0, y: 28 }}
                animate={pillarsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: EASE_OUT }}
              >
                <div className="svc-dot-grid" aria-hidden="true" />
                <span style={{
                  fontSize: "0.52rem",
                  fontWeight: 700,
                  letterSpacing: "0.28em",
                  color: "var(--teal)",
                  opacity: 0.8,
                }}>
                  {pillar.number}
                </span>
                <p className="svc-diff-label">{pillar.title}</p>
                <p className="svc-diff-desc">{pillar.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>

      {/* ── Responsive overrides (inline media fallback via className) */}
      <style>{`
        @media (max-width: 768px) {
          .about-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .about-scene-wrapper {
            height: 340px !important;
            order: -1;
          }
        }
        @media (max-width: 480px) {
          .about-scene-wrapper {
            height: 280px !important;
          }
        }
      `}</style>
    </section>
  );
}
