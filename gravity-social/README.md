# Gravity Social OS

**The AI social media team for Alpha Nodus's Gravity, run on Claude, with one person holding the final say.**

Rebuilt from *The AI Social Media Team That Runs on One Person* (ReStructure Brief; the text and all seven images are mapped in [`research/reference-architecture.md`](research/reference-architecture.md)) for a B2B imaging brand, on the AN27 positioning: *Gravity is the Agentic Operations System (AOS) for your CRM, RIS and RCM. No referral leaks. No order leaks. No revenue leaks.*

```
 Signals ─────────► 03 The Brain (Claude Code: skill gravity-social) ◄──── Owner inputs (config.yaml, approvals)
 LinkedIn · X ·        triage · route · prioritize · check the work            │
 Instagram · inbox          │                                                  │
                            ▼                                                  ▼
 ┌──────────────┐  ┌────────────────┐  ┌──────────────────────────┐  ┌──────────────────┐
 │ 1 Research   │─►│ 2 Content      │─►│ 3 Approval ─► Scheduling  │─►│ Report           │
 │ signals      │  │ native per     │  │   gate.py     Metricool   │  │ post → click →   │
 │ competitors  │  │ platform,      │  │   (a person)  (hook-gated)│  │ demo → pipeline  │
 │ questions    │  │ linted,        │  │ Community: inbox, leads,  │  │ 7:30 one-page    │
 │ hook lab     │  │ rendered       │  │ never-auto-reply list     │  │ morning brief    │
 └──────────────┘  └────────────────┘  └──────────────────────────┘  └──────────────────┘
        ▲                                 04 Knowledge layer: brand/ · platforms/ · content/pillars.md
        └──────────────── the report's winners feed next week's research ─────────────────┘
```

## What makes it Gravity-specific, not generic

