# 17 — Team Portal
> Elevique Client Portal · Team Member Pages + Components

---

## Design System

Team portal uses the same `src/styles/portal.css` dark-theme system as the admin panel. See `16_ADMIN_PANEL.md` for the full token / class reference.

---

## Team Layout

Auth is enforced by middleware — no `requireTeamMember()` call needed in the layout. `MobileHeader` dispatches `p:open-sidebar` which `TeamSidebar` listens for.

---

## Team Sidebar

Key points:
- `matchPrefix` on the Projects item keeps it active when navigating into `/team/projects/[id]`
- Auth action: `logoutTeam` from `@/lib/actions/auth/logout-team`
- Role tag displayed: **"Team"**

---

## Team Dashboard

---

## Team Project Milestones Page

