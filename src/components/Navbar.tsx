"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import "./ui/navbar.css";

const navLinks = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services",  href: "/services"  },
  { label: "Process",   href: "/process"   },
  { label: "About",     href: "/about"     },
  { label: "Contact",   href: "/contact"   },
];

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [navOpacity, setNavOpacity] = useState(1);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setNavOpacity(Math.max(0.35, 1 - y / 380));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* ── Floating pill wrapper ───────────────────────────── */}
      <div
        className={`navbar-wrapper${scrolled ? " navbar-wrapper--scrolled" : ""}`}
        style={{ "--nb-wrapper-opacity": navOpacity } as React.CSSProperties}
      >
        <div className="navbar-container">
          <div className="navbar-glass-layer" />
          <div className="navbar-glow" />

          <Link href="/" className="navbar-logo">Elevique</Link>

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
