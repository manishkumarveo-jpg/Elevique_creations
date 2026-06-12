"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, CheckCircle2, ArrowRight } from "lucide-react";
import "@/styles/leads.css";

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

  // Dropdown click handlers
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleSelectOption = (field: "service_type" | "videos_count" | "phone_code", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setActiveDropdown(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Basic Validation
    if (!form.full_name.trim() || !form.email.trim()) {
      setError("Please fill out both Name and Email.");
      setIsSubmitting(false);
      return;
    }

    try {
      const fullPhone = form.phone_number.trim() 
        ? `${form.phone_code} ${form.phone_number.trim()}`
        : "";

      const res = await fetch("/api/leads", {
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

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to submit form.");

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
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="leads-container-outer">
      {/* Background patterns */}
      <div className="noise-overlay" aria-hidden="true" />
      <div className="leads-grid-overlay" aria-hidden="true" />
      <div className="leads-bloom leads-bloom-top" aria-hidden="true" />
      <div className="leads-bloom leads-bloom-bottom" aria-hidden="true" />

      {/* Header */}
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

      {/* Form Container */}
      <div className="leads-card" ref={dropdownRef}>
        <AnimatePresence mode="wait">
          {sent ? (
            <div className="leads-success">
              <div className="leads-success-badge">
                <CheckCircle2 size={30} strokeWidth={1.5} />
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
            </div>
          ) : (
            <form
              className="leads-form"
              onSubmit={handleSubmit}
            >
              {error && (
                <div className="leads-error-msg">
                  ⚠️ {error}
                </div>
              )}

              {/* Row 1: Service Selection & Number of Videos */}
              <div className="leads-grid-row">
                <div className="leads-field">
                  <label>What service are you looking for?</label>
                  <div className="leads-select-wrapper">
                    <div
                      className={`leads-select-trigger ${
                        activeDropdown === "service" ? "leads-select-trigger--open" : ""
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
                        {form.service_type || "Select"}
                      </span>
                      <ChevronDown size={14} className="leads-select-trigger-chevron" />
                    </div>

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
                              className={`leads-select-option ${
                                form.service_type === s ? "leads-select-option--selected" : ""
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
                  <label>Number of videos required?</label>
                  <div className="leads-select-wrapper">
                    <div
                      className={`leads-select-trigger ${
                        activeDropdown === "videos" ? "leads-select-trigger--open" : ""
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
                        {form.videos_count || "Select"}
                      </span>
                      <ChevronDown size={14} className="leads-select-trigger-chevron" />
                    </div>

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
                              className={`leads-select-option ${
                                form.videos_count === v ? "leads-select-option--selected" : ""
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

              {/* Row 2: Budget & Project Brief */}
              <div className="leads-grid-row">
                <div className="leads-field">
                  <label>BUDGET PER VIDEO</label>
                  <input
                    type="text"
                    className="leads-input"
                    placeholder="Enter your budget"
                    value={form.budget_per_video}
                    onChange={(e) => setForm({ ...form, budget_per_video: e.target.value })}
                  />
                </div>

                <div className="leads-field">
                  <label>Tell us briefly about requirement</label>
                  <textarea
                    className="leads-textarea"
                    placeholder="goals, timeline, brand info..."
                    rows={1}
                    value={form.requirement_brief}
                    onChange={(e) => setForm({ ...form, requirement_brief: e.target.value })}
                  />
                </div>
              </div>

              {/* Contact Information Divider */}
              <div className="leads-field-group-title">Contact Information</div>

              {/* Row 3: Full Name & Email */}
              <div className="leads-grid-row">
                <div className="leads-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    className="leads-input"
                    placeholder="Your full name"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  />
                </div>

                <div className="leads-field">
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    className="leads-input"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Row 4: Phone & City */}
              <div className="leads-grid-row">
                <div className="leads-field">
                  <label>Phone Number</label>
                  <div className="leads-phone-row">
                    <div className="leads-select-wrapper leads-country-code">
                      <div
                        className={`leads-select-trigger ${
                          activeDropdown === "phone" ? "leads-select-trigger--open" : ""
                        }`}
                        onClick={() => toggleDropdown("phone")}
                        style={{ paddingLeft: "10px", paddingRight: "10px" }}
                      >
                        <span className="leads-select-trigger-text">
                          {form.phone_code}
                        </span>
                        <ChevronDown size={12} className="leads-select-trigger-chevron" />
                      </div>

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
                                className={`leads-select-option ${
                                  form.phone_code === c.code ? "leads-select-option--selected" : ""
                                }`}
                                onClick={() => handleSelectOption("phone_code", c.code)}
                              >
                                <span style={{ fontSize: "0.78rem" }}>{c.label}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="leads-phone-input-wrapper">
                      <input
                        type="tel"
                        className="leads-input"
                        placeholder="Phone number"
                        value={form.phone_number}
                        onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="leads-field">
                  <label>City</label>
                  <input
                    type="text"
                    className="leads-input"
                    placeholder="Enter your city"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>
              </div>

              {/* Row 5: Company Name & Website */}
              <div className="leads-grid-row">
                <div className="leads-field">
                  <label>Company Name</label>
                  <input
                    type="text"
                    className="leads-input"
                    placeholder="Enter company name"
                    value={form.company_name}
                    onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  />
                </div>

                <div className="leads-field">
                  <label>Website</label>
                  <input
                    type="url"
                    className="leads-input"
                    placeholder="https://yourwebsite.com"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                  />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="leads-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Inquiry"}
                {!isSubmitting && <ArrowRight size={14} />}
              </button>
            </form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
