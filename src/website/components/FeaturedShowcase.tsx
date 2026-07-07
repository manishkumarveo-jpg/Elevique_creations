"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import gsap from "gsap";
import { motion, useInView } from "framer-motion";
import {
  Play,
  X,
  ChevronDown,
  Volume2,
  VolumeX,
} from "lucide-react";
import PortfolioReels from "./PortfolioReels";
import { GRID_PROJECTS, type GridProject } from "@/website/data/gridVideos";
import { PKG_AI_VISUALS, PKG_EDITORIAL, PKG_PRODUCT_FILM, PKG_BRAND_FILM, PKG_TECH_UI, PKG_EXPERIMENTAL } from "@/website/data/packagesVideo";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const imageRevealVariants = {
  hidden: { clipPath: "inset(8% 0 0 0)" },
  visible: { clipPath: "inset(0% 0 0 0)" },
};

// Touch devices never fire mouseenter, so hover-to-play videos would
// otherwise sit on an unpainted (black) first frame forever.
function useNoHover() {
  const [noHover, setNoHover] = useState(false);
  useEffect(() => {
    setNoHover(window.matchMedia("(hover: none)").matches);
  }, []);
  return noHover;
}

/* ─── Data ───────────────────────────────────────────────────── */
interface Project {
  id: number;
  title: string;
  videoSrc: string;
  verticalVideoSrc?: string;
  colorFrom?: string;
  colorTo?: string;
  /** Poster image URL — fill in manually; falls back to a black card until set. */
  thumbnail?: string;
}

