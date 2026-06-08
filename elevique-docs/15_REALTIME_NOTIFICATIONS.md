# 15 — Realtime & Notifications
> Elevique Client Portal · Supabase Realtime + Resend Emails

---

## Realtime Hook

Located at `src/hooks/use-project-realtime.ts`. Client Component hook.

```ts
function useProjectRealtime(projectId: string, onEvent: () => void): void
```

**Implementation:**
1. Call `createClientSupabase()` once (module-level singleton)
2. On mount: subscribe to a Postgres Changes channel filtered by `project_id`:
   ```ts
   supabase
     .channel(`project:${projectId}`)
     .on('postgres_changes', {
       event: '*',
       schema: 'public',
       filter: `project_id=eq.${projectId}`,
     }, () => onEvent())
     .subscribe()
   ```
3. On unmount: call `supabase.removeChannel(channel)` to clean up
4. Tables to subscribe to: `milestones`, `files`, `deliverables`, `asset_checklist`

---

## Usage in Client Portal Page

Extract the realtime-aware portion into a `'use client'` wrapper component at the top of the project tracker page:

```tsx
'use client'
import { useProjectRealtime } from '@/hooks/use-project-realtime'
import { useRouter } from 'next/navigation'

export function ProjectRealtimeRefresh({ projectId }: { projectId: string }) {
  const router = useRouter()
  useProjectRealtime(projectId, () => router.refresh())
  return null
}
```

Include `<ProjectRealtimeRefresh projectId={project.id} />` inside the Server Component page. On any realtime event `router.refresh()` re-fetches server data without a full navigation.

---

## Email Templates

Located at `src/lib/email/templates.ts`. All emails sent via Resend from `hello@elevique.in`.

```ts
welcomeEmail(params: { fullName: string; email: string; password: string; role: Role; loginUrl: string }): EmailPayload
milestoneCompleteEmail(params: { clientName: string; projectName: string; milestoneName: string; portalUrl: string }): EmailPayload
```

**Template fields:**
- `subject`: e.g. `"Welcome to the Elevique Portal"` / `"Milestone Complete: {{milestoneName}}"`
- `html`: branded HTML with `{{fullName}}`, `{{projectName}}`, `{{milestoneName}}`, `{{loginUrl}}` placeholders
- `text`: plain-text fallback

**When emails are triggered:**
- `welcomeEmail` — called inside `createUserAccount()` server action after the Supabase user is created
- `milestoneCompleteEmail` — called inside `notifyMilestoneComplete()` helper in `milestones.ts` when status is set to `'completed'`

Both helpers call `resend.emails.send({ from: 'hello@elevique.in', to, subject, html })` and never throw (failures are logged but do not block the mutation).

---

## Enable Realtime in Supabase

Run this SQL in the Supabase SQL Editor:

```sql
BEGIN;
  ALTER PUBLICATION supabase_realtime ADD TABLE milestones;
  ALTER PUBLICATION supabase_realtime ADD TABLE files;
  ALTER PUBLICATION supabase_realtime ADD TABLE deliverables;
  ALTER PUBLICATION supabase_realtime ADD TABLE asset_checklist;
COMMIT;
```

Or enable via: **Supabase Dashboard → Database → Replication → supabase_realtime → Add tables**.

RLS applies to Realtime — clients only receive change events for rows their policy permits them to read. No additional Realtime-specific policies are needed.
