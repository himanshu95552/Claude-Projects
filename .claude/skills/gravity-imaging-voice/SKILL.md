---
name: gravity-imaging-voice
description: "Write LinkedIn posts, comments, headlines, About sections and DMs for Gravity by AlphaNodus team members in one of three personas (Revenue Cycle, Referral Acquisition & Growth, Practice Growth) that sound like outpatient imaging-center operators. Use whenever drafting LinkedIn content for Gravity/AlphaNodus people, or when checking whether a draft sounds like the imaging-center audience."
---

# Gravity Imaging Voice — three LinkedIn personas

**Measured from 60 public LinkedIn posts (2019-07 to 2026-09) by 25 US outpatient
imaging-center leaders and 2 adjacent radiology-business influencers.** Split: 10 revenue
cycle, 16 referral/physician relations, 24 practice growth, 10 adjacent. 7 items excluded
(3 company-page posts, 4 posts with under 4 words). Mechanics below are computed with
`voice_stats.py` (in this folder), not inferred.

These personas are **style blends**, not clones of any one person. Output is written *in the
style of* the audience, published by real Gravity employees under their own names. Never put
words, opinions or quotes in a real third party's mouth.

## ⚠️ THE FOUR RULES THAT MATTER MOST

1. **Short and plain beats polished.** The default model instinct is 150 to 250 word posts
   with a hook, a list and a moral. Measured median here is **209 characters (33 words)**;
   revenue cycle posts median **138 characters**. Only the growth persona's lesson posts run long.
2. **No em-dashes, no tricolon cadence.** Only **7%** of posts contain an em-dash. Use periods
   and commas. Do not stack three parallel fragments as a rhythm device more than once per post.
3. **Exclamation, not emoji.** **53%** of posts use "!" (referral cluster 75%); **88%** use no
   emoji at all (mean 0.28 per post). If an emoji appears, it is one, at the end.
4. **Gravity is the minority topic.** At most one post in five is about the product. The rest is
   the audience's work: orders, auths, front desks, teams, events, market news. Proof uses only
   published Gravity figures (below). Never invent stats, customers or quotes.

## Measured mechanics (all 60 posts)

| Feature | Rate | Rule |
|---|---|---|
| Length | median 209 chars; p10 42; p90 835 | Default 150–400 chars; long only for lesson/article posts |
| Sentence length | median 12 words, mean 13.8 | Keep most sentences 8–16 words |
| Burstiness | stdev 10.4 (range 1–74) | Every post needs one very short sentence (≤5 words) next to a longer one |
| Line breaks | median 0–1; 51% single block (adjacent voices: median 6) | Short posts: 1–3 blocks. Story posts: a break after every 1–2 sentences |
| Lowercase start | 0% | Always sentence case |
| "!" | 53% of posts; "!!" 5% | "!!" only for team celebrations |
| "?" | 12% (revenue cycle 30%) | End roughly 1 in 3 RCM posts with a genuine question |
| Em-dash | 7% | Avoid |
| Colon | 13% | Fine for introducing a quote or list |
| Hashtags | 42% of posts, placed at the end; adjacent median 4 | 0–4, always last line, CamelCase |
| Emoji | none in 88% | 0, or 1 at the end |
| Bullets | 5% (growth 12.5%) | Only in growth lesson posts and checklists |
| Contractions | 1.6 per 100 words | Light: "don't", "it's", "we're" are fine, not every sentence |
| Pronouns | "I" 17.5, "our" 8.3, "my" 8.3, "we" 4.6, "you" 6.9 per 1,000 words | First person singular, plus "our team" |

**Default shape:** one opening claim or feeling in sentence case, 2–4 short sentences of
specifics, one very short line, optional question, hashtags on the last line.

## Per-persona mechanics

### Persona 1 — Revenue Cycle ("the front-door revenue fixer")
Headline: `Revenue Cycle Lead @ Gravity by AlphaNodus | Fixing imaging revenue at the front door: orders, eligibility, prior auth`
- Measured cluster: median 138 chars, median sentence 9.5 words, burstiness 7.0, 60% "!", 30% "?", 20% hashtags.
- Tone: calm, direct, a little dry. Practical over inspirational.
- Vocabulary: front end, denials, prior auth, eligibility, worklist, rework, clean claim, payer, exceptions, AR.
- Pillars: front-end revenue 40% · payer/policy in plain words 20% · team and RBMA/HBMA community 20% · Gravity proof 20%.
- Series: "Denial Autopsy" — one anonymized denial traced to where it started, and the check that stops it.

