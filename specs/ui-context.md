# UI Context
> Elevique Client Portal · Visual Style Guide, Branding Colors, and Component States

This specification details the visual styles, branding tokens, styling variables, and interface states that build the Elevique user experience.

---

## 1. HSL Design System Tokens

Elevique operates a dark color theme, using HSL values to maintain color consistency across layouts.

### Primary Colors
- **Background (`--black`)**: `#050505` (Pure dark canvas)
- **Foreground (`--white`)**: `#ffffff` (Clean typography contrast)
- **Accent Purple (`--glass-glow`)**: HSL `262, 83%, 58%` with transparent opacities.
- **Teal highlights (`--p-t1`)**: HSL `174, 90%, 41%` used for successful status badges, buttons, and links.

### Glassmorphic Tokens
To render the premium card look, containers implement the following CSS specifications:
- **Background**: `rgba(255, 255, 255, 0.03)`
- **Border**: `1px solid rgba(255, 255, 255, 0.08)`
- **Backdrop Blur**: `backdrop-filter: blur(12px)`
- **Accent Glow**: Shadow offsets projecting `--glass-glow` HSL highlights on hover.

---

## 2. Typography Hierarchy

- **Title Fonts**: Google Fonts **Outfit** (weight 800) for headers. Character tracking set to `0.15em` with uppercase transformation.
- **Body Fonts**: Google Fonts **Outfit** (weight 400) for clean text rendering on dark backgrounds.
- **Code/Labels**: Monospace families configured for timestamps, user IDs, and activity feed tags.

---

## 3. Interactive Component States

### Standard Button states (`btn-primary`)
- **Idle**: Purple background gradient, white text, uppercase tracking.
- **Hover**: Scale factor 1.02, smooth box-shadow glow, transition duration `200ms`.
- **Focus**: Outer white ring border to support keyboard accessibility.
- **Disabled**: Grey opacity (`opacity-50`), cursor pointer blocked.

### Navigation Sidebars
- Fixed desktop position width `260px` with a frosted border on the right.
- Active items highlight with a left-aligned vertical line matching the purple accent.
