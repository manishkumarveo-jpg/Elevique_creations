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

---

## 4. Error Handling Pattern

All `catch` blocks must use `unknown` — never `any`:

```ts
} catch (err: unknown) {
  const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
  setError(msg);
}
```

API route handlers follow the same pattern:
```ts
} catch (err: unknown) {
  console.error("[Handler] error:", err);
  return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
}
```

---

## 5. Supabase Row Typing

Never use `any[]` for Supabase query results in page components. Define a local type that matches the columns accessed in the JSX:

```ts
type SocialLead = {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  created_at: string;
  // ...other columns used in the template
};

let leads: SocialLead[] = [];
```

This avoids downstream TypeScript errors when rendering properties and keeps ESLint clean.

---

## 6. React Hooks Rules

### setState inside useEffect
Direct `setState` calls at the top level of an effect body trigger the `react-hooks/set-state-in-effect` rule. Wrap them in `startTransition`:

```ts
import { startTransition, useEffect } from "react";

// ✅ correct
useEffect(() => {
  startTransition(() => setMenuOpen(false));
}, [pathname]);

// ❌ incorrect
useEffect(() => {
  setMenuOpen(false);
}, [pathname]);
```

### Stable external references inside effects
When a value created outside an effect (e.g. a Supabase client) would trigger a missing-dep warning, stabilise it with `useRef` instead of adding it to the dep array:

```ts
const supabaseRef = useRef(createClientSupabase());

useEffect(() => {
  const supabase = supabaseRef.current;
  // use supabase here
}, []);
```

### Timer cleanup inside effects
Always copy `ref.current` to a local variable before returning a cleanup function — the ref value may have changed by the time cleanup runs:

```ts
useEffect(() => {
  hideTimer.current = setTimeout(...);
  const timer = hideTimer.current;
  return () => clearTimeout(timer); // ✅ captures at schedule time
}, [pathname]);
```

### useCallback for functions used in effects
If a function is called inside a `useEffect` or `setInterval`, wrap it in `useCallback` and add it to the dependency array so the exhaustive-deps rule is satisfied:

```ts
const handleNext = useCallback(() =>
  handleChange(active === items.length - 1 ? 0 : active + 1),
[active, handleChange]);

useEffect(() => {
  const timer = setInterval(() => { handleNext(); }, 5000);
  return () => clearInterval(timer);
}, [active, handleNext]);
```

---

## 7. Component Extraction Rule

**Never define a React component inside another component's render function.** Components defined in render reset their state on every parent re-render and break Fast Refresh.

```tsx
// ❌ wrong — defined inside parent
export default function FeaturedShowcase() {
  const ViewToggle = () => <div>...</div>; // triggers react-hooks/static-components
  return <ViewToggle />;
}

// ✅ correct — extracted above parent, receives state as props
function ViewToggle({ viewMode, setViewMode }: { viewMode: ViewMode; setViewMode: (m: ViewMode) => void }) {
  return <div>...</div>;
}
export default function FeaturedShowcase() {
  return <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />;
}
```

---

## 8. useRef Typing Rule

Always type `useRef` to match the element the ref is actually attached to — never cast with `as any`:

```ts
// ref attached to <button> element
const btnRef = useRef<HTMLButtonElement>(null);

// ref attached to <dialog> element
const dialogRef = useRef<HTMLDialogElement>(null);
```

When an event handler's element type differs from a parent callback's expected element type, widen the prop type to the common base (`HTMLElement` or `Element`) rather than casting:

```ts
// ✅ widen prop type
onEnter: (p: GridProject, e: React.MouseEvent<HTMLElement>) => void

// ❌ avoid
onEnter(project, e as any);
```
