# 02A — Landing Page
> Elevique Client Portal · Landing Page Components, Layouts, and Animations

This specification defines the public landing page experience for Elevique, detailing the sections, visual accents, responsive features, and cinematic micro-interactions.

---

## 1. Landing Page Section Matrix

The page layout consists of 7 sections designed to flow sequentially, with dynamic scroll triggers and video backdrops:

| Section | Component Name | Description | Key Interactive Element |
|---|---|---|---|
| **0. Navbar** | `Navbar` | Premium glassy fixed header with branding and action routes. | Hover indicators, portal links dropdown |
| **1. Hero** | `HeroSection` | Cinematic backdrop showing an AI video montage with titles and a lightbox showreel. | Parallax scroll, Looping Phrase text reveal, count-up trust stats |
| **2. Services** | `ServicesSection` | Three service columns: Creative AI Visuals, Brand Ad Campaigns, CGI/3D. | Hover cards with dynamic glowing borders |
| **3. Process** | `ProcessSection` | Four-step studio process: Briefing, Scripting, Production, Delivery. | Custom scroll timeline tracker |
| **4. Testimonials** | `TestimonialsEditorial` | Editorial review grid featuring verified brand feedback. | Grid masonry layout |
| **5. Clients Map** | `ClientsMap` | Interactive D3-geo SVG globe visual mapping worldwide brand reach. | ThreeJS/D3 3D Globe with active project markers |
| **6. Contact** | `ContactSection` | Secure public request submission form. | Captcha token integration, validation response |

---

## 2. Animation & Rendering System

Elevique leverages advanced visual animation wrappers to present a premium experience:
1. **Lenis Smooth Scroll** (`SmoothScrollProvider`):
   - Integrates normalized mouse wheel/trackpad scrolling for uniform speeds across browsers.
2. **GSAP & Framer Motion Integration**:
   - Staggered entrances for text blocks.
   - Screen-space cursor glows following the client mouse coordinates.
   - Cinema easing cubic-beziers: `[0.77, 0, 0.175, 1]` for dramatic reveals.
3. **Looping Phrase Engine**:
   - AnimatePresence cycle to rotate header arguments: `"Look Like AI" → "Cost a Fortune" → "Take Weeks"`.

---

## 3. SEO & Structural Best Practices

- **Semantic HTML**: Nested inside semantic `<main>`, `<section>`, and `<header>` tags with accurate `aria-label` tags on buttons.
- **Single Heading Hierarchy**: A single, prominent `<h1>` tag in the hero with secondary `<h2>` markers mapping the section boundaries.
- **Fast Load Dynamics**: Lower fold sections are dynamically imported using Next.js `dynamic()` to minimize the initial JS bundle size and preserve Core Web Vitals.
