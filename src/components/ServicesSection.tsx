"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  Video,
  PenTool,
  Cpu,
  X,
  ChevronRight,
  Brain,
  Film,
  Zap,
  BookOpen,
  Layers,
  Camera,
  Sparkles,
} from "lucide-react";

/* Services We Offer */

/* ─── Data ─────────────────────────────────────────────────────── */
const SERVICES = [
  {
    id: "ai-video-ads",
    icon: <Video size={36} strokeWidth={1.5} />,
    title: "AI Video Ads",
    synopsis:
      "Harness AI to create engaging, personalized video ads that capture attention and drive real business results. We combine advanced AI with creative storytelling to deliver content tailored to your audience — relevant, impactful, and cost-effective."
  },
  {
    id: "content-creation",
    icon: <PenTool size={36} strokeWidth={1.5} />,
    title: "Content Creation",
    synopsis:
      "End-to-end content pipelines from concept to publish. Our studio handles scripting, visual direction, AI-assisted photography, voiceover synthesis, and multi-channel repurposing across social, web, and OTT — with a 48-hour turnaround SLA.",
  },
  {
    id: "immersive-grap",
    icon: <Cpu size={36} strokeWidth={1.5} />,
    title: "Graphic Design",
    synopsis:
      "Our  creative team crafts visually striking graphics that align with your brand identity, ensuring your message stands out and leaves a lasting impression..",
  },
  {
    id: "brand-strategy",
    icon: <Layers size={36} strokeWidth={1.5} />,
    title: "Lead Generation",
    synopsis:
      "We design proven strategies to attract, capture , and convert potential customers into qualified leads,helping your business grow faster.",
  },
  {
    id: "ai-photography",
    icon: <Camera size={36} strokeWidth={1.5} />,
    title: "Social Media",
    synopsis:
      "From planning to publishing, we manage your social media presence to build brand awareness, engage your audiencem, and drive  meaningful interactions.",
  },
  {
    id: "motion-graphics",
    icon: <Sparkles size={36} strokeWidth={1.5} />,
    title: "Meta Ads",
    synopsis:
      "Our data-driven Meta (Facebook & instagram) ad campaigns ensure your brand reaches the right audience, delivering maximum visibility and measurable results.",
  },
];

const DIFFERENTIATORS = [
  {
    id: "realistic-ai",
    icon: <Brain size={28} strokeWidth={1.4} />,
    label: "Realistic AI",
    desc: "Highly integrated neural styling pipelines",
  },
  {
    id: "cinematic-quality",
    icon: <Film size={28} strokeWidth={1.4} />,
    label: "Cinematic Quality",
    desc: "High-contrast digital asset finishes",
  },
  {
    id: "speed-efficiency",
    icon: <Zap size={28} strokeWidth={1.4} />,
    label: "Speed & Efficiency",
    desc: "Render builds completed in short turnarounds",
  },
  {
    id: "creative-storytelling",
    icon: <BookOpen size={28} strokeWidth={1.4} />,
    label: "Creative Storytelling",
    desc: "Scripting, styling, and visual frameworks",
  },
  {
    id: "premium-integration",
    icon: <Layers size={28} strokeWidth={1.4} />,
    label: "Premium Integration",
    desc: "Standard API, Next.js, and database sync pipelines",
  }
];

