---
name: gravity-report
description: The layer that runs it all for the Gravity Social OS. Tracks Alpha Nodus / Gravity social results down the funnel (post to engagement, click, demo or "exam itemized" request, opportunity, customer) using Metricool analytics, UTM post ids and the CRM outcomes file, and writes the one-page morning brief: best post, engaged-but-no-clicks post, approvals waiting, messages needing a person, and the signal to ride. Also scores hooks weekly to feed research. Use for morning brief, daily or weekly report, "how did we do", or which posts drove demos.
---

# Gravity report: pipeline, not likes

Method and file formats: `gravity-social/reports/attribution.md`. The brief is internal and never published.

## Daily (the morning brief)

1. **Refresh metrics from Metricool** (skip and say so if no networks are connected):
   - `getBrandSettings` → brand id, timezone, connected networks.
   - `getAnalyticsAvailableMetrics` per connected network (connector `posts`, plus `evolution` for followers). Pick impressions/reach, engagements (reactions, comments, shares, saves), clicks and followers.
   - `getAnalyticsDataByMetrics` for the last 7 days.
   - Match Metricool posts to queue posts by `metricool_post_id`, else by text (a post's `main_text()`), and write `reports/metrics/<today>.json` in the format in `attribution.md`.
   - For published posts missing `published_url`, run `python3 scripts/gate.py mark-published <id> --url <url>`.
2. **Outcomes:** check `reports/outcomes.csv` for new rows. If the person shares a CRM or form export, append rows (date, post_id from `utm_content`, outcome, organization, value_usd). Never guess an attribution.
3. **Build the brief:** `python3 scripts/morning_brief.py` → `reports/daily/<today>.md`. Replace each `[Claude: ...]` with one or two sentences of judgement:
   - Best post: *why* it worked (hook pattern, format, persona, leak) and a concrete part-2 idea.
   - Engaged but went nowhere: which pattern to drop or change (e.g. "a good line with no CTA," "a poll with no follow-up").
4. `python3 scripts/build_dashboard.py` so the Growth and Morning brief tabs are current.
5. Reply to the person with the brief itself (it's one page). If `config.yaml reporting.email_draft_to` is set, create a Gmail **draft** with the brief (never send).

## Weekly (Thursday, before research)

- **Hook Scorer:** for the last 4 weeks of published posts, group results by hook pattern, format, pillar, persona and platform. Keep a running table in `research/hook-scoreboard.md` (pattern → posts, median engagement rate, clicks, leads, requests). Hand the winners to the research module.
- **A/B Tester:** suggest one controlled test for next week (same angle, two hook patterns on the same platform at the same slot in consecutive weeks). Keep it honest: with small numbers, say "directional."
- **Mix check:** compare the published pillar mix against the phase weighting in `content/pillars.md` and flag drift.

## How to read small numbers

B2B imaging audiences are small. Report counts ("3 demo requests, 2 from the carousel"), not rates on tiny bases. Don't call a winner on fewer than about 30 clicks or 5 outcomes; say "early signal." One demo request from the right COO is worth more than a thousand likes, and the brief says so.

## Never

- Publish or share the brief outside the team.
- Present modeled, estimated or inferred numbers as measured.
- Attribute an outcome to a post without a `utm_content` or a note from sales that says so.
