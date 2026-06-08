# 14 — File & Link Management
> Elevique Client Portal · No Storage · Admin Pastes External Links

---

## Overview

Files are stored externally (Google Drive, Dropbox, etc.). The portal only stores the link + metadata in the database. No uploads, no buckets, no signed URLs.

---

## saveLinkRecord Server Action

Located at `src/lib/actions/files.ts`. Starts with `'use server'`.

```ts
saveLinkRecord(params: {
  project_id: string
  folder_id: string
  file_url: string
  file_name: string
  link_provider?: string   // e.g. 'google_drive', 'dropbox', 'notion', 'other'
}): Promise<{ success: true; fileId: string } | { error: string }>
```

**Flow:**
1. `requireAdmin()` or `requireTeamMember()` depending on the folder's `upload_roles[]`
2. Zod: `file_url` must pass `isValidUrl()`, `file_name` 1–200 chars, `project_id` and `folder_id` UUIDs
3. Fetch folder row — verify the caller's role is in `upload_roles[]`
4. Insert into `files (project_id, folder_id, file_url, file_name, link_provider, added_by)`
5. `logActivity(userId, 'file.link_added', { file_name, folder_id })`
6. `revalidatePath('/[role]/projects/[id]/files')`

Returns `{ success: true, fileId }` or `{ error: string }`.

---

## FolderFilesSection Component

Located at `src/components/shared/FolderFilesSection.tsx`. Client Component.

```ts
interface FolderFilesSectionProps {
  folderId: string
  folderName: string
  links: FileLink[]            // pre-fetched from server
  canAddLinks: boolean         // true if role is in folder.upload_roles
  projectId: string
}
```

**Behaviour:**
- Renders folder name as a card header
- Lists each link as a `FileLinkRow` (icon, name, provider badge, "Open" button)
- If `canAddLinks`: shows `AddLinkForm` at the bottom of the card
- On `AddLinkForm` submit: calls `saveLinkRecord()` → on success calls `router.refresh()`
- On delete (admin only): calls `deleteLinkRecord(fileId)` → `router.refresh()`
- Empty state: "No links added yet."

---

## Files Page Pattern (admin / team / client)

Each portal's files page (`/[role]/projects/[id]/files/page.tsx`) is a Server Component that:

1. Calls `requireAdmin()` / `requireTeamMember()` / `requireClient()`
2. Fetches all 6 folders for the project
3. For each folder, fetches `files` rows where `folder_id = folder.id AND is_deleted = false`
4. Determines `canAddLinks` by checking `folder.upload_roles.includes(profile.role)`
5. Renders a `FolderFilesSection` per folder

Admin sees all 6 folders. Team member sees only folders where `upload_roles` includes `'team_member'`. Client sees only `Assets` and `References` folders.

---

## Updated files Table SQL

Use this instead of the version in 05_DATABASE_SCHEMA.md:

```sql
CREATE TABLE files (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  folder_id     uuid NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
  file_name     text NOT NULL,
  file_url      text NOT NULL,              -- full external URL
  link_provider text,                       -- 'google_drive' | 'dropbox' | 'notion' | 'other'
  added_by      uuid NOT NULL REFERENCES profiles(id),
  is_deleted    boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_files_project   ON files(project_id);
CREATE INDEX idx_files_folder    ON files(folder_id);
CREATE INDEX idx_files_added_by  ON files(added_by);
```

No `storage_bucket`, `storage_path`, `mime_type`, or `file_size` columns — those belong to the upload-based design that this project does not use.

---

## What Was Removed

These files/features from the original design are **NOT needed**:

| Removed | Why |
|---------|-----|
| `src/app/api/upload/route.ts` | No file uploads |
| `src/app/api/download/route.ts` | No signed URLs — links open directly |
| `src/lib/supabase/storage.ts` | No storage buckets |
| `src/components/shared/FileUploader.tsx` | Replaced by AddLinkForm |
| `src/components/shared/FileDownloadButton.tsx` | Replaced by FileLinkRow |
| `src/lib/utils/file-validation.ts` | No file type/size limits needed |
| Supabase Storage buckets | Not created |
| Storage RLS policies | Not needed |
| `@upstash/ratelimit` for uploads | Not needed (still used for middleware) |
