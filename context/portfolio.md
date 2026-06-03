Build a Netflix-inspired cinematic portfolio section for an AI creative agency website using React and Tailwind CSS.

Hero (88vh, full-bleed video):

Autoplay, muted, looped <video> covering the full hero area with object-cover
Three overlay layers: (1) a per-project colour tint gradient linear-gradient(135deg, colorFrom at 30% opacity, colorTo at 20% opacity, transparent 60%), (2) bg-gradient-to-t from-background at the bottom, (3) bg-gradient-to-r from-background/80 on the left
Top-left: a small — Portfolio section label in uppercase, spaced tracking, muted opacity
Bottom-left: project category badge (pill, coloured border + tinted bg), massive bold title (text-7xl), short description, two CTA buttons — "Watch Film" (solid white, rounded-full) and "View Case Study" (frosted glass border, rounded-full)
Featured Projects row (below hero, pt-6):

Horizontally scrollable flex row, no scrollbar visible
Each card: 390×220px, rounded-xl, looping muted video fill (object-cover), a gradient-to-top from-black overlay at 75% opacity, project title and category text at the bottom-left
Active card has a glowing coloured border (box-shadow: 0 0 18px 2px colorFrom at 55% opacity) — clicking a card swaps the hero content to that project via state
Portfolio section grid (below featured):

Bold text-3xl "Portfolio section" heading
4-column CSS grid, 220px row height, gap-4
Each cell: looping muted video, gradient-to-bottom from-transparent to-black overlay, year top-left, title and category bottom-left, no border radius
On hover (350ms delay): a 300px wide popup card appears centred over the card via GSAP (xPercent: -50, yPercent: -50, scale from 0.9→1) showing a video preview (same video, mute-toggleable), play/add/like icon buttons, category badge, title, year badge, and a "More info" expand chevron
Only one popup visible at a time; 120ms grace period when moving between card and popup
Clicking a grid card or the play button inside the popup opens a full modal
Modal:

Fixed overlay, backdrop-blur-2xl, bg-black/85
Modal card: max-w-680px, rounded-3xl, dark background #111118
Header: 210px tall video (autoplay, muted, looped) with per-project colour tint overlay and a bottom fade gradient; close button top-right
Body: category badge + year, project title (text-3xl bold), role, About paragraph, Tech Stack pill tags, two action buttons — "Watch Full Film" (coloured bg) and "Open Case Study" (ghost)
Opens/closes with GSAP scale+opacity animation; Escape key closes
Data model per project: id, title, category, year, role, description, techStack[], thumbnail, previewVideo, fullVideo, colorFrom, colorTo

Tech: React with useState/useEffect/useRef/useCallback, GSAP (plain gsap, not @gsap/react), Lucide React icons (Play, X, ExternalLink, Info, Plus, ThumbsUp, VolumeX, Volume2), Tailwind CSS, Space Grotesk font. Background colour #0a0a0f. All video sources point to the same Cloudinary MP4 URL.