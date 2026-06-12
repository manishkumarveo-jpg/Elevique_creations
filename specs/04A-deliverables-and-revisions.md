# 04A — Deliverables & Revisions
> Elevique Client Portal · Asset Hand-off, Client Reviews, and Revision Cycles

This specification outlines the process for delivering final creative assets (videos/images) and managing client-initiated revisions.

---

## 1. Asset Hand-off & Deliverables Table

Once visual assets are rendered, the Admin or Assigned Team member shares the final media by registering a deliverable. 

- **Data Linkage**: A deliverable is linked to a record in the `files` table, specifying a clean title, uploader ID, and the direct Google Drive, Frame.io, or Dropbox destination URL.
- **Access Level**: Only Admins and Team members can insert deliverables. Clients have read-only access to the list.

---

## 2. Dynamic Client Review Flow

Clients can take two distinct actions when reviewing a pending deliverable:

```
                      ┌──────────────────────┐
                      │  Deliverable Posted  │
                      │  [ pending_review ]   │
                      └──────────┬───────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       [ Approve Asset ]               [ Request Revision ]
   - Sets status = 'approved'        - Sets status = 'shared'
   - Records client approval ID      - Sets revision_note details
```

### Flow 1: Approval
- **Status Change**: Transitions the deliverable's `status` enum to `'approved'`.
- **Database Rules**: Sets the `approved_by` profile reference field to the client's UUID.

### Flow 2: Revision Request
- **Status Change**: Transitions the status to `'shared'` (meaning revision notes are shared with the team).
- **Feedback Collection**: Captures the client's text-area comments directly inside the `deliverables.revision_note` column.

---

## 3. Append-Only Project Revisions Thread

In addition to commenting on individual deliverables, clients can open global project-wide revisions. This is tracked inside the `project_revisions` table:

- **Structure**: Append-only log. Clients can only select and insert revision logs, ensuring past requests remain immutable.
- **Status lifecycle**:
  - `'open'` (Default when a client posts the note)
  - `'resolved'` (When an Admin or Team member marks the request as resolved, stamping `resolved_by` and `resolved_at` values).
- **Index Optimization**: Composite index `(project_id, created_at DESC)` ensures instant retrieval of the project timeline.
