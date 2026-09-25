# Gravity Social OS: session handoff

Everything a new Claude Code session needs to pick up this work: what was asked, what was built, what state it's in, what's left, and the rules that hold. Read this first, then `README.md` in this folder.

## 1. How to start the new session

1. Open a Claude Code session on `himanshu95552/Claude-Projects`, branch `claude/laughing-bardeen-5uf8wh`. If you start from the zip instead, unzip it, `git init`, and push to that branch (or just clone: `git clone -b claude/laughing-bardeen-5uf8wh https://github.com/himanshu95552/Claude-Projects`).
2. Paste the prompt in section 10 as your first message.
3. Re-upload the AN27 source documents (they're in the zip under `an27-source-docs/`) if you want Claude to re-read the originals. The distilled versions are already in `brand/`.
4. Optional: copy `local-only/` from the zip back into `gravity-social/`. It holds git-ignored files (the review-page HTML and today's brief). The lead and outcome files are empty headers, so there's no real data to carry over.

## 2. What was asked (in order)

- **Original ask (Tushant):** build the "AI social media team that runs on one person" (ReStructure Brief newsletter, re-structure.ai) as an app running on Claude, for **Alpha Nodus** (alphanodus.com) and its product **Gravity**. It had to be platform-specific, never generic. Read every AN27 document in detail and review the article's images from start to end. Make it "super good."
- **Answers given:**
  - Post on LinkedIn, X, Instagram and YouTube Shorts.
  - The day-to-day approver is **Tushant** (marketing manager). **Shamit Patel** (founder) approves his own posts.
  - Demo requests come in through the **Calendly** link on the website's contact page.
  - Keep the repo **public**.
  - The morning brief runs on **US Central** time.
- **Then:** audit everything end to end (every text and every image), build what's missing, and say what can't be done. Publish the dashboard as a private review page and set up the daily brief.
- **Then:** fold in the later uploads, Winning Story v1.1 and AOS Definitional Page v1.1.
- **Last:** move to a new session with a full handoff and a zip of the code. That's this file.

## 3. What was built

| Part | Where | What it does |
|---|---|---|
| The Brain (orchestrator) | `.claude/skills/gravity-social/` | Triage, routing, weekly rhythm, rules that never bend, phone-approval sync, daily run |
| Research | `.claude/skills/gravity-research/` | 8 agents (trends, competitors via Crustdata, questions, hook lab, keywords, audience, idea bank, planner). Writes `research/briefs/<week>.{yaml,md}` |
| Content | `.claude/skills/gravity-content/` | Writes native posts per platform, then lints, renders carousels and builds the dashboard |
| Publish | `.claude/skills/gravity-publish/` | Approval through `gate.py` or page taps. Schedules in Metricool, one network per post, autoPublish false. Shamit posts founder posts himself |
| Community | `.claude/skills/gravity-community/` | Intent taxonomy, reply drafts, leads, and the never-auto-reply list (PHI, patients, press, security…) |
| Report | `.claude/skills/gravity-report/` | Metricool analytics, Calendly import, the morning brief, dashboards, republishing the page |
| Knowledge layer | `brand/`, `platforms/`, `content/pillars.md` | Voice, messaging, the proof ledger (P01–P23, B01–B17), guardrails (regex rules), the verbatim AOS definition, visual system, search vocabulary, one playbook per platform, limits |
| Scripts | `scripts/` | `gravity_lint.py`, `gate.py`, `metricool_gate_hook.py`, `utm.py`, `render_carousel.py/.cjs` (embedded Inter and Space Grotesk), `build_dashboard.py`, `morning_brief.py`, `import_calendly.py`, `fill_media_urls.py`, `sync_leads.py`, `record_metrics.py`, `sync_decisions.py`, `gs_common.py` |
| Hard gate | `../.claude/settings.json` | A PreToolUse hook blocks every Metricool create or update call that doesn't exactly match an approved, unedited post |
| Tests | `tests/e2e.py` | 54 end-to-end checks in a temp copy (`--render` makes 55). **All pass.** |

## 4. Current state (as of 25 Sep 2026)

- **Commits** on `claude/laughing-bardeen-5uf8wh`, all pushed:
  - f3a8160: task-observer
  - 7970504: initial OS
  - 5898c6a: Tushant, YouTube, Calendly
  - 54adad3: audit fixes, phone approvals, e2e
  - 83dea83: review page and daily run
  - 0986e25: Winning Story and AOS v1.1
  - This handoff.
- **Week 40 queue (28 Sep to 4 Oct):** 15 drafts in `content/queue/pending/`. All pass lint with 0 errors and 0 warnings. **None are approved.**
  - LinkedIn company: li-co-01 (poll), li-co-02 (the five-tests document carousel), li-co-03 (Surest prior auth from Oct 1), li-co-04 (agentic AI).
  - LinkedIn founder: li-sp-01 (six weeks), li-sp-02 (why we named a category).
  - X: x-01 to x-05 (x-02 is a 7-part thread).
  - Instagram: ig-01 and ig-03 (carousels), ig-02 (reel script).
  - YouTube: yt-01 (a Short from the same shoot as the reel).
- **Rendered carousels:** `content/assets/<id>/frame-NN.png` plus `carousel.pdf` for li-co-02 (8 frames), ig-01 (6) and ig-03 (7).
- **Review page (private):** https://claude.ai/artifact/3GHPfJ9kALVRvnDwseyBrd. It has 5 tabs and Approve/Reject buttons. Taps go to its `decisions` collection, which was empty at handoff. You own it, so any session can update it by passing that URL.
- **Daily Routine:** "Gravity morning brief" (`trig_01ToSKBx1SKfpokPKtRe6cUE`) runs weekdays at 7:25 a.m. US Central. **It fires into the old session**, `session_01Jwttej1FXByihqVsDCYB94`. In the new session, either:
  - update it with `persistent_session_id` set to the new session, or
  - delete it and create a new one from the new session.
- **task-observer log:** `~/.claude/skill-observations/observation-log/`. It has two open observations, 0001 and 0002. Both propose a `brand-content-system` skill. That log lives in the old container, so it doesn't carry over unless you copy it; the zip includes it under `local-only/skill-observations/`.

## 5. Rules that never bend

1. Never run `gate.py approve` without an explicit, **named** approval in the conversation, or a review-page tap recorded through `scripts/sync_decisions.py`. Approver names: `Tushant` or `Shamit Patel`. Founder posts need Shamit.
2. Never get around the Metricool hook. That means:
   - no editing after approval,
   - no posting to more than one network per post,
   - autoPublish always false.
3. Every number comes from `brand/proof-ledger.yaml`, with its qualifiers:
   - Unit economics always say *modeled*.
   - The $31 expected case always appears with the $21 conservative case.
4. Language rules:
   - Never use the retired words: platform, AI-powered, seam, front office, RPA bots, "get the referral".
   - Personas (Sasha, Sandra, Susan) stay internal.
   - Never say "SOC 2" or "HIPAA certified".
   - Keep "We don't read the scan. We make sure it gets back."
   - Never blame staff.
   - No em dashes.
5. **No PHI**, ever. The demo tenant only: Maria Lopez, 52, knee MRI, referred by Dr. Patel's office.
6. **The repo is public.** Never commit leads, inbox items, outcomes, metrics, daily briefs, viewer ids, or the newsletter's `mcp_token` URL.
7. Develop only on `claude/laughing-bardeen-5uf8wh`. Open a PR only when asked. Keep model names out of commits and files.
8. `CLAUDE.md` sets the session-start protocol: run the task-observer protocol first, then use the `gravity-social` skill for any social work.

## 6. Still open (needs a person or an outside system)

| # | Item | Owner |
|---|---|---|
| 1 | Connect LinkedIn company page, X, Instagram and YouTube to Metricool brand `6979710`; create the YouTube channel if needed | Tushant |
| 2 | Calendly event URL into `config.yaml → links.calendly_demo`, or add `reports/calendly-embed-snippet.html` to the contact page | Tushant / web |
| 3 | RSNA 2026 booth number → `campaigns[0].booth` | Tushant |
| 4 | Metricool reviewer emails → `approval.metricool_reviewers` | Tushant |
| 5 | Shoot the reel and the Short (ig-02 and yt-01) on the demo tenant | Team |
| 6 | Shamit reviews and posts li-sp-01 and li-sp-02 himself | Shamit |
| 7 | Share the review page with Shamit as Contributor | Tushant |
| 8 | Publish AOS page v1.1 at `/aos` (the site still shows v1.0) | Web |
| 9 | Documents not shared yet: AN27 History and Research, and the Open Items Register | Tushant |
| 10 | Approve or reject the 15 W40 drafts before Monday 28 Sep | Tushant / Shamit |

## 7. Fixes already made (so nobody redoes them)

- **Script bugs:**
  - Path `.resolve()`.
  - YAML datetimes converted to ISO.
  - `set_meta` kept the blank line.
  - The linter no longer re-flags numbers it already matched.
  - Dashboard phase dates are compared as strings.
  - Dashboard `--date` flag added.
  - Carousel fonts embedded.
- **Linter rules:**
  - RPA is split into error and warn.
  - "agentic operating system" lookbehind.
  - "time saved" lookbehinds.
- **Audit defects:**
  - YouTube posts could never match the hook.
  - Founder posts could be scheduled on the company page.
  - YouTube titles weren't checked.
- **Copy edits:**
  - li-co-01: removed the double negative; "on Friday" is now "next week".
  - li-co-04: softened claims about competitors.
  - yt-01: title no longer blames staff.
  - li-sp-02: "favorite" spelling.

## 8. Environment notes

- Python 3.11 with PyYAML, which is all the scripts need. Rendering needs Node with Playwright and Chromium (`/opt/pw-browsers` on Claude Code on the web).
- The proxy blocked re-structure.ai and the Webflow CDN. The article text and images were read through TinyFish; the result is in `research/reference-architecture.md`.
- Connectors used: Metricool (no networks connected yet), Crustdata (about 3 of 30 credits used), TinyFish.
- Media is served from GitHub raw URLs (`config.yaml → media.base_url`), which works because the repo is public.

## 9. Quick commands (from `gravity-social/`)

```bash
python3 scripts/gate.py status
python3 scripts/gravity_lint.py --state pending
python3 tests/e2e.py
python3 scripts/build_dashboard.py            # content/dashboard.html
python3 scripts/build_dashboard.py --artifact # review-page HTML (git-ignored)
python3 scripts/morning_brief.py
```

## 10. Prompt to paste into the new session

> I'm Tushant, marketing manager at Alpha Nodus. We're continuing the Gravity Social OS on branch `claude/laughing-bardeen-5uf8wh`. Read `CLAUDE.md`, run the task-observer session-start protocol, then read `gravity-social/HANDOFF.md` and `gravity-social/README.md` and load the `gravity-social` skill. Then:
> 1. Run `python3 tests/e2e.py` and `gate.py status` to confirm the state.
> 2. Move the "Gravity morning brief" Routine (`trig_01ToSKBx1SKfpokPKtRe6cUE`) to fire into this session.
> 3. Tell me what needs me today.
>
> The review page is https://claude.ai/artifact/3GHPfJ9kALVRvnDwseyBrd. Don't approve anything unless I name the post and say I approve it.
