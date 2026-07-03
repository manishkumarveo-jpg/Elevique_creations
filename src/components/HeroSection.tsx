"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { posterFromVideoSrc } from "@/lib/utils";

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
  "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Gauddly%20Music%20Video.mp4";
const POSTER_SRC = posterFromVideoSrc(VIDEO_SRC);

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
  { value: 500, suffix: "+", label: "Brands Served" },
  { value: 2000, suffix: "+", label: "AI Ads Delivered" },
  { value: 5, suffix: "x", label: "AI Video Ads ROAS" },
  { value: 80, suffix: "%", label: "Savings On Production" },
  { value: 5, suffix: "x", label: "CTR Boost" },
];

const statsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.06,
    },
  },
};

const statsItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: EASE_OUT,
    },
  },
};

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Sync mute state changes to video tag
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  /* Autoplay, but skip it when the user has asked for reduced motion —
     the poster frame still renders so the section isn't empty.
     Mobile browsers (notably Chrome/Android with Data Saver, and some
     in-app webviews) can silently block the initial autoplay() call even
     when muted+playsInline are set, so we retry on the events that fire
     once the video is actually ready, plus on the user's first touch. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Mobile and standard autoplay trigger logic
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

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
        muted={isMuted}
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="hero-gradient-b" aria-hidden="true" />
      <div className="hero-gradient-l" aria-hidden="true" />

      <button
        type="button"
        className="hero-sound-btn"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>

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
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.8, ease: EASE_OUT }}
        >
          <div className="hero-stats-grid">
            {STATS.map((stat, idx) => (
              <div
                key={stat.label}
                className="hero-stat-item"
              >
                <span className="hero-stat-number">
                  <CountUpNumber value={stat.value} suffix={stat.suffix} delay={300 + idx * 80} />
                </span>
                <span className="hero-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
