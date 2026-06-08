# 07 — File & Link Management
> Elevique Client Portal · No Storage Buckets · Admin Pastes Links

---

## How It Works

There is **no file storage** in this system. Files (videos, images, PDFs, etc.) are hosted wherever the admin prefers — Google Drive, Dropbox, OneDrive, WeTransfer, or anywhere else.

When a file needs to be shared:
1. Admin uploads the file to Google Drive (or any platform)
2. Admin copies the shareable link
3. Admin pastes the link into the portal (in a folder or as a deliverable)
4. Client clicks the link — opens in a new tab directly

No signed URLs. No buckets. No storage costs.

---

## Database Change

The `files` table uses `file_url TEXT` instead of `storage_path TEXT`.

---

## Who Can Add Links

| Folder | Who Can Paste Links |
|--------|-------------------|
| Agreements | Admin only |
| Assets | Admin, Team Member, Client |
| References | Admin, Team Member, Client |
| Script/Moodboard | Admin, Team Member |
| Final Videos | Admin, Team Member |
| Final Images | Admin, Team Member |

This matches the `upload_roles` column on the `folders` table — same rules, just for links instead of uploads.

---

## Link Validation

---

## Removed from the Stack

The following are **NOT needed** in this system. Do not install or create them:

- ❌ Supabase Storage buckets
- ❌ `/api/upload` route
- ❌ `/api/download` route
- ❌ `FileUploader` drag-and-drop component
- ❌ `FileDownloadButton` component
- ❌ `@upstash/ratelimit` for upload limiting (still needed for general rate limiting)
- ❌ Storage RLS policies
- ❌ `getUploadUrl()` / `getDownloadUrl()` helpers

Replace all of the above with the simple `AddLinkForm` component below.

---

## AddLinkForm Component (replaces FileUploader everywhere)

---

## FileLinkRow Component (replaces FileDownloadButton)

