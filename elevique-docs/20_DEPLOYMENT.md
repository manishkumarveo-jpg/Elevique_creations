# 20 — Deployment
> Elevique Client Portal · Vercel + Supabase Production Setup

---

## Pre-Deployment Checklist

Before deploying, confirm all of these are done:

- [ ] All SQL migrations run in Supabase production project
- [ ] RLS enabled and all policies applied
- [ ] All 6 storage buckets created (private)
- [ ] Realtime enabled on: projects, milestones, deliverables, files
- [ ] At least one admin user created manually in Supabase Auth
- [ ] All environment variables ready
- [ ] Custom domain purchased (e.g. portal.elevique.in)

---

## Environment Variables

### .env.example (commit this — no real values)

### Where to find each value

| Variable | Location |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → service_role secret key |
| `UPSTASH_REDIS_REST_URL` | Upstash Console → Database → REST API → UPSTASH_REDIS_REST_URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Console → Database → REST API → UPSTASH_REDIS_REST_TOKEN |
| `RESEND_API_KEY` | Resend Dashboard → API Keys → Create API Key |
| `NEXT_PUBLIC_APP_URL` | Your production URL e.g. `https://portal.elevique.in` |

---

## Step 1 — Create Supabase Production Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name: `elevique-portal-prod`
3. Region: `ap-south-1` (Mumbai — closest to Indian users)
4. Password: generate a strong one and save it
5. Wait for project to be ready (~2 minutes)
6. Go to SQL Editor → run all migrations from `supabase/migrations/` in order

### Run migrations in this exact order:

### Create the first admin user manually

---

## Step 2 — Set Up Upstash Redis

1. Go to [console.upstash.com](https://console.upstash.com) → Create Database
2. Name: `elevique-ratelimit`
3. Region: `ap-southeast-1` (Singapore) or `eu-west-1`
4. Type: Regional (not Global — free tier)
5. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

---

## Step 3 — Set Up Resend

1. Go to [resend.com](https://resend.com) → Sign up
2. Go to Domains → Add Domain → `elevique.in`
3. Add the DNS records Resend shows you to your domain registrar
4. Wait for verification (5–30 minutes)
5. Go to API Keys → Create API Key → copy it
6. The `from` email in the code uses `hello@elevique.in` — make sure this domain is verified

---

## Step 4 — Deploy to Vercel

### Connect repository

### Vercel setup

1. Go to [vercel.com](https://vercel.com) → Add New Project
2. Import your GitHub repository
3. Framework: Next.js (auto-detected)
4. Root Directory: `.` (or `elevique-portal/` if in a subfolder)
5. **Before deploying** → Go to Environment Variables and add all 7 variables from `.env.local`
6. Click Deploy

### Add production environment variables in Vercel

Go to: Project → Settings → Environment Variables

Add all 7 variables. Set them for **Production**, **Preview**, and **Development** environments.

---

## Step 5 — Custom Domain

### If using Vercel Pro ($20/month)

1. Vercel Dashboard → Project → Settings → Domains
2. Add domain: `portal.elevique.in`
3. Vercel shows you a CNAME record to add
4. Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
5. Add CNAME: `portal` → `cname.vercel-dns.com`
6. SSL is automatic (Let's Encrypt via Vercel)

### If using Cloudflare (recommended — free SSL + DDoS)

1. Add your domain to Cloudflare (free plan)
2. Update nameservers at your registrar to Cloudflare's
3. In Cloudflare DNS → Add record:
   - Type: `CNAME`
   - Name: `portal`
   - Target: your Vercel deployment URL (e.g. `elevique-portal.vercel.app`)
   - Proxy status: Proxied (orange cloud = DDoS + CDN protection)
4. In Vercel → Domains → Add `portal.elevique.in`
5. Vercel verifies via Cloudflare automatically

---

## Step 6 — Post-Deployment Verification

Test each of these after deploying:

```
✅ https://portal.elevique.in/api/health     → { "status": "ok" }
✅ https://portal.elevique.in/admin/login    → Login page loads
✅ https://portal.elevique.in/team/login     → Login page loads
✅ https://portal.elevique.in/portal/login   → Login page loads
✅ https://portal.elevique.in/admin/dashboard → Redirects to login (not logged in)
✅ Login as admin → dashboard loads with stats
✅ Create a team member account → welcome email received
✅ Create a client account → welcome email received
✅ Create a project → 4 milestones + 6 folders + 6 checklist items auto-seeded
✅ Assign team member → they see the project when logged in
✅ Client logs in → sees only their own project
✅ File upload → file appears in folder + signed URL download works
✅ Milestone update → client portal updates in real-time (test in two browsers)
```

---

## Supabase Production Settings

Enable these after going live:

### Point-in-Time Recovery (PITR)
- Supabase Dashboard → Settings → Backups
- Requires Pro plan ($25/month)
- Recommended once you have real client data

### Auth settings
- Supabase Dashboard → Authentication → Settings
- Disable: Email confirmations (admin creates users, no self-signup)
- Disable: Enable email signup (no public signup)
- Set JWT expiry: 3600 (1 hour) — sessions expire after 1 hour of inactivity

### Connection pooling
- Supabase Dashboard → Settings → Database → Connection Pooling
- Mode: Transaction
- Copy the pooled connection string
- Use it in any direct DB connections (e.g. migrations, Prisma — not needed for this stack)

---

## Ongoing Maintenance

| Task | How Often | How |
|------|-----------|-----|
| Regenerate DB types | After any schema change | `npm run db:types` |
| Review error logs | Weekly | Vercel Dashboard → Functions → Logs |
| Check storage usage | Monthly | Supabase Dashboard → Storage |
| Review activity log | As needed | Admin Panel → (build an activity page) |
| Update dependencies | Monthly | `npm outdated` → update cautiously |
