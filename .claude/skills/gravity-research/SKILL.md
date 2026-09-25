---
name: gravity-research
description: Module 1 of the Gravity Social OS. Weekly research for Alpha Nodus / Gravity social content, working like a full-time strategist for imaging operations. It finds this week's industry signals (prior authorization, payers, CMS, staffing, agentic AI in imaging, RSNA), the competitor and peer posts that outperformed, what imaging operators keep asking, and a hook lab (first lines side by side, why they worked, Gravity's version). Writes research/briefs/<week>.yaml and .md for the content module. Use when asked to research, find trends, check competitors, or plan the next week.
---

# Gravity research: the strategist

Output: `gravity-social/research/briefs/<YYYY>-W<ww>.yaml` (schema in `templates/brief.yaml`) and a short `.md` narrative next to it with every source linked. The brief is the only input the content module needs besides the brand files. Every post should start from something that is already working.

## Before you search

1. Read `config.yaml` (campaign phase), `content/pillars.md` (phase weighting), `brand/messaging.md` (the three leaks), `brand/search-vocabulary.md`.
2. Read last week's brief, `research/hook-scoreboard.md` (which hook patterns, formats and platforms earned clicks and demo requests) and the latest `reports/daily/*.md` so you know what worked. Don't repeat an angle that went nowhere.
3. Pick the ISO week you're researching for, usually next week.

## The eight agents (run them as steps)

**1. Trend Scout (industry signals, last 7 to 14 days).** Search the news with `WebSearch`, falling back to `mcp__TinyFish__search` (domain_type news) or `mcp__Nimble__nimble_search`. Queries to rotate:
- prior authorization imaging / radiology benefit manager / EviCore, Carelon, Cohere portal changes
- CMS physician fee schedule radiology (the 2027 proposed and final rules), Medicare Advantage denials
- AMA prior authorization survey / reform / gold carding
- radiology technologist shortage, ASRT vacancy
- imaging center no-shows, patient access, MRI wait times
- referral leakage healthcare, referring physician portal
- agentic AI radiology operations / AI agents healthcare operations (trade press: Radiology Business, AuntMinnie, Healthcare IT Today, Diagnostic Imaging, ITN, Health Imaging, Becker's)
- RSNA 2026 news, sessions on operations, AI and the business of imaging (in the RSNA phases)
- imaging center M&A, outpatient imaging growth, site-of-care shifts
For each signal, set `fits` to the leak it maps to (`referral`, `order`, `revenue`, `category`), or `skip` if it doesn't map to one. Most signals should be skipped: we only ride the ones that are one of our three leaks.

**2. Competitor Watch (what outperformed in our space).** Search competitors and adjacent voices, per positioning §7 and the SEO map: DeepHealth (RadNet), AbbaDox, Infinx, Notable, Luma Health, Assort Health, Vocca, IntelePeer, Phreesia, Clearwave, Intelerad, PocketHealth, ImagineSoftware, Zotec, Waystar. Also track the associations and trade press (RBMA, AHRA, RSNA, Radiology Business, AuntMinnie) and imaging operators who post well.
- LinkedIn posts: use Crustdata (`mcp__Crustdata__crustdata_social_posts` for a company or person profile; `crustdata_social_posts_by_keyword` for topics such as "prior authorization imaging" or "radiology operations"). Run `crustdata_credit_costs` first and keep to about 20 credits a week unless the person says otherwise. Direct LinkedIn browsing hits a login wall, so don't use TinyFish for LinkedIn feeds.
- X, Instagram, YouTube: Metricool competitor analytics (once networks are connected), or `WebSearch` / TinyFish.
- Record posts that beat **their own** median engagement, as "N× their median," not raw numbers. Capture the hook verbatim.
- We study competitors' patterns. We never name them in our posts (the linter blocks it).

**3. Question Miner (what the audience asks).** Look at Reddit (r/Radiology, r/radiologytechs, r/MedicalBilling, r/healthIT; search `site:reddit.com`), comments under the competitor posts above, comments in our own inbox (`community/inbox/`), AuntMinnie forums and RBMA discussions. Cluster the questions into themes with counts and 1 to 2 verbatim examples. Map each theme to a persona (owner, cfo, coo, marketing, rcm, scheduling, it).

**4. Hook Analyst (the hook lab).** From the outperforming posts (and top videos for reels), take the first line or the first three seconds. For each:
- the pattern: Proof/result, Warning, Contrarian, Question, Number, Scene, Definition, Story, Comparison
- why it worked, in one sentence
- scores: curiosity 0 to 3, specific 0 to 2, relatable-to-an-imaging-operator 0 to 2
- **Gravity's version:** the same pattern, our words, using only approved lines and ledger figures. Check originality: `python3 -c "import sys; sys.path.insert(0,'scripts'); import gravity_lint as g; print(g.copied_share('<source hook>', '<our version>'))"` must be ≤ 0.20.
Aim for 6 to 8 hooks a week.

**5. Keyword Finder.** Note search phrases seen in titles and hashtags this week. Update `brand/search-vocabulary.md` if a tag is clearly in use (or clearly dead) in our audience.

**6. Audience Profiler.** For each signal and question, name the persona and the leak. Balance the week so owners, CFOs, COOs, marketing, RCM and IT each hear something.

**7. Idea Bank.** Turn the findings into 4 to 6 **angles**. Each angle is one idea, one pillar, one leak, one CTA, the claims it needs (ledger ids), and a native format per platform, for example: LinkedIn document carousel, X thread, Instagram carousel, a founder story. Weight the pillars by the campaign phase (`content/pillars.md`). Add any good angle you won't use this week to the evergreen bank in `content/pillars.md`.

**8. Content Planner.** Map the angles to the week's slots per `config.yaml` posts_per_week and the phase. Choose `trend_to_ride`: the single signal most worth riding this week.

## Write the brief

- `research/briefs/<week>.yaml` following `templates/brief.yaml`. Every trend, competitor post and question has a source URL, and all URLs are also listed in `sources`.
- `research/briefs/<week>.md`: a one-page narrative: "This week: …" (3 sentences), then signals, what outperformed and why, what the audience asks, the hooks, the angles. Link every source.
- Run `python3 scripts/build_dashboard.py` so the Research tab shows it.
- Tell the person the three-sentence summary and the angles. Offer to send them to content.

## Honesty rules for research

- Never fabricate a trend, a metric or a quote. If a tool fails or is blocked, say so in the brief and work with what you have.
- Label the evidence: a news article, a post, a forum thread. Performance numbers come from the source, never estimated.
- Research may mention competitors by name (it's internal). Posts may not.
- A benchmark you want to use in a post that isn't in `brand/proof-ledger.yaml` goes in the brief as "proposed ledger addition" with its source. Only the person can add it to the ledger.
