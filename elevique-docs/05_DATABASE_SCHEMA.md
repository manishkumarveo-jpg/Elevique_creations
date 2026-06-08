# 05 — Database Schema
> Elevique Client Portal · All Tables, Enums, Triggers, Indexes
> Run this SQL in Supabase SQL Editor in the exact order shown.

---

## Step 1 — Custom ENUM Types

---

## Step 2 — Helper Functions (used by RLS and triggers)

---

## Step 3 — Profiles Table

---

## Step 4 — Projects Table

---

## Step 5 — Project Assignments Table

---

## Step 6 — Milestones Table

---

## Step 7 — Folders Table

---

## Step 8 — Files Table

> ⚠️ No file storage — files are external links (Google Drive, Dropbox, etc.)
> Use `file_url` not `storage_path`. No `file_status` ENUM needed for files.

---

## Step 9 — Deliverables Table

---

## Step 10 — Asset Checklist Table

---

## Step 11 — Activity Log Table

---

## Step 12 — Auto-Seed Trigger (runs on every new project)

---

## Step 13 — Auto-Complete Project Trigger

---

## Schema Summary

| Table | Rows (est.) | Key Relationships |
|-------|-------------|-------------------|
| `profiles` | 1 per user | Root entity |
| `projects` | 1+ per client | belongs to profiles (client + admin) |
| `project_assignments` | 1 per team+project | junction: profiles ↔ projects |
| `milestones` | 4 per project | belongs to projects |
| `folders` | 6 per project | belongs to projects |
| `files` | many per folder | belongs to folders + projects |
| `deliverables` | many per project | belongs to projects, links to files |
| `asset_checklist` | 6 per project | belongs to projects |
| `activity_log` | many per project | belongs to projects + profiles |
