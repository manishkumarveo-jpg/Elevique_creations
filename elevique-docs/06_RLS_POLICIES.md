# 06 — Row Level Security (RLS)
> Elevique Client Portal · Every Policy for Every Table
> Run AFTER the schema from 05_DATABASE_SCHEMA.md is applied.

---

## Enable RLS on All Tables

---

## Profiles Policies

---

## Projects Policies

---

## Project Assignments Policies

---

## Milestones Policies

---

## Folders Policies

---

## Files Policies

---

## Deliverables Policies

---

## Asset Checklist Policies

---

## Activity Log Policies

---

## No Storage Policies Needed

This project uses **no Supabase Storage buckets**. Files are stored as external links (Google Drive etc.) in the `files.file_url` column. The `files` table RLS policies above are sufficient — they control who can read and insert link records.

---

## Verify RLS is Working

Run these checks after applying all policies:

