"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Heart,
  Volume2,
  VolumeX,
  Share2,
  ExternalLink,
  ChevronUp,
  Wifi,
  Battery,
  Play,
  Pause,
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  role: string;
  description: string;
  techStack: string[];
  colorFrom: string;
  colorTo: string;
  verticalVideoSrc?: string;
}

const DEFAULT_VIDEO =
  "https://res.cloudinary.com/dpaoerbde/video/upload/v1780379272/hero-video_pxivlu.mp4";

interface PortfolioReelsProps {
  projects: Project[];
  onViewDetails: (project: Project) => void;
}

export default function PortfolioReels({ projects, onViewDetails }: PortfolioReelsProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Toggle local mute state across all videos
  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  }, []);

  // Set up Intersection Observer to track which Reel is active
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observerOptions = {
      root: container,
      rootMargin: "0px",
      threshold: 0.6, // Fire when 60% of the slide is visible
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
  }, [projects]);

  const activeProject = projects[activeIndex] || projects[0];

  return (
    <div className="reels-feed-section">
      {/* Ambient background blur glowing with the active project's custom theme color */}
      <div
        className="reels-ambient-backdrop"
        style={{
          backgroundColor: activeProject ? `${activeProject.colorFrom}1A` : "rgba(0,0,0,0.5)",
          boxShadow: activeProject ? `inset 0 0 100px ${activeProject.colorFrom}1F` : "none",
        }}
      />

      {/* Main smartphone frame for desktop view */}
      <div 
        className="reels-chassis"
        style={{
          borderColor: activeProject ? `${activeProject.colorFrom}2B` : "#1a1a1a",
        }}
      >
        {/* Glow border ring */}
        <div 
          className="reels-chassis-glow"
          style={{
            borderColor: activeProject ? `${activeProject.colorFrom}33` : "transparent",
            boxShadow: activeProject ? `0 0 30px ${activeProject.colorFrom}15` : "none",
          }}
        />

        {/* Top Status Bar UI Decorator */}
        <div className="reels-status-bar">
          <span>10:09</span>
          <div className="reels-status-icons">
            <Wifi size={12} />
            <Battery size={14} />
          </div>
        </div>

        {/* Snap-scrolling reels viewport */}
        <div ref={containerRef} className="reels-snap-container" data-lenis-prevent>
          {projects.map((project, idx) => (
            <ReelCard
              key={project.id}
              project={project}
              index={idx}
              isActive={idx === activeIndex}
              isMuted={isMuted}
              toggleMute={toggleMute}
              onViewDetails={onViewDetails}
              isLast={idx === projects.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Individual Reel Card ─────────────────────────────────────────── */
interface ReelCardProps {
  project: Project;
  index: number;
  isActive: boolean;
  isMuted: boolean;
  toggleMute: (e: React.MouseEvent) => void;
  onViewDetails: (project: Project) => void;
  isLast: boolean;
}

interface FloatingHeartItem {
  id: number;
  left: number;
  rot: number;
}

function ReelCard({
  project,
  index,
  isActive,
  isMuted,
  toggleMute,
  onViewDetails,
  isLast,
}: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(120);
  const [copied, setCopied] = useState<boolean | 'error'>(false);
  
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
      setIsPlaying(false);
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
      video.play().catch(() => {});
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
    const url = `${window.location.origin}/portfolio?project=${project.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch((err) => {
      console.error('[PortfolioReels] clipboard write failed:', err);
      setCopied('error');
      setTimeout(() => setCopied(false), 2000);
    });
  }, [project.id]);

  const handleOpenDetails = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails(project);
  }, [project, onViewDetails]);

  return (
    <div className="reel-card" data-index={index}>
      {/* Immersive Video element */}
      <video
        ref={videoRef}
        src={project.verticalVideoSrc || DEFAULT_VIDEO}
        loop
        muted={isMuted}
        playsInline
        className="reel-video-element"
        onClick={handleVideoInteraction}
        aria-label={`Video demo for ${project.title}`}
      />

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
            borderColor: `${project.colorFrom}99`,
            background: `${project.colorFrom}1A`,
            color: project.colorFrom,
          }}
        >
          {project.category}
        </span>
        <h4 className="reel-meta-title">{project.title}</h4>
        <p className="reel-meta-desc">{project.description}</p>
        <div className="reel-meta-tags">
          {project.techStack.slice(0, 3).map((tech) => (
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
            aria-label={`Like ${project.title}`}
          >
            <Heart size={20} fill={liked ? "currentColor" : "none"} />
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
            <Share2 size={20} />
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
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
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
            <ExternalLink size={20} />
          </button>
          <span className="reel-action-label">Details</span>
        </div>
      </div>

      {/* Swipe up guide (hidden on the last reel item) */}
      {!isLast && (
        <div className="reels-swipe-hint">
          <ChevronUp size={16} />
          <span>Swipe up</span>
        </div>
      )}
    </div>
  );
}
