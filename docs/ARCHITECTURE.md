# Architecture

This document explains how the app is put together and why, so a future
contributor (human or AI) can extend it without re-deriving decisions
that are already settled. It follows the source build spec's own
structure, because the spec's reasoning is good and this build didn't
deviate from it without saying so.

## 1 · The one non-negotiable

**The system prepares. A human executes.** Every publish, comment,
reply, follow, and connection request is a person deciding and clicking
— in the app or on the platform itself. Nothing runs on a timer that
touches a platform.

This shows up in the code in specific, checkable ways:
- The nightly job (`src/domain/nightly-job.ts`) only ever writes rows
  into `queue_items` with `status: 'pending'`. It has no code path that
  calls a platform API.
- The only place a real LinkedIn API call happens is
  `POST /api/linkedin/publish`, which requires a queue item to already
  exist, be `pending`, and not be under review — i.e., it can only ever
  be triggered by a click on a specific card.
- There is no scheduler, cron job, or background worker anywhere in the
  codebase that publishes, comments, follows, or connects. The only
  scheduled component is the nightly generation job, and see above for
  what it's restricted to.
- Manual-fulfillment items (follow, connect — see §4) have no API path
  at all, by design, because LinkedIn doesn't expose one; this isn't a
  gap to fill later, it's permanent.

## 2 · Shape

```
Participant's phone/desktop (PWA)
        ↕  HTTPS
Next.js app — auth, queue API, config, OAuth token vault
        ↕
  ├→ Claude API (drafting + research; DEMO_MODE fallback with no key)
  ├→ LinkedIn / Instagram / Facebook APIs (publish on click only)
  └→ Postgres (participants, queues, voice profiles, targets, config, ...)

Nightly job (npm run nightly-job, or POST /api/cron/nightly-generation)
  → research sweep → draft → build tomorrow's queues
  → never touches a platform
```

One shared backend, not per-person local installs — build-spec.md's own
comparison table is the reasoning, and it holds: asking a non-technical
participant to obtain and manage an API key is where these programs lose
people before they start. "Runs on their system" means *their account,
their device, their data* — never their compute.

## 3 · Why these specific technology choices

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js App Router | Server components read straight from Postgres with no separate API layer for read paths; API routes cover the writes; one deploy target |
| Database | Postgres + Drizzle ORM | Relational fits this domain exactly (participants → lanes, queues → items, versioned config rows); Drizzle keeps schema as reviewable TypeScript instead of a separate DSL, and its migrations are plain SQL you can read before running |
| Auth | Hand-rolled magic-link | No passwords to manage or leak; simple enough (~150 lines total) that owning it beats an adapter-version-compatibility tax from a full auth library for a program this size |
| Generation | Anthropic SDK directly | Batch API access for the nightly job's 50%-cheaper path, and prompt caching control that a generic AI SDK wrapper would abstract away right when it matters most for cost |
| Push | web-push (VAPID) | No vendor, no third-party dashboard, works with any browser that supports the standard |
| Styling | Tailwind v4 + CSS custom properties | Design tokens as `--color-*` variables give light/dark for free through `@theme inline`; no separate design-system package for an app this size |

None of this is load-bearing in a way that resists change — see §7 for
what actually would need to change to add a second backend framework or
swap the database, and why nothing here should be read as "the only way
to do it."

## 4 · The two-fulfillment-path rule

Every `queue_item` carries a `fulfillment` value: `api_publish` or
`manual_link`. This isn't a UI nicety — it's downstream of a real
platform constraint (see `03-research/platform-api-capabilities.md` in
the original handoff package, and its 2026 research citations):

- **`api_publish`** — LinkedIn posts and comments (via `w_member_social`,
  self-serve, approved same day) and, once configured, Instagram/Facebook
  posts. These get a real "Post" / "Post to LinkedIn" button that calls
  the platform API on click.
- **`manual_link`** — follows, connection invites, and page follow-invites.
  LinkedIn has **no public API for any of these**, for any developer, at
  any approval tier — not a gap this build left open, a wall. These items
  render with a copy button and an open-in-LinkedIn link, and "mark
  done" only records that the person did it themselves.

The two card types are deliberately never unified into one rendering
path (`src/components/queue/item-card.tsx`) — collapsing them would mean
either lying about what a button does, or blocking on an API that will
never exist.

## 5 · Data model

Full schema: `src/lib/db/schema/`, one file per table family, each with a
comment explaining the non-obvious choices. The two decisions worth
calling out specifically, because they're easy to get wrong and both
directly encode a build-spec.md requirement:

