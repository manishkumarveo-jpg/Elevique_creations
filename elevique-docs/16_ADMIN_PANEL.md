# 16 — Admin Panel
> Elevique Client Portal · Every Admin Page, Layout, and Feature

---

## Design System

All admin UI uses the shared dark-theme CSS in `src/styles/portal.css`. Do **not** use Tailwind for layout or panel styling — use the `p-` class system.

| Token / Class | Value / Purpose |
|---|---|
| `--p-bg` | `#07080c` — page background |
| `--p-s1/s2/s3` | Dark surface layers |
| `--p-teal` | `#14B8A6` — primary accent |
| `--p-purple` | `#7C3AED` — secondary accent |
| `--p-amber` | Warning colour |
| `.p-shell` | Flex-row root wrapper (sidebar + main) |
| `.p-main` | Scrollable content area |
| `.p-sidebar` | Left sidebar element |
| `.p-sidebar-header/nav/footer` | Sidebar regions |
| `.p-sidebar-cta` | "New Project" call-to-action button |
| `.p-nav-item` / `.active` | Nav link states |
| `.p-mobile-header` | Mobile-only top bar (hidden on desktop) |
| `.p-hamburger` / `.p-overlay` | Mobile menu controls |
| `.p-welcome-card` | Dashboard hero panel |
| `.p-stat` | Stat box |
| `.p-project-card` / `.p-project-row` | Project card / list row |
| `.p-feed` / `.p-feed-item` | Activity feed container / item |
| `.p-alert` / `.p-alert--warn` / `--danger` | Alert banner variants |

---

## Admin Layout

No `requireAdmin()` call in the layout — auth is enforced by middleware (`src/middleware.ts`).

---

## Shared: MobileHeader

Hidden on desktop via CSS. Dispatches `p:open-sidebar` CustomEvent which all sidebars listen for.

---

## Admin Sidebar

Key points:
- Listens for `p:open-sidebar` CustomEvent to open on mobile
- Closes automatically on route change
- Active state: `pathname.startsWith(item.href)` — prefix match for nested routes
- Auth action: `logoutAdmin` from `@/lib/actions/auth/logout-admin`

---

## Admin Dashboard Page

### Dashboard data dependencies

| Query helper | Source | Returns |
|---|---|---|
| `getProjectsWithTeam()` | `src/lib/queries/projects.ts` | projects with `team[]`, `client{}`, `milestone_total`, `milestone_done` |
| `getRecentActivity(n)` | `src/lib/queries/activity.ts` | last n `activity_log` rows with `actor{}` join |
| `getStats()` | inline | `totalClients`, `totalTeam`, `awaitingApproval` (delivered deliverables count) |

---

## Create User Page

---

## Create Project Page

