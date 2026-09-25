# Reference: "The AI Social Media Team That Runs on One Person"

Source: The ReStructure Brief newsletter (re-structure.ai), read 25 Sep 2026, text plus all seven images (the hero diagram and product screenshots 0 to 5, transcribed by a browser agent). This file records what the reference system does and how Gravity Social maps each part, adapted for a B2B imaging brand instead of a consumer skincare brand.

## The reference, in one paragraph

A one-person company runs a full AI social team. Claude researches the niche, drafts a week of content in the brand voice, posts approved work on every platform at the best time, answers comments and DMs, flags buyers as leads, tracks results down to revenue, and sends a one-page brief every morning. **Nothing goes public until the owner approves it.** "It's an architecture decision, not another scheduling app."

## The architecture diagram (hero image)

| Reference layer | What it is | Gravity Social equivalent |
|---|---|---|
| 01 Signals | TikTok, X, Instagram, YouTube, Gmail | LinkedIn (company and founder), X, Instagram, YouTube Shorts (off), comments and DMs pasted or exported into `community/inbox/`, Gmail (optional brief delivery) |
| 02 Systems and records | App stack | Metricool (scheduling, analytics, best times), the CRM where demo requests land, `content/approvals.log` |
| Owner inputs | The owner's rules and approvals | `config.yaml`, the AN27 documents, approvals through `scripts/gate.py` |
| 03 The Brain: Claude Code | Triage, route tasks, set priorities, check the work. "Every task starts here. Every morning ends in one summary." | The `gravity-social` orchestrator skill |
| 04 Knowledge layer | Brand and voice files | `brand/` (voice, messaging, proof ledger, guardrails, visual, search vocabulary), `platforms/`, `content/pillars.md` |
| What interrupts the loop | Escalations to the human | The exit ramps: `community/reply-playbook.md` "never auto-replied" list, lint errors, anything that needs Shamit |

## Module 1: Research (screenshots 0 and 1)

**Reference UI:** a "this week" banner summarizing the three findings, with a "Send to Content →" button. Trending topics with % change and a "Fits you / Skip" tag. Competitor posts ranked by "3.9x vs their average." An audience panel of comment themes with counts ("Price, shipping, discounts: 172"). A Hook Lab: the top videos' first three seconds side by side. A detail panel per hook: WHY IT WORKED (pattern, e.g. "Proof / result"), scores for Curiosity, Specific and Relatable, "Claude's version: made for you," and an originality check ("Same pattern: kept 73% · Copied words: 2%").

**Agents named:** Trend Scout, Competitor Watch, Hook Analyst, Question Miner, Keyword Finder, Audience Profiler, Idea Bank, Content Planner.

**Gravity mapping:** `gravity-research` skill. Each agent is a step in the weekly brief (`research/briefs/<week>.md` + `.yaml`). "Fits us / Skip" means the trend maps to one of the three leaks, or it doesn't. Competitor Watch covers the search competitors in positioning §7. The hook lab scores Curiosity, Specific and Relatable and writes a Gravity version of each hook. The originality check is enforced by the linter (`hook_source_text` overlap).

## Module 2: Content (screenshot 2)

**Reference UI:** research pills at the top (8 hooks, the trend, 178 price questions, the brand voice rule "warm, honest, no miracle claims"; "Claude writes, [checker] checks"). Next week as a Mon to Sun grid of 14 posts, each marked Passed or Fixed. An approval queue: "14 waiting · Approve all," and per post: time, "On brand 2.3 · No over-promise · Original · Approve."

**Agents named:** Hook Writer, Scriptwriter, Caption Writer, Carousel Designer, Thumbnail Maker, Clip Cutter, Video Editor, Voiceover, B-roll Finder, Brand Checker.

**Gravity mapping:** `gravity-content` skill writes each post natively per platform into `content/queue/pending/`. The Brand Checker is `scripts/gravity_lint.py`: On brand = guardrails and voice; No over-promise = the guarantee/zero rules plus every number traced to the proof ledger; Original = hook overlap. The Carousel Designer and Thumbnail Maker are `scripts/render_carousel.py` (frame 1 is the thumbnail). Clip Cutter, Video Editor, Voiceover and B-roll become shot lists and scripts in `## Video script`: video is recorded on the demo tenant by a person. The approval queue is `scripts/gate.py` plus the dashboard's Content tab.

## Module 3: Posting and community (screenshot 3)

**Reference UI:** a best-time grid per platform per day (from Metricool; "56 / 56 live"). An inbox of every comment and DM, tagged Lead, Question, Praise, Complaint or Spam. Replies in the brand voice ("Ava asks how much for the set → Lead, 100% sure, ready to buy 2.0/2 → reply with price → added to HubSpot"). A lead list: asked "how much?" becomes a lead. **"39 need you personally: refunds, reactions, lost orders. Never auto-replied."**

**Agents named:** Approval Queue, Scheduler, Cross-Poster, Comment Replier, DM Responder, Lead Tagger, Collab Manager, Email Capture.

**Gravity mapping:** `gravity-publish` (the Metricool scheduler behind the approval hook) and `gravity-community` (inbox triage, replies, lead tagging). One deliberate change: **no Cross-Poster.** The same angle is rewritten natively for each platform, and the hook blocks any post sent to more than one network. The intent taxonomy is rebuilt for B2B imaging (`community/intent-taxonomy.md`): buying signals are "pricing," "demo," "does it work with our RIS," "RFP," "RSNA meeting," not "how much for the set." The "never auto-replied" list grows for healthcare: anything with patient information, complaints, security questionnaires, pricing specifics, partners and press.

## The layer that runs it all: revenue and the brief (screenshots 4 and 5)

**Reference UI:** KPI tiles (revenue over 7 days, new followers, link clicks, paying customers; "likes: nice, but not the goal"). A funnel from post to paying customer: views → followers → link clicks → customers, with conversion rates. "Every post links with its own UTM tag." A table of which posts made money (likes, followers, clicks, orders, revenue per post). A Claude Code job that runs nightly: read Metricool, read Stripe, match UTMs, write the brief. A one-page morning brief by email at 7:00: the best post ("make a part 2"), the most-liked post that made $0 ("skip it next week"), N posts waiting for approval, N messages that need you personally, a trend to ride, and a "Review the 14 posts →" button.

**Agents named:** Analytics Tracker, Link Tracker, Revenue Tracker, Hook Scorer, A/B Tester, Ads Manager, Daily Brief.

**Gravity mapping:** `gravity-report` skill. B2B imaging has no Stripe checkout: "revenue" becomes pipeline. The funnel is impressions → engagement → followers → link clicks → demo requests and "exam itemized" requests → opportunities → customers, joined on `utm_content = post id`. The morning brief keeps the reference's five bullets, rewritten for Gravity: best post (make a part 2), most-engaged post that drove no clicks (skip that pattern), posts waiting for approval, messages that need a person, and the signal to ride this week. Ads Manager is out of scope until there is paid budget.

## What we kept exactly

- The human gate is absolute, and it is structural (a hook), not a promise.
- One brief a day, one page, with the approval count and a link to the queue.
- UTM on every link, and results measured in outcomes, not likes.
- The hook lab: what the winners said first, why it worked, our version, and an originality check.
