# Deployment guide

The stack (Next.js + Postgres) is intentionally boring to deploy. This
walks through Vercel + Supabase, which matches the build spec's
suggested stack and has a free tier that comfortably covers a five-person
program (`docs/ARCHITECTURE.md` has the reasoning for these picks; swap
either for Neon/Railway/Fly/your own Postgres without changing any code
— it's a connection string).

## 1 · Provision Postgres

**Supabase** (recommended — matches the build spec):
1. Create a project at [supabase.com](https://supabase.com)
2. Settings → Database → copy the connection string (use the "Session
   pooler" one for serverless compatibility)

**Neon** (equally fine, slightly simpler free tier):
1. Create a project at [neon.tech](https://neon.tech)
2. Copy the connection string it gives you at creation

Either way, you now have your production `DATABASE_URL`.

## 2 · Run migrations against production

From your local machine, pointed at the production database:

```bash
DATABASE_URL="<production connection string>" npm run db:migrate
```

Do this once before the first deploy, and again after pulling any change
that touches `src/lib/db/schema/`.

## 3 · Deploy to Vercel

```bash
npm install -g vercel     # if you don't have it
vercel login
vercel
```

Or connect the GitHub repo at [vercel.com/new](https://vercel.com/new) for
deploys-on-push instead of CLI deploys — either works, nothing here is
CLI-specific.

### Environment variables

In the Vercel project's Settings → Environment Variables, set everything
from `.env.example` that you're using. At minimum:

```
DATABASE_URL=<from step 1>
APP_URL=https://<your-vercel-domain>
SESSION_SECRET=<openssl rand -base64 32>
ENCRYPTION_KEY=<openssl rand -base64 32>
CRON_SECRET=<openssl rand -hex 24>
```

Add the optional integrations (`ANTHROPIC_API_KEY`, `LINKEDIN_CLIENT_ID`
/ `_SECRET`, etc.) the same way, following `docs/SETUP.md §6` for how to
obtain each one. **Update the redirect URLs registered with LinkedIn/Meta
to your production `APP_URL`** — they were pointed at `localhost` during
local setup and OAuth will fail silently against the wrong one.

## 4 · Wire up the nightly job

The nightly job needs something to trigger it once a day — it does not
run itself. Two options, matching the build spec's own recommendation
(architecture-options.md ranks a scheduled trigger above cron-on-an-idle-machine):

**Option A — Vercel Cron** (simplest, included free on Vercel):

Add to `vercel.json` in the repo root:
```json
{
  "crons": [{ "path": "/api/cron/nightly-generation", "schedule": "0 11 * * *" }]
}
```
This fires daily at 11:00 UTC (adjust for when you want tomorrow's
queue ready — build-spec.md's US-evening-IST window suggests generating
overnight IST, e.g. `0 17 * * *` for ~10:30pm IST). Vercel Cron sends no
auth header by default, so also set this in the same file:
```json
{ "crons": [...], "headers": [] }
```
and instead protect the route by checking Vercel's own
`x-vercel-cron` behavior, **or** simpler: set a custom header via
Vercel's cron config (`vercel.json` supports it in newer versions), or
just call the endpoint from a GitHub Action instead (Option B) if you
want the `Authorization: Bearer <CRON_SECRET>` check to actually gate
anything.

**Option B — GitHub Actions** (works from any host, gives you real logs):

```yaml
# .github/workflows/nightly-job.yml
name: Nightly queue generation
on:
  schedule:
    - cron: "0 17 * * *"   # adjust to your timezone target
  workflow_dispatch: {}      # lets you trigger it manually from the Actions tab
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -X POST "https://<your-domain>/api/cron/nightly-generation" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```
Add `CRON_SECRET` (the same value you set on Vercel) as a repository
secret. This is the more reliable option since it actually exercises the
auth check and gives you a visible run history.

Either way, verify it worked: check **Admin → Overview** the morning
after for participant counts and item totals, or query
`generation_jobs` directly.

## 5 · Push notifications in production

Generate VAPID keys once (`npx web-push generate-vapid-keys`) and set
them as environment variables — the same keys work across every
deployment, don't regenerate them per-environment or existing
subscriptions will break.

## 6 · Smoke-test after deploy

1. Visit the production URL, sign in with an email — confirm the
   bootstrap-admin rule works (first sign-in only)
2. **Admin → Participants** → add the real team
3. Trigger the nightly job manually once (GitHub Actions'
   `workflow_dispatch`, or `curl` the cron endpoint directly with the
   secret) and confirm a queue appears
4. If LinkedIn is configured: **Persona → Accounts → Connect LinkedIn**,
   confirm the OAuth round-trip completes and lands back on `/persona`

## 7 · Ongoing operations

- **Monitor spend:** Admin → Overview shows 30-day API spend against
  `MONTHLY_SPEND_CAP_USD`. There's no hard cutoff enforced yet (see
  `docs/ARCHITECTURE.md` known gaps) — this is a dashboard, not a limiter.
- **LinkedIn token expiry:** the app refreshes automatically; Persona
  shows a warning badge starting 7 days before expiry as a backstop.
- **Database backups:** both Supabase and Neon offer automatic daily
  backups on their free/pro tiers — confirm yours is enabled, this app
  doesn't run its own.
