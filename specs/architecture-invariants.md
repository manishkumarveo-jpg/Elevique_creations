# Architecture Invariants
> Elevique Client Portal · Unalterable Structural Rules and Design Constraints

This document outlines the hard rules and invariants that govern the Elevique Client Portal architecture. These rules must never be violated or bypassed under any circumstances.

---

## 1. File Management Invariant

- **Rule**: The application **does not support local file storage** or file hosting inside Supabase buckets. All assets (video drafts, scripts, images) must be hosted on external cloud platforms (Google Drive, Dropbox, Frame.io, WeTransfer, OneDrive).
- **Enforcement**:
  - The database stores only metadata record strings containing external URLs.
  - Do not create Supabase Storage folders, APIs for file uploads, or upload progress UI components.
  - Standard uploader is replaced with the `AddLinkForm` component.

---

## 2. Mutational Invariant

- **Rule**: All database changes (inserts, updates, deletes) must execute through Next.js Server Actions. Client-side database client operations (`supabase.from().update()`) are forbidden.
- **Enforcement**:
  - Direct updates are blocked. The browser client is restricted to fetching sessions and subscribing to Realtime database changes.
  - Server Actions run inside safe environment wrappers, enforcing role validation and Zod parameter parsing before queries reach PostgreSQL.

---

## 3. Data Integrity & Deletion Invariant

- **Rule**: Deletions on the `files` table must be soft deletes. Hard `DELETE` operations are disabled.
- **Enforcement**:
  - Setting uploader links to inactive must set the record column `is_deleted = true`.
  - Fetch query utilities must filter records with `is_deleted = false` so that deleted assets vanish from frontend panels while preserving the database log entry.

---

## 4. Audit Trailing Invariant

- **Rule**: Every user-initiated change (on projects, users, milestones, deliverables, files) must write a corresponding log line to the `activity_log` table.
- **Enforcement**:
  - Activity logs must record the user ID (`user_id`), targeted project ID (`project_id`), action label (e.g. `added_link`), and role context.
  - This activity feed is rendered inside dashboard sections as a read-only audit log.
