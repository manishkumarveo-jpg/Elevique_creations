"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services",  href: "#services"  },
  { label: "About",     href: "#about"     },
  { label: "Contact",   href: "#contact"   },
];

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
      >
        <Link href="/" className="navbar-brand">Elevique</Link>

        <nav className="navbar-links" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "nav-link--active" : ""}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="#contact" className="navbar-cta">Start Project</Link>

        {/* Hamburger — spans animate to X via Tailwind conditional transforms */}
        <button
          className="nav-hamburger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={`transition-all duration-300 ${menuOpen ? "translate-y-[6.5px] rotate-45" : ""}`} />
          <span className={`transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`transition-all duration-300 ${menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
        </button>
      </motion.header>

      {/* ── Mobile drawer ───────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.nav
              className="fixed top-0 right-0 w-[min(320px,85vw)] h-dvh bg-[rgba(8,8,10,0.97)] border-l border-white/[0.07] z-[1001] flex flex-col justify-center px-8 py-10 gap-10"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.42, ease: EASE_OUT }}
              aria-label="Mobile navigation"
            >
              {/* Links */}
              <div className="flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.38, ease: EASE_OUT }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`block text-[1.35rem] font-bold uppercase no-underline py-3 border-b border-white/[0.07] transition-colors duration-200 ${
                        pathname === link.href
                          ? "text-[var(--gold)]"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.38, ease: EASE_OUT }}
              >
                <Link
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 text-[0.65rem] font-bold tracking-[0.18em] uppercase no-underline text-[var(--black)] bg-white rounded-full border border-white transition-all duration-300 hover:bg-[var(--gold)] hover:border-[var(--gold)]"
                >
                  <span>Start Project</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
