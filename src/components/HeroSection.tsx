"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Navbar from "./Navbar";

/* ─── Data ──────────────────────────────────────────────────── */
const VIDEO_SRC =
  "https://res.cloudinary.com/dpaoerbde/video/upload/v1780379272/hero-video_pxivlu.mp4";

const TITLE_LINES = [
  { text: "AI Visuals", em: false },
  { text: "That Don't", em: false },
];

const LOOP_PHRASES = ["Look Like AI", "Cost a Fortune", "Take Weeks"];

const STAT_DATA = [
  { count: 2000, suffix: "+", label: "Videos Created" },
  { count: 500, suffix: "+", label: "Brands Served" },
  { count: 100, suffix: "M+", label: "Views Generated" },
];

const EASE_CINEMA = [0.77, 0, 0.175, 1] as const;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/* ─── Count-up hook ─────────────────────────────────────────── */
function useCountUp(target: number, duration = 1.8, delay = 0) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let raf: number;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.floor(eased * target));
        if (p < 1) raf = requestAnimationFrame(tick);
        else setVal(target);
      };
      raf = requestAnimationFrame(tick);
    }, delay * 1000);

    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [target, duration, delay]);

  return val;
}

/* ─── CountStat ─────────────────────────────────────────────── */
function CountStat({ count, suffix, label }: { count: number; suffix: string; label: string }) {
  const val = useCountUp(count, 1.8, 1.6);
  return (
    <div className="trust-stat">
      <span className="trust-stat-value">{val}{suffix}</span>
      <span className="trust-stat-label">{label}</span>
    </div>
  );
}

/* ─── LoopingPhrase ─────────────────────────────────────────── */
function LoopingPhrase() {
  const [index, setIndex] = useState(0);
  const [cycling, setCycling] = useState(false);

  /* Wait for entrance animation to finish + brief hold, then start cycling */
  useEffect(() => {
    const t = setTimeout(() => setCycling(true), 4200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!cycling) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % LOOP_PHRASES.length), 3000);
    return () => clearInterval(id);
  }, [cycling]);

  if (!cycling) {
    return (
      <motion.em
        style={{ display: "block" }}
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.15, delay: 0.75, ease: EASE_CINEMA }}
      >
        {LOOP_PHRASES[0]}
      </motion.em>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.em
        key={index}
        style={{ display: "block" }}
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "-100%" }}
        transition={{ duration: 0.55, ease: EASE_CINEMA }}
      >
        {LOOP_PHRASES[index]}
      </motion.em>
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [showReel, setShowReel] = useState(false);

  /* ── Pause/resume hero video when reel opens/closes ──────── */
  const openReel = useCallback(() => {
    videoRef.current?.pause();
    setShowReel(true);
  }, []);

  const closeReel = useCallback(() => {
    setShowReel(false);
    videoRef.current?.play().catch(() => { });
  }, []);

  /* ── Cursor glow parallax (desktop only via CSS) ────────── */
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
    v.play().catch(() => { });

    const onPause = () => v.play().catch(() => { });
    v.addEventListener("pause", onPause);
    return () => v.removeEventListener("pause", onPause);
  }, []);

  /* ── Scroll parallax ────────────────────────────────────── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const trustY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const trustOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  /* ── Escape closes reel ─────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeReel(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeReel]);

  const scrollDown = useCallback(() => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  }, []);

  /* ════════════════════════════════════════════════════════ */
  return (
    <>
      {/* Film grain */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Cursor glow — hidden on touch devices via CSS */}
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
          autoPlay loop muted playsInline preload="metadata"
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
            {/* Pulsing live-indicator dot */}
            <span className="relative inline-flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
            </span>
            AI Commercial Studio
          </motion.div>

          {/* Headline — staggered reveal; last line loops */}
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
                  {line.text}
                </motion.span>
              </span>
            ))}

            {/* Looping last line */}
            <span className="reveal-clip">
              <LoopingPhrase />
            </span>
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

            <Link
              href="/portfolio"
              className="btn-secondary"
              id="hero-cta-secondary"
            >
              View Work
              <span aria-hidden="true">↗</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Trust Bar ────────────────────────────────────── */}
        <motion.div
          className="hero-trust"
          aria-label="Studio credentials"
          style={{ y: trustY, opacity: trustOpacity }}
        >
          <motion.div
            className="trust-stats"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.9, ease: EASE_OUT }}
          >
            {STAT_DATA.map((s, i) => (
              <CountStat key={i} count={s.count} suffix={s.suffix} label={s.label} />
            ))}
          </motion.div>

          {/* Showreel */}
          <motion.button
            className="showreel-btn"
            onClick={openReel}
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
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          className="scroll-indicator"
          onClick={scrollDown}
          aria-label="Scroll to next section"
          style={{ opacity: scrollOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <span className="scroll-indicator-label">Scroll</span>
          <div className="scroll-line" aria-hidden="true">
            <div className="scroll-line-fill" />
          </div>
        </motion.button>

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
            onClick={closeReel}
            role="dialog"
            aria-modal="true"
            aria-label="Showreel"
          >
            <motion.div
              className="showreel-video"
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={VIDEO_SRC}
                autoPlay loop muted playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </motion.div>

            <button
              type="button"
              className="showreel-close"
              onClick={closeReel}
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