### Persona 2 — Referral Acquisition & Growth ("the script-to-scan connector")
Headline: `Referral Acquisition & Growth Lead @ Gravity by AlphaNodus | Streamlining Physician Order Ingestion, Referral Workflows & Practice Growth`
- Measured cluster: median 219 chars, median sentence 11.5, burstiness 8.5, 75% "!", hashtags in 56% (median 1.5), median 2 line breaks, quotes in 19%.
- Tone: warm, grateful, curious. Gives the spotlight to others.
- Vocabulary: referring offices, orders, front desk, intake, turnaround, schedulers, liaisons, grateful, honored.
- Pillars: referring-office reality 35% · people series/spotlights 25% · field notes and team moments 20% · Gravity proof 20%.
- Series: "Script to Scan: one question" — same question to a different liaison/scheduler/front-desk lead each week.

### Persona 3 — Practice Growth ("the capacity-first grower")
Headline: `Practice Growth Manager @ Gravity by AlphaNodus | Helping outpatient imaging centers turn more referrals into scans`
- Measured cluster: median 259 chars, burstiness 11.3 (widest swing), em-dash 12.5%, bullets 12.5%, "!" 54%.
- Two modes: short team posts (<300 chars, "!!" allowed) and long lesson posts (1,500–2,500 chars) with a title line, 2–3 short headed sections ("Why it worked", "The takeaway") and "•" bullets.
- Vocabulary: same-center growth, capacity, schedule, slots, leakage, referrals, market, de novo, partners.
- Pillars: growth lessons from other industries 30% · capacity math 30% · market news/events/team 20% · Gravity proof 20%.
- Series: "What imaging can learn from..." — this week's brand story turned into one imaging-growth lesson.

## Hooks and openers (shapes seen in the corpus, excerpted by role)

- Gratitude/pride: "So proud of this team!" · "Honored to speak at..." · "Grateful to be part of a team that..." (referral, adjacent)
- Plain announcement: "Excited to join [company] and lead..." · "Super exciting news to share today!" (growth)
- Scene or confession: "I have been leading for years. I still catch myself auditioning." (adjacent)
- Story-first: "Most of what I needed to know about [X], I learned from [unexpected person]." (adjacent)
- Titled lesson: "When Authenticity Beats Advertising: The [Brand] Marketing Lesson" (growth)
- Invitation: "Are you looking for a great opportunity with..." · "Looking forward to another RSNA!" (RCM, growth)
- Interview frame: "I asked [person] one question..." (referral)
- One-liner caption over photos: "Love getting my whole team together in one place !!" · "Leadership Christmas dinner !!" (growth)

## How they build a post (argument shapes)

1. **Moment → gratitude → name the people.** Team/event/award posts. Short, "!", tags.
2. **Story → what it taught me → one line that lands.** Adjacent voices; closes on a short aphorism ("Integrity is when the versions match.").
3. **Titled lesson → why it worked (bullets) → the takeaway.** Growth lesson posts; ends on a plain one-sentence takeaway, no question needed.
4. **Problem in the audience's words → 2–3 concrete examples → short line → question.** Best fit for RCM and referral problem posts.

## What actually performs

Visible comment counts (8 posts, weak evidence): median 17, range 4–32. Highest: a personal
milestone (32), a job-change announcement (31), a featured honor (23), a leadership-story post
(15), a summit kickoff (16). People respond to people and moments, not to product claims.

## Grammar fingerprints — PRESERVE THESE

- Space before "!!" appears in one heavy poster's captions ("in one place !!"). Use sparingly in the growth persona's team posts; it reads human.
- Sentence fragments as a beat: "Simple." · "Fewer touches. Cleaner claims." Keep them.
- Tagging organizations inline without "@" in running text is common. Fine.
Do not manufacture typos.

## Emotional register

Earnest, generous, proud of teams, never ironic, never dunking on payers, hospitals or
competitors. Certainty is moderate: they state what they see, then ask peers what they see.
Strongest move in the set: turning a small personal moment into a one-line leadership rule.

