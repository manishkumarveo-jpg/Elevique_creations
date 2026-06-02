Hero Section - "The Cinematic Gateway"
The entry experience is inspired by premium interactive cinematic websites (like the user reference). It utilizes a high-contrast looping background video overlayed with premium, clean display typography, a glassmorphic floating navbar, and custom control utilities.

1. Structural Elements
Looping Video Background: A <video> element set to autoplay, loop, muted, and playsinline spanning the entire viewport (width: 100vw; height: 100vh; object-fit: cover;).
Dark Vignette Overlay: A gradient layer (.hero-overlay) sitting on top of the video to ensure maximum text readability:
Left-heavy gradient overlay: linear-gradient(to right, rgba(8, 7, 13, 0.85) 0%, rgba(8, 7, 13, 0.4) 50%, rgba(8, 7, 13, 0.1) 100%)
Bottom vignette overlay: linear-gradient(to top, rgba(8, 7, 13, 0.9) 0%, transparent 40%)
Volume Controller Toggle: A persistent round button in the bottom-right corner (id="sound-toggle") with dynamic speaker icons to toggle video sound on/off (if audio track exists).
2. Transparent Floating Navbar
A clean, minimal, sticky navigation bar (<header> with position: absolute; top: 0; left: 0; width: 100%;) featuring:

Left Side (Brand Identity): A clean logo mark combined with the name AURA in uppercase (Outfit font, heavy weight).
Center (Navigation Links): Spaced navigation links (EXPERIENCE, THE SERVICES, PORTFOLIO, ABOUT US) in uppercase, small font-size, heavy tracking (letter-spacing: 0.15em), fading color transitions on hover.
Right Side (Call to Action):
A pill-button with a sliding arrow icon: Start Project ➔ (.btn-nav-cta).
A mobile hamburger menu icon visible only on responsive mobile breaklines.
3. Typography & Text Hierarchy (Left-Aligned)
Category Tag: A small uppercase text label enclosed in a thin glassmorphic container:
text

DIRECTOR'S CUT
Headline: Extra large, bold display title (Outfit or matching premium sans-serif):
text

The Art of Immersive Space
Styled in clean white (#f8fafc) with a tight letter-spacing (-0.03em) and line-height (1.05).
Description Paragraph: High readability text block:
text

A mesmerizing journey through digital craft and interactive design. Witness detail and creativity merge, frame by frame.
Call-to-Action Buttons:
Main button: Immerse Now inside a premium pill-shaped translucent button (.btn-hero-primary) that glows subtly on hover.
Secondary scroll prompt: SCROLL TO EXPLORE stacked above a moving vertical line keyframe animation.