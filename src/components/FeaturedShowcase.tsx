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
import PortfolioReels from "./PortfolioReels";
import { GRID_PROJECTS, AI_VISUALS, EDITORIAL, PRODUCT_FILM, BRAND_FILM, TECH_UI, EXPERIMENTAL, type GridProject } from "@/data/gridVideos";
import { PKG_AI_VISUALS, PKG_EDITORIAL, PKG_PRODUCT_FILM, PKG_BRAND_FILM, PKG_TECH_UI, PKG_EXPERIMENTAL } from "@/data/packagesVideo";

/* ─── Data ───────────────────────────────────────────────────── */
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
  videoSrc: string;
  verticalVideoSrc?: string;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Elevique Creation",
    category: "AI Visuals",
    year: "2024",
    role: "Creative Direction",
    description: "A visceral exploration of human endurance pushing the boundaries of motion and light.",
    techStack: ["AI Generation", "Motion Design", "Color Grading", "VFX"],
    colorFrom: "#ff6b35",
    colorTo: "#ff1a1a",
    videoSrc: "https://res.cloudinary.com/dpm8hbhff/video/upload/q_auto/f_auto/v1780998674/Forbes_properties_-_Real_estate_odzs1p.mov",
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
    videoSrc: "https://res.cloudinary.com/dpaoerbde/video/upload/v1780379272/hero-video_pxivlu.mp4",
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
    videoSrc: "https://res.cloudinary.com/dpm8hbhff/video/upload/q_auto/f_auto/v1781089842/Animated_movie_-_Malibhai_compressed_avswba.mp4",
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
    videoSrc: "https://res.cloudinary.com/dpm8hbhff/video/upload/q_auto/f_auto/v1781090224/Its_me_music_video_compressed_ug7wwp.mp4",
  },

];

interface PopupState {
  project: Project;
  anchorEl: HTMLElement;
}

function groupByCategory(projects: GridProject[]) {
  const map = new Map<string, GridProject[]>();
  for (const p of projects) {
    if (!map.has(p.category)) map.set(p.category, []);
    map.get(p.category)!.push(p);
  }
  return Array.from(map.entries()).map(([category, items]) => ({ category, items }));
}
const CATEGORY_GROUPS = groupByCategory(GRID_PROJECTS);

type PackageTab = "signature" | "impact" | "custom";

const PACKAGE_SECTIONS: Record<PackageTab, { rows: { category: string; items: GridProject[] }[] }> = {
  "signature": { rows: [{ category: "AI Visuals", items: PKG_AI_VISUALS as GridProject[] }, { category: "Editorial", items: PKG_EDITORIAL as GridProject[] }] },
  "impact": { rows: [{ category: "Product Film", items: PKG_PRODUCT_FILM as GridProject[] }, { category: "Brand Film", items: PKG_BRAND_FILM as GridProject[] }] },
  "custom": { rows: [{ category: "Tech / UI", items: PKG_TECH_UI as GridProject[] }, { category: "Experimental", items: PKG_EXPERIMENTAL as GridProject[] }] },
};

const VO_BACKDROP_CLICK_STYLE = {
  position: "absolute",
  inset: 0,
  background: "transparent",
  border: "none",
  cursor: "pointer",
  width: "100%",
  height: "100%",
  zIndex: 1,
} as const;

/* ─── View Mode Toggle ──────────────────────────────────────── */
type ViewMode = "grid" | "reels" | "packages";

