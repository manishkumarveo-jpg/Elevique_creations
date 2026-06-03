"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import {
  Play,
  X,
  ExternalLink,
  Info,
  Plus,
  ThumbsUp,
  VolumeX,
  Volume2,
  ChevronDown,
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
    description:
      "A visceral exploration of human endurance pushing the boundaries of motion and light.",
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
    description:
      "Haute couture meets surrealism in a dreamlike sequence of fabric, motion, and identity.",
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
    description:
      "An immersive product reveal where engineering precision meets cinematic grandeur.",
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
    description:
      "Sensory storytelling distilled into 60 seconds of atmospheric brand cinema.",
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
    description:
      "A futuristic interface reveal blending hardware aesthetics with software poetry.",
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
    description:
      "A generative art odyssey where machine imagination meets human emotional depth.",
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
    description:
      "Hyper-real product cinematics that dissolve the line between render and reality.",
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
    description:
      "An architectural meditation on the cities we're building and the ones we dream.",
    techStack: ["Drone AI", "Photogrammetry", "WebGL", "GLSL"],
    colorFrom: "#06b6d4",
    colorTo: "#10b981",
  },
];

/* ─── Popup state ─────────────────────────────────────────────── */
interface PopupState {
  project: Project;
  anchorEl: HTMLElement;
}

