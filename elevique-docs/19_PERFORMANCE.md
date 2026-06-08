# 19 — Performance & Scalability
> Elevique Client Portal · Indexes, Caching, Query Patterns

---

## Database Indexes

All indexes are included in the schema migration. This is the consolidated reference.

---

## Query Discipline — Rules

### Always select only columns you need

### Always paginate lists

### Run independent queries in parallel

---

## Next.js Caching

### Page-level revalidation

### On-demand cache invalidation in server actions

---

## Supabase Connection Pooling

For production, use the **pgBouncer pooled connection** string.
This handles high concurrency without exhausting Postgres connections.

Set in Supabase Dashboard → Settings → Database → Connection pooling → Transaction mode.

The pooled connection string looks like:
```
postgresql://postgres.[ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

Use the pooled string for all server-side Supabase client connections.
Use the direct (non-pooled) string only for migrations.

---

## Vercel Performance Config

---

## When to Scale

| Metric | Free Tier Limit | Action |
|--------|----------------|--------|
| DB storage | 500MB | Upgrade Supabase to Pro |
| Storage files | 1GB (not used — link-only architecture) | N/A |
| DB connections | 60 (direct) | Enable pgBouncer (handles 1000s) |
| Vercel serverless | 100GB bandwidth | Upgrade Vercel to Pro |
| Upstash requests | 10,000/day | Upgrade Upstash |
| Resend emails | 3,000/month | Upgrade Resend |

With free tiers you can comfortably handle:
- Up to ~50 active projects
- Up to ~200 users
- Unlimited external file links (files are stored on Google Drive/Dropbox, not in Supabase)

Upgrade triggers: >20 concurrent users online, >500MB DB, >50 team+client accounts.
