"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, CheckCircle2, ArrowRight } from "lucide-react";

const SERVICES = [
  "AI Video Ads",
  "Portfolio/Campaign shoot",
  "Premium Brand film",
  "Social media content & management",
];

const VIDEO_COUNTS = [
  "1-2 videos",
  "3-5 videos",
  "6-10 videos",
  "10+ videos",
];

const COUNTRY_CODES = [
  { code: "+91", label: "IN +91" },
  { code: "+1", label: "US +1" },
  { code: "+44", label: "UK +44" },
  { code: "+971", label: "AE +971" },
];

export default function LeadsLandingPage() {
  const [form, setForm] = useState({
    service_type: "",
    videos_count: "",
    budget_per_video: "",
    requirement_brief: "",
    full_name: "",
    email: "",
    phone_code: "+91",
    phone_number: "",
    city: "",
    company_name: "",
    website: "",
  });

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  // Close active dropdown when clicking outside the form card container
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleSelectOption = (field: "service_type" | "videos_count" | "phone_code", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setActiveDropdown(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Basic client side validation matching contact schema expectations
    if (!form.full_name.trim() || !form.email.trim()) {
      setError("Please enter both Name and Email.");
      setIsSubmitting(false);
      return;
    }

    try {
      const fullPhone = form.phone_number.trim()
        ? `${form.phone_code} ${form.phone_number.trim()}`
        : "";

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_type: form.service_type || null,
          videos_count: form.videos_count || null,
          budget_per_video: form.budget_per_video.trim() || null,
          requirement_brief: form.requirement_brief.trim() || null,
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          phone: fullPhone || null,
          city: form.city.trim() || null,
          company_name: form.company_name.trim() || null,
          website: form.website.trim() || null,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to submit lead submission.");
      }

      setSent(true);
      setForm({
        service_type: "",
        videos_count: "",
        budget_per_video: "",
        requirement_brief: "",
        full_name: "",
        email: "",
        phone_code: "+91",
        phone_number: "",
        city: "",
        company_name: "",
        website: "",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="leads-container-outer">
      {/* Decorative patterns */}
      <div className="leads-grid-overlay" aria-hidden="true" />
      <div className="leads-bloom leads-bloom-top" aria-hidden="true" />
      <div className="leads-bloom leads-bloom-bottom" aria-hidden="true" />

      {/* Header section */}
      <header className="leads-header">
        <Link href="/" className="leads-logo">
          Elevique
        </Link>
        <div className="leads-eyebrow">
          <span className="leads-eyebrow-dot" />
          Start a Project
        </div>
        <h1 className="leads-title">Premium AI Visuals for Branding</h1>
        <p className="leads-subtitle">
          Ultra-realistic, ROI-driven high-quality AI generated visuals for your brand without expensive shoots.
        </p>
      </header>

      {/* Glassmorphic Form Card Wrapper */}
      <div className="leads-card" ref={cardRef}>
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              className="leads-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className="leads-success-badge">
                <CheckCircle2 size={32} strokeWidth={1.5} />
              </div>
              <h2 className="leads-success-title">Inquiry Submitted</h2>
              <p className="leads-success-body">
                Thank you for reaching out. We have received your parameters and will get back to you within 24 hours.
              </p>

              <div className="leads-success-actions">
                <Link href="/portfolio" className="btn-leads-portfolio">
                  Visit Portfolio
                </Link>
                <Link href="/" className="btn-leads-main">
                  Visit Main Site
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              className="leads-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {error && (
                <div className="leads-error-msg" role="alert">
                  ⚠️ <span>{error}</span>
                </div>
              )}

              {/* Row 1: Service Selection & Number of Videos */}
              <div className="leads-grid-row">
                <div className="leads-field">
                  <label htmlFor="service-type">What service are you looking for?</label>
                  <div className="leads-select-wrapper">
                    <button
                      id="service-type"
                      type="button"
                      className={`leads-select-trigger ${activeDropdown === "service" ? "leads-select-trigger--open" : ""
                        }`}
                      onClick={() => toggleDropdown("service")}
                    >
                      <span
                        className={
                          form.service_type
                            ? "leads-select-trigger-text"
                            : "leads-select-trigger-placeholder"
                        }
                      >
                        {form.service_type || "Select a service"}
                      </span>
                      <ChevronDown size={15} className="leads-select-trigger-chevron" />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === "service" && (
                        <motion.div
                          className="leads-select-options"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                        >
                          {SERVICES.map((s) => (
                            <div
                              key={s}
                              className={`leads-select-option ${form.service_type === s ? "leads-select-option--selected" : ""
                                }`}
                              onClick={() => handleSelectOption("service_type", s)}
                            >
                              <span style={{ flex: 1 }}>{s}</span>
                              {form.service_type === s && <Check size={12} />}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="leads-field">
                  <label htmlFor="videos-count">Number of videos required?</label>
                  <div className="leads-select-wrapper">
                    <button
                      id="videos-count"
                      type="button"
                      className={`leads-select-trigger ${activeDropdown === "videos" ? "leads-select-trigger--open" : ""
                        }`}
                      onClick={() => toggleDropdown("videos")}
                    >
                      <span
                        className={
                          form.videos_count
                            ? "leads-select-trigger-text"
                            : "leads-select-trigger-placeholder"
                        }
                      >
                        {form.videos_count || "Select video count"}
                      </span>
                      <ChevronDown size={15} className="leads-select-trigger-chevron" />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === "videos" && (
                        <motion.div
                          className="leads-select-options"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                        >
                          {VIDEO_COUNTS.map((v) => (
                            <div
                              key={v}
                              className={`leads-select-option ${form.videos_count === v ? "leads-select-option--selected" : ""
                                }`}
                              onClick={() => handleSelectOption("videos_count", v)}
                            >
                              <span style={{ flex: 1 }}>{v}</span>
                              {form.videos_count === v && <Check size={12} />}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Row 2: Budget & Brief */}
              <div className="leads-grid-row">
                <div className="leads-field">
                  <label htmlFor="budget-per-video">Budget Per Video</label>
                  <input
                    id="budget-per-video"
                    type="text"
                    className="leads-input"
                    placeholder="Enter your budget"
                    value={form.budget_per_video}
                    onChange={(e) => setForm((prev) => ({ ...prev, budget_per_video: e.target.value }))}
                  />
                </div>

                <div className="leads-field">
                  <label htmlFor="requirement-brief">Brief Requirement</label>
                  <textarea
                    id="requirement-brief"
                    className="leads-textarea"
                    placeholder="goals, timeline, brand info..."
                    rows={1}
                    value={form.requirement_brief}
                    onChange={(e) => setForm((prev) => ({ ...prev, requirement_brief: e.target.value }))}
                  />
                </div>
              </div>

              {/* Contact Information Divider */}
              <div className="leads-field-group-title">Contact Information</div>

              {/* Row 3: Name & Email */}
              <div className="leads-grid-row">
                <div className="leads-field">
                  <label htmlFor="full-name">Full Name *</label>
                  <input
                    id="full-name"
                    type="text"
                    required
                    className="leads-input"
                    placeholder="Your full name"
                    value={form.full_name}
                    onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
                  />
                </div>

                <div className="leads-field">
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="leads-input"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              {/* Row 4: Phone & City */}
              <div className="leads-grid-row">
                <div className="leads-field">
                  <label htmlFor="phone-number">Phone Number</label>
                  <div className="leads-phone-row">
                    <div className="leads-select-wrapper leads-country-code">
                      <button
                        type="button"
                        className={`leads-select-trigger ${activeDropdown === "phone" ? "leads-select-trigger--open" : ""
                          }`}
                        onClick={() => toggleDropdown("phone")}
                        style={{ paddingLeft: "12px", paddingRight: "12px" }}
                      >
                        <span className="leads-select-trigger-text">
                          {form.phone_code}
                        </span>
                        <ChevronDown size={13} className="leads-select-trigger-chevron" />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === "phone" && (
                          <motion.div
                            className="leads-select-options"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15 }}
                          >
                            {COUNTRY_CODES.map((c) => (
                              <div
                                key={c.code}
                                className={`leads-select-option ${form.phone_code === c.code ? "leads-select-option--selected" : ""
                                  }`}
                                onClick={() => handleSelectOption("phone_code", c.code)}
                              >
                                <span style={{ fontSize: "0.8rem" }}>{c.label}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="leads-phone-input-wrapper">
                      <input
                        id="phone-number"
                        type="tel"
                        className="leads-input"
                        placeholder="Phone number"
                        value={form.phone_number}
                        onChange={(e) => setForm((prev) => ({ ...prev, phone_number: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="leads-field">
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    type="text"
                    className="leads-input"
                    placeholder="Enter your city"
                    value={form.city}
                    onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                  />
                </div>
              </div>

              {/* Row 5: Company Name & Website */}
              <div className="leads-grid-row">
                <div className="leads-field">
                  <label htmlFor="company-name">Company Name</label>
                  <input
                    id="company-name"
                    type="text"
                    className="leads-input"
                    placeholder="Enter company name"
                    value={form.company_name}
                    onChange={(e) => setForm((prev) => ({ ...prev, company_name: e.target.value }))}
                  />
                </div>

                <div className="leads-field">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    type="url"
                    className="leads-input"
                    placeholder="https://yourwebsite.com"
                    value={form.website}
                    onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="leads-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Inquiry"}
                {!isSubmitting && <ArrowRight size={15} />}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