- **Every word is checked against AN27.** `brand/guardrails.yaml` enforces the retired language (platform, AI-powered, seams, front office, personas, RPA bots, "get the referral"…), the security wording (never SOC 2 or "HIPAA certified"), "we don't read the scan," channel safety (no "replace your RIS"), and never blaming staff.
- **Every number comes from the proof ledger.** `brand/proof-ledger.yaml` holds the only figures allowed in public (Tower Radiology's RSNA 2021 results, 85% vs 65%, the modeled $154 exam, the AMA and MGMA benchmarks…) with their qualifiers. The linter fails any $, % or large number that isn't there, requires "modeled" on unit economics, and requires the $21 conservative case wherever the $31 expected case appears.
- **Every platform gets its own piece.** One weekly angle becomes a LinkedIn document carousel, a founder story for Shamit, an X thread, an Instagram reel and a YouTube Short, each following its playbook in `platforms/` and the hard limits in `platforms/limits.yaml`. Cross-posting the same text is blocked.
- **The calendar runs to RSNA 2026** (Chicago, Nov 29 to Dec 3): category seeding → proof and economics → countdown → live → follow-up (`config.yaml`, `content/pillars.md`).
- **Leads are B2B imaging leads.** "Does it work with our RIS?", "RFP," "meet at RSNA," not "how much?". Patients, PHI, complaints, customers, partners, press and security questions are never auto-replied (`community/`).
- **Results are measured in pipeline.** Every link carries its post id (`utm_content`). Demo bookings happen in Calendly, and `scripts/import_calendly.py` ties each booking back to the post that earned it (`reports/attribution.md`).

## The human gate (structural, not a promise)

1. Drafts land in `content/queue/pending/`.
2. `scripts/gate.py approve <id> --by "<approver>"` re-lints the post, records who and when, and seals the public text with a SHA-256.
3. A Claude Code **PreToolUse hook** (`.claude/settings.json` → `scripts/metricool_gate_hook.py`) blocks every Metricool create or update call unless the text exactly matches an approved, unedited post, goes to exactly one network, and uses `autoPublish: false` (per config). Edit a post after approval and it's blocked until re-approved.
4. Optional second gate: Metricool's own review flow (`createScheduledPostForReview`) with named reviewers.

Tested: lint refusal, unknown approver, exact-match pass, unapproved text, cross-posting, autoPublish, malformed payload, and edit-after-approval.

## Using it (talk to Claude in this repo)

| Say | What happens |
|---|---|
| "Plan next week" | research brief → drafts for every enabled platform → lint → carousels rendered → dashboard |
| "Show me the queue" | the Content tab of `content/dashboard.html`, with a preview of each post as it will look on its platform |
| "Approve 2026-W40-li-co-02 and all the X posts" | `gate.py approve …` in your name (Tushant day to day; Shamit for his own posts) |
| "Reject li-co-03: too salesy" | rejected with your reason; a rewrite is offered |
| "Schedule the approved posts" | Metricool, one network per post, at the best time, behind the hook |
| "Here are this week's comments: …" | classified, leads logged, replies drafted, sensitive ones routed to you |
| "Here's this week's Calendly export" | bookings tied to posts, company domain only |
| "Morning brief" | the one-page brief, the Growth tab refreshed |

Or run the pieces yourself from `gravity-social/`:

```bash
python3 scripts/gravity_lint.py --state pending --write   # brand, ledger and platform checks
python3 scripts/render_carousel.py --state pending        # PNG frames + LinkedIn PDF, in brand fonts
python3 scripts/build_dashboard.py                         # content/dashboard.html (5 tabs)
python3 scripts/gate.py status | show <id> | approve <id> --by "Shamit Patel"
python3 scripts/morning_brief.py                           # reports/daily/<date>.md
python3 scripts/utm.py --cta exam-itemized --platform x --post 2026-W41-x-01
python3 scripts/import_calendly.py ~/Downloads/calendly-export.csv   # demo bookings -> reports/outcomes.csv
```

Requirements: Python 3.10+ with PyYAML; Node with Playwright and Chromium (for rendering only).

## What's in the first run (week 40: 28 Sep to 4 Oct)

- `research/briefs/2026-W40.{yaml,md}`: signals (Surest prior auth for outpatient CT/MRI/PET from Oct 1, the CY2027 fee schedule, agentic AI in radiology being defined as reading), LinkedIn posts that outperformed (via Crustdata), audience questions, and a 6-hook lab with originality scores.
- 15 drafts in `content/queue/pending/`: 4 LinkedIn company (poll, the five-tests document carousel, the Surest post, the agentic-AI post), 2 for Shamit, 5 X (including a 7-part thread), 3 Instagram (2 carousels, 1 reel script), 1 YouTube Short (same shoot as the reel). All pass lint with 0 errors and 0 warnings. **None are approved.**
- Rendered carousels in `content/assets/`, the dashboard, and today's brief.

## Review on your phone

The private review page (`config.yaml → review_page`, https://claude.ai/artifact/3GHPfJ9kALVRvnDwseyBrd) shows all five tabs with Approve/Reject on every pending post. Pick who you are ("Approving as"), tap, then tap again to confirm. Taps are recorded in the queue by the weekday 7:25 a.m. CT run or when you say "sync approvals" (`scripts/sync_decisions.py`: same gate rules, and a post edited after you saw it is refused as stale). To let Shamit approve from his phone, share the page with him as **Contributor**.

## Testing

`python3 tests/e2e.py` (add `--render` to re-render carousels) copies the system to a temp folder and runs a full week through every stage: lint, approval roles, the Metricool gate for each platform, scheduling marks, metrics, Calendly import, inbox and leads, page decisions, the brief and both dashboards. 54 checks.

## Private data

The repo is public, so files holding other people's data are git-ignored and stay local: `community/inbox/*.yaml`, `community/leads.csv`, `reports/outcomes.csv`, `reports/metrics/*.json`, `reports/daily/`. Templates are committed instead. They don't survive a fresh clone; move them to a private repo if they need to be versioned.

## Setup still needed (one-time)

| # | What | Where |
|---|---|---|
| 1 | Connect LinkedIn (company page), X, Instagram and YouTube to Metricool brand `6979710` (create the YouTube channel if there isn't one) | app.metricool.com → Brand → Connections |
| 2 | Metricool reviewer emails for the second gate (Tushant, Shamit) | `config.yaml` → `approval.metricool_reviewers` |
| 3 | Somewhere public for media (Google Drive linked in Metricool works) | Instagram and LinkedIn documents need public URLs |
| 4 | RSNA booth number | `config.yaml` → `campaigns[0].booth` |
| 5 | Pages for the CTAs: `/aos` (the v1.1 definition) and a "your exam, itemized" request page; both point to live pages until then | `config.yaml` → `links` |
| 6 | Tie Calendly bookings to posts: set `links.calendly_demo` to the Calendly event URL, **or** swap the contact-page embed for `reports/calendly-embed-snippet.html` | `reports/attribution.md` |
| 7 | Optional: a weekday Routine for the morning brief and inbox triage | ask Claude to set it up |

## Folder map

```
config.yaml                  accounts, cadence, approvers, links, campaign phases
brand/                       voice · messaging · proof-ledger.yaml · guardrails.yaml · visual · search vocabulary
platforms/                   one playbook per platform + limits.yaml
research/                    reference architecture · weekly briefs (yaml + md)
content/pillars.md           9 pillars, weekly mix, phase weighting, angle bank
content/queue/{pending,approved,rejected,scheduled,published}/   one .md per post
content/assets/<post-id>/    rendered frames + PDF
content/dashboard.html       the app: Research · Content · Posting & community · Growth · Brief
community/                   intent taxonomy · reply playbook · inbox/ · leads.csv
reports/                     attribution method · metrics/ · outcomes.csv · daily/
scripts/                     lint · gate · hook · render · dashboard · brief · utm
templates/                   post.md · brief.yaml
../.claude/skills/gravity-*  the Brain + research, content, publish, community, report
```

Source of truth: AN27 Positioning and Messaging v1.7, Messaging Package v1.0, Customer Pitch Deck Outline v2.1, Winning Story and Pitch Narrative v1.1, Unit Economics Closer v1.1, SEO and Keyword Map v0.1, and the AOS Definitional Page v1.1 (`brand/aos-definition.md`). When they change, update `brand/` first.
