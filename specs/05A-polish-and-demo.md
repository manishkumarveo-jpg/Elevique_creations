# 05A — Polish & Demo
> Elevique Client Portal · Visual Transitions, Performance Rules, and Demo Checklist

This specification outlines the visual details, loading indicators, performance caching strategies, and validation scripts used to audit and polish the Elevique application.

---

## 1. Visual Polish & Transitions

To guarantee a premium brand aesthetic, the following micro-animations and loading scripts are required:
- **Skeleton Layouts**: Rather than blank pages, cards render dark glassmorphic skeleton items with a subtle pulse.
- **GSAP Scroll Triggers**: Smooth parallax updates on the landing page as below-fold elements load into the viewport.
- **CSS Backdrop Filters**: Use of frosted glass borders (`backdrop-filter: blur(12px)`) to keep navigation sidebars feeling integrated.
- **Button Micro-interactions**: Smooth HSL shifts and hover scaling on primary buttons (`btn-primary`).

---

## 2. Performance Caching & Scaling Invariants

The application maintains extreme lightweight performance through the following code invariants:
1. **Direct Column Queries**: Every Supabase select query must request only necessary columns (`.select('id, name')` instead of wildcards) to reduce network payload sizes.
2. **pgBouncer Connection Pooling**: Production builds connect to Supabase through pooled port `6543` in Transaction Mode, managing concurrent database hooks efficiently.
3. **Dynamic Import Splitting**: Heavy landing page items (e.g. `ClientsMap` globe module and testimonials) utilize Next.js `dynamic()` lazy-loading.
4. **On-Demand Cache Invalidation**: Next.js cache is refreshed via `revalidatePath` and `revalidateTag` in Server Actions when database mutations occur.

---

## 3. Demo Verification Script

Use this step-by-step checklist to verify full system functionality before final client hand-off:

- [ ] **Step 1: Admin Creation**
  - Verify admin login at `/admin/login` opens the workspace.
- [ ] **Step 2: Client/Team Onboarding**
  - Create a new Client profile; verify Resend triggers a welcome email.
- [ ] **Step 3: Project Generation**
  - Create a Project; verify milestones (4), folders (6), and checklist items (6) are automatically seeded.
- [ ] **Step 4: Role Boundary Audit**
  - Verify that a Client cannot navigate to `/admin/dashboard` or `/team/dashboard` (routes should trigger `/unauthorized` or login redirects).
- [ ] **Step 5: Real-Time Synchronization**
  - Open the Client Portal and Admin Panel in separate browser windows. Update a milestone status; verify changes reflect instantly without page reloads.
- [ ] **Step 6: File Link & Deliverables Review**
  - Share a file link uploader; verify external page links open in a new tab. Accept a deliverable and check that it updates the approval log.
