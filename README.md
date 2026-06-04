# Elevique Website

Elevique is a Next.js website for a creative AI visuals studio. The site presents the studio landing page, service sections, client/map visuals, and a portfolio page for featured work.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- GSAP
- Three.js with React Three Fiber and Drei
- D3 Geo and TopoJSON for map rendering

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev
```

Starts the Next.js development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server after a successful build.

```bash
npm run lint
```

Runs ESLint.

## Project Structure

```text
src/
  app/
    layout.tsx          Root layout, metadata, fonts, global background
    page.tsx            Home page
    portfolio/page.tsx  Portfolio route
    globals.css         Global styles
  components/
    ClientsMap.tsx
    DotBackground.tsx
    FeaturedShowcase.tsx
    HeroSection.tsx
    Navbar.tsx
    ServicesSection.tsx
    SoundToggle.tsx
  styles/
    clients-map.css
context/
  Hero Section.md
  clientSection.md
  portfolio.md
  service.md
```

## Routes

- `/` - Home page with hero, services, and client map sections.
- `/portfolio` - Portfolio page with navigation and featured showcase.

## Development Notes

- This project uses the App Router under `src/app`.
- Global metadata and font setup live in `src/app/layout.tsx`.
- Shared UI and visual sections live in `src/components`.
- Content planning notes are stored in `context/`.

Before changing Next.js-specific APIs or conventions, check the local Next.js documentation in `node_modules/next/dist/docs/`, because this project uses Next.js 16.
