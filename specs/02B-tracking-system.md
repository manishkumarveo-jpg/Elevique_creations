# 02B — Tracking System
> Elevique Client Portal · Milestones, Folders, and File Link Collaboration

This specification defines the mechanics of the Elevique tracking system, which replaces static Notion links with a secure dashboard using dynamic milestones, directory folders, and external URL link storage.

---

## 1. Project Lifecycles & Milestones

Each project proceeds through 4 sequential, pre-seeded milestones. Their progress dictates client-portal visibility and team tasks:

| Milestone Phase | Status States | Actions Triggered / Permission Rules |
|---|---|---|
| **1. Briefing** | `pending` \| `in_progress` \| `completed` | The project starts here. Client uploads reference images/documents into the `References` folder. |
| **2. Scripting** | `pending` \| `in_progress` \| `completed` | Team uploads drafts to `Scripts` folder. Client reviews script and leaves comments. |
| **3. Production** | `pending` \| `in_progress` \| `completed` | Core production step. AI rendering and post-production assets are prepared. |
| **4. Delivery** | `pending` \| `in_progress` \| `completed` | Final video/image deliverables are published to the Client dashboard. |

---

## 2. Directory Folder System

Every project contains 6 pre-seeded virtual directories with custom write access rules (via `folders.upload_roles` column):

| Virtual Folder | Display Name | Read Access | Write Access | Description |
|---|---|---|---|---|
| `/agreements` | Agreements | Admin, Client | Admin only | Service contracts, proposals, and invoices. |
| `/assets` | Assets | Admin, Team, Client | Admin, Team, Client | Brand assets, fonts, logos from the client. |
| `/references` | References | Admin, Team, Client | Admin, Team, Client | Creative inspiration and visual references. |
| `/scripts` | Scripts/Moodboards | Admin, Team, Client | Admin, Team | Screenplays, storyboards, and scripts. |
| `/videos` | Final Videos | Admin, Team, Client | Admin, Team | High-res video exports and revisions. |
| `/images` | Final Images | Admin, Team, Client | Admin, Team | Still renders, banner designs, and cover frames. |

---

## 3. Link-Based File Architecture

To avoid storage cost overhead and signed URL management, Elevique stores references to files hosted on external platforms (e.g., Google Drive, Dropbox, Frame.io, WeTransfer, OneDrive):

- **Data Insertion**: When sharing files, the user enters the name and target URL into the `AddLinkForm` component.
- **Link Verification**: The system checks if the URL is valid, enforces HTTPS, and sanitizes input text parameters.
- **Soft Deletion**: Deleting files changes the boolean flag to `is_deleted = true`. Rows are never hard-deleted from Postgres to preserve logs.
- **Display Component**: The `FileLinkRow` renders the file icon, name, date, and uploader profile, linking out to the third-party destination in a new window tab.
