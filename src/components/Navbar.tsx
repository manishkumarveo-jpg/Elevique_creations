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
        className={`navbar ${scrolled ? "navbar--scrolled" : ""} ${menuOpen ? "navbar--menu-open" : ""}`}
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
               className="fixed inset-0 w-full min-h-[100dvh] bg-[#020203] z-[1001] flex flex-col justify-center items-center overflow-y-auto px-6 py-28"
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               transition={{ duration: 0.42, ease: EASE_OUT }}
               aria-label="Mobile navigation"
             >
               {/* Links */}
               <div className="flex flex-col items-center gap-8 w-full max-w-sm">
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
                       className={`block text-3xl sm:text-4xl font-light uppercase tracking-[0.1em] no-underline transition-colors duration-300 ${
                         pathname === link.href
                           ? "text-[var(--gold)]"
                           : "text-white/60 hover:text-white"
                       }`}
                     >
                       {link.label}
                     </Link>
                   </motion.div>
                 ))}
               </div>
 
               {/* Drawer Footer Connect / CTA */}
               <div className="flex flex-col items-center gap-10 mt-16 w-full max-w-sm">
                 {/* CTA */}
                 <motion.div
                   initial={{ opacity: 0, y: 12 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.35, duration: 0.45, ease: EASE_OUT }}
                 >
                   <Link
                     href="#contact"
                     onClick={() => setMenuOpen(false)}
                     className="inline-flex items-center justify-center gap-3 px-8 py-4 text-[0.75rem] font-bold tracking-[0.2em] uppercase no-underline text-[var(--black)] bg-white rounded-full transition-all duration-300 hover:bg-white/90"
                   >
                     <span>Start Project</span>
                     <span aria-hidden="true">→</span>
                   </Link>
                 </motion.div>

                 {/* Fine-print details */}
                 <motion.div
                   className="flex flex-col items-center gap-4 text-white/40 text-[0.65rem] tracking-[0.15em] uppercase text-center w-full"
                   initial={{ opacity: 0, y: 12 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.45, duration: 0.45, ease: EASE_OUT }}
                 >
                   <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
                     <Link href="mailto:hello@elevique.com" className="hover:text-white transition-colors">hello@elevique.com</Link>
                     <span className="hidden sm:inline opacity-50">|</span>
                     <span>+1 (555) 123-4567</span>
                   </div>
                   <div className="flex gap-6 mt-2">
                     <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
                     <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
                     <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
                   </div>
                 </motion.div>
               </div>
             </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