/* ─── Inquiry Modal ─────────────────────────────────────────────── */
function InquiryModal({
  service,
  onClose,
}: {
  service: (typeof SERVICES)[0];
  onClose: () => void;
}) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const enrichedMessage = `[Service Inquiry: ${service.title}]\n\n${form.message}`;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: enrichedMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to submit inquiry.");

      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="svc-modal-backdrop" onClick={onClose}>
      <div
        className="svc-modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Start project inquiry for ${service.title}`}
      >
        {/* header */}
        <div className="svc-modal-header">
          <div className="svc-modal-eyebrow">
            <span className="svc-modal-eyebrow-dot" />
            Start a Project
          </div>
          <button
            type="button"
            className="svc-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <h3 className="svc-modal-title">{service.title}</h3>
        <p className="svc-modal-subtitle">
          Tell us about your vision and we&apos;ll get back within 24 hours.
        </p>

        {sent ? (
          <div className="svc-modal-success">
            <div className="svc-modal-success-icon">✓</div>
            <p>We received your inquiry. Expect a reply within 24&nbsp;hrs.</p>
          </div>
        ) : (
          <form className="svc-modal-form" onSubmit={handleSubmit}>
            {error && (
              <p className="svc-modal-error" style={{ color: "#ff5a5a", fontSize: "0.8rem", margin: "0 0 0.8rem 0", textAlign: "left" }}>
                {error}
              </p>
            )}
            <div className="svc-modal-field">
              <label htmlFor={`modal-name-${service.id}`}>Name</label>
              <input
                id={`modal-name-${service.id}`}
                type="text"
                placeholder="Your full name"
                aria-label="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="svc-modal-field">
              <label htmlFor={`modal-email-${service.id}`}>Email</label>
              <input
                id={`modal-email-${service.id}`}
                type="email"
                placeholder="you@company.com"
                aria-label="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="svc-modal-field">
              <label htmlFor={`modal-msg-${service.id}`}>Project Brief</label>
              <textarea
                id={`modal-msg-${service.id}`}
                placeholder="Describe your project goals, timeline, and budget…"
                rows={4}
                aria-label="Project Brief"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="svc-modal-submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Inquiry"}
              {!isSubmitting && <ChevronRight size={15} />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─── Dot grid SVG overlay ──────────────────────────────────────── */
function DotGrid() {
  return (
    <svg
      className="svc-dot-grid"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="svc-dots"
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
        </pattern>
        <radialGradient id="svc-dot-mask" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="svc-dot-fade">
          <rect width="100%" height="100%" fill="url(#svc-dot-mask)" />
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#svc-dots)"
        mask="url(#svc-dot-fade)"
      />
    </svg>
  );
}

/* ─── Flip Card — hover on desktop, tap on touch ───────────────── */
function FlipCard({
  svc,
  onStart,
  isFlipped,
  onFlipToggle,
}: {
  svc: (typeof SERVICES)[0];
  onStart: () => void;
  isFlipped: boolean;
  onFlipToggle: (flipped: boolean) => void;
}) {
  return (
    <div
      className={`svc-flip-wrapper${isFlipped ? " svc-flip-wrapper--tapped" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={`Service: ${svc.title}`}
      onClick={(e) => {
        e.stopPropagation();
        onFlipToggle(!isFlipped);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onFlipToggle(!isFlipped);
        }
      }}
    >
      <div className="svc-flip-inner">
        {/* ── FRONT ── */}
        <div className="svc-card svc-card--front">
          <DotGrid />
          <div className="svc-card-icon">{svc.icon}</div>
          <h3 className="svc-card-title">{svc.title}</h3>

          <div className="svc-front-animation">
            {svc.id === "ai-video-ads" && (
              <div className="anim-video">
                <div className="video-player">
                  <div className="video-scanline" />
                  <div className="play-ring">
                    <div className="play-triangle" />
                  </div>
                </div>
                <div className="video-timeline">
                  <div className="timeline-track">
                    <div className="timeline-fill" />
                    <div className="timeline-head" />
                  </div>
                  <div className="timeline-marks">
                    <span className="tmark" />
                    <span className="tmark" />
                    <span className="tmark" />
                  </div>
                </div>
              </div>
            )}
            {svc.id === "content-creation" && (
              <div className="anim-content">
                <div className="doc-stack">
                  <div className="doc-shadow doc-shadow-2" />
                  <div className="doc-shadow doc-shadow-1" />
                  <div className="doc-sheet">
                    <div className="doc-title-line" />
                    <div className="doc-divider" />
                    <div className="doc-line line-1" />
                    <div className="doc-line line-2" />
                    <div className="doc-line line-3" />
                    <div className="doc-line-container">
                      <div className="doc-line line-4" />
                      <div className="cursor-bar" />
                    </div>
                  </div>
                </div>
                <div className="ai-pill">AI</div>
              </div>
            )}
            {svc.id === "immersive-grap" && (
              <div className="anim-graphic">
                <div className="design-canvas">
                  <svg className="canvas-svg" viewBox="0 0 55 55" width="55" height="55" aria-hidden="true">
                    <rect className="canvas-rect" x="8" y="8" width="39" height="39" rx="5"
                      fill="rgba(20,184,166,0.04)" stroke="rgba(20,184,166,0.7)" strokeWidth="1.2" />
                  </svg>
                  <span className="handle h-tl" />
                  <span className="handle h-tr" />
                  <span className="handle h-bl" />
                  <span className="handle h-br" />
                </div>
                <div className="swatch-row">
                  <span className="swatch sw-1" />
                  <span className="swatch sw-2" />
                  <span className="swatch sw-3" />
                  <span className="swatch sw-4" />
                </div>
              </div>
            )}
            {svc.id === "brand-strategy" && (
              <div className="anim-lead">
                <div className="funnel-wrap">
                  <svg viewBox="0 0 80 62" width="80" height="62" className="lead-funnel" aria-hidden="true">
                    <path d="M4,4 L76,4 L46,56 L34,56 Z"
                      fill="rgba(20,184,166,0.07)" stroke="rgba(20,184,166,0.45)"
                      strokeWidth="1.4" strokeLinejoin="round" />
                  </svg>
                  <div className="funnel-particles">
                    <span className="fp fp-1" />
                    <span className="fp fp-2" />
                    <span className="fp fp-3" />
                    <span className="fp fp-4" />
                  </div>
                </div>
                <div className="lead-drop-dot" />
              </div>
            )}
            {svc.id === "ai-photography" && (
              <div className="anim-social">
                <div className="phone-outline">
                  <div className="phone-notch" />
                  <div className="phone-screen">
                    <div className="sicon sicon-1">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </div>
                    <div className="sicon sicon-2">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                      </svg>
                    </div>
                    <div className="sicon sicon-3">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                    </div>
                    <div className="engage-bar"><div className="engage-fill" /></div>
                  </div>
                  <div className="notif-badge">3</div>
                </div>
              </div>
            )}
            {svc.id === "motion-graphics" && (
              <div className="anim-meta">
                <div className="rings-container">
                  <span className="meta-ring meta-ring-1" />
                  <span className="meta-ring meta-ring-2" />
                  <span className="meta-ring meta-ring-3" />
                </div>
                <div className="meta-circle">
                  <div className="meta-crosshair">
                    <div className="ch-h" />
                    <div className="ch-v" />
                  </div>
                  <div className="ad-badge">AD</div>
                </div>
              </div>
            )}
          </div>

          <div className="svc-card-hover-badge">
            Hover to learn more
            <ChevronRight size={13} className="svc-badge-chevron" />
          </div>
        </div>

        {/* ── BACK ── */}
        <div className="svc-card svc-card--back">
          <DotGrid />
          <p className="svc-card-synopsis">{svc.synopsis}</p>
          <button
            type="button"
            className="svc-card-cta"
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
            onTouchEnd={(e) => e.stopPropagation()}
            aria-label={`Start project for ${svc.title}`}
          >
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
}

const CARD_EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Animated grid ─────────────────────────────────────────────── */
function ServicesGrid({ onStart }: { onStart: (svc: (typeof SERVICES)[0]) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (ref.current && ref.current.contains(e.target as Node)) {
        return;
      }
      setActiveCardId(null);
    };
    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick, { passive: true });
    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={ref} className="svc-grid" role="list">
      {SERVICES.map((svc, i) => {
        const tilt = i % 2 === 0 ? -3 : 3;
        return (
          <motion.div
            key={svc.id}
            role="listitem"
            initial={{
              opacity: 0,
              y: 80,
              rotateX: 18,
              rotateY: tilt * 3,
              transformPerspective: 1200,
            }}
            animate={inView ? {
              opacity: 1,
              y: 0,
              rotateX: 0,
              rotateY: 0,
            } : {}}
            transition={{
              duration: 0.95,
              delay: i * 0.12,
              ease: CARD_EASE,
            }}
          >
            <FlipCard
              svc={svc}
              onStart={() => onStart(svc)}
              isFlipped={activeCardId === svc.id}
              onFlipToggle={(flipped) => setActiveCardId(flipped ? svc.id : null)}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────── */
export default function ServicesSection() {
  const [activeModal, setActiveModal] = useState<(typeof SERVICES)[0] | null>(null);

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — Services We Offer
      ══════════════════════════════════════════════════════════ */}
      <section className="svc-section" id="services" aria-labelledby="services-heading">
        {/* diagonal grid texture */}
        <div className="svc-grid-overlay" aria-hidden="true" />

        {/* teal bloom behind title */}
        <div className="svc-bloom svc-bloom--title" aria-hidden="true" />

        <div className="svc-container">
          {/* Section header */}
          <div className="svc-header">
            <span className="svc-eyebrow">
              <span className="svc-eyebrow-line" />
              What We Do
            </span>
            <h2 className="svc-heading" id="services-heading">
              Services We Offer
            </h2>
            <p className="svc-subheading">
              Precision-crafted AI visuals, content pipelines, and immersive
              digital experiences — built for premium brands.
            </p>
          </div>

          {/* 3-column flip card grid — staggered tilt-rise on scroll */}
          <ServicesGrid onStart={setActiveModal} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — What Makes Us Different
      ══════════════════════════════════════════════════════════ */}
      <section
        className="svc-diff-section"
        id="differentiators"
        aria-labelledby="diff-heading"
      >
        <div className="svc-bloom svc-bloom--diff" aria-hidden="true" />
        <div className="svc-grid-overlay" aria-hidden="true" />

        <div className="svc-container">
          <div className="svc-header">
            <span className="svc-eyebrow">
              <span className="svc-eyebrow-line" />
              Our Edge
            </span>
            <h2 className="svc-heading" id="diff-heading">
              What Makes Us Different
            </h2>
            <p className="svc-subheading">
              Five core pillars that define the Elevique standard.
            </p>
          </div>

          {/* Asymmetrical staggered grid — 3 top / 2 bottom */}
          <div className="svc-diff-grid" role="list">
            {DIFFERENTIATORS.map((d, i) => (
              <div
                key={d.id}
                className={`svc-diff-card svc-diff-card--${i}`}
                role="listitem"
                aria-label={d.label}
              >
                <DotGrid />
                <div className="svc-diff-icon">{d.icon}</div>
                <div className="svc-diff-label">{d.label}</div>
                <div className="svc-diff-desc">{d.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MODAL
      ══════════════════════════════════════════════════════════ */}
      {activeModal && (
        <InquiryModal
          service={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
}