## Never do these

- Em-dashes; "X isn't just Y, it's Z"; "Here's the thing"; "Let that sink in"; "game-changer", "revolutionize", "unlock".
- One-thought-per-line broetry for a whole post.
- Engagement bait ("Comment YES", "Agree?" on every post). A single "Agree?" is allowed occasionally.
- Generic profundity closers that restate the post.
- More than 4 hashtags; hashtags mid-sentence.
- Invented numbers, customers, quotes, credentials or past employers. Use `[fill-in]` brackets instead.
- Pitching Gravity in a first DM or inside a lesson post.

## Gravity facts you may use (alphanodus.com, 2026-09)

Gravity by AlphaNodus: AI-first platform for outpatient diagnostic imaging and radiology (also
ortho, cardiology). "Script to Scan". Products: Gravity Docs (faxed and handwritten order
processing into the RIS), Gravity Auth (prior authorization), Gravity Estimate (patient
estimates), Gravity Booking (scheduling), Gravity Analytics. Complements the RIS/EMR (HL7, FHIR,
RPA), HIPAA. Figures: 83M documents processed, 99.8% classification accuracy, 90-second average
processing, up to 90% of document tasks automated, integration in days; 20M+ visits, 4M prior
authorizations, 15M calls handled. Founded 2015; vision "Just In Time Care". Published customer
quote (prior authorization manager): "In the amount of time it takes to load our worklist in the
RIS, our agent were able to process three prior authorizations." Quote it only as published,
attributed to "a prior authorization manager" / "one of our customers".

## Reference corpus (calibration)

When a draft feels off, compare it to these shapes rather than to the rules.

- RCM, short problem post: "Most imaging denials we look at were decided before the scan. / Auth tied to the wrong CPT. Eligibility checked once, weeks too early. A handwritten order keyed with the wrong side. / None of those feel like front-end problems when they happen. They show up weeks later as a denial someone has to work by hand. / Where does your team catch these today, at scheduling or at check-in? / #RevenueCycle #Radiology #PriorAuthorization"
- Referral, field note: "Spent the morning with an intake team that handles [number] faxed orders a day. / The hard ones were not the handwritten ones. They were the orders that looked complete and weren't. ... / Grateful for teams who do this work every day! ..."
- Growth, lesson post: title line → "Where the slots leak" with three "•" bullets → "Why it matters" → "The takeaway" in one plain sentence → 3 hashtags.
- Insider team caption (measured shape): one line, "!!", photo set, tags.

## Working method

1. Ask which persona and the one thing the post is about. If the user gives a topic only, pick the persona whose pillars fit and say which.
2. Draft 2–3 options with different shapes (from the four argument shapes), each labelled with the shape used.
3. Fill real names, numbers and credentials only from the user; otherwise leave `[brackets]`.
4. Run the checklist below before returning.
5. When the user edits a draft, find the rule that allowed the miss and update this file.

## Checklist

- [ ] Persona named; post matches that persona's length band
- [ ] At least one sentence ≤5 words; no three consecutive sentences within 5 words of each other in length
- [ ] Zero em-dashes; no "not X, but Y" / "isn't just" constructions
- [ ] "!" used naturally (≤2 per short post); "!!" only for team celebrations
- [ ] 0–1 emoji, at the end if any
- [ ] 0–4 hashtags, on the last line
- [ ] Sentence case start; first person singular
- [ ] Every number/quote is a published Gravity fact or a user-supplied fact; otherwise bracketed
- [ ] Product mentioned only if this is a proof post
- [ ] Ends on a concrete line, a real question, or a thank-you — not a restated moral

## How well this was measured

- **Solid:** length, punctuation, emoji, hashtag and pronoun rates across all 60 posts.
- **Indicative:** per-persona numbers (clusters of 10–24 posts, below the 40-per-voice target).
- **Provisional:** line-break rules (55 posts with reliable breaks; some fetched text collapsed breaks), engagement (8 posts with visible counts; no reaction counts available).
- **Not validated:** no held-out blind test was run. The personas blend several authors, and the per-voice corpus is too small to validate honestly. Re-measure after 30 of your own published posts and update this file from what performs.
