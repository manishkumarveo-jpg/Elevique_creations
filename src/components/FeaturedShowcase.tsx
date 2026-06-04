"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import {
  Play,
  X,
  Plus,
  ThumbsUp,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

/* ─── Data ───────────────────────────────────────────────────── */
const VIDEO_SRC =
  "https://res.cloudinary.com/dpaoerbde/video/upload/v1780379272/hero-video_pxivlu.mp4";

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
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Elevique Creation",
    category: "Ai Visuals",
    year: "2024",
    role: "Creative Direction",
    description: "A visceral exploration of human endurance pushing the boundaries of motion and light.",
    techStack: ["AI Generation", "Motion Design", "Color Grading", "VFX"],
    colorFrom: "#ff6b35",
    colorTo: "#ff1a1a",
  },
  {
    id: 2,
    title: "Fashion Film",
    category: "Editorial",
    year: "2023",
    role: "Cinematography & Edit",
    description: "Haute couture meets surrealism in a dreamlike sequence of fabric, motion, and identity.",
    techStack: ["AI Cinematics", "Editorial", "Sound Design", "Compositing"],
    colorFrom: "#e879f9",
    colorTo: "#7c3aed",
  },
  {
    id: 3,
    title: "Automotive Launch",
    category: "Product Film",
    year: "2024",
    role: "Interactive Frontend",
    description: "An immersive product reveal where engineering precision meets cinematic grandeur.",
    techStack: ["3D Render", "AI Upscale", "Particle FX", "WebGL"],
    colorFrom: "#3b82f6",
    colorTo: "#06b6d4",
  },
  {
    id: 4,
    title: "Luxury Perfume",
    category: "Brand Film",
    year: "2024",
    role: "Packaging & Brand System",
    description: "Sensory storytelling distilled into 60 seconds of atmospheric brand cinema.",
    techStack: ["Product Viz", "AI Styling", "Motion Graphics", "Grade"],
    colorFrom: "#f59e0b",
    colorTo: "#ec4899",
  },
  {
    id: 5,
    title: "Vessel OS",
    category: "Tech / UI",
    year: "2023",
    role: "Lead Systems Architecture",
    description: "A futuristic interface reveal blending hardware aesthetics with software poetry.",
    techStack: ["UI Animation", "AI Design", "WebGL", "Data Viz"],
    colorFrom: "#10b981",
    colorTo: "#3b82f6",
  },
  {
    id: 6,
    title: "AI World",
    category: "Experimental",
    year: "2024",
    role: "Machine Learning Arts",
    description: "A generative art odyssey where machine imagination meets human emotional depth.",
    techStack: ["Stable Diffusion", "ControlNet", "Python", "TouchDesigner"],
    colorFrom: "#8b5cf6",
    colorTo: "#ec4899",
  },
  {
    id: 7,
    title: "Product Render",
    category: "Commercial",
    year: "2023",
    role: "3D Specialist",
    description: "Hyper-real product cinematics that dissolve the line between render and reality.",
    techStack: ["Blender", "AI Texture", "Redshift", "Nuke"],
    colorFrom: "#f97316",
    colorTo: "#eab308",
  },
  {
    id: 8,
    title: "Future Cities",
    category: "Documentary",
    year: "2024",
    role: "Creative WebGL Engineer",
    description: "An architectural meditation on the cities we're building and the ones we dream.",
    techStack: ["Drone AI", "Photogrammetry", "WebGL", "GLSL"],
    colorFrom: "#06b6d4",
    colorTo: "#10b981",
  },
];

interface PopupState {
  project: Project;
  anchorEl: HTMLElement;
}

