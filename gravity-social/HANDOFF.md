# Gravity Social OS: handoff to a new Claude

This file lets a new Claude (a new session, a new account, or Claude Code on your own computer) run the exact same system with **no other context from you**. It holds everything that was asked, decided, built and left open. The one exception is the account-level pieces in section 5, which have to be connected once and can't be copied. Read it top to bottom once, then use `README.md` in this folder for day-to-day use.

## 1. Start here (10 minutes)

**What you need:**
- `gravity-social-code.zip`, which contains the repo and a `private/` folder.
- A Claude that can run Claude Code:
  - claude.ai/code (web),
  - the desktop app, or
  - the CLI.

**Option A: Claude Code on the web, same or new account**
1. Open a session on the GitHub repo `himanshu95552/Claude-Projects`, branch `claude/laughing-bardeen-5uf8wh`. The code arrives through the clone.
2. Attach `gravity-social-code.zip` to your first message.
3. Paste the prompt from section 12. Claude runs `bash setup.sh <the zip>`, which restores the private files and checks everything.

**Option B: your own computer (Claude Code desktop or CLI)**
1. Unzip `gravity-social-code.zip`.
2. `cd Claude-Projects`
3. `bash setup.sh private`
4. Open Claude Code in that folder and paste the prompt from section 12.
5. To push to GitHub, run `git remote add origin https://github.com/himanshu95552/Claude-Projects` and check out the branch.

**What `setup.sh` does:**
- installs PyYAML;
- checks Node and Playwright, which are only needed to re-render carousels;
- restores the private bundle:

  | From the bundle | Restored to |
  |---|---|
  | AN27 originals | `gravity-social/source-docs/` |
  | Conversation history | `gravity-social/source-docs/history/` |
  | Task-observer log | `~/.claude/skill-observations` |
  | Morning briefs and local data files | their usual places |

  Everything restored is git-ignored.
- runs the linter, the gate check and the 54 end-to-end tests, and prints the approval queue.

## 2. What was asked (in order, so you don't have to re-explain)

**Who is asking and what for**
- **Who:** Tushant, Marketing Manager at Alpha Nodus.
- **Company:** Alpha Nodus, alphanodus.com.
- **Product:** Gravity, "the Agentic Operations System (AOS) for your CRM, RIS and RCM" in outpatient imaging.
- **Founder:** Shamit Patel.

**Original ask**
- Rebuild the "AI social media team that runs on one person" from the ReStructure Brief newsletter (re-structure.ai) as an application running on Claude.
- It must be **platform-specific, never generic**.
- Read every AN27 document in detail, review all of the article's images from start to end, and make it "super good."

**Decisions Tushant made**