// Titles are pre-filled from each video's file name — edit them freely below.
const PROJECTS: Project[] = [
  { id: 1, title: "Animated short movie ", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Animated%20movie%20-%20Hero%20Cat%20(1)%20(1).mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Animated%20movie%20-%20Hero%20Cat%20(1)%20(1).png" },
  { id: 2, title: "Fabluxe by Forbes", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Forbes%20properties%20-%20Real%20estate%20-%20concept.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Forbes%20properties%20-%20Real%20estate%20-%20concept.png" },
  { id: 3, title: "Tech-Electronics", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Electronics%20-%20Cooler%20Ad%20(1).mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Electronics%20-%20Cooler%20Ad%20(1).png" },
  { id: 4, title: "Music Video Trailer", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Gangsters%20punjab.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Gangsters%20punjab.png" },
  { id: 5, title: "Gauddly Music Video", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Gauddly%20Music%20Video.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Gauddly%20Music%20Video.png" },
  { id: 6, title: "Cosmetics Music Video", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Itsme%20Music%20Video.mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Itsme%20Music%20Video.png" },
  { id: 7, title: "Kobala Teaser", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Kobala%20(1).mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Kobala%20(1).png" },
  { id: 8, title: "Mahindra EV", videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Mahindra%20XEV%20car%20(1).mp4", thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/Mahindra%20XEV%20car%20(1).compressed.png" },
];

const SHOWREEL_PROJECT = {
  id: 9999,
  title: "",
  videoSrc: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Elevique%20portfolio%20showreel(1)%20(1).mp4",
  thumbnail: "https://pub-024f5faf2e2c4757970fbb447e537ac1.r2.dev/Food%20%26%20bevrages/Thumbnaile/video_thumbnails/cult%20.png"
};

interface PopupState {
  project: Project;
  anchorEl: HTMLElement;
}

function groupByCategory(projects: GridProject[]) {
  const map = new Map<string, GridProject[]>();
  for (const p of projects) {
    const category = p.category ?? "Uncategorized";
    if (!map.has(category)) map.set(category, []);
    map.get(category)!.push(p);
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

  const [overlayLoading, setOverlayLoading] = useState<boolean>(false);
  const [sheetLoading, setSheetLoading] = useState<boolean>(false);
  const [popupLoading, setPopupLoading] = useState<boolean>(false);

  const [heroMuted, setHeroMuted] = useState<boolean>(true);
  const [overlayMuted, setOverlayMuted] = useState<boolean>(true);
  const [sheetMuted, setSheetMuted] = useState<boolean>(true);

  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isHeroInView = useInView(sectionRef, { once: true, margin: "400px" });
  const popupRef = useRef<HTMLDivElement>(null);

  /* overlay refs */
  const overlayBgRef = useRef<HTMLDialogElement>(null);
  const overlayBoxRef = useRef<HTMLDivElement>(null);

  /* bottom sheet refs */
  const sheetBgRef = useRef<HTMLButtonElement>(null);
  const sheetPanelRef = useRef<HTMLDialogElement>(null);

  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Keyed by videoSrc rather than numeric id: PROJECTS (featured row) and
  // GRID_PROJECTS (category rows) both start their id sequence at 1, so two
  // different cards can share an id and be mistaken for "already showing".
  const activePopupProject = useRef<string | null>(null);

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

  const onCardClick = useCallback((p: GridProject) => openVideoOverlay(p as Project), [openVideoOverlay]);

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

  // Real modal semantics (focus trap, top-layer stacking, native a11y) instead
  // of the `open` attribute, which only makes a <dialog> visually present.
  useEffect(() => {
    const el = overlayBgRef.current;
    if (!videoOverlay || !el) return;
    if (!el.open) el.showModal();
    return () => { if (el.open) el.close(); };
  }, [videoOverlay]);

  const closeVideoOverlay = useCallback(() => {
    if (!overlayBgRef.current || !overlayBoxRef.current) return;
    gsap.to(overlayBoxRef.current, { scale: 0.94, opacity: 0, duration: 0.3, ease: "power3.in" });
    gsap.to(overlayBgRef.current, {
      opacity: 0, duration: 0.3, ease: "power2.in",
      onComplete: () => {
        setVideoOverlay(null);
        setOverlayLoading(false);
      },
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

  // Real modal semantics (focus trap, top-layer stacking, native a11y) instead
  // of the `open` attribute, which only makes a <dialog> visually present.
  useEffect(() => {
    const el = sheetPanelRef.current;
    if (!bottomSheet || !el) return;
    if (!el.open) el.showModal();
    return () => { if (el.open) el.close(); };
  }, [bottomSheet]);

  const closeBottomSheet = useCallback(() => {
    if (!sheetBgRef.current || !sheetPanelRef.current) return;
    gsap.to(sheetPanelRef.current, { xPercent: -50, yPercent: -50, scale: 0.92, opacity: 0, duration: 0.3, ease: "power3.in" });
    gsap.to(sheetBgRef.current, {
      opacity: 0, duration: 0.3, ease: "power2.in",
      onComplete: () => {
        setBottomSheet(null);
        setSheetLoading(false);
      },
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
    const key = p.videoSrc ?? String(p.id);
    if (activePopupProject.current === key) return;
    activePopupProject.current = key;
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
    if (!popupRef.current) {
      setPopup(null);
      activePopupProject.current = null;
      setPopupLoading(false);
      return;
    }
    gsap.to(popupRef.current, {
      scale: 0.88, opacity: 0, duration: 0.22, ease: "power3.in",
      onComplete: () => {
        setPopup(null);
        activePopupProject.current = null;
        setPopupLoading(false);
      },
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
    <section id="work" ref={sectionRef} style={{ background: "#000000" }}>

      {/* ══ HERO (grid mode only) ══════════════════════════════ */}
      {viewMode === "grid" && (
        <div className="portfolio-hero">
          {isHeroInView && (
            <video ref={heroVideoRef} className="portfolio-hero-video" src={SHOWREEL_PROJECT.videoSrc} poster={SHOWREEL_PROJECT.thumbnail} autoPlay loop muted={heroMuted} playsInline preload="auto" aria-hidden="true" tabIndex={-1} />
          )}
          <div className="portfolio-hero-gradient-b" />
          <div className="portfolio-hero-gradient-l" />
          <button
            type="button"
            className="portfolio-hero-sound-btn"
            onClick={() => setHeroMuted(!heroMuted)}
            aria-label={heroMuted ? "Unmute showcase film" : "Mute showcase film"}
            title={heroMuted ? "Unmute" : "Mute"}
          >
            {heroMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <div className="portfolio-label">
            <span className="portfolio-label-line" />
            Portfolio Section
          </div>
          <div className="portfolio-hero-content">
            <h2 className="portfolio-hero-title">{SHOWREEL_PROJECT.title}</h2>
            <div className="portfolio-hero-actions">
              <button type="button" className="portfolio-btn-primary" onClick={() => openVideoOverlay(SHOWREEL_PROJECT as Project)}>
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
              {PROJECTS.map((p) => (
                <FeaturedCard
                  key={p.id}
                  project={p}
                  isActive={false}
                  onClick={(project) => openVideoOverlay(project)}
                  onEnter={onCardEnter}
                  onLeave={onCardLeave}
                />
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
                onCardClick={onCardClick}
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
        <div className="reels-feed-wrapper reels-feed-wrapper--packages">
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          <PackagesSection
            onCardEnter={onCardEnter}
            onCardLeave={onCardLeave}
            onCardClick={onCardClick}
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
          <video
            src={popup.project.videoSrc}
            poster={popup.project.thumbnail || undefined}
            autoPlay
            loop
            muted={true}
            playsInline
            preload="auto"
            className="portfolio-popup-video"
            aria-label={`${popup.project.title} video preview`}
            onWaiting={() => setPopupLoading(true)}
            onPlaying={() => setPopupLoading(false)}
            onCanPlay={() => setPopupLoading(false)}
            onLoadStart={() => setPopupLoading(true)}
          />
          {popupLoading && (
            <div className="video-modal-loader">
              <div
                className="reel-loader-spinner"
                style={{ "--accent-color": popup.project.colorFrom || "#ec4899" } as React.CSSProperties}
              />
            </div>
          )}
          <div className="portfolio-popup-scanline" aria-hidden="true" />
          <div className="portfolio-popup-fade" aria-hidden="true" />
          <div className="portfolio-popup-overlay">
            <div className="portfolio-popup-actions">
              <button type="button" className="portfolio-popup-play" onClick={(e) => { e.stopPropagation(); hidePopup(); openVideoOverlay(popup.project); }} aria-label="Play">
                <Play size={13} fill="currentColor" />
              </button>
              <button
                type="button"
                className="portfolio-popup-icon-btn portfolio-popup-icon-btn--right"
                aria-label="Preview"
                onClick={(e) => { e.stopPropagation(); hidePopup(); openBottomSheet(popup.project); }}
              >
                <ChevronDown size={13} />
              </button>
            </div>
            <h4 className="portfolio-popup-title">{popup.project.title}</h4>
          </div>
        </div>
      )}

      {/* ══ VIDEO OVERLAY (full viewport) ════════════════════════ */}
      {videoOverlay && (
        <dialog
          ref={overlayBgRef}
          className="vo-backdrop"
          aria-modal="true"
          aria-label={videoOverlay.title}
          tabIndex={-1}
          onCancel={(e) => { e.preventDefault(); closeVideoOverlay(); }}
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
              poster={videoOverlay.thumbnail || undefined}
              autoPlay
              loop
              muted={overlayMuted}
              playsInline
              preload="auto"
              className="vo-video"
              aria-label={`${videoOverlay.title} full film`}
              onWaiting={() => setOverlayLoading(true)}
              onPlaying={() => setOverlayLoading(false)}
              onCanPlay={() => setOverlayLoading(false)}
              onLoadStart={() => setOverlayLoading(true)}
            />

            {overlayLoading && (
              <div className="video-modal-loader">
                <div
                  className="reel-loader-spinner"
                  style={{ "--accent-color": "#ec4899" } as React.CSSProperties}
                />
              </div>
            )}

            {/* bottom info bar */}
            <div className="vo-info">
              <div className="vo-info-left">
                <h2 className="vo-title">{videoOverlay.title}</h2>

              </div>
            </div>

            {/* sound controls */}
            <button
              type="button"
              className="vo-sound-btn"
              onClick={() => setOverlayMuted(!overlayMuted)}
              aria-label={overlayMuted ? "Unmute film" : "Mute film"}
              title={overlayMuted ? "Unmute" : "Mute"}
            >
              {overlayMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

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
            aria-modal="true"
            aria-label={bottomSheet.title}
            tabIndex={-1}
            onCancel={(e) => { e.preventDefault(); closeBottomSheet(); }}
            style={{ border: "none", padding: 0 }}
          >

            {/* close — top-right over video */}
            <button type="button" className="bs-close" onClick={closeBottomSheet} aria-label="Close">
              <X size={16} />
            </button>

            {/* ── video (full width, 16:9) ── */}
            <div className="bs-video-col" style={{ position: "relative" }}>
              <video
                src={bottomSheet.videoSrc}
                poster={bottomSheet.thumbnail || undefined}
                autoPlay
                loop
                muted={sheetMuted}
                playsInline
                preload="auto"
                className="bs-video"
                aria-label={`${bottomSheet.title} highlight video`}
                onWaiting={() => setSheetLoading(true)}
                onPlaying={() => setSheetLoading(false)}
                onCanPlay={() => setSheetLoading(false)}
                onLoadStart={() => setSheetLoading(true)}
              />
              <button
                type="button"
                className="bs-video-sound-btn"
                onClick={() => setSheetMuted(!sheetMuted)}
                aria-label={sheetMuted ? "Unmute details video" : "Mute details video"}
                title={sheetMuted ? "Unmute" : "Mute"}
              >
                {sheetMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              {sheetLoading && (
                <div className="video-modal-loader">
                  <div
                    className="reel-loader-spinner"
                    style={{ "--accent-color": bottomSheet.colorFrom || "#ec4899" } as React.CSSProperties}
                  />
                </div>
              )}
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

          </dialog>
        </>
      )}
    </section>
  );
}

/* ─── Featured Card ─────────────────────────────────────────── */
const FeaturedCard = memo(function FeaturedCard({ project, isActive, onClick, onEnter: onCardEnter, onLeave: onCardLeave }: { project: Project; isActive: boolean; onClick: (p: Project) => void; onEnter: (p: GridProject, e: React.MouseEvent<HTMLElement>) => void; onLeave: () => void }) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "150px" });
  const noHover = useNoHover();
  const onEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isActive) gsap.to(cardRef.current, { scale: 1.04, duration: 0.22, ease: "power4.out" });
    if (project.videoSrc) videoRef.current?.play().catch(() => { });
    onCardEnter(project as unknown as GridProject, e);
  };
  const onLeave = () => {
    gsap.to(cardRef.current, { scale: 1, duration: 0.22, ease: "power4.out" });
    if (!noHover && videoRef.current) {
      videoRef.current.pause();
      // .load() resets the element back to its poster-showing state — pause()
      // alone leaves the last rendered video frame on screen, not the poster.
      videoRef.current.load();
    }
    onCardLeave();
  };
  const handleClick = () => onClick(project);
  return (
    <button
      ref={cardRef}
      type="button"
      className={`portfolio-feat-card shrink-0${isActive ? " portfolio-feat-card--active" : ""}`}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { if (e.key === " ") e.preventDefault(); handleClick(); } }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label={`Switch to ${project.title}`}
    >
      {project.videoSrc && isInView && (
        <motion.video
          ref={videoRef}
          src={project.videoSrc}
          poster={project.thumbnail || undefined}
          loop
          muted
          playsInline
          preload="none"
          className="portfolio-feat-video"
          aria-hidden="true"
          tabIndex={-1}
          initial="hidden"
          animate="visible"
          variants={imageRevealVariants}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT }}
        />
      )}
      <div className="portfolio-feat-overlay" />
      <div className="portfolio-feat-info">
        <span className="portfolio-feat-title">{project.title}</span>
      </div>
    </button>
  );
});

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
              onClick={onCardClick}
            />
          ))}
        </div>
        <button type="button" className="portfolio-row-arrow portfolio-row-arrow--right" onClick={() => scroll(1)} aria-label="Scroll right">›</button>
      </div>
    </div>
  );
}

/* ─── Grid Card ─────────────────────────────────────────────── */
const GridCard = memo(function GridCard({ project, onEnter, onLeave, onClick, disableHoverOnMobile, viewMargin = "150px" }: { project: GridProject; onEnter: (p: GridProject, e: React.MouseEvent<HTMLElement>) => void; onLeave: () => void; onClick: (p: GridProject) => void; disableHoverOnMobile?: boolean; viewMargin?: `${number}px` }) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: viewMargin });
  const noHover = useNoHover();
  const handleEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disableHoverOnMobile && noHover) return;
    if (project.videoSrc) videoRef.current?.play().catch(() => { });
    onEnter(project, e);
  };
  const handleLeave = () => {
    if (disableHoverOnMobile && noHover) return;
    if (!noHover && videoRef.current) {
      videoRef.current.pause();
      // .load() resets the element back to its poster-showing state — pause()
      // alone leaves the last rendered video frame on screen, not the poster.
      videoRef.current.load();
    }
    onLeave();
  };
  const handleClick = () => onClick(project);
  return (
    <button
      ref={cardRef}
      type="button"
      className="portfolio-grid-card shrink-0"
      style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer" }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { if (e.key === " ") e.preventDefault(); handleClick(); } }}
      aria-label={`Play ${project.title}`}
    >
      <div className="portfolio-grid-card-inner">
        {project.videoSrc && isInView && (
          <motion.video
            ref={videoRef}
            src={project.videoSrc}
            poster={project.thumbnail || undefined}
            loop
            muted
            playsInline
            preload="none"
            className="portfolio-grid-video"
            aria-hidden="true"
            tabIndex={-1}
            initial="hidden"
            animate="visible"
            variants={imageRevealVariants}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT }}
          />
        )}
        <div className="portfolio-grid-overlay" />
      </div>
      <div className="portfolio-grid-info">
        <span className="portfolio-grid-title">{project.title}</span>
      </div>
    </button>
  );
});

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

  const flattenedProjects = section.rows.reduce<GridProject[]>((acc, row) => [...acc, ...row.items], []);

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
        <div className="packages-grid-4cols">
          {flattenedProjects.map((p) => (
            <GridCard
              key={p.id}
              project={p}
              onEnter={onCardEnter}
              onLeave={onCardLeave}
              onClick={onCardClick}
              disableHoverOnMobile
              viewMargin="0px"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
