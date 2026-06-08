# 10 — Project Assignments
> Elevique Client Portal · Team Member ↔ Project Junction System

---

## Overview

The `project_assignments` table is a many-to-many junction between `profiles` (team members) and `projects`. It is the single source of truth for what a team member can see and do.

```
profiles (role = 'team_member')
        ↓
project_assignments (user_id, project_id)
        ↓
projects
```

When a team member logs in, every query they make is scoped by their assignment rows. RLS uses `is_assigned_to_project(project_id)` which checks this table.

---

## Server Actions

---

## Query Functions

---

## Assign Team Members Component (Admin)