**Config is versioned, never overwritten.** `configs` rows are never
`UPDATE`d in place — a save inserts a new row with the incremented
version and flips `is_current`. This makes the config editor's "change
log" just a query, not a separate audit table, and answers "what changed
and when" by construction whenever quality shifts (`src/lib/config/resolve.ts`).
Cadence, voice profiles, and lane assignments follow the same pattern —
see `voice_profiles.version` and the participant-scope rows in `configs`.

**`edited_content` is kept separate from `content`.** When a participant
edits a draft before posting, the original AI draft and their edit are
both preserved (`queue_items.content` vs `.editedContent`). That diff is
the highest-quality voice-training signal available and is what the
monthly voice-profile refresh is meant to read — not yet automated (see
§7), but the data it needs is captured from day one.

## 6 · Config resolution: global → lane → participant

Every tunable number in the program (`src/lib/config/schema.ts`) resolves
through three layers, each overriding only the keys it sets:

```
GLOBAL_DEFAULTS (code, always present)
  → global config row (optional override)
    → lane config row (optional override)
      → participant config row (optional override, wins)
```

`resolveSettings()` deep-merges these at read time; nothing downstream
ever sees a partial config. This is build-spec.md's most explicit
requirement ("if marketing might want to change it, it's a setting, not
a constant") made structural rather than aspirational — there's no
hardcoded cadence, targeting threshold, or governance rule anywhere in
the generation or queue-building code; it all flows through this one
function, covered by tests that specifically assert the override
ordering (`tests/unit/config-resolve.test.ts`).

## 7 · Known gaps and simplifications

Named explicitly, the same way the source handoff package named its own
gaps — a list like this is more useful than pretending everything is
finished:

| Gap | What exists instead | What real work looks like |
|---|---|---|
| **No live LinkedIn activity monitoring** | `src/domain/research-signals.ts`'s `DemoResearchProvider` — deterministic, date-seeded mock signals so the queue builder is fully testable | Swap in a real `ResearchProvider` implementation backed by a monitoring/search service; the interface is the seam, nothing else changes |
| **Company-page posting not built** | Amplify items exist and generate reshare commentary against a labeled placeholder "company post" | Gated behind LinkedIn's Community Management API approval (weeks, business verification) — same gate the source plan flags; build the real page-post flow once that's approved |
| **Nightly job runs single-call, not Batch API, in this environment** | `src/lib/generation/generate.ts` calls Claude per-item; `src/lib/integrations/claude/batch.ts` has the full Batch API wrapper (submit/poll/results) ready to use | Wire `queue-builder.ts` to build all participants' prompts, submit one batch, and process results in a second pass once nightly volume justifies the latency tradeoff |
| **Monthly voice-profile refresh from edit diffs isn't automated** | The data is captured (`content` vs `editedContent` on every item) | A scheduled job that runs `buildVoiceFingerprint()` over the month's edits and proposes slider adjustments for the participant to confirm |
| **Business-hours review SLA is wall-clock, not business-hours** | `computeReviewSlaDueAt()` adds raw hours | Skip nights/weekends if the 4-hour SLA needs to mean 4 *working* hours |
| **Instagram/Facebook are thin by design** | OAuth + publish exist; no IG-specific content generation, no carousel builder | Deliberately deferred — the source plan's own day-60 cut decision; build out only if the data says to |
| **Push subscription unverifiable in a network-restricted dev sandbox** | Every other layer (SW registration, VAPID key derivation, server send logic with 404/410 cleanup) verified directly | Confirm on an unrestricted deployment — the code doesn't change, only the environment it runs in |

## 8 · Where to extend things

- **New queue item type:** add to `queueItemTypeEnum` (schema), the
  `QUEUE_SECTION_ORDER` array (`src/domain/queue-order.ts`), a
  generation function (`src/lib/generation/generate.ts`), and a case in
  `queue-builder.ts`'s item-planning loop.
- **New config setting:** add the field to the relevant zod schema in
  `src/lib/config/schema.ts` and its default in `GLOBAL_DEFAULTS`. It's
  immediately editable from **Admin → Config** (the JSON-patch editor
  accepts any key in the schema) with zero UI code required.
- **New platform:** follow the LinkedIn integration's shape
  (`src/lib/integrations/linkedin/`) — `oauth.ts`, `client.ts`,
  `account.ts` for token lifecycle, then wire into
  `src/app/api/oauth/<platform>/`.
