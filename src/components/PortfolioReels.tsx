"use client";

import React, { useState, useEffect, useRef, useCallback, startTransition } from "react";
import {
  Heart,
  Volume2,
  VolumeX,
  Share2,
  ExternalLink,
  Wifi,
  Battery,
  Play,
  Pause,
  ArrowLeft,
} from "lucide-react";
import { REEL_VIDEOS, type ReelVideo } from "@/data/reelVideos";

// kept for onViewDetails compatibility with parent (FeaturedShowcase passes Project-typed handler)
type Project = ReelVideo;

interface PortfolioReelsProps {
  onViewDetails: (project: Project) => void;
  onBack: () => void;
}

export default function PortfolioReels({ onViewDetails, onBack }: PortfolioReelsProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observerOptions = {
      root: container,
      rootMargin: "0px",
      threshold: 0.6,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute("data-index") || "0", 10);
          setActiveIndex(index);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const childElements = container.querySelectorAll(".reel-card");
    childElements.forEach((el) => observer.observe(el));

    return () => {
      childElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  const activeReel = REEL_VIDEOS[activeIndex] || REEL_VIDEOS[0];

  return (
    <div className="reels-feed-section">
      <div
        className="reels-ambient-backdrop"
        style={{
          backgroundColor: activeReel ? `${activeReel.colorFrom}1A` : "rgba(0,0,0,0.5)",
          boxShadow: activeReel ? `inset 0 0 100px ${activeReel.colorFrom}1F` : "none",
        }}
      />

      <div
        className="reels-chassis"
        style={{
          borderColor: activeReel ? `${activeReel.colorFrom}2B` : "#1a1a1a",
        }}
      >
        <div
          className="reels-chassis-glow"
          style={{
            borderColor: activeReel ? `${activeReel.colorFrom}33` : "transparent",
            boxShadow: activeReel ? `0 0 30px ${activeReel.colorFrom}15` : "none",
          }}
        />

        <div className="reels-status-bar">
          <span>10:09</span>
          <div className="reels-status-icons">
            <Wifi size={12} />
            <Battery size={14} />
          </div>
        </div>

        {/* Back Button inside phone frame */}
        <button
          type="button"
          className="reels-back-btn-chassis"
          onClick={onBack}
          aria-label="Back to Showcase"
        >
          <ArrowLeft size={16} />
        </button>

        <div ref={containerRef} className="reels-snap-container" data-lenis-prevent>
          {REEL_VIDEOS.map((reel, idx) => {
            const isAdjacent = Math.abs(idx - activeIndex) <= 1;
            return (
              <ReelCard
                key={reel.id}
                reel={reel}
                index={idx}
                isActive={idx === activeIndex}
                isAdjacent={isAdjacent}
                isMuted={isMuted}
                toggleMute={toggleMute}
                onViewDetails={onViewDetails}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Individual Reel Card ─────────────────────────────────────────── */
interface ReelCardProps {
  reel: ReelVideo;
  index: number;
  isActive: boolean;
  isAdjacent: boolean;
  isMuted: boolean;
  toggleMute: (e: React.MouseEvent) => void;
  onViewDetails: (project: Project) => void;
}

interface FloatingHeartItem {
  id: number;
  left: number;
  rot: number;
}

function ReelCard({
  reel,
  index,
  isActive,
  isAdjacent,
  isMuted,
  toggleMute,
  onViewDetails,
}: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(120);
  const [copied, setCopied] = useState<boolean | 'error'>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const prevActiveRef = useRef<boolean>(isActive);
  if (isActive !== prevActiveRef.current) {
    prevActiveRef.current = isActive;
    if (!isActive) {
      setIsBuffering(false);
    }
  }

  // Double-tap and play/pause action feedback
  const [showHeartPop, setShowHeartPop] = useState<boolean>(false);
  const [playStateFeedback, setPlayStateFeedback] = useState<"play" | "pause" | null>(null);
  const [particles, setParticles] = useState<FloatingHeartItem[]>([]);

  const lastTapRef = useRef<number>(0);
  const nextParticleId = useRef<number>(0);

  // Sync video play/pause with active visibility state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      // Small timeout to allow transition stability
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err: unknown) => {
            console.error('[PortfolioReels] autoplay blocked:', err);
            setIsPlaying(false);
          });
      }
    } else {
      video.pause();
      video.currentTime = 0; // Rewind
      startTransition(() => setIsPlaying(false));
    }
  }, [isActive]);

  // Sync mute setting dynamically
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Handle Play/Pause trigger
  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      setPlayStateFeedback("pause");
    } else {
      video.play().catch(() => { });
      setIsPlaying(true);
      setPlayStateFeedback("play");
    }

    // Reset indicator overlay after animation
    setTimeout(() => {
      setPlayStateFeedback(null);
    }, 500);
  }, [isPlaying]);

  // Trigger Like actions & float-up heart particles
  const handleLike = useCallback(() => {
    if (!liked) {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }

    // Create new float-up particles
    const newParticles = Array.from({ length: 5 }).map(() => ({
      id: nextParticleId.current++,
      left: 15 + Math.random() * 60, // random lateral positioning
      rot: -25 + Math.random() * 50, // random rotation
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    // Cleanup particles
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 1200);
  }, [liked]);

  // Double-tap or click handler
  const handleVideoInteraction = useCallback(() => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double click: Trigger glowing heart pop & like project
      handleLike();
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 800);
    } else {
      // Single click: Play/Pause toggle
      togglePlayPause();
    }
    lastTapRef.current = now;
  }, [handleLike, togglePlayPause]);

  // Handle Share link copy
  const handleShare = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/portfolio?project=${reel.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch((err) => {
      console.error('[PortfolioReels] clipboard write failed:', err);
      setCopied('error');
      setTimeout(() => setCopied(false), 2000);
    });
  }, [reel.id]);

  const handleOpenDetails = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails(reel as unknown as Project);
  }, [reel, onViewDetails]);

  return (
    <div className="reel-card" data-index={index}>
      {/* Immersive Video element */}
      <video
        ref={videoRef}
        src={reel.videoSrc || undefined}
        loop
        muted={isMuted}
        playsInline
        preload={isActive ? "auto" : (isAdjacent ? "auto" : "none")}
        className="reel-video-element"
        onClick={handleVideoInteraction}
        aria-label={`Video demo for ${reel.title}`}
        onWaiting={() => { if (isActive) setIsBuffering(true); }}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => setIsBuffering(false)}
        onLoadStart={() => { if (isActive) setIsBuffering(true); }}
      />

      {/* Loading/Buffering Spinner overlay */}
      {isActive && isBuffering && (
        <div className="reel-video-loader">
          <div
            className="reel-loader-spinner"
            style={{ "--accent-color": reel.colorFrom } as React.CSSProperties}
          />
        </div>
      )}

      {/* Atmospheric gradients */}
      <div className="reel-gradient-bottom" />
      <div className="reel-gradient-top" />

      {/* Double-tap heart animation overlay */}
      {showHeartPop && (
        <div className="double-tap-heart">
          <Heart size={80} fill="currentColor" />
        </div>
      )}

      {/* Play/Pause state feedback animation */}
      {playStateFeedback && (
        <div className="play-pause-overlay">
          {playStateFeedback === "play" ? <Play size={28} fill="currentColor" /> : <Pause size={28} fill="currentColor" />}
        </div>
      )}

      {/* Floating particles container */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="floating-heart"
          style={{
            left: `${p.left}%`,
            bottom: "80px",
            "--rot": `${p.rot}deg`,
          } as React.CSSProperties}
        >
          <Heart size={20} fill="currentColor" />
        </span>
      ))}

      {/* Left Bottom Metadata Overlay */}
      <div className="reel-meta-overlay">
        <span
          className="reel-meta-badge"
          style={{
            borderColor: `${reel.colorFrom}99`,
            background: `${reel.colorFrom}1A`,
            color: reel.colorFrom,
          }}
        >
          {reel.category}
        </span>
        <h4 className="reel-meta-title">{reel.title}</h4>
        <p className="reel-meta-desc">{reel.description}</p>
        <div className="reel-meta-tags">
          {reel.techStack.slice(0, 3).map((tech) => (
            <span key={tech} className="reel-meta-tag">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Right Actions Column */}
      <div className="reel-actions-overlay">
        {/* Like action */}
        <div className="reel-action-btn-wrap">
          <button
            type="button"
            className={`reel-action-btn${liked ? " liked" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            aria-label={`Like ${reel.title}`}
          >
            <Heart size={14} fill={liked ? "currentColor" : "none"} />
          </button>
          <span className="reel-action-label">{likeCount}</span>
        </div>

        {/* Share action */}
        <div className="reel-action-btn-wrap">
          <button
            type="button"
            className="reel-action-btn"
            onClick={handleShare}
            aria-label="Share project"
          >
            <Share2 size={14} />
          </button>
          <span className="reel-action-label">{copied === true ? "Copied" : copied === 'error' ? "Failed" : "Share"}</span>
        </div>

        {/* Audio control */}
        <div className="reel-action-btn-wrap">
          <button
            type="button"
            className="reel-action-btn"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <span className="reel-action-label">{isMuted ? "Muted" : "Sound"}</span>
        </div>

        {/* View Details Case Study */}
        <div className="reel-action-btn-wrap">
          <button
            type="button"
            className="reel-action-btn"
            onClick={handleOpenDetails}
            aria-label="View case study details"
          >
            <ExternalLink size={14} />
          </button>
          <span className="reel-action-label">Details</span>
        </div>
      </div>
    </div>
  );
}
