# Setup guide

Everything you need to get this running, from "nothing installed" to a
fully working app. Follow it top to bottom the first time; after that,
skip to whichever integration you're adding.

## 1 · Prerequisites

- Node.js 20+ and npm
- A Postgres database — a local install, Docker, or a hosted one
  (Supabase, Neon both have generous free tiers)

You do **not** need an Anthropic API key, LinkedIn app, Meta app, or
push keys to get the app running end to end — every one of those is
optional and the app degrades gracefully without it (more on that
below).

## 2 · Install and configure

```bash
git clone <this repo>
cd <repo>
npm install
cp .env.example .env.local
```

Open `.env.local` and fill in at minimum:

```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
SESSION_SECRET=<run: openssl rand -base64 32>
ENCRYPTION_KEY=<run: openssl rand -base64 32>
CRON_SECRET=<run: openssl rand -hex 24>
```

`APP_URL` defaults to `http://localhost:3000`, which is correct for local
dev — change it when you deploy (see `docs/DEPLOYMENT.md`).

### Don't have a Postgres running yet?

**Option A — Docker (simplest):**
```bash
docker run -d --name advocacy-db -p 5432:5432 \
  -e POSTGRES_USER=app -e POSTGRES_PASSWORD=app_dev_password \
  -e POSTGRES_DB=alphanodus_advocacy postgres:16
```
Then `DATABASE_URL=postgresql://app:app_dev_password@localhost:5432/alphanodus_advocacy`.

**Option B — a hosted free tier (Supabase or Neon):** create a project,
copy the connection string it gives you into `DATABASE_URL`. This is
also what you'll use in production, so it's a reasonable place to start.

**Option C — native Postgres on your machine:** `createdb
alphanodus_advocacy` after installing Postgres normally, point
`DATABASE_URL` at `postgresql://<you>@localhost:5432/alphanodus_advocacy`.

## 3 · Migrate and seed

```bash
npm run db:migrate
```

This creates all 19 tables. Then, optionally:

```bash
npm run db:seed
```

This loads the real program data from the handoff package: the seven
lanes (two claimed — Category Education / Tushant, Industry POV /
Shamit — five open), the twelve cleared-customer names from
`governance.md`, both participants' actual voice profiles and cadences,
and the target roster from the worked queue example. Skip this if you'd
rather start from a completely empty program and add your own
participants through the admin UI.

## 4 · Run it

```bash
npm run dev
```

Open `http://localhost:3000`. You'll land on `/login`. Enter any email —
**the first email anyone signs in with becomes an admin automatically**
(this is the bootstrap rule; every subsequent sign-in only works for an
email an admin has added). If you ran the seed step, sign in as
`tushant@alphanodus.com` or `shamit@alphanodus.com` instead to see the
real seeded data.

Since no email provider is configured yet, the magic link prints
straight to your terminal:

```
──────────────────────────────────────────────────────
  Magic link for you@example.com:
  http://localhost:3000/api/auth/callback?token=...
──────────────────────────────────────────────────────
```

Copy that URL into your browser. You're in.

## 5 · Generate a queue

Queues don't exist until the nightly job runs. Run it manually for
today:

```bash
npm run nightly-job                    # generates for tomorrow by default
npm run nightly-job 2025-01-15         # or a specific date
```

With no `ANTHROPIC_API_KEY` or `GROQ_API_KEY` set, this runs in
**`DEMO_MODE`** — every draft is clearly prefixed `[DEMO]` and the queue
is fully interactive (edit, skip, mark done) without ever calling a paid
API. This is deliberate: a fresh clone should be fully clickable before
anyone wires up a real account.

## 6 · Optional integrations

Each of these is independently optional. The app tells you what's
missing wherever it matters (a "not configured" message instead of a
broken button) rather than crashing.

### Generation provider (real drafts instead of `[DEMO]` placeholders)

Pick one. If both are set, Anthropic wins.

**Claude API:**

1. Get a key at [console.anthropic.com](https://console.anthropic.com)
2. Set `ANTHROPIC_API_KEY` in `.env.local`
3. Re-run `npm run nightly-job` — drafts now come from Sonnet 5 (Haiku 4.5
   for research passes), run through the humanizer audit, with prompt
   caching on the stable per-participant context

**Groq (faster, usually cheaper, no prompt caching):**

1. Get a key at [console.groq.com/keys](https://console.groq.com/keys)
2. Set `GROQ_API_KEY` in `.env.local` (optionally override
   `GROQ_DRAFTING_MODEL` / `GROQ_RESEARCH_MODEL`, default to
   `openai/gpt-oss-120b` / `openai/gpt-oss-20b`). Groq's lineup changes —
   check what your account actually has access to with:
   ```bash
   curl -s https://api.groq.com/openai/v1/models -H "Authorization: Bearer $GROQ_API_KEY"
   ```
3. Re-run `npm run nightly-job` — same humanizer audit and governance
   checks run regardless of which provider drafted the text

### LinkedIn (real "Post to LinkedIn" button)

1. Create an app at [linkedin.com/developers/apps](https://www.linkedin.com/developers/apps)
2. Add the **"Share on LinkedIn"** product — this is self-serve, approved
   same-day, and grants exactly the `w_member_social` scope this app uses
3. Under Auth, add this redirect URL: `<APP_URL>/api/oauth/linkedin/callback`
   (`http://localhost:3000/api/oauth/linkedin/callback` for local dev)
4. Copy the Client ID and Secret into `LINKEDIN_CLIENT_ID` /
   `LINKEDIN_CLIENT_SECRET`
5. Restart the dev server, sign in, go to **Persona → Accounts**, click
   **Connect LinkedIn**

Access tokens expire in 60 days; the app refreshes them automatically
starting 24 hours before expiry (`src/lib/integrations/linkedin/account.ts`).
If a refresh token itself has expired (~365 days), Persona shows an
"expired" badge with a reconnect button — nothing silently breaks.

### X / Twitter (real "Post to X" button)

1. Create a project and app at
   [developer.x.com](https://developer.x.com) with **OAuth 2.0** enabled
   (this app uses the PKCE flow, not OAuth 1.0a)
2. Under User authentication settings, request the scopes `tweet.read
   tweet.write users.read offline.access` — `offline.access` is what
   grants a refresh token, without which reconnecting every ~2 hours is
   the only option
3. Add this callback URL: `<APP_URL>/api/oauth/x/callback`
4. Copy the Client ID and Secret into `X_CLIENT_ID` / `X_CLIENT_SECRET`
5. Restart the dev server, sign in, go to **Persona → Accounts**, click
   **Connect X**

X access tokens expire in ~2 hours (far shorter than LinkedIn's 60
days), so the refresh margin is minutes, not days — the app refreshes
transparently on every publish call
(`src/lib/integrations/x/account.ts`). Once connected, every LinkedIn
publish item in the queue gets a companion X post, generated separately
and tuned for X's format and engagement signals rather than copy-pasted.

### Instagram / Facebook (optional, deliberately thin)

1. Create an app at [developers.facebook.com](https://developers.facebook.com)
2. Add Facebook Login and the Instagram Graph API products
3. Redirect URL: `<APP_URL>/api/oauth/meta/callback`
4. Set `META_APP_ID` / `META_APP_SECRET`
5. Connect from **Persona → Accounts**

The build spec itself scopes this as low-priority repurposing with a
day-60 review — don't spend much setup time here before the LinkedIn
track has real usage data.

### Email delivery for magic links (instead of console logging)

1. Sign up at [resend.com](https://resend.com) (or swap in your own
   provider by editing `src/lib/auth/mailer.ts` — it's one function)
2. Set `RESEND_API_KEY` and `MAIL_FROM`

### Push notifications

```bash
npx web-push generate-vapid-keys
```
Put the two keys into `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY`. Restart
the server, then **Persona → Accounts → Enable notifications**.

> **Note on sandboxed/restricted-network environments:** actually
> registering a push subscription requires the browser to reach its
> vendor's push service (Google's FCM for Chrome, Apple's APNs for
> Safari) directly from the internet. In a network-restricted dev
> container this step can fail even though every other part of the flow
> (service worker registration, VAPID key format, server-side send
> logic) is correct — this was verified during development. It works
> normally on an unrestricted deployment or a normal laptop.

## 7 · Run the tests

```bash
npm test              # 141 unit tests — domain logic, config engine, generation modules
npm run test:e2e       # 19 end-to-end tests — every screen's golden path, real browser
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
```

The e2e suite needs the dev server running (or it starts one itself —
see `playwright.config.ts`) and a reachable `DATABASE_URL`; it creates
and cleans up its own test participants, so it's safe to run against
your seeded dev database.

## 8 · Common problems

| Symptom | Fix |
|---|---|
| `Invalid environment configuration` on startup | You're missing `DATABASE_URL`, or another required var — the error names exactly which ones |
| Magic link 404s or shows "expired_link" | Links expire in 15 minutes and are single-use; request a new one |
| "That email hasn't been added to the program yet" | Only the very first sign-in auto-creates an admin; every other participant must be added via **Admin → Participants** first |
| Queue page says "No queue for today yet" | The nightly job hasn't run for today — see step 5 |
| `npm run db:migrate` fails with a permission error | Your Postgres user needs `CREATE` on the target database |
