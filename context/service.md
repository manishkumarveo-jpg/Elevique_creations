


Services & Differentiators Specification — Next.js 15 + TS + GSAP
This document details the visual guidelines, grid configurations, 3D interactive flip animations, and component layouts for the Services and Differentiators sections of the website.

1. Visual Style & Global Tokens
Background Base: Solid deep black background (#000000).
Texture Overlay: Subtle diagonal grid overlay lines spanning the sections.
Accents & Blooms: Glowing teal backdrop blur layers (radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 60%)) positioned behind titles.
Card Composition (Glassmorphism):
Background surface: Translucent dark grey (rgba(20, 20, 20, 0.45)).
Backdrop Blur: backdrop-filter: blur(12px).
Borders: Thin 1px border frame using semi-transparent white/border metrics (border border-white/10).
Shadows: Soft glow drops styled in a subtle teal shadow tint.
Typography: Hanken Grotesk (Modern, geometric, high-readability sans-serif) configured across all headers, badges, and body descriptions.
2. Layout Structure & Animation Zones
Section 1 — Services We Offer
Grid Layout: Responsive 3-column CSS grid (grid-cols-1 md:grid-cols-3 gap-6).
Interactive 3D Flip Cards:
Cards implement a high-perspective container (perspective: 2000px) and transform-style: preserve-3d to render physical depth.
Hovering a card triggers a smooth, 180-degree rotation along the Y-axis (transform: rotateY(180deg)) using a GSAP timeline or pure CSS easing (0.6s cubic-bezier(0.16, 1, 0.3, 1)).
Front Side Card Layout:
Icon: Large white geometric icon placed at the top-left (Lucide icons).
Heading: Bold, uppercase service title (Outfit/Hanken Grotesk, e.g., AI VIDEO ADS, CONTENT CREATION, IMMERSIVE ENGINEERING).
Prompt: A "Hover to learn more" badge anchored at the bottom-right with a moving chevron arrow.
Back Side Card Layout (Flipped 180 degrees, hidden via backface-visibility: hidden):
Synopsis: Centered, high-contrast white text providing a detailed breakdown of deliverables and studio capabilities.
CTA Trigger: A prominent, glassmorphic Start Now button positioned at the bottom center.
Start Query Modal:
Clicking the Start Now button on any card flips open a dark, glassmorphic project inquiry form modal to capture lead information.
Section 2 — What Makes Us Different (Differentiators)
Title Accent: A large centered section header (What Makes Us Different) highlighted with a subtle glowing teal bloom positioned behind the text.
Asymmetrical Grid:
A staggered, asymmetrical grid array displaying 5 distinct cards.
Column alignment leverages responsive flex-wrapping or a custom CSS Grid layout mapping to maintain grid stagger.
Differentiator Cards:
Simple, minimalist glass cards containing:
Custom white geometric icon matching the domain.
Large bold label.
The 5 Core Pillars:
Realistic AI: Highly integrated neural styling pipelines.
Cinematic Quality: High-contrast digital asset finishes.
Speed & Efficiency: Render builds completed in short turnarounds.
Creative Storytelling: Scripting, styling, and visual frameworks.
Premium Integration: Standard API, Next.js, and database sync pipelines.