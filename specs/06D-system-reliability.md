# 06D — System Reliability
> Elevique Client Portal · Rate Limiting, Error Boundaries, and Recovery Configurations

This specification defines the fallback boundaries, rate limit policies, and system recovery hooks that guarantee site stability.

---

## 1. Edge-Based Request Rate Limiting

To prevent API abuse and denial-of-service attempts, Elevique utilizes **Upstash Redis** sliding-window rate limiting directly inside the Next.js Edge Middleware:

- **Target Paths**: All API endpoints (`/api/*`) are throttled.
- **Rule Definition**: Caps clients at **100 requests per 60 seconds** per IP address.
- **Header Returns**: Throttled requests immediately return standard HTTP status code `429 Too Many Requests` along with headers:
  - `X-RateLimit-Remaining`: Slots left before block.
  - `X-RateLimit-Reset`: Timestamp indicating reset deadline.
  - `Retry-After`: Default wait duration (60 seconds).
- **Edge Compatibility**: Uses Upstash REST-based library client to avoid TCP socket setup constraints inside Next.js edge environments.

---

## 2. Global Error Boundaries

The portal handles unexpected runtime failures gracefully without crashing client browsers:

- **`global-error.tsx`**: Registered at the root of the `app/` folder, trapping uncaught exceptions in layout components. It presents a stylized error panel and a "Try Again" trigger.
- **Error Boundaries**: Specific pages (e.g. Chat channels, Deliverable Tables) include nested Error Boundaries to allow parent dashboards to function normally even if a child component fails.
- **Sentry Integration**: Captures stack traces automatically and forwards details to Sentry before rendering fallback widgets.

---

## 3. Skeleton Loading State Design

To maintain a fluid user experience during data fetching, Elevique provides skeleton loaders:
- **Project Detail Skeletons**: Displays pulsing card outlines matching the grid before the project metadata is returned.
- **Chat Skeletons**: Pre-renders mock message bubbles to prevent visual jumpiness when WebSocket data arrives.
- **Visual Design**: Styled with a pulsing opacity change (`animate-pulse`) using semi-transparent grey colors (`bg-white/5`).
