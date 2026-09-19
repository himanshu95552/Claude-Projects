# Alpha Nodus Advocacy

The daily-queue app for Alpha Nodus's team-led LinkedIn advocacy program.
A handful of real employees each own one topic, post under their own
names, and the app does everything except the parts only a human should
do: writing overnight drafts, tracking who's worth reaching out to next,
and handing a person a queue of cards to review and click through in
about 20 minutes.

**The one rule the whole app is built around:** the system prepares, a
human executes. Nothing publishes, comments, follows, or connects without
someone looking at it and clicking a button. See
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for why that's a hard
constraint, not a design preference.

## New here? Start with one of these

| I want to... | Read |
|---|---|
| Run this on my laptop in the next 10 minutes | [`docs/SETUP.md`](docs/SETUP.md) |
| Understand how it's built and why | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| Put it on the internet for real people to use | [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) |
| Use the app as a participant or admin | [`docs/USER_GUIDE.md`](docs/USER_GUIDE.md) |
| See what's genuinely done vs. simplified for v1 | [`docs/ARCHITECTURE.md#known-gaps-and-simplifications`](docs/ARCHITECTURE.md#known-gaps-and-simplifications) |

## What's actually built

Every module in the original build spec's phases 1–5, plus a deliberately
thin phase 6 (the source plan itself scopes phase 6 that way):

- **Auth** — magic-link sign-in, no passwords, role-based access
  (participant / operator / admin)
- **Onboarding** — a 7-step guided wizard: identity, consent (a hard
  gate, recorded with a timestamp and version), lane selection, voice
  capture, cadence, schedule, tour
- **Daily queue** — publish, first-hour comments, general comments,
  replies, follow, connect, amplify — each card editable inline, an
  "explain" panel on every item, skip-with-reason, a progress bar and
  streak
- **Persona editor + test bench** — voice sliders, free-text rules, a
  story bank, and a way to preview a generated sample against candidate
  settings before saving
- **Weekly summary** — computed live from the week's queue data:
  posts shipped, completion rate, skip reasons, a participation nudge
- **Admin** — program KPIs, a review queue with SLA aging, an
  add-participant flow, a versioned config editor with a visible change
  log, a 30-day spend monitor
- **Generation** — the LinkedIn skills bundle's actual methodology
  (20 hook formulas, the humanizer's AI-tell scrubbing, comment/reply
  templates, thread-flattening rules) ported into typed, unit-tested
  TypeScript, wired to the Claude API with prompt caching and a Batch
  API path for the nightly job — and a clearly-labeled `DEMO_MODE`
  fallback so the whole app runs and is fully clickable with zero API
  keys configured
- **LinkedIn** — real OAuth (`w_member_social`), real publish, and
  transparent token refresh before the 60-day expiry ever bites
- **Instagram / Facebook** — intentionally thin, per the build spec's
  own scoping ("day-60 cut decision")
- **PWA** — installable, a service worker, real web push

Everything above is covered by 74 unit tests and 13 end-to-end tests
(`npm test`, `npm run test:e2e`) and has been exercised in an actual
browser against real seed data, not just typechecked.

## Quickstart

```bash
npm install
cp .env.example .env.local        # then fill in DATABASE_URL at minimum
npm run db:migrate
npm run db:seed                    # optional — real program data (Tushant + Shamit)
npm run dev
```

Open `http://localhost:3000`, sign in with any email (the first one
becomes an admin), and you're in. Full walkthrough, including how to get
a local Postgres running if you don't have one: [`docs/SETUP.md`](docs/SETUP.md).

## Tech stack

Next.js (App Router) + TypeScript + Tailwind, Postgres via Drizzle ORM,
magic-link auth, Anthropic SDK (Batch API for the nightly job), web-push
for notifications. Reasoning for each choice: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Repository layout

```
src/
  app/            Next.js routes — pages and API routes side by side
  components/     UI, grouped by feature (queue/, persona/, admin/, onboarding/, pwa/, ui/)
  domain/         Business logic with no framework dependency (ladder, governance, queue-builder...)
  lib/
    db/           Drizzle schema + migrations
    config/       The versioned global→lane→participant settings engine
    generation/   The ported LinkedIn methodology + Claude prompt contracts
    integrations/ LinkedIn / Meta / Claude API clients, token encryption
    auth/         Magic-link + session logic
    push/         Web push sending
scripts/          seed.ts, migrate.ts, nightly-job.ts — all runnable directly
tests/
  unit/           Vitest — domain logic, generation modules, config engine
  e2e/            Playwright — every screen's golden path, real browser
docs/             Everything in the table above
```

## Also in this repo

This repository also carries `.claude/skills/task-observer/` and its
`CLAUDE.md` activation block — tooling for the coding-assistant session
that built this, unrelated to the advocacy app itself and documented
separately in [`docs/REPO_TOOLING.md`](docs/REPO_TOOLING.md). None of it
affects running or deploying the app.
