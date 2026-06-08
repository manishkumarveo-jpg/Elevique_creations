# 03 — Tech Stack
> Elevique Client Portal · Every Dependency with Version and Reason

---

## Core Framework

| Package | Version | Why |
|---------|---------|-----|
| `next` | `14.2.x` | App Router, Server Actions, Edge Middleware, ISR |
| `react` | `18.3.x` | Required by Next.js |
| `react-dom` | `18.3.x` | Required by Next.js |
| `typescript` | `5.x` | Full type safety — mandatory for this project |

---

## Supabase

| Package | Version | Why |
|---------|---------|-----|
| `@supabase/supabase-js` | `2.x` | Main Supabase client |
| `@supabase/ssr` | `0.x` | Cookie-based auth for Next.js App Router (replaces auth-helpers) |

---

## Validation & Security

| Package | Version | Why |
|---------|---------|-----|
| `zod` | `3.x` | Schema validation on all server action inputs |
| `@upstash/ratelimit` | `1.x` | Sliding window rate limiting in Edge middleware |
| `@upstash/redis` | `1.x` | Redis client for Upstash (REST-based, works in Edge) |

---

## Email

| Package | Version | Why |
|---------|---------|-----|
| `resend` | `3.x` | Transactional email — welcome emails, milestone notifications |

---

## UI & Styling

| Package | Version | Why |
|---------|---------|-----|
| `tailwindcss` | `3.x` | Utility-first CSS framework |
| `@tailwindcss/forms` | `0.5.x` | Better default form styles |
| `postcss` | `8.x` | Required by Tailwind |
| `autoprefixer` | `10.x` | Required by Tailwind |

---

## shadcn/ui Components (installed via CLI)

These are copied into `components/ui/` — not installed as npm packages.

---

## Icons

| Package | Version | Why |
|---------|---------|-----|
| `lucide-react` | `0.400.x` | Icon library compatible with shadcn/ui |

---

## Error Tracking

| Package | Version | Why |
|---------|---------|-----|
| `@sentry/nextjs` | `8.x` | Production error tracking and alerting |

---

## Dev Tools

| Package | Version | Why |
|---------|---------|-----|
| `supabase` | `1.x` (CLI) | Local Supabase dev server, migrations, type generation |
| `@types/node` | `20.x` | Node.js types for TypeScript |
| `eslint` | `8.x` | Code linting |
| `eslint-config-next` | `14.x` | Next.js ESLint rules |
| `prettier` | `3.x` | Code formatting |

---

## Full Installation Commands

### Step 1 — Bootstrap Next.js

### Step 2 — Install Runtime Dependencies

### Step 3 — Install Dev Dependencies

### Step 4 — Initialize shadcn/ui

### Step 5 — Add shadcn Components

### Step 6 — Install Supabase CLI (Global)

### Step 7 — Generate Types (after DB is set up)

---

## package.json Scripts

---

## tsconfig.json

---

## .prettierrc