function ViewToggle({ viewMode, setViewMode }: { viewMode: ViewMode; setViewMode: (m: ViewMode) => void }) {
  return (
    <div className="portfolio-view-toggle-wrap">
      <div className="portfolio-view-toggle">
        <button
          type="button"
          className={`portfolio-toggle-btn${viewMode === "grid" ? " active" : ""}`}
          onClick={() => setViewMode("grid")}
          style={{ width: "110px", justifyContent: "center" }}
        >
          Grid Showcase
        </button>
        <button
          type="button"
          className={`portfolio-toggle-btn${viewMode === "reels" ? " active" : ""}`}
          onClick={() => setViewMode("reels")}
          style={{ width: "110px", justifyContent: "center" }}
        >
          Reels Feed
        </button>
        <button
          type="button"
          className={`portfolio-toggle-btn${viewMode === "packages" ? " active" : ""}`}
          onClick={() => setViewMode("packages")}
          style={{ width: "110px", justifyContent: "center" }}
        >
          Packages
        </button>
        <div
          className="portfolio-toggle-pill"
          style={{
            width: "110px",
            transform: viewMode === "grid" ? "translateX(0)" : viewMode === "reels" ? "translateX(110px)" : "translateX(220px)",
          }}
        />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
export default function FeaturedShowcase() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [active, setActive] = useState<Project>(PROJECTS[0]);
  const [videoOverlay, setVideoOverlay] = useState<Project | null>(null);
  const [bottomSheet, setBottomSheet] = useState<Project | null>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);

  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  /* overlay refs */
  const overlayBgRef = useRef<HTMLDialogElement>(null);
  const overlayBoxRef = useRef<HTMLDivElement>(null);

  /* bottom sheet refs */
  const sheetBgRef = useRef<HTMLButtonElement>(null);
  const sheetPanelRef = useRef<HTMLDialogElement>(null);

  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activePopupProject = useRef<number | null>(null);

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

  /* ── Scroll to top on view change ───────────────────────────── */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [viewMode]);

  /* ── Hide navbar on mobile when in reels mode ───────────────── */
  useEffect(() => {
    if (viewMode === "reels") {
      document.body.classList.add("reels-active");
    } else {
      document.body.classList.remove("reels-active");
    }
    return () => { document.body.classList.remove("reels-active"); };
  }, [viewMode]);

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

  const videoOverlayRef = useRef(videoOverlay);
  const bottomSheetRef = useRef(bottomSheet);
  const closeVideoOverlayRef = useRef(closeVideoOverlay);
  const closeBottomSheetRef = useRef(closeBottomSheet);

  useEffect(() => {
    videoOverlayRef.current = videoOverlay;
  }, [videoOverlay]);

  useEffect(() => {
    bottomSheetRef.current = bottomSheet;
  }, [bottomSheet]);

  useEffect(() => {
    closeVideoOverlayRef.current = closeVideoOverlay;
  }, [closeVideoOverlay]);

  useEffect(() => {
    closeBottomSheetRef.current = closeBottomSheet;
  }, [closeBottomSheet]);

  /* ── Escape key ─────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (videoOverlayRef.current) closeVideoOverlayRef.current();
      else if (bottomSheetRef.current) closeBottomSheetRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
    const top = Math.max(margin, Math.min(rect.top - expand, window.innerHeight - popH - margin));
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

  /* Close the hover popup as soon as the page scrolls, since its position
     is calculated once and won't follow the card while scrolling. */
  useEffect(() => {
    if (!popup) return;
    const onScroll = () => hidePopup();
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [popup, hidePopup]);

  const onCardEnter = useCallback((p: GridProject, e: React.MouseEvent<HTMLElement>) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    const anchor = e.currentTarget;
    hoverTimer.current = setTimeout(() => showPopup(p as Project, anchor), 350);
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
    <section id="work" style={{ background: "#000000" }}>

      {/* ══ HERO (grid mode only) ══════════════════════════════ */}
      {viewMode === "grid" && (
        <div className="portfolio-hero">
          <video ref={heroVideoRef} className="portfolio-hero-video" src={active.videoSrc} autoPlay loop muted playsInline aria-hidden="true" tabIndex={-1} />
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
              <button type="button" className="portfolio-btn-primary" onClick={() => openVideoOverlay(active)}>
                <Play size={15} fill="currentColor" />
                Watch Full Video
              </button>

            </div>
          </div>

          <div className="portfolio-view-toggle-wrap hero-toggle-overlay">
            <div className="portfolio-view-toggle">
              <button
                type="button"
                className="portfolio-toggle-btn active"
                onClick={() => setViewMode("grid")}
                style={{ width: "110px", justifyContent: "center" }}
              >
                Grid Showcase
              </button>
              <button
                type="button"
                className="portfolio-toggle-btn"
                onClick={() => setViewMode("reels")}
                style={{ width: "110px", justifyContent: "center" }}
              >
                Reels Feed
              </button>
              <button
                type="button"
                className="portfolio-toggle-btn"
                onClick={() => setViewMode("packages")}
                style={{ width: "110px", justifyContent: "center" }}
              >
                Packages
              </button>
              <div
                className="portfolio-toggle-pill"
                style={{
                  width: "110px",
                  transform: "translateX(0)",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {viewMode === "grid" ? (
        <>
          {/* ══ FEATURED ROW ════════════════════════════════════════ */}
          <div className="portfolio-featured-wrap">
            <div className="svc-grid-overlay" aria-hidden="true" />
            <p className="portfolio-featured-label">Featured Projects</p>
            <div className="portfolio-featured-row">
              {PROJECTS.slice(0, 6).map((p) => (
                <FeaturedCard key={p.id} project={p} isActive={active.id === p.id} onClick={() => switchProject(p)} />
              ))}
            </div>
          </div>

          {/* ══ CATEGORY ROWS ═══════════════════════════════════════ */}
          <div className="portfolio-rows-wrap">
            {CATEGORY_GROUPS.map(({ category, items }) => (
              <CategoryRow
                key={category}
                category={category}
                projects={items}
                onCardEnter={onCardEnter}
                onCardLeave={onCardLeave}
                onCardClick={(p: GridProject) => openVideoOverlay(p as Project)}
              />
            ))}
          </div>
        </>
      ) : viewMode === "reels" ? (
        /* Reels mode — standalone toggle header + feed */
        <div className="reels-feed-wrapper reels-feed-wrapper--reels">
          {/* Persistent toggle so user can always switch back */}
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          <PortfolioReels onViewDetails={(p) => openBottomSheet(p as Project)} onBack={() => setViewMode("grid")} />
        </div>
      ) : (
        /* Packages mode */
        <div className="reels-feed-wrapper">
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          <PackagesSection
            onCardEnter={onCardEnter}
            onCardLeave={onCardLeave}
            onCardClick={(p: GridProject) => openVideoOverlay(p as Project)}
          />
        </div>
      )}

      {/* ══ POPUP ═══════════════════════════════════════════════ */}
      {popup && (
        <div
          ref={popupRef}
          className="portfolio-popup"
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
          onClick={() => { hidePopup(); openVideoOverlay(popup.project); }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              if (e.key === " ") e.preventDefault();
              hidePopup();
              openVideoOverlay(popup.project);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`View details for ${popup.project.title}`}
          style={{ cursor: "pointer" }}
        >
          <video src={popup.project.videoSrc} autoPlay loop muted playsInline className="portfolio-popup-video" aria-label={`${popup.project.title} video preview`} />
          <div className="portfolio-popup-scanline" aria-hidden="true" />
          <div className="portfolio-popup-fade" aria-hidden="true" />
          <div className="portfolio-popup-overlay">
            <div className="portfolio-popup-actions">
              <button type="button" className="portfolio-popup-play" onClick={(e) => { e.stopPropagation(); hidePopup(); openVideoOverlay(popup.project); }} aria-label="Play">
                <Play size={13} fill="currentColor" />
              </button>
              <button type="button" className="portfolio-popup-icon-btn" onClick={(e) => e.stopPropagation()} aria-label="Add"><Plus size={13} /></button>
              <button type="button" className="portfolio-popup-icon-btn" onClick={(e) => e.stopPropagation()} aria-label="Like"><ThumbsUp size={12} /></button>
              <button
                type="button"
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
        <dialog
          ref={overlayBgRef}
          className="vo-backdrop"
          open
          aria-modal="true"
          aria-label={videoOverlay.title}
          tabIndex={-1}
          style={{ display: "flex", border: "none", background: "rgba(0, 0, 0, 0.96)", padding: 0 }}
        >
          <button
            type="button"
            className="vo-backdrop-click"
            onClick={closeVideoOverlay}
            aria-label="Close film overlay"
            style={VO_BACKDROP_CLICK_STYLE}
          />
          <div ref={overlayBoxRef} className="vo-box" onClick={(e) => e.stopPropagation()} style={{ zIndex: 2 }}>
            <video
              src={videoOverlay.videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="vo-video"
              aria-label={`${videoOverlay.title} full film`}
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
            <button type="button" className="vo-close" onClick={closeVideoOverlay} aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </dialog>
      )}

      {/* ══ BOTTOM SHEET (Netflix-style centered modal) ══════════ */}
      {bottomSheet && (
        <>
          <button
            ref={sheetBgRef}
            type="button"
            className="bs-backdrop"
            onClick={closeBottomSheet}
            aria-label="Close details dialog"
            style={{ border: "none", padding: 0 }}
          />
          <dialog
            ref={sheetPanelRef}
            className="bs-panel"
            open
            aria-modal="true"
            aria-label={bottomSheet.title}
            tabIndex={-1}
            style={{ border: "none", padding: 0 }}
          >

            {/* close — top-right over video */}
            <button type="button" className="bs-close" onClick={closeBottomSheet} aria-label="Close">
              <X size={16} />
            </button>

            {/* ── video (full width, 16:9) ── */}
            <div className="bs-video-col">
              <video src={bottomSheet.videoSrc} autoPlay loop muted playsInline className="bs-video" aria-label={`${bottomSheet.title} highlight video`} />
              <div className="bs-video-overlay" />

              {/* title + action btns float over gradient */}
              <div className="bs-video-footer">
                <h3 className="bs-video-title">{bottomSheet.title}</h3>
                <div className="bs-video-btns">
                  <button
                    type="button"
                    className="portfolio-btn-primary"
                    style={{ fontSize: "0.75rem", padding: "8px 16px" }}
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
                <button type="button" className="portfolio-btn-ghost" style={{ fontSize: "0.75rem" }}>
                  <ExternalLink size={13} />
                  Case Study
                </button>
              </div>
            </div>
          </dialog>
        </>
      )}
    </section>
  );
}

/* ─── Featured Card ─────────────────────────────────────────── */
function FeaturedCard({ project, isActive, onClick }: { project: Project; isActive: boolean; onClick: () => void }) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const onEnter = () => {
    if (!isActive) gsap.to(cardRef.current, { scale: 1.04, duration: 0.22, ease: "power4.out" });
    if (project.videoSrc) videoRef.current?.play().catch(() => { });
  };
  const onLeave = () => {
    gsap.to(cardRef.current, { scale: 1, duration: 0.22, ease: "power4.out" });
    videoRef.current?.pause();
  };
  return (
    <button
      ref={cardRef}
      type="button"
      className={`portfolio-feat-card${isActive ? " portfolio-feat-card--active" : ""}`}
      style={{
        background: "transparent",
        padding: 0,
        cursor: "pointer",
        ...(isActive ? { boxShadow: `0 0 18px 2px ${project.colorFrom}8C`, borderColor: project.colorFrom } : {})
      }}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { if (e.key === " ") e.preventDefault(); onClick(); } }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label={`Switch to ${project.title}`}
    >
      {project.videoSrc ? (
        <video ref={videoRef} src={project.videoSrc} loop muted playsInline className="portfolio-feat-video" aria-hidden="true" tabIndex={-1} />
      ) : (
        <div
          className="portfolio-feat-video"
          style={{ background: `linear-gradient(135deg, ${project.colorFrom}33 0%, ${project.colorTo}22 100%)` }}
          aria-hidden="true"
        />
      )}
      <div className="portfolio-feat-overlay" />
      <div className="portfolio-feat-info">
        <span className="portfolio-feat-title">{project.title}</span>
        <span className="portfolio-feat-category">{project.category.toUpperCase()}</span>
      </div>
    </button>
  );
}

/* ─── Category Row ──────────────────────────────────────────── */
function CategoryRow({
  category,
  projects,
  onCardEnter,
  onCardLeave,
  onCardClick,
}: {
  category: string;
  projects: GridProject[];
  onCardEnter: (p: GridProject, e: React.MouseEvent<HTMLElement>) => void;
  onCardLeave: () => void;
  onCardClick: (p: GridProject) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: -1 | 1) => {
    scrollRef.current?.scrollBy({ left: dir * 900, behavior: "smooth" });
  };
  return (
    <div className="portfolio-row">
      <span className="portfolio-row-label">{category}</span>
      <div className="portfolio-row-track-wrap">
        <button type="button" className="portfolio-row-arrow portfolio-row-arrow--left" onClick={() => scroll(-1)} aria-label="Scroll left">‹</button>
        <div ref={scrollRef} className="portfolio-row-track">
          {projects.map((p) => (
            <GridCard
              key={p.id}
              project={p}
              onEnter={onCardEnter}
              onLeave={onCardLeave}
              onClick={() => onCardClick(p)}
            />
          ))}
        </div>
        <button type="button" className="portfolio-row-arrow portfolio-row-arrow--right" onClick={() => scroll(1)} aria-label="Scroll right">›</button>
      </div>
    </div>
  );
}

/* ─── Grid Card ─────────────────────────────────────────────── */
function GridCard({ project, onEnter, onLeave, onClick }: { project: GridProject; onEnter: (p: GridProject, e: React.MouseEvent<HTMLElement>) => void; onLeave: () => void; onClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const handleEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (project.videoSrc) videoRef.current?.play().catch(() => { });
    onEnter(project, e);
  };
  const handleLeave = () => {
    videoRef.current?.pause();
    onLeave();
  };
  return (
    <button
      type="button"
      className="portfolio-grid-card"
      style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer" }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { if (e.key === " ") e.preventDefault(); onClick(); } }}
      aria-label={`Play ${project.title}`}
    >
      <div className="portfolio-grid-card-inner">
        {project.videoSrc ? (
          <video ref={videoRef} src={project.videoSrc} loop muted playsInline className="portfolio-grid-video" aria-hidden="true" tabIndex={-1} />
        ) : (
          <div
            className="portfolio-grid-video"
            style={{
              background: `linear-gradient(135deg, ${project.colorFrom}44 0%, ${project.colorTo}33 100%)`,
              opacity: 0.7,
            }}
            aria-hidden="true"
          />
        )}
        <div className="portfolio-grid-overlay" />
      </div>
      <span className="portfolio-grid-year">{project.year}</span>
      <div className="portfolio-grid-info">
        <span className="portfolio-grid-title">{project.title}</span>
        <span className="portfolio-grid-category">{project.category.toUpperCase()}</span>
      </div>
    </button>
  );
}

/* ─── Packages Section ──────────────────────────────────────── */
function PackagesSection({
  onCardEnter,
  onCardLeave,
  onCardClick,
}: {
  onCardEnter: (p: GridProject, e: React.MouseEvent<HTMLElement>) => void;
  onCardLeave: () => void;
  onCardClick: (p: GridProject) => void;
}) {
  const [activeTab, setActiveTab] = useState<PackageTab>("impact");
  const section = PACKAGE_SECTIONS[activeTab];

  return (
    <div className="packages-section-wrap">
      <div className="packages-tabs-wrap">
        {(["impact", "signature", "custom"] as PackageTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`packages-tab-btn${activeTab === tab ? " active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="portfolio-rows-wrap" style={{ paddingTop: "0.5rem" }}>
        {section.rows.map(({ category, items }) => (
          <CategoryRow
            key={category}
            category={category}
            projects={items}
            onCardEnter={onCardEnter}
            onCardLeave={onCardLeave}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
}
