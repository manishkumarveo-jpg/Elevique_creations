# Progress Tracker
> Elevique Client Portal · Implementation Milestones and Active Task Status

This document tracks the active progress of features across the website and client portal.

---

## 1. Project Implementation Matrix

### Phase 1: Database & Core Infrastructure
- [x] Create database migrations (Tables, Constraints, Custom Types)
- [x] Configure Postgres trigger function (Auto-seeding milestones, folders, checklist)
- [x] Implement database indexes for query performance optimization
- [x] Apply Row Level Security (RLS) policies to all 9 core tables
- [x] Generate TypeScript type profiles via Supabase CLI

### Phase 2: Next.js Architecture & Routing
- [x] Bootstrap Next.js 16 + Tailwind CSS v4 environment
- [x] Setup three-portal layout directory routing (`/admin`, `/team`, `/portal`)
- [x] Configure cookie-based Edge session refresh and route guards in `middleware.ts`
- [x] Integrate rate limiting via Upstash Redis REST connection
- [x] Add Sentry error profiling and diagnostic reporting hooks

### Phase 3: Public Website
- [x] Implement Hero section with loop transitions and video background
- [x] Design Services card layouts and animations (GSAP/Framer Motion)
- [x] Embed Lenis Smooth Scroll container
- [x] Code process timeline component
- [x] Set up contact submission actions and RLS anonymous write capabilities
- [x] Add Portfolio Reels feed with mobile-first vertical video layout
- [x] Add Packages section with three-tier tab navigation inside FeaturedShowcase
- [x] Implement view-mode switcher (Grid / Reels / Packages) as shared extracted component
- [x] Hide Navbar on mobile when reels mode is active
- [x] Animate ServicesSection with new grid card layout and flip interactions
- [x] Improve ProcessSection responsiveness and card hover effects

### Phase 4: Collaboration Portals (Admin, Team, Client)
- [x] Build Admin Dashboard widgets (circular progress, alert bars, activity feed)
- [x] Implement Team project scopes (assigned-only listings)
- [x] Configure virtual folders and uploader link forms (`AddLinkForm`)
- [x] Code Deliverables client approval loop (`approved` / `shared` with `revision_note`)
- [x] Code thread-based project messaging with Supabase Realtime channel updates
- [x] Integrate Resend transactional onboarding and update notifications
- [x] Add append-only global project revisions log

### Phase 5: Performance & Code Quality
- [x] Reduce font weight variants (Syne 5→2, Space Grotesk 5→2, Geist Mono 3→1) to cut HTTP requests
- [x] Pause Three.js `AboutScene3D` canvas when off-screen via `IntersectionObserver` + `frameloop="demand"`
- [x] Add `performance={{ min: 0.5 }}` to R3F Canvas for auto DPR scaling under load
- [x] Speed up Lenis smooth scroll duration (1.2s → 0.8s)
- [x] Enable AVIF + WebP image formats in `next.config.ts` for 30–50% smaller images
- [x] Remove unused tsparticles packages (`@tsparticles/engine`, `@tsparticles/react`, `@tsparticles/slim`) — ~37 packages removed
- [x] Delete unused `src/components/ui/sparkles.tsx`
- [x] Remove Sentry client instrumentation (`sentry.edge.config.ts`, `sentry.server.config.ts`, example pages)
- [x] Resolve all 25 ESLint errors (0 errors, 0 warnings after cleanup)
  - Replaced all `catch (err: any)` with `catch (err: unknown)` + narrowing
  - Defined typed interfaces for Supabase rows in admin pages (`ContactSubmission`, `SocialLead`)
  - Extracted `ViewToggle` out of render function into top-level component
  - Fixed `useRef` element types (`HTMLDivElement` → `HTMLButtonElement` where appropriate)
  - Wrapped `setState` calls in `startTransition` in Navbar, AdminSidebar, ClientSidebar, TeamSidebar, PortfolioReels, LocationMap
  - Removed `passive` option from `removeEventListener` (not valid per spec)
  - Typed framer-motion `handleDragEnd` with `PanInfo` instead of `any`
  - Wrapped `handleChange`/`handleNext`/`handlePrev` in `useCallback`; added to effect dep arrays
  - Stabilised Supabase client via `useRef` in `use-current-user` hook
  - Captured timer refs to locals before cleanup in `NavigationProgress`


---

## 2. Active Polish & Auditing Queue

- [ ] Complete full regression check using React Doctor (`npm run doctor`)
- [ ] Verify accessibility indicators for client forms (ARIA tags, keyboard navigation)
- [ ] Conduct performance and speed audits for heavy visual layers (e.g. 3D maps, reels)