| Question | Decision |
|---|---|
| Platforms | All of them: LinkedIn (company page, plus Shamit's profile), X, Instagram and YouTube Shorts |
| Approvers | Tushant day to day. Shamit Patel approves his own posts and posts them himself |
| Where demo requests land | The Calendly link on the website's contact page |
| GitHub repo | Stays **public**, so private data is kept out of it |
| Morning brief | Weekdays at 7:25 a.m. **US Central** |

**Later requests**
- An end-to-end audit of every text and every image, building whatever was missing and saying what couldn't be done.
- A private review page for approving from a phone.
- The daily brief.
- Folding in Winning Story v1.1 and AOS Definitional Page v1.1.
- This handoff.

The conversation itself is in `source-docs/history/conversation-history.md` (readable). Every tool call is in `transcript.jsonl.gz`. The newsletter's private link token is redacted in both.

## 3. What was built

| Part | Where | What it does |
|---|---|---|
| The Brain (orchestrator) | `.claude/skills/gravity-social/` | Triage, routing, weekly rhythm, never-bend rules, phone-approval sync, daily run |
| Research | `.claude/skills/gravity-research/` | 8 agents (Trend Scout, Competitor Watch via Crustdata, Question Miner, Hook Analyst, Keyword Finder, Audience Profiler, Idea Bank, Content Planner). Writes `research/briefs/<week>.{yaml,md}` |
| Content | `.claude/skills/gravity-content/` | Native posts per platform, then lint, render carousels, build the dashboard |
| Publish | `.claude/skills/gravity-publish/` | Approval (by chat or page tap), then Metricool scheduling: one network per post, autoPublish off. Shamit posts founder posts himself |
| Community | `.claude/skills/gravity-community/` | Intent taxonomy, reply drafts, leads, and the never-auto-reply list (PHI, patients, press, security…) |
| Report | `.claude/skills/gravity-report/` | Metricool analytics, Calendly import, the morning brief, dashboards, the hook scoreboard, republishing the page |
| Self-improvement | `.claude/skills/task-observer/` and `CLAUDE.md` | Logs lessons about the skills. Its session-start protocol is mandatory |
| Knowledge layer | `brand/`, `platforms/`, `content/pillars.md` | See below |
| Reference | `research/reference-architecture.md` | The newsletter's text and all 7 images, mapped to this system |
| Scripts | `scripts/` | Lint, gate, Metricool hook, UTM, carousel render (fonts embedded), dashboard, brief, Calendly import, media URLs, leads, metrics, page-decision sync |
| Hard gate | `.claude/settings.json` (repo root) | A PreToolUse hook blocks any Metricool create or update call that doesn't exactly match an approved, unedited post |
| Tests | `tests/e2e.py` | 54 end-to-end checks in a temporary copy (55 with `--render`) |

The knowledge layer covers:
- **Voice and messaging:** voice, approved lines and messaging.
- **Proof ledger:** P01–P23 and B01–B17, the only numbers allowed in public.
- **Guardrails:** the regex rules the linter enforces.
- **AOS definition:** the AOS Definitional Page v1.1, kept verbatim.
- **Visual and search:** the visual system and the search vocabulary.
- **Platforms:** one playbook per platform, plus hard limits.
- **Pillars:** 9 pillars, and the phase plan through RSNA 2026 (Chicago, 29 Nov to 3 Dec).

**Source documents.** The seven AN27 documents are distilled into `brand/`, which is all the system needs to run. The originals are in `source-docs/` after setup:
- AN27 Positioning and Messaging v1.7
- Messaging Package v1.0
- Customer Pitch Deck Outline v2.1
- Winning Story and Pitch Narrative v1.1
- Unit Economics Closer v1.1
- SEO and Keyword Map v0.1
- AOS Definitional Page v1.1

## 4. State at handoff (25 Sep 2026)

- **Branch:** everything is committed and pushed to `claude/laughing-bardeen-5uf8wh`. Lint shows 0 errors and 0 warnings. The end-to-end tests pass 54 of 54.
- **Week 40 (28 Sep to 4 Oct):** 15 drafts are in `content/queue/pending/`. **None are approved.**
  - LinkedIn company:
    - li-co-01: poll
    - li-co-02: the five-tests document carousel
    - li-co-03: Surest prior auth, which starts Oct 1
    - li-co-04: agentic AI
  - LinkedIn founder:
    - li-sp-01: six weeks
    - li-sp-02: why we named a category
  - X: x-01 to x-05. x-02 is a 7-part thread.
  - Instagram:
    - ig-01 and ig-03: carousels
    - ig-02: reel script
  - YouTube: yt-01, a Short filmed in the same shoot as the reel.
- **Rendered carousels:** `content/assets/<id>/` holds li-co-02 (8 frames and a PDF), ig-01 (6) and ig-03 (7).
- **Review page:** https://claude.ai/artifact/3GHPfJ9kALVRvnDwseyBrd. Its `decisions` collection was empty at handoff.
- **Daily Routine:** "Gravity morning brief", id `trig_01ToSKBx1SKfpokPKtRe6cUE`. It fires into the **old** session, `session_01Jwttej1FXByihqVsDCYB94`. Section 5 covers moving it.
- **Improvement notes:** the task-observer log has 2 open observations, 0001 and 0002. Both propose a `brand-content-system` skill. Neither has been reviewed yet.

## 5. Accounts and connectors (can't be copied: connect once)

These live in a Claude account or a third-party account, not in files. In a **new** Claude account, set them up once:

| Piece | What it's used for | Same account | New account |
|---|---|---|---|
| **Metricool connector** | Scheduling, best times, analytics. Brand id `6979710` (`config.yaml → metricool.brand_id`) | Already connected | Connect Metricool in claude.ai → Settings → Connectors **with the same Metricool login**, so brand 6979710 is visible. If it's a different Metricool account, update `brand_id` |
| **Crustdata connector** | Competitor Watch (LinkedIn posts that beat the author's median). About 20 credits a week | Connected | Connect it, or research falls back to web search |
| **TinyFish connector** | Web fetch and search for research, and reading pages the proxy blocks | Connected | Connect it, or use built-in web search |
| **GitHub** | Clone and push the branch. Media URLs point at raw files on this branch | Connected | Connect GitHub to the account and give Claude access to `himanshu95552/Claude-Projects` |
| **Review page** | Phone approvals. Owned by the account that published it | Pass its URL (section 4) to update it | Publish a new one (recipe below) and put its URL in `config.yaml → review_page` |
| **Daily Routine** | The weekday morning run | Move it: `update_trigger` it with the new session's id as `persistent_session_id`, or delete it and recreate it (recipe below) | Recreate it from the new session. Delete the old one in the old account |

**Review page recipe:**
1. From `gravity-social/`, run `python3 scripts/build_dashboard.py --artifact`. This writes `content/dashboard-artifact.html`.
2. Publish it with the Artifact tool:
   - `file_path`: that HTML file
   - `icon`: `calendar`
   - `capabilities`: `{"db": {}, "user": {}}`
   - `root`: the repo root
   - `files`: map each `assets/<post-id>/frame-NN.png` to `gravity-social/content/assets/<post-id>/frame-NN.png`, one entry for every rendered frame
   - `description`: "Alpha Nodus's Gravity social team: this week's research, the post queue with Approve/Reject, posting and community, growth, and the morning brief."
3. On a new page, update `review_page` in `config.yaml` with the new URL and commit.
4. Share the page with Shamit as **Contributor**.

**Routine recipe:**
- **Name:** "Gravity morning brief"
- **Cron:** `CRON_TZ=America/Chicago 25 7 * * 1-5`
- **Initiation:** human_request
- **Prompt, verbatim:**

  > Gravity Social daily run. Use the gravity-social skill and follow its "The daily run" section on branch claude/laughing-bardeen-5uf8wh (git pull first). In order: (1) sync approvals from the review page (config.yaml review_page) with scripts/sync_decisions.py and write each result back to its decisions doc; (2) fill media URLs for approved posts; if Metricool has connected networks, schedule approved posts through the gate (never bypass the hook); (3) sync leads if inbox files exist; (4) refresh metrics if available, then build the morning brief with judgement filled in; (5) rebuild both dashboards and republish the review page; (6) commit and push public files only. Finish with the one-page brief in chat, plus a line on anything that needs Tushant or Shamit today. Never approve anything on your own.

- **If you change branches:** update `config.yaml → media.base_url`, which contains the branch name, and the branch named in this prompt.

## 6. Rules that never bend

1. **Approvals:** run `gate.py approve` only after an explicit, **named** approval of that post in the conversation, or a review-page tap recorded through `scripts/sync_decisions.py`.
   - Approver names are exactly `Tushant` or `Shamit Patel`.
   - Founder posts need Shamit.
2. **The Metricool hook stays in the way.** Never get around it:
   - no edits after approval,
   - one network per post,
   - autoPublish always false.
3. **Every number comes from `brand/proof-ledger.yaml`, with its qualifiers:**
   - Unit economics always say *modeled*.
   - $31 (expected) always appears with $21 (conservative).
   - Tower Radiology's figures always name RSNA 2021.
4. **Language rules:**
   - Retired words stay out: platform, AI-powered, seam, front office, RPA bots, "get the referral".
   - The personas (Sasha, Sandra, Susan) stay internal.
   - Never say "SOC 2" or "HIPAA certified".
   - Keep "We don't read the scan. We make sure it gets back."
   - Never blame staff.
   - No em dashes.
   - Never name competitors.
5. **No PHI**, ever. Use the demo tenant only: Maria Lopez, 52, knee MRI, referred by Dr. Patel's office.
6. **The repo is public.** Never commit any of these:
   - the AN27 originals (`source-docs/`) or the conversation history;
   - leads, inbox items, outcomes, metrics or daily briefs;
   - viewer ids or invitee names or emails;
   - the newsletter's `mcp_token` link.
7. **Branch and PRs:** develop only on `claude/laughing-bardeen-5uf8wh`, and open a PR only when asked. Keep model names out of commits and files.
8. **Session start:** `CLAUDE.md` requires running the task-observer session-start protocol first, then using the `gravity-social` skill for any social-media work.

## 7. Still open (needs a person or an outside system)

| # | Item | Owner |
|---|---|---|
| 1 | Connect the LinkedIn company page, X, Instagram and YouTube to Metricool brand `6979710`. Create the YouTube channel if needed | Tushant |
| 2 | Put the Calendly event URL in `config.yaml → links.calendly_demo`, or add `reports/calendly-embed-snippet.html` to the contact page | Tushant / web |
| 3 | RSNA 2026 booth number → `campaigns[0].booth` (currently TBD) | Tushant |
| 4 | Metricool reviewer emails → `approval.metricool_reviewers` | Tushant |
| 5 | Film the reel and the Short (ig-02, yt-01) on the demo tenant | Team |
| 6 | Shamit approves and posts li-sp-01 and li-sp-02 himself | Shamit |
| 7 | Share the review page with Shamit as Contributor | Tushant |
| 8 | Publish AOS page v1.1 at `/aos`. The site still shows v1.0 | Web |
| 9 | Documents not shared yet: AN27 History and Research, and the Open Items Register | Tushant |
| 10 | Approve or reject the 15 week-40 drafts before Monday 28 Sep | Tushant / Shamit |

## 8. Already fixed (don't redo)

**Script bugs**
- Absolute paths.
- YAML datetimes are converted to ISO strings.
- `set_meta` keeps the blank line after the frontmatter.
- Numbers the linter already matched aren't flagged again.
- Dashboard phase dates are compared as strings.
- `--date` flag.
- Embedded carousel fonts.

**Linter rules**
- RPA split into error and warn.
- Lookbehinds for "agentic operating system" and "time saved".

**Audit defects**
- YouTube posts couldn't match the hook.
- Founder posts could be scheduled on the company page.
- YouTube titles weren't checked.

**Copy edits**
- li-co-01: removed the double negative, and "on Friday" became "next week".
- li-co-04: softened claims about competitors.
- yt-01: the title no longer blames staff.
- li-sp-02: "favorite" spelling.

**For this handoff**
- The hook scoreboard is seeded and the research skill now reads it.
- The skills point to `source-docs/`.
- Added `setup.sh` and `requirements.txt`.

## 9. Environment notes

- **Scripts:** Python 3.10+ and PyYAML are enough for every script. Rendering carousels also needs Node, Playwright and Chromium, which are preinstalled on Claude Code on the web (`/opt/pw-browsers`).
- **Blocked sites:** the network proxy on Claude Code on the web blocked re-structure.ai and the Webflow CDN. TinyFish reached them, and the article is saved in `research/reference-architecture.md`, so it doesn't need re-reading.
- **Media:** carousel images are served from GitHub raw URLs (`config.yaml → media.base_url`). That works because the repo is public.

## 10. Quick commands (run from `gravity-social/`)

```bash
python3 scripts/gate.py status              # the queue
python3 scripts/gate.py show <id>           # one post as it will appear
python3 scripts/gravity_lint.py --state pending
python3 scripts/render_carousel.py --state pending
python3 scripts/build_dashboard.py           # content/dashboard.html
python3 scripts/build_dashboard.py --artifact
python3 scripts/morning_brief.py
python3 tests/e2e.py                          # 54 checks
```

## 11. What's in the zip

| Path | What |
|---|---|
| `Claude-Projects/` | The whole repo at the latest commit: `CLAUDE.md`, `.claude/` (skills and hook), `gravity-social/`, `setup.sh`, this file |
| `Claude-Projects/private/an27-source-docs/` | The 7 AN27 originals, one copy each |
| `Claude-Projects/private/skill-observations/` | The task-observer workspace: observations 0001 and 0002, principles, review date |
| `Claude-Projects/private/local-only/` | Git-ignored working files: the morning brief, and the leads and outcomes files (headers only so far) |
| `Claude-Projects/private/history/` | `conversation-history.md` and `transcript.jsonl.gz`, with the token redacted |

The `private/` folder is git-ignored. Don't commit it to the public repo.

## 12. Prompt to paste into the new Claude

> I'm Tushant, Marketing Manager at Alpha Nodus. We're continuing the Gravity Social OS (repo himanshu95552/Claude-Projects, branch claude/laughing-bardeen-5uf8wh). I've attached gravity-social-code.zip.
> 1. Follow CLAUDE.md: run the task-observer session-start protocol first.
> 2. Run `bash setup.sh <path to the attached zip>` from the repo root and show me the result.
> 3. Read gravity-social/HANDOFF.md fully, then load the gravity-social skill.
> 4. Section 5: check which connectors this account has (Metricool brand 6979710, Crustdata, TinyFish, GitHub). Tell me whether the review page https://claude.ai/artifact/3GHPfJ9kALVRvnDwseyBrd is reachable; if it isn't, publish a new one with the recipe. Then move or recreate the "Gravity morning brief" Routine so it fires into this session.
> 5. Tell me what needs me today.
>
> Don't approve anything unless I name the post and say I approve it.