/* ════════════════════════════════════════════════════════════════ */
export default function FeaturedShowcase() {
  const [active, setActive] = useState<Project>(PROJECTS[0]);
  const [modal, setModal] = useState<Project | null>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const [popupMuted, setPopupMuted] = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalCardRef = useRef<HTMLDivElement>(null);

  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activePopupProject = useRef<number | null>(null);

  /* ── Hero video transition ──────────────────────────────────── */
  const switchProject = useCallback((p: Project) => {
    if (!heroVideoRef.current) return;
    gsap.to(heroVideoRef.current, {
      opacity: 0,
      scale: 1.04,
      filter: "blur(10px)",
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        setActive(p);
        gsap.to(heroVideoRef.current!, {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.55,
          ease: "power4.out",
        });
      },
    });
  }, []);

  /* ── Modal open / close ─────────────────────────────────────── */
  const openModal = useCallback((p: Project) => {
    setModal(p);
  }, []);

  useEffect(() => {
    if (!modal || !modalCardRef.current || !modalRef.current) return;
    gsap.fromTo(
      modalRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    );
    gsap.fromTo(
      modalCardRef.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "power4.inOut" }
    );
  }, [modal]);

  const closeModal = useCallback(() => {
    if (!modalCardRef.current || !modalRef.current) return;
    gsap.to(modalCardRef.current, { scale: 0.95, opacity: 0, duration: 0.28, ease: "power3.in" });
    gsap.to(modalRef.current, {
      opacity: 0,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => setModal(null),
    });
  }, []);

  /* ── Escape closes modal ────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModal]);

  /* ── Popup show ─────────────────────────────────────────────── */
  const showPopup = useCallback((p: Project, anchor: HTMLElement) => {
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
    if (activePopupProject.current === p.id) return;
    activePopupProject.current = p.id;
    setPopup({ project: p, anchorEl: anchor });
  }, []);

  /* ── Popup position — Netflix-style: +40px every side ───────── */
  useEffect(() => {
    if (!popup || !popupRef.current) return;
    const el = popupRef.current;
    const rect = popup.anchorEl.getBoundingClientRect();
    const expand = 40;
    const margin = 8;

    const popW = rect.width  + expand * 2;
    const popH = rect.height + expand * 2;

    // clamp so popup never bleeds off viewport
    const left = Math.max(margin, Math.min(rect.left - expand, window.innerWidth  - popW - margin));
    const top  = Math.max(margin, Math.min(rect.top  - expand, window.innerHeight - popH - margin));

    gsap.set(el, {
      position: "fixed",
      left,
      top,
      width: popW,
      height: popH,
      x: 0, y: 0,
      xPercent: 0, yPercent: 0,
      scale: 0.88,
      opacity: 0,
    });
    gsap.to(el, { scale: 1, opacity: 1, duration: 0.38, ease: "back.out(1.4)" });
  }, [popup]);

  /* ── Popup hide ─────────────────────────────────────────────── */
  const hidePopup = useCallback(() => {
    if (!popupRef.current) {
      setPopup(null);
      activePopupProject.current = null;
      return;
    }
    gsap.to(popupRef.current, {
      scale: 0.88,
      opacity: 0,
      duration: 0.22,
      ease: "power3.in",
      onComplete: () => {
        setPopup(null);
        activePopupProject.current = null;
      },
    });
  }, []);

  const scheduleHide = useCallback(() => {
    leaveTimer.current = setTimeout(hidePopup, 120);
  }, [hidePopup]);

  const cancelHide = useCallback(() => {
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
  }, []);

  /* ── Grid card mouse handlers ───────────────────────────────── */
  const onCardEnter = useCallback((p: Project, e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    const anchor = e.currentTarget;
    hoverTimer.current = setTimeout(() => showPopup(p, anchor), 350);
  }, [showPopup]);

  const onCardLeave = useCallback(() => {
    if (hoverTimer.current) { clearTimeout(hoverTimer.current); hoverTimer.current = null; }
    scheduleHide();
  }, [scheduleHide]);

  /* ── cleanup ────────────────────────────────────────────────── */
  useEffect(() => () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }, []);

  /* ════════════════════════════════════════════════════════════ */
  return (
    <section id="work" style={{ background: "#0a0a0f" }}>

      {/* ══ HERO 88vh ════════════════════════════════════════════ */}
      <div ref={heroRef} className="portfolio-hero">

        {/* video */}
        <video
          ref={heroVideoRef}
          className="portfolio-hero-video"
          src={VIDEO_SRC}
          autoPlay loop muted playsInline
          aria-hidden="true"
        />

        {/* overlays */}
        <div className="portfolio-hero-gradient-b" />
        <div className="portfolio-hero-gradient-l" />

        {/* label */}
        <div className="portfolio-label">
          <span className="portfolio-label-line" />
          Portfolio Section
        </div>

        {/* content */}
        <div className="portfolio-hero-content">
          <span
            className="portfolio-category-badge"
            style={{
              borderColor: active.colorFrom + "99",
              background: active.colorFrom + "22",
              color: active.colorFrom,
            }}
          >
            {active.category}
          </span>

          <h2 className="portfolio-hero-title">{active.title}</h2>

          <p className="portfolio-hero-desc">{active.description}</p>

          <div className="portfolio-hero-actions">
            <button
              className="portfolio-btn-primary"
              onClick={() => openModal(active)}
            >
              <Play size={15} fill="currentColor" />
              Watch Full Visual
            </button>
            <button
              className="portfolio-btn-ghost"
              onClick={() => openModal(active)}
            >
              <Info size={15} />
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
            <FeaturedCard
              key={p.id}
              project={p}
              isActive={active.id === p.id}
              onClick={() => switchProject(p)}
            />
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
              onClick={() => openModal(p)}
            />
          ))}
        </div>
      </div>

      {/* ══ POPUP — covers card exactly ═════════════════════════ */}
      {popup && (
        <div
          ref={popupRef}
          className="portfolio-popup"
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
        >
          {/* full-cover video */}
          <video
            src={VIDEO_SRC}
            autoPlay loop muted={popupMuted} playsInline
            className="portfolio-popup-video"
          />

          {/* scan-line shimmer */}
          <div className="portfolio-popup-scanline" aria-hidden="true" />

          {/* gradient fade bottom */}
          <div className="portfolio-popup-fade" aria-hidden="true" />

          {/* mute toggle — top-right */}
          <button
            className="portfolio-popup-mute"
            onClick={() => setPopupMuted((m) => !m)}
            aria-label={popupMuted ? "Unmute" : "Mute"}
          >
            {popupMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>

          {/* bottom overlay — actions + info */}
          <div className="portfolio-popup-overlay">
            <div className="portfolio-popup-actions">
              <button
                className="portfolio-popup-play"
                onClick={() => { hidePopup(); openModal(popup.project); }}
                aria-label="Play"
              >
                <Play size={13} fill="currentColor" />
              </button>
              <button className="portfolio-popup-icon-btn" aria-label="Add"><Plus size={13} /></button>
              <button className="portfolio-popup-icon-btn" aria-label="Like"><ThumbsUp size={12} /></button>
              <button className="portfolio-popup-icon-btn portfolio-popup-icon-btn--right" aria-label="More info">
                <ChevronDown size={13} />
              </button>
            </div>

            <div className="portfolio-popup-meta">
              <span className="portfolio-popup-category" style={{ color: popup.project.colorFrom }}>
                {popup.project.year}
              </span>
              <span className="portfolio-popup-role">{popup.project.role.toUpperCase()}</span>
            </div>
            <h4 className="portfolio-popup-title">{popup.project.title}</h4>
          </div>
        </div>
      )}

      {/* ══ MODAL ═══════════════════════════════════════════════ */}
      {modal && (
        <div
          ref={modalRef}
          className="portfolio-modal-backdrop"
          onClick={closeModal}
        >
          <div
            ref={modalCardRef}
            className="portfolio-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header video */}
            <div className="portfolio-modal-header">
              <video
                src={VIDEO_SRC}
                autoPlay loop muted playsInline
                className="portfolio-modal-video"
              />
              <div
                className="portfolio-modal-tint"
                style={{
                  background: `linear-gradient(135deg, ${modal.colorFrom}55, ${modal.colorTo}33, transparent 60%)`,
                }}
              />
              <div className="portfolio-modal-fade" />
              <button
                className="portfolio-modal-close"
                onClick={closeModal}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* body */}
            <div className="portfolio-modal-body">
              <div className="portfolio-modal-meta">
                <span
                  className="portfolio-category-badge"
                  style={{
                    borderColor: modal.colorFrom + "99",
                    background: modal.colorFrom + "22",
                    color: modal.colorFrom,
                  }}
                >
                  {modal.category}
                </span>
                <span className="portfolio-modal-year">{modal.year}</span>
              </div>

              <h3 className="portfolio-modal-title">{modal.title}</h3>
              <p className="portfolio-modal-role">{modal.role}</p>

              <p className="portfolio-modal-about">{modal.description} The project pushed the boundaries of what AI-assisted production can achieve, delivering a final cut that exceeded client expectations across every metric.</p>

              <div className="portfolio-modal-stack">
                {modal.techStack.map((tag) => (
                  <span key={tag} className="portfolio-modal-tag">{tag}</span>
                ))}
              </div>

              <div className="portfolio-modal-actions">
                <button
                  className="portfolio-modal-btn-primary"
                  style={{ background: modal.colorFrom }}
                >
                  <Play size={14} fill="currentColor" />
                  Watch Full Visual
                </button>
                <button className="portfolio-modal-btn-ghost">
                  <ExternalLink size={14} />
                  
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─── Featured Card ─────────────────────────────────────────── */
function FeaturedCard({
  project,
  isActive,
  onClick,
}: {
  project: Project;
  isActive: boolean;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const onEnter = () => {
    if (isActive) return;
    gsap.to(cardRef.current, { scale: 1.04, duration: 0.22, ease: "power4.out" });
  };
  const onLeave = () => {
    gsap.to(cardRef.current, { scale: 1, duration: 0.22, ease: "power4.out" });
  };

  return (
    <div
      ref={cardRef}
      className={`portfolio-feat-card${isActive ? " portfolio-feat-card--active" : ""}`}
      style={isActive ? {
        boxShadow: `0 0 18px 2px ${project.colorFrom}8C`,
        borderColor: project.colorFrom,
      } : {}}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      role="button"
      tabIndex={0}
      aria-label={`Switch to ${project.title}`}
    >
      <video
        src={VIDEO_SRC}
        autoPlay loop muted playsInline
        className="portfolio-feat-video"
        aria-hidden="true"
      />
      <div className="portfolio-feat-overlay" />
      <div className="portfolio-feat-info">
        <span className="portfolio-feat-title">{project.title}</span>
        <span className="portfolio-feat-category">{project.category.toUpperCase()}</span>
      </div>
    </div>
  );
}

/* ─── Grid Card ─────────────────────────────────────────────── */
function GridCard({
  project,
  onEnter,
  onLeave,
  onClick,
}: {
  project: Project;
  onEnter: (p: Project, e: React.MouseEvent<HTMLDivElement>) => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  return (
    <div
      className="portfolio-grid-card"
      onMouseEnter={(e) => onEnter(project, e)}
      onMouseLeave={onLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Open ${project.title}`}
    >
      <video
        src={VIDEO_SRC}
        autoPlay loop muted playsInline
        className="portfolio-grid-video"
        aria-hidden="true"
      />
      <div className="portfolio-grid-overlay" />
      <span className="portfolio-grid-year">{project.year}</span>
      <div className="portfolio-grid-info">
        <span className="portfolio-grid-title">{project.title}</span>
        <span className="portfolio-grid-category">{project.category.toUpperCase()}</span>
      </div>
    </div>
  );
}
