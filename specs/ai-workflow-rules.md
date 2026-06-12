# AI Workflow Rules
> Elevique Client Portal · Agent Behavioral Rules and Coding Constraints

This file defines the rules and constraints that AI coding agents must strictly follow when making changes or refactoring code in this repository.

---

## 1. Golden Rules for Agents

1. **Maintain Code Documentation Integrity**:
   - Do not remove, prune, or alter existing code comments, docstrings, or JSDoc comments unless they are directly related to the logic you are changing or updating.
   - Retain developer notes and inline annotations; they carry essential context.
2. **Strict RLS Adherence**:
   - Never query or write to the database using the bypass client (`createAdminClient`) in components.
   - Any database mutation or select operation must use the user-session based client (`createServerClient` or `createBrowserClient`) to ensure Postgres Row Level Security (RLS) is active.
3. **Server Action Guardrails**:
   - Every mutation must go through a Server Action in `src/lib/actions/`.
   - Every action must start with a validation guard:
     - Verify user session is active.
     - Call `requireRole()` to ensure the user possesses the role permissions to run the script.
     - Validate arguments using the corresponding Zod schema.

---

## 2. Structural Guidelines

- **No New API Routes for Mutations**: Do not build REST routes for page-level mutations. Use Server Actions instead.
- **Component Separation**: Keep page layouts clear of data querying or update loops. Fetch database records in Server Components (`page.tsx`), then pass the data down to interactive Client Components (marked with `'use client'`).
- **File Naming Compliance**: Follow the standard kebab-case or PascalCase conventions defined in the style rules.
- **Next.js conventions**: Remember this version of Next.js might feature changes compared to older versions. Check references in the package manager before writing code, and respect deprecation warnings.
