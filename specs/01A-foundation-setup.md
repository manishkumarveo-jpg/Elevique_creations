# 01A — Foundation Setup
> Elevique Client Portal · Bootstrapping and Project Configuration

This specification documents the bootstrap setup, dependency configurations, and workspace settings for the Elevique Creative AI Visuals Studio client portal.

---

## Core Technologies

The application is built on a modern frontend/backend architecture using:
- **Next.js 16.2.x** (App Router, Server Actions, Edge Middleware, and ISR)
- **React 19.2.x** (React Server Components, Actions API, and state hooks)
- **Tailwind CSS v4** (PostCSS integration, design system variables, and utility classes)
- **Supabase (PostgreSQL)** (Auth, Realtime websockets, Row Level Security, and edge operations)
- **Upstash Redis** (Edge-compatible serverless database for request rate-limiting)

---

## Configuration Files

### 1. `package.json`
Manages project dependencies, scripts, and runtime engines. Key scripts configured:
- `npm run dev`: Boots the Next.js development server.
- `npm run build`: Compiles production assets and triggers React Server Components builds.
- `npm run start`: Serves the compiled production bundle.
- `npm run lint`: Code-quality lint check via ESLint.
- `npm run doctor`: Triages React Diagnostics and accessibility checks.

### 2. `tsconfig.json`
Ensures strict TypeScript compilation rules, absolute imports (`@/*`), and type safety across pages, layouts, and server actions.

### 3. `postcss.config.mjs`
Wires up Tailwind CSS v4 to compile styles with autoprefixing and optimization.

---

## Environment Variables Configuration

The project utilizes two environment files:
1. `.env.local` (Git-ignored) - For local environment variables.
2. `.env.example` (Committed) - Serves as the boilerplate for setting up environment variables in new environments.

### Environment Variable Table

| Variable | Scope | Source / Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | Supabase API project endpoint |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | Public API key for client-side subscription calls |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-Only | Secret key to bypass RLS for administrative actions |
| `UPSTASH_REDIS_REST_URL` | Server-Only | Upstash Redis connection endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Server-Only | Upstash Redis authentication token |
| `RESEND_API_KEY` | Server-Only | Email dispatch authentication key |
| `NEXT_PUBLIC_APP_URL` | Client & Server | Web application root URL (e.g., `https://portal.elevique.in`) |

---

## Dev Tools & Verification Checklist

- [x] Bootstrapped Next.js using App Router structure.
- [x] Initialized Tailwind CSS v4 variables in `globals.css`.
- [x] Connected database hooks and verified local Supabase instance.
- [x] Setup and tested Upstash Redis rate limiting middleware locally.
- [x] Configured Sentry Next.js configuration profiles (`sentry.edge.config.ts`, `sentry.server.config.ts`).
