"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Navbar from "./Navbar";
import SoundToggle from "./SoundToggle";

/* ─── Data ──────────────────────────────────────────────────── */
const VIDEO_SRC =
  "https://res.cloudinary.com/dpaoerbde/video/upload/v1780379272/hero-video_pxivlu.mp4";

const TITLE_LINES = [
  { text: "AI Visuals",    em: false },
  { text: "That Don't",   em: false },
  { text: "Look Like AI", em: true  },
];

const STATS = [
  { value: "500+",  label: "Videos Created"  },
  { value: "50+",   label: "Brands Served"   },
  { value: "100M+", label: "Views Generated" },
];

const EASE_CINEMA = [0.77, 0, 0.175, 1] as const;
const EASE_OUT    = [0.16, 1, 0.3,   1] as const;

/* ════════════════════════════════════════════════════════════ */
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);

  const [showReel, setShowReel] = useState(false);

  /* ── Cursor glow parallax ───────────────────────────────── */
  const glowX = useSpring(0, { damping: 60, stiffness: 120 });
  const glowY = useSpring(0, { damping: 60, stiffness: 120 });

  useEffect(() => {
    const onMouse = (e: MouseEvent) => { glowX.set(e.clientX); glowY.set(e.clientY); };
    window.addEventListener("mousemove", onMouse);
    return () => window.removeEventListener("mousemove", onMouse);
  }, [glowX, glowY]);

  /* ── Autoplay video ─────────────────────────────────────── */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});

    const onMute = (e: Event) => {
      const ev = e as CustomEvent<{ muted: boolean }>;
      v.muted = ev.detail.muted;
      if (!ev.detail.muted) v.volume = 0.4;
    };
    window.addEventListener("hero:toggleMute", onMute);
    return () => window.removeEventListener("hero:toggleMute", onMute);
  }, []);

  /* ── Scroll parallax ────────────────────────────────────── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentY   = useTransform(scrollYProgress, [0, 1], [0, 70]);

  /* ── Escape closes reel ─────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowReel(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scrollDown = useCallback(() => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  }, []);

  /* ════════════════════════════════════════════════════════ */
  return (
    <>
      {/* Film grain */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Cursor glow — desktop only */}
      <motion.div
        className="cursor-glow"
        style={{ left: glowX, top: glowY }}
        aria-hidden="true"
      />

      {/* ══ SECTION ══════════════════════════════════════════ */}
      <section
        ref={sectionRef}
        className="hero-section"
        aria-label="Elevique — AI Visuals Studio Hero"
      >
        <Navbar />

        {/* Video */}
        <motion.video
          ref={videoRef}
          className="hero-video"
          src={VIDEO_SRC}
          autoPlay loop muted playsInline preload="auto"
          aria-hidden="true"
          style={{ scale: videoScale }}
        />

        {/* Cinematic overlay */}
        <div className="hero-overlay" aria-hidden="true" />

        {/* ── Left-column content ─────────────────────────── */}
        <motion.div className="hero-content" style={{ y: contentY }}>

          {/* Eyebrow */}
          <motion.div
            className="hero-eyebrow"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: EASE_OUT }}
          >
            <span className="hero-eyebrow-line" aria-hidden="true" />
            AI Commercial Studio
          </motion.div>

          {/* Headline — staggered reveal per line */}
          <h1 className="hero-title" aria-label="AI Visuals That Don't Look Like AI">
            {TITLE_LINES.map((line, i) => (
              <span
                key={i}
                className={`reveal-clip${i === 0 ? " hero-title-accent" : ""}`}
              >
                <motion.span
                  style={{ display: "block" }}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 1.15,
                    delay: 0.45 + i * 0.15,
                    ease: EASE_CINEMA,
                  }}
                >
                  {line.em ? <em>{line.text}</em> : line.text}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Description */}
          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.9, ease: EASE_OUT }}
          >
            We create cinematic commercials, product films, and social content
            indistinguishable from traditional production.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.8, ease: EASE_OUT }}
          >
            <a href="#contact" className="btn-primary" id="hero-cta-primary">
              <span>Start Project</span>
              <span className="arrow" aria-hidden="true">→</span>
            </a>

            <a href="#work" className="btn-secondary" id="hero-cta-secondary">
              View Work
              <span aria-hidden="true">↗</span>
            </a>
          </motion.div>
        </motion.div>

        {/* ── Trust Bar ────────────────────────────────────── */}
        <div className="hero-trust" aria-label="Studio credentials">
          <motion.div
            className="trust-stats"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.9, ease: EASE_OUT }}
          >
            {STATS.map((s, i) => (
              <div key={i} className="trust-stat">
                <span className="trust-stat-value">{s.value}</span>
                <span className="trust-stat-label">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Showreel */}
          <motion.button
            className="showreel-btn"
            onClick={() => setShowReel(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            aria-label="Watch showreel 2026"
            id="showreel-trigger"
          >
            <span>Showreel 2026</span>
            <span style={{ position: "relative", display: "inline-flex" }}>
              <span className="showreel-pulse" aria-hidden="true" />
              <span className="showreel-icon" aria-hidden="true">
                <svg viewBox="0 0 16 16"><path d="M5 3.5l8 4.5-8 4.5z" /></svg>
              </span>
            </span>
          </motion.button>
        </div>

        {/* Scroll indicator */}
        <motion.button
          className="scroll-indicator"
          onClick={scrollDown}
          aria-label="Scroll to next section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <span className="scroll-indicator-label">Scroll</span>
          <div className="scroll-line" aria-hidden="true">
            <div className="scroll-line-fill" />
          </div>
        </motion.button>

        <SoundToggle />
      </section>

      {/* ══ Showreel Lightbox ════════════════════════════════ */}
      <AnimatePresence>
        {showReel && (
          <motion.div
            className="showreel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setShowReel(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Showreel"
          >
            <motion.div
              className="showreel-video"
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              exit={{ scale: 0.92,    opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={VIDEO_SRC}
                autoPlay loop playsInline controls
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </motion.div>

            <button
              className="showreel-close"
              onClick={() => setShowReel(false)}
              aria-label="Close showreel"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