/* ════════════════════════════════════════════════════════════════ */
export default function FeaturedShowcase() {
  const [active, setActive]           = useState<Project>(PROJECTS[0]);
  const [videoOverlay, setVideoOverlay] = useState<Project | null>(null);
  const [bottomSheet, setBottomSheet]   = useState<Project | null>(null);
  const [popup, setPopup]             = useState<PopupState | null>(null);

  const heroVideoRef  = useRef<HTMLVideoElement>(null);
  const popupRef      = useRef<HTMLDivElement>(null);

  /* overlay refs */
  const overlayBgRef  = useRef<HTMLDivElement>(null);
  const overlayBoxRef = useRef<HTMLDivElement>(null);

  /* bottom sheet refs */
  const sheetBgRef    = useRef<HTMLDivElement>(null);
  const sheetPanelRef = useRef<HTMLDivElement>(null);

  const hoverTimer            = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimer            = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activePopupProject    = useRef<number | null>(null);

  /* ── Hero video transition ──────────────────────────────────── */
  const switchProject = useCallback((p: Project) => {
    if (!heroVideoRef.current) return;
    gsap.to(heroVideoRef.current, {
      opacity: 0, scale: 1.04, filter: "blur(10px)",
      duration: 0.25, ease: "power2.in",
      onComplete: () => {
        setActive(p);
        gsap.to(heroVideoRef.current!, {
          opacity: 1, scale: 1, filter: "blur(0px)",
          duration: 0.55, ease: "power4.out",
        });
      },
    });
  }, []);

  /* ══ VIDEO OVERLAY ══════════════════════════════════════════════ */
  const openVideoOverlay = useCallback((p: Project) => {
    setVideoOverlay(p);
  }, []);

  useEffect(() => {
    if (!videoOverlay || !overlayBgRef.current || !overlayBoxRef.current) return;
    gsap.fromTo(overlayBgRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power2.out" }
    );
    gsap.fromTo(overlayBoxRef.current,
      { scale: 0.92, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.45, ease: "power4.out" }
    );
  }, [videoOverlay]);

  const closeVideoOverlay = useCallback(() => {
    if (!overlayBgRef.current || !overlayBoxRef.current) return;
    gsap.to(overlayBoxRef.current, { scale: 0.94, opacity: 0, duration: 0.3, ease: "power3.in" });
    gsap.to(overlayBgRef.current, {
      opacity: 0, duration: 0.3, ease: "power2.in",
      onComplete: () => setVideoOverlay(null),
    });
  }, []);

  /* ══ BOTTOM SHEET ═══════════════════════════════════════════════ */
  const openBottomSheet = useCallback((p: Project) => {
    setBottomSheet(p);
  }, []);

  useEffect(() => {
    if (!bottomSheet || !sheetBgRef.current || !sheetPanelRef.current) return;
    gsap.fromTo(sheetBgRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    );
    gsap.fromTo(sheetPanelRef.current,
      { xPercent: -50, yPercent: -50, scale: 0.9, opacity: 0 },
      { xPercent: -50, yPercent: -50, scale: 1, opacity: 1, duration: 0.48, ease: "power4.out" }
    );
  }, [bottomSheet]);

  const closeBottomSheet = useCallback(() => {
    if (!sheetBgRef.current || !sheetPanelRef.current) return;
    gsap.to(sheetPanelRef.current, { xPercent: -50, yPercent: -50, scale: 0.92, opacity: 0, duration: 0.3, ease: "power3.in" });
    gsap.to(sheetBgRef.current, {
      opacity: 0, duration: 0.3, ease: "power2.in",
      onComplete: () => setBottomSheet(null),
    });
  }, []);

  /* ── Escape key ─────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (videoOverlay) closeVideoOverlay();
      else if (bottomSheet) closeBottomSheet();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [videoOverlay, bottomSheet, closeVideoOverlay, closeBottomSheet]);

  /* ══ POPUP ══════════════════════════════════════════════════════ */
  const showPopup = useCallback((p: Project, anchor: HTMLElement) => {
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
    if (activePopupProject.current === p.id) return;
    activePopupProject.current = p.id;
    setPopup({ project: p, anchorEl: anchor });
  }, []);

  useEffect(() => {
    if (!popup || !popupRef.current) return;
    const el = popupRef.current;
    const rect = popup.anchorEl.getBoundingClientRect();
    const expand = 40, margin = 8;
    const popW = rect.width + expand * 2;
    const popH = rect.height + expand * 2;
    const left = Math.max(margin, Math.min(rect.left - expand, window.innerWidth - popW - margin));
    const top  = Math.max(margin, Math.min(rect.top  - expand, window.innerHeight - popH - margin));
    gsap.set(el, { position: "fixed", left, top, width: popW, height: popH, x: 0, y: 0, xPercent: 0, yPercent: 0, scale: 0.88, opacity: 0 });
    gsap.to(el, { scale: 1, opacity: 1, duration: 0.38, ease: "back.out(1.4)" });
  }, [popup]);

  const hidePopup = useCallback(() => {
    if (!popupRef.current) { setPopup(null); activePopupProject.current = null; return; }
    gsap.to(popupRef.current, {
      scale: 0.88, opacity: 0, duration: 0.22, ease: "power3.in",
      onComplete: () => { setPopup(null); activePopupProject.current = null; },
    });
  }, []);

  const scheduleHide = useCallback(() => {
    leaveTimer.current = setTimeout(hidePopup, 120);
  }, [hidePopup]);

  const cancelHide = useCallback(() => {
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
  }, []);

  const onCardEnter = useCallback((p: Project, e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    const anchor = e.currentTarget;
    hoverTimer.current = setTimeout(() => showPopup(p, anchor), 350);
  }, [showPopup]);

  const onCardLeave = useCallback(() => {
    if (hoverTimer.current) { clearTimeout(hoverTimer.current); hoverTimer.current = null; }
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }, []);

  /* ════════════════════════════════════════════════════════════ */
  return (
    <section id="work" style={{ background: "#0a0a0f" }}>

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <div className="portfolio-hero">
        <video ref={heroVideoRef} className="portfolio-hero-video" src={VIDEO_SRC} autoPlay loop muted playsInline aria-hidden="true" />
        <div className="portfolio-hero-gradient-b" />
        <div className="portfolio-hero-gradient-l" />
        <div className="portfolio-label">
          <span className="portfolio-label-line" />
          Portfolio Section
        </div>
        <div className="portfolio-hero-content">
          <span className="portfolio-category-badge" style={{ borderColor: active.colorFrom + "99", background: active.colorFrom + "22", color: active.colorFrom }}>
            {active.category}
          </span>
          <h2 className="portfolio-hero-title">{active.title}</h2>
          <p className="portfolio-hero-desc">{active.description}</p>
          <div className="portfolio-hero-actions">
            <button className="portfolio-btn-primary" onClick={() => openVideoOverlay(active)}>
              <Play size={15} fill="currentColor" />
              Watch Film
            </button>
            <button className="portfolio-btn-ghost" onClick={() => openBottomSheet(active)}>
              <ExternalLink size={15} />
              View Case Study
            </button>
          </div>
        </div>
      </div>

      {/* ══ FEATURED ROW ════════════════════════════════════════ */}
      <div className="portfolio-featured-wrap">
        <p className="portfolio-featured-label">Featured Projects</p>
        <div className="portfolio-featured-row">
          {PROJECTS.slice(0, 5).map((p) => (
            <FeaturedCard key={p.id} project={p} isActive={active.id === p.id} onClick={() => switchProject(p)} />
          ))}
        </div>
      </div>

      {/* ══ GRID ════════════════════════════════════════════════ */}
      <div className="portfolio-grid-wrap">
        <h3 className="portfolio-grid-heading">Portfolio</h3>
        <div className="portfolio-grid">
          {PROJECTS.map((p) => (
            <GridCard
              key={p.id}
              project={p}
              onEnter={onCardEnter}
              onLeave={onCardLeave}
              onClick={() => openVideoOverlay(p)}
            />
          ))}
        </div>
      </div>

      {/* ══ POPUP ═══════════════════════════════════════════════ */}
      {popup && (
        <div
          ref={popupRef}
          className="portfolio-popup"
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
          onClick={() => { hidePopup(); openVideoOverlay(popup.project); }}
          style={{ cursor: "pointer" }}
        >
          <video src={VIDEO_SRC} autoPlay loop muted playsInline className="portfolio-popup-video" />
          <div className="portfolio-popup-scanline" aria-hidden="true" />
          <div className="portfolio-popup-fade" aria-hidden="true" />
          <div className="portfolio-popup-overlay">
            <div className="portfolio-popup-actions">
              <button className="portfolio-popup-play" onClick={(e) => { e.stopPropagation(); hidePopup(); openVideoOverlay(popup.project); }} aria-label="Play">
                <Play size={13} fill="currentColor" />
              </button>
              <button className="portfolio-popup-icon-btn" onClick={(e) => e.stopPropagation()} aria-label="Add"><Plus size={13} /></button>
              <button className="portfolio-popup-icon-btn" onClick={(e) => e.stopPropagation()} aria-label="Like"><ThumbsUp size={12} /></button>
              <button
                className="portfolio-popup-icon-btn portfolio-popup-icon-btn--right"
                aria-label="Preview"
                onClick={(e) => { e.stopPropagation(); hidePopup(); openBottomSheet(popup.project); }}
              >
                <ChevronDown size={13} />
              </button>
            </div>
            <div className="portfolio-popup-meta">
              <span className="portfolio-popup-category" style={{ color: popup.project.colorFrom }}>{popup.project.year}</span>
              <span className="portfolio-popup-role">{popup.project.role.toUpperCase()}</span>
            </div>
            <h4 className="portfolio-popup-title">{popup.project.title}</h4>
            <p className="portfolio-popup-desc">{popup.project.description}</p>
            <div className="portfolio-popup-tags">
              {popup.project.techStack.slice(0, 3).map((tag) => (
                <span key={tag} className="portfolio-popup-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ VIDEO OVERLAY (full viewport) ════════════════════════ */}
      {videoOverlay && (
        <div ref={overlayBgRef} className="vo-backdrop" onClick={closeVideoOverlay} role="dialog" aria-modal="true" aria-label={videoOverlay.title}>
          <div ref={overlayBoxRef} className="vo-box" onClick={(e) => e.stopPropagation()}>
            <video
              src={VIDEO_SRC}
              autoPlay
              loop
              muted
              playsInline
              className="vo-video"
            />

            {/* bottom info bar */}
            <div className="vo-info">
              <div className="vo-info-left">
                <span className="vo-category" style={{ color: videoOverlay.colorFrom }}>{videoOverlay.category}</span>
                <h2 className="vo-title">{videoOverlay.title}</h2>
                <p className="vo-role">{videoOverlay.role}</p>
              </div>
            </div>

            {/* close */}
            <button className="vo-close" onClick={closeVideoOverlay} aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* ══ BOTTOM SHEET (Netflix-style centered modal) ══════════ */}
      {bottomSheet && (
        <>
          <div ref={sheetBgRef} className="bs-backdrop" onClick={closeBottomSheet} aria-hidden="true" />
          <div ref={sheetPanelRef} className="bs-panel" role="dialog" aria-modal="true" aria-label={bottomSheet.title}>

            {/* close — top-right over video */}
            <button className="bs-close" onClick={closeBottomSheet} aria-label="Close">
              <X size={16} />
            </button>

            {/* ── video (full width, 16:9) ── */}
            <div className="bs-video-col">
              <video src={VIDEO_SRC} autoPlay loop muted playsInline className="bs-video" />
              <div className="bs-video-overlay" />

              {/* title + action btns float over gradient */}
              <div className="bs-video-footer">
                <h3 className="bs-video-title">{bottomSheet.title}</h3>
                <div className="bs-video-btns">
                  <button
                    className="portfolio-btn-primary"
                    style={{ fontSize: "0.6rem", padding: "8px 16px" }}
                    onClick={() => { closeBottomSheet(); openVideoOverlay(bottomSheet); }}
                  >
                    <Play size={12} fill="currentColor" />
                    Watch Film
                  </button>
                </div>
              </div>
            </div>

            {/* ── details below video ── */}
            <div className="bs-details">
              <div className="bs-meta">
                <span className="portfolio-category-badge" style={{ borderColor: bottomSheet.colorFrom + "99", background: bottomSheet.colorFrom + "22", color: bottomSheet.colorFrom }}>
                  {bottomSheet.category}
                </span>
                <span className="bs-year">{bottomSheet.year}</span>
                <span className="bs-role" style={{ marginLeft: "auto" }}>{bottomSheet.role}</span>
              </div>

              <p className="bs-desc">{bottomSheet.description}</p>

              <div className="bs-stack">
                {bottomSheet.techStack.map((tag) => (
                  <span key={tag} className="portfolio-modal-tag">{tag}</span>
                ))}
              </div>

              <div className="bs-actions">
                <button className="portfolio-btn-ghost" style={{ fontSize: "0.6rem" }}>
                  <ExternalLink size={13} />
                  Case Study
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

/* ─── Featured Card ─────────────────────────────────────────── */
function FeaturedCard({ project, isActive, onClick }: { project: Project; isActive: boolean; onClick: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const onEnter = () => {
    if (!isActive) gsap.to(cardRef.current, { scale: 1.04, duration: 0.22, ease: "power4.out" });
    videoRef.current?.play().catch(() => {});
  };
  const onLeave = () => {
    gsap.to(cardRef.current, { scale: 1, duration: 0.22, ease: "power4.out" });
    videoRef.current?.pause();
  };
  return (
    <div
      ref={cardRef}
      className={`portfolio-feat-card${isActive ? " portfolio-feat-card--active" : ""}`}
      style={isActive ? { boxShadow: `0 0 18px 2px ${project.colorFrom}8C`, borderColor: project.colorFrom } : {}}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      role="button"
      tabIndex={0}
      aria-label={`Switch to ${project.title}`}
    >
      <video ref={videoRef} src={VIDEO_SRC} loop muted playsInline className="portfolio-feat-video" aria-hidden="true" />
      <div className="portfolio-feat-overlay" />
      <div className="portfolio-feat-info">
        <span className="portfolio-feat-title">{project.title}</span>
        <span className="portfolio-feat-category">{project.category.toUpperCase()}</span>
      </div>
    </div>
  );
}

/* ─── Grid Card ─────────────────────────────────────────────── */
function GridCard({ project, onEnter, onLeave, onClick }: { project: Project; onEnter: (p: Project, e: React.MouseEvent<HTMLDivElement>) => void; onLeave: () => void; onClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const handleEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    videoRef.current?.play().catch(() => {});
    onEnter(project, e);
  };
  const handleLeave = () => {
    videoRef.current?.pause();
    onLeave();
  };
  return (
    <div
      className="portfolio-grid-card"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Play ${project.title}`}
    >
      <video ref={videoRef} src={VIDEO_SRC} loop muted playsInline className="portfolio-grid-video" aria-hidden="true" />
      <div className="portfolio-grid-overlay" />
      <span className="portfolio-grid-year">{project.year}</span>
      <div className="portfolio-grid-info">
        <span className="portfolio-grid-title">{project.title}</span>
        <span className="portfolio-grid-category">{project.category.toUpperCase()}</span>
      </div>
    </div>
  );
}
