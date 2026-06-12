# Code Standards — General
> Elevique Client Portal · Coding Standards, TypeScript Guidelines, and Action Patterns

This specification outlines the coding standards, folder layouts, and implementation guidelines for this project.

---

## 1. Type Safety Invariants

To eliminate runtime reference errors, the codebase enforces strict TypeScript typing rules:
- **No `any` values**: Use `unknown` for untrusted or external payloads and narrow types using type guards.
- **Database Types**: Utilize generated Supabase types from `src/lib/types/database.ts` rather than custom interface overlays.
- **Query Typing**: Explicitly type all database select operations:
  ```ts
  type ProjectWithAssignments = QueryResult<typeof getProjectsWithTeam>;
  ```

---

## 2. File and Directory Layout Conventions

All files must follow these structure and naming conventions:

| File Type | Casing Convention | Example Path |
|---|---|---|
| Pages / Routes | Lowercase `page.tsx` | `src/app/admin/dashboard/page.tsx` |
| Layout templates | Lowercase `layout.tsx` | `src/app/portal/layout.tsx` |
| React Components | PascalCase | `src/components/shared/MilestoneTimeline.tsx` |
| Server Actions | kebab-case | `src/lib/actions/projects/create-project.ts` |
| Custom Hooks | `use-` kebab-case | `src/hooks/use-project-realtime.ts` |
| Database Migrations | `YYYYMMDD_description.sql` | `supabase/migrations/20260601_02_profiles.sql` |

---

## 3. Server Action Pattern Rules

All files created under `src/lib/actions/` must conform to the following code pattern:
1. **Define Input Schema**: Declare Zod validators at the top of the file to sanitize parameters.
2. **Authorize Session**: Invoke `requireRole()` checks before executing database queries.
3. **Utilize Correct Client**: Use cookie-based server client (`createServerClient`) for standard mutations to ensure RLS is active. Use admin client (`createAdminClient`) only for account onboarding.
4. **Propagate Errors**: Throw clean, readable exception messages on the server; catch and display them using UI toast panels in client components.
5. **Revalidate Caches**: Trigger `revalidatePath` on relevant routes to refresh cached static files.
