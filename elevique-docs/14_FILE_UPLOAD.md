# 14 — File & Link Management
> Elevique Client Portal · No Storage · Admin Pastes External Links

---

## Overview

Files are stored externally (Google Drive, Dropbox, etc.). The portal only stores the link + metadata in the database. No uploads, no buckets, no signed URLs.

---

## saveLinkRecord Server Action

---

## FolderFilesSection Component

Used in admin, team, and client portal file pages.

---

## Files Page Pattern (admin / team / client)

---

## Updated files Table SQL

Use this instead of the version in 05_DATABASE_SCHEMA.md:

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
