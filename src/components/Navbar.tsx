"use client";

import React, { useState, useEffect, startTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { BorderBeam } from "@/components/ui/border-beam";

const navLinks = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBeam, setShowBeam] = useState(true);
  const pathname = usePathname();

  /* BorderBeam is a decorative, infinitely-looping animation rendered under
     a blurred fixed pill. On mobile GPUs that combination commonly shows up
     as a constant jitter/vibration of the whole navbar, so skip it below
     desktop widths instead of trying to tune the animation itself. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 769px)");
    setShowBeam(mq.matches);
    const handler = (e: MediaQueryListEvent) => setShowBeam(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    let ticking = false;
    let isScrolled = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      // Hysteresis: different enter/exit thresholds so momentum/rubber-band
      // scroll hovering near one value can't flip the class back and forth
      // every frame (that flicker is what reads as the navbar "shaking").
      if (!isScrolled && y > 60) {
        isScrolled = true;
        setScrolled(true);
      } else if (isScrolled && y < 30) {
        isScrolled = false;
        setScrolled(false);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { startTransition(() => setMenuOpen(false)); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* ── Floating pill wrapper ───────────────────────────── */}
      <div
        className={`navbar-wrapper${scrolled ? " navbar-wrapper--scrolled" : ""}`}
      >
        <div className="navbar-container">
          <div className="navbar-glass-layer" />
          <div className="navbar-glow" />
          {showBeam && (
            <BorderBeam size={80} thickness={3} radius={20} duration={48} colorFrom="#14b8a6b3" colorTo="#14b8a6b3" />
          )}

          <Link href="/" className="navbar-logo" style={{ overflow: "visible", display: "flex", alignItems: "center", position: "relative" }}>
            {/* SVG filter to key out the light grey background of the logo */}
            <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
              <defs>
                <filter id="remove-white-bg" colorInterpolationFilters="sRGB">
                  <feColorMatrix
                    type="matrix"
                    values="
                      1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      -6 0 0 5 0
                    "
                  />
                </filter>
              </defs>
            </svg>
            <Image
              src="/logo.png"
              alt="Elevique Logo"
              width={80}
              height={80}
              style={{
                objectFit: "contain",
                filter: "url(#remove-white-bg) brightness(2.2) contrast(1.1)",
                marginTop: "-20px",
                marginBottom: "-20px",
              }}
              priority
            />
          </Link>

          <nav className="navbar-links" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`navbar-link${pathname === link.href ? " navbar-link--active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/login" className="navbar-login" target="_blank" rel="noopener noreferrer">Login</Link>
          <Link href="/contact" className="navbar-cta">Book a Call</Link>

          <button
            type="button"
            className={`navbar-mobile-toggle${menuOpen ? " is-open" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* ── Mobile overlay ──────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="navbar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            <motion.nav
              className="navbar-mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.42, ease: EASE_OUT }}
              aria-label="Mobile navigation"
            >
              <div className="navbar-mobile-links">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.45, ease: EASE_OUT }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`navbar-mobile-link${pathname === link.href ? " navbar-mobile-link--active" : ""}`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="navbar-mobile-footer">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.33, duration: 0.45, ease: EASE_OUT }}
                >
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="navbar-mobile-login"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.45, ease: EASE_OUT }}
                >
                  <Link
                    href="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="navbar-mobile-cta"
                  >
                    <span>Book a Call</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </motion.div>

                <motion.p
                  className="navbar-mobile-tagline"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.45, ease: EASE_OUT }}
                >
                  Premium AI Visuals Studio
                </motion.p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
