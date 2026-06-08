# 18 — Client Portal
> Elevique Client Portal · Client-Facing Pages + Project Tracker

---

## Design System

Client portal uses the same `src/styles/portal.css` dark-theme system as the admin panel. See `16_ADMIN_PANEL.md` for the full token / class reference.

---

## Client Layout

Auth is enforced by middleware — no `requireClient()` call in the layout. `MobileHeader` dispatches `p:open-sidebar` which `ClientSidebar` listens for.

---

## Client Sidebar

Key points:
- `matchPrefix` on Projects keeps it active when viewing `/portal/projects/[id]`
- No "New Project" CTA — project creation is admin-only
- Auth action: `logoutClient` from `@/lib/actions/auth/logout-client`
- Role tag displayed: **"Premium Portal"**

---

## Client Dashboard

---

## Project Tracker Page (Main Client View)

---

## Milestone Timeline Component (Shared)

---

## Asset Checklist Component

