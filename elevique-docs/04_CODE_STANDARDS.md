# 04 — Code Standards
> Elevique Client Portal · Naming, Structure, TypeScript Rules

---

## Golden Rules

1. **Never use `any`** — if you don't know the type, use `unknown` and narrow it
2. **Never expose the service role key** — it lives only in server files, never in components or client utilities
3. **Never query without RLS** — always use the session-based client in server components, never the admin client
4. **Validate before you touch the DB** — Zod schema first, DB query second
5. **Every server action must call requireRole()** — no exceptions
6. **Fail loudly on the server, fail gracefully on the client** — throw errors in server actions, catch and display them in components

---

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Pages | `page.tsx` | `app/admin/dashboard/page.tsx` |
| Layouts | `layout.tsx` | `app/admin/layout.tsx` |
| Server Actions | `kebab-case.ts` | `lib/actions/create-user.ts` |
| Components | `PascalCase.tsx` | `components/admin/UserCard.tsx` |
| Hooks | `use-kebab-case.ts` | `hooks/use-project-realtime.ts` |
| Types | `kebab-case.ts` | `lib/types/project.ts` |
| Utilities | `kebab-case.ts` | `lib/utils/format-date.ts` |
| DB migrations | `YYYYMMDD_description.sql` | `supabase/migrations/20260601_initial_schema.sql` |

---

## Folder Structure Rules

```
src/
├── app/                    # Next.js App Router pages only — no logic here
│   ├── (auth)/             # Route group — no URL segment
│   ├── admin/
│   ├── team/
│   └── portal/
│
├── components/             # React components only — no data fetching
│   ├── ui/                 # shadcn/ui primitives — DO NOT EDIT
│   ├── shared/             # Used by 2+ portals
│   ├── admin/              # Admin-only components
│   ├── team/               # Team-only components
│   └── portal/             # Client-only components
│
├── lib/                    # All non-component logic
│   ├── actions/            # Server Actions — mutations only
│   │   └── auth/           # Auth-specific actions
│   ├── auth/               # requireRole() helpers
│   ├── supabase/           # Supabase client instances
│   ├── validations/        # Zod schemas
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Pure utility functions
│
└── hooks/                  # React hooks — client-side only
```

---

## TypeScript Rules

### Always type server action inputs with Zod + infer the type

### Always use the generated database types

### Never use `any` — use `unknown` for untrusted data

### Type all Supabase query results

---

## Server Action Rules

Every server action file must:

---

## Component Rules

### Server Components (default in App Router)

### Client Components

### Rule: Keep data fetching in Server Components, interactivity in Client Components

```
app/admin/projects/page.tsx       ← Server Component: fetches data
    └── components/admin/ProjectList.tsx  ← Client Component: handles search/filter
```

---

## Error Handling Pattern

### In Server Actions — throw errors

### In Client Components — catch and display

---

## Import Order

Always use this order, separated by blank lines:

---

## Supabase Client Usage Rules

| Client | File | Use For |
|--------|------|---------|
| `createServerClient()` | `lib/supabase/server.ts` | Server Components, Server Actions — uses session cookie |
| `createBrowserClient()` | `lib/supabase/client.ts` | Client Components — auth state, Realtime subscriptions |
| `createAdminClient()` | `lib/supabase/admin.ts` | Server Actions only — creating users, admin operations |

---

## Environment Variable Rules

