# 03A — Dashboard
> Elevique Client Portal · Interface Portals, Statistics Widgets, and Navigation Hubs

This specification outlines the visual layout structures, navigation panels, and data dashboards for each user type (Admin, Team Member, Client).

---

## 1. Shared Layout Architecture

All dashboards implement a standard container model featuring:
- **Responsive Navigation Sidebar**: Left-hand navigation panel loaded dynamically based on user role (`AdminSidebar`, `TeamSidebar`, `ClientSidebar`).
- **Glassmorphic Card Deck**: CSS variables configured for dark backgrounds, frosted semi-transparent borders (`var(--glass-border)`), and shadow elements.
- **Top Bar Console**: User avatar indicator, welcome prompt, and logout action trigger.

---

## 2. Admin Dashboard Console (`/admin/dashboard`)

The Admin console acts as the company control center, compiling studio-wide productivity data.

### Interface Matrix

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Welcome back, Admin.                                                   │
│  Active Pipeline Review, Alert triggers, Meeting scheduler              │
├─────────────────────────────────────────────────────────────────────────┤
│  GLOBAL PROGRESS         AWAITING APPROVAL          NEEDS ATTENTION      │
│  [ Circular SVG Ring ]   [ Deliverables Counter ]   [ Unassigned/Overdue]│
│  78% Completed           04 Items Due               02 Projects          │
├─────────────────────────────────────────────────────────────────────────┤
│  ACTIVE PROJECTS GRID                              RECENT ACTIVITY FEED │
│  ┌────────────────────┐ ┌────────────────────┐     - Admin added link   │
│  │ Project Alpha 65%   │ │ Project Beta 20%   │     - Client approved v1 │
│  └────────────────────┘ └────────────────────┘     - Team updated phase │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Widgets
1. **Global Progress Radial Ring**:
   - Renders a dynamic, SVG-drawn progress ring based on total milestones completed across the database (`(doneMilestones / totalMilestones) * 100`).
   - Radial stroke styling gradient: Purple (`#7C3AED`) to Teal (`#14B8A6`).
2. **Attention Alert Banners**:
   - Warns the administrator if active projects lack assigned team members or have passed deadlines.
3. **Pipeline Cards**:
   - Grid listing active client accounts, progress bars, and link shortcuts.
4. **Recent Activity Stream**:
   - Renders an audit log of recent database mutations (linked uploader profiles, dates, actions).

---

## 3. Team Portal Console (`/team/dashboard`)

The Team dashboard scopes details down to staff assignments, avoiding client billing or global statistics.
- **Assigned Projects List**: Simple list containing the projects where the team member's ID exists in `project_assignments`.
- **Milestone Update Console**: Inline status updates to slide projects from Briefing through to Delivery.
- **Action Triggers**: Add File Links button directly to allowed directories.

---

## 4. Client Portal Console (`/portal/dashboard`)

Clients are directed to a clean, focused single-project tracking board upon authentication.
- **Project Progress Tracker**: Horizontal timeline indicating project milestone stages.
- **Asset Upload Checklist**: Tasks requested by the Admin (e.g. "Upload vector logo") with inline checkboxes.
- **Deliverables Carousel**: Showcase of final video and image links waiting for review and approval.
