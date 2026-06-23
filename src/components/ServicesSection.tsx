"use client";

import { useState } from "react";
import { StaggerContainer, StaggerItem } from "@/components/shared/StaggerGroup";
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

/* ─── Flip Card — pure CSS hover, no React state ───────────────── */
function FlipCard({ svc, onStart }: { svc: (typeof SERVICES)[0]; onStart: () => void }) {
  return (
    <div
      className="svc-flip-wrapper"
      role="article"
      aria-label={`Service: ${svc.title}`}
    >
      <div className="svc-flip-inner">
        {/* ── FRONT ── */}
        <div className="svc-card svc-card--front">
          <DotGrid />
          <div className="svc-card-icon">{svc.icon}</div>
          <h3 className="svc-card-title">{svc.title}</h3>
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
            className="svc-card-cta"
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
            aria-label={`Start project for ${svc.title}`}
          >
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Grid ───────────────────────────────────────────────────────── */
function ServicesGrid({ onStart }: { onStart: (svc: (typeof SERVICES)[0]) => void }) {
  return (
    <div className="svc-grid" role="list">
      {SERVICES.map((svc) => (
        <div key={svc.id} role="listitem">
          <FlipCard svc={svc} onStart={() => onStart(svc)} />
        </div>
      ))}
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

          {/* 3-column flip card grid */}
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
          <StaggerContainer>
            <div className="svc-diff-grid" role="list">
              {DIFFERENTIATORS.map((d, i) => (
                <StaggerItem
                  key={d.id}
                  direction={i < 3 ? "up" : "scale"}
                  className={`svc-diff-card svc-diff-card--${i}`}
                >
                  <div role="listitem" aria-label={d.label}>
                    <DotGrid />
                    <div className="svc-diff-icon">{d.icon}</div>
                    <div className="svc-diff-label">{d.label}</div>
                    <div className="svc-diff-desc">{d.desc}</div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
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
