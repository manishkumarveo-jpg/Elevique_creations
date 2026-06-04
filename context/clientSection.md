Build an interactive "Clients across India" map section for my website.

## What it is
A premium, dark, minimal map of India. Most states sit quietly in the background;
5 client locations are highlighted with glowing pin markers. Hovering a pin shows a
small glassy tooltip with the client name, city, and "client since" year. It's a
trust/credibility section — calm and high-end, NOT a data dashboard.

## Tech context
- Detect my stack first. If this is a React/Next/Vue app, build it as a reusable
  component using my existing conventions (TS if the repo uses TS, my styling system —
   / Tailwind / styled-components — match what's already here). If it's a
  plain static site, build a single self-contained section.
- Use d3-geo for the projection + path generation, and topojson-client to dissolve
  district geometry into clean state shapes. Install `d3-geo` and `topojson-client`
  (or load from CDN for a static site).
- Render real SVG <path> elements (one per state). Do NOT hand-draw the map.

## Map data (important)
Source TopoJSON (district-level, 36 states via `st_nm` property):
  https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@ef25ebc/topojson/india.json

The file is district-level, so you MUST dissolve districts into states or you'll get
hundreds of internal borders. Do it like this:

  import { merge } from "topojson-client";
  // topo.objects has one key ("districts"); group its geometries by properties.st_nm,
  // then for each state: { type:"Feature", properties:{ st_nm:name },
  //   geometry: merge(topo, geomsForThatState) }
  // Collect into a FeatureCollection of 36 features.

Then project with d3.geoMercator().fitExtent([[44,44],[W-44,H-64]], featureCollection)
into a fixed viewBox (e.g. 1000×1080) and let the SVG scale responsively
(width:100%, height:auto, preserveAspectRatio="xMidYMid meet").

Bundle the dissolved GeoJSON as a static asset at build time if you can, so the page
doesn't fetch from a CDN at runtime. Fall back to runtime fetch only if that's simpler.

## The 5 clients (placeholder — keep them in one editable array at the top)
Match each to a state by a keyword, and place a marker at the state's path centroid.
  [
    { match:"delhi",       name:"Vantage Media", city:"New Delhi", since:"2021" },
    { match:"rajasthan",   name:"Forge Labs",    city:"Jaipur",    since:"2022" },
    { match:"bengal",      name:"Meridian Co.",  city:"Kolkata",   since:"2020" },
    { match:"maharashtra", name:"Atlas Group",   city:"Mumbai",    since:"2019" },
    { match:"tamil",       name:"Nimbus AI",     city:"Chennai",   since:"2023" },
  ]
(I'll swap these for my real clients later — make them trivially editable.)

## Visual design (dark premium)
Tokens:
  --bg gradient:   radial-gradient(120% 80% at 50% 18%, #101725 0%, #080b11 58%, #05070b 100%)
  --state (base):  subtle deterministic shades from ["#111a26","#141e2c","#172433"]
                   (pick per-state by a hash of the name, for gentle texture)
  --state-hi:      #2b405d   (the 5 client states are this brighter blue)
  --line:          rgba(150,180,230,.10), 0.7px, vector-effect:non-scaling-stroke
  --line-hi:       rgba(128,164,240,.45), 1px  (client states)
  --accent:        #7aa2ff
  --text #e8edf6  --muted #8a97ab  --faint #5b6678
Fonts: "Hanken Grotesk" for UI, "JetBrains Mono" for the small meta line.

Markers (per client, at the state centroid, group translated to centroid):
  - two pulsing rings: <circle> stroke=accent, animated
      @keyframes ping { 0%{scale(1);opacity:.55} 70%{opacity:0} 100%{scale(3.4);opacity:0} }
      2.8s infinite, second ring delayed 1.4s; transform-box:fill-box; transform-origin:center
  - a soft halo: circle r≈9.5 fill=accent opacity .16, drop-shadow(0 0 6px accent)
  - a light disc: circle r≈6 fill #d4def5
  - a dark core:  circle r≈2.2 fill #0a0e16 (grows to r=3 on hover)
  - Respect prefers-reduced-motion: disable the ping animation.

Tooltip (on pin hover AND on highlighted-state hover):
  Glass card — bg rgba(13,18,28,.92), backdrop-blur(10px), 1px var(--line-hi) border,
  12px radius, soft shadow. Contents:
    line 1: client name (14px, 600)
    line 2: small accent dot + "{city} · {state}" (11.5px, muted)
    line 3 (divider above): mono "CLIENT SINCE {year}" (10.5px, faint)
  Position it near the cursor, clamped inside the map container. pointer-events:none.

Optional header above the map (easy to remove):
  eyebrow "OUR CLIENTS" (accent, letter-spacing), h2 "Trusted by teams across India",
  one muted subline. Plus a tiny legend chip: a pin swatch + "Active client locations".

## Interactions & a11y
- Only the 5 client states + their pins are interactive (cursor:pointer, hover tooltip).
- Non-client states are inert background.
- Keyboard: make pins focusable (tabindex), show the tooltip on focus too, and give each
  an aria-label like "Atlas Group, Mumbai, client since 2019".
- Fully responsive; map scales with the container, header/legend reflow on mobile.

## Deliverable
A drop-in section/component I can place anywhere on a page, with the CLIENTS array and
the color tokens clearly exposed at the top for easy editing. Keep it dependency-light
and match my repo's existing patterns.