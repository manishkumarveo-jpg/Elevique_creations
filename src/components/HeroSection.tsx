"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

function Typewriter({ phrases, speed = 80, delay = 1800, deleteSpeed = 40 }: { phrases: string[]; speed?: number; delay?: number; deleteSpeed?: number }) {
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const phrase = phrases[currentPhraseIdx];

    if (!isDeleting) {
      if (currentText.length < phrase.length) {
        timer = setTimeout(() => {
          setCurrentText(phrase.substring(0, currentText.length + 1));
        }, speed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, delay);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(phrase.substring(0, currentText.length - 1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setCurrentPhraseIdx((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIdx, phrases, speed, delay, deleteSpeed]);

  return (
    <>
      {currentText}
      <span className="animate-pulse ml-0.5 text-[#2dd4bf] font-extralight select-none" style={{ WebkitTextFillColor: "#2dd4bf", color: "#2dd4bf" }}>|</span>
    </>
  );
}

const VIDEO_SRC =
  "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/fashion%20%26%20Lifestyle/Itsme%20red%20carpet.mp4";
const POSTER_SRC =
  "";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

function CountUpNumber({ value, suffix = "", duration = 2000, delay = 1000 }: { value: number; suffix?: string; duration?: number; delay?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let timerId: ReturnType<typeof setTimeout>;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Easing: easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCount(Math.floor(easeProgress * value));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    timerId = setTimeout(() => {
      window.requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timerId);
  }, [value, duration, delay]);

  return <>{count}{suffix}</>;
}

const STATS = [
  { value: 500, suffix: "+", label: "Brand's Served" },
  { value: 2000, suffix: "+", label: "Ai Ads Delivered" },
  { value: 5, suffix: "x", label: "Ai Video Ads ROAS" },
  { value: 80, suffix: "%", label: "Savings On Production" },
  { value: 5, suffix: "x", label: "CTR Boost" },
];

const statsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.85,
      staggerChildren: 0.1,
    },
  },
};

const statsItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE_OUT,
    },
  },
};

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  /* Autoplay, but skip it when the user has asked for reduced motion —
     the poster frame still renders so the section isn't empty.
     Mobile browsers (notably Chrome/Android with Data Saver, and some
     in-app webviews) can silently block the initial autoplay() call even
     when muted+playsInline are set, so we retry on the events that fire
     once the video is actually ready, plus on the user's first touch. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    v.muted = true;
    const tryPlay = () => v.play().catch(() => { });

    tryPlay();
    v.addEventListener("pause", tryPlay);
    v.addEventListener("loadeddata", tryPlay);
    v.addEventListener("canplay", tryPlay);

    const onFirstInteraction = () => {
      tryPlay();
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("click", onFirstInteraction);
    };
    window.addEventListener("touchstart", onFirstInteraction, { once: true, passive: true });
    window.addEventListener("click", onFirstInteraction, { once: true });

    return () => {
      v.removeEventListener("pause", tryPlay);
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("click", onFirstInteraction);
    };
  }, []);

  return (
    <section className="hero-section" aria-label="Elevique — AI Visuals Studio Hero">
      <video
        ref={videoRef}
        className="hero-video"
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="hero-gradient-b" aria-hidden="true" />
      <div className="hero-gradient-l" aria-hidden="true" />

      <div className="hero-content">
        <motion.div
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: EASE_OUT }}
        >
          <span className="hero-eyebrow-line" aria-hidden="true" />
          <span className="relative inline-flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-400" />
          </span>
          <span className="hero-eyebrow-text">India&apos;s Fastest Growing Creative AI Visuals Studio</span>
        </motion.div>

        <h1 className="hero-title">
          <span className="reveal-clip">
            <motion.span
              style={{ display: "block" }}
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.3, duration: 0.9, ease: EASE_OUT }}
            >
              AI Visuals That
            </motion.span>
          </span>
          <span className="reveal-clip">
            <motion.em
              className="hero-title-accent"
              style={{ display: "block" }}
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.42, duration: 0.9, ease: EASE_OUT }}
            >
              <Typewriter phrases={["Don't Look Like AI", "Cost a Fortune", "Take Weeks"]} />
            </motion.em>
          </span>
        </h1>

        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.7, ease: EASE_OUT }}
        >
          We create cinematic commercials, product films, and social content
          indistinguishable from traditional production.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.7, ease: EASE_OUT }}
        >
          <Link href="/portfolio" className="btn-secondary" id="hero-cta-secondary">
            View Our Work
            <span aria-hidden="true">↗</span>
          </Link>

          <Link href="/contact" className="btn-primary" id="hero-cta-primary">
            <span>Start Your Project</span>
            <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </motion.div>

        <motion.div
          className="hero-stats-bar"
          variants={statsContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="hero-stats-grid">
            {STATS.map((stat, idx) => (
              <motion.div
                key={stat.label}
                className="hero-stat-item"
                variants={statsItemVariants}
              >
                <span className="hero-stat-number">
                  <CountUpNumber value={stat.value} suffix={stat.suffix} delay={1000 + idx * 100} />
                </span>
                <span className="hero-stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
