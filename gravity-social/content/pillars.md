# Content pillars and the RSNA 2026 runway

Every post belongs to exactly one pillar, and every pillar traces to the AN27 argument. Set the `pillar:` frontmatter field to the id.

## The nine pillars

| id | Pillar | What it does | Anchor material | Leads to CTA |
|---|---|---|---|---|
| `three-leaks` | **Every order can be lost three times** | Names the problem in the reader's own terms: referral, order and revenue leakage | Deck slides 6 to 8; the three questions nobody can answer | exam-itemized |
| `referral-loop` | **Every referral captured. Every report returned.** | Get the order: referrers going quiet, fax vs portal, live status, report and images back the minute they're signed | Deck slides 10, 11, 17; Pillar 1 | demo |
| `order-to-exam` | **Complete the exam** | Fax to order, text and voice booking, no-show refill, kiosk check-in, the empty seat at takeoff | Deck slides 12 to 14, 17; Pillar 2 | demo |
| `get-paid` | **Every exam you complete, you get paid for** | Authorized before arrival; denials are front-end problems found weeks later; charges from the report (beta) | Deck slides 15, 16, 18, 19; Pillar 3 | exam-itemized |
| `exam-itemized` | **Your exam, itemized** | Unit economics: $154 in, $39 of paper, $11 left; the fixed-cost lever; $127 per filled slot | Unit Economics Closer v1.1 (always modeled; show the conservative case with the expected one) | exam-itemized |
| `aos-category` | **RIS records the work. AOS does the work.** | Category education: the five tests, the maturity model (Level 0 to 3), what an AOS is not, AOS vs RIS | AOS definitional page; SEO map §7 | aos-page |
| `proof` | **Don't take our word for it** | Tower Radiology (RSNA 2021 award), the IGI Global paper, 350 orders a day per person, 99% classification | Proof ledger | demo |
| `founder-and-team` | **We did the job before we automated it** | Six weeks for a scan; a year volunteering at a center; engineers who sit and do the work first; the values | Deck slides 1 to 3 | aos-page / none |
| `industry-signal` | **What changed this week** | Timely commentary: payer portal migrations, CMS rules, the AMA prior-auth survey, technologist vacancies, agentic AI in imaging, RSNA news. Always tied back to one of the three leaks | Research brief each week | varies |

`one-system` (phone, fax and text built in; cloud; one set of data; fewer vendors to secure) is **never its own pillar**. Use it inside posts for IT audiences, or as the supporting point in `order-to-exam` and `get-paid`.

## Weekly mix (default; the orchestrator rebalances from the report)

| Platform | Posts | Suggested mix |
|---|---|---|
| LinkedIn company | 4 | 1 document carousel (three-leaks / exam-itemized / aos-category), 1 proof or industry-signal text post, 1 poll or question, 1 short demo video or order-timeline image |
| LinkedIn founder (Shamit) | 3 | 1 story (founder-and-team), 1 point of view on industry-signal, 1 "what we learned doing the job" |
| X | 7 | 5 single posts (sharp lines, stats with sources, live commentary), 1 thread (5 to 8 parts), 1 reply-bait question |
| Instagram | 3 | 2 carousels (typographic), 1 reel (team, demo moment, or RSNA) |
| YouTube Shorts | 1 | Reuse the reel script, only when enabled |

The research brief names the week's **angle**, and the same idea runs natively on each platform: the carousel on LinkedIn, the thread on X, the reel on Instagram. Each piece is written for its platform, never cross-posted as the same text.

## Phase weighting (from config.yaml `campaigns`)

| Phase | Dates | Weighting | Signature pieces |
|---|---|---|---|
| **Category seeding** | 28 Sep to 25 Oct | aos-category 25%, three-leaks 25%, founder 15%, referral-loop 10%, order-to-exam 10%, industry-signal 15% | "What is an Agentic Operations System (AOS)?" carousel; the five tests as a 5-post X series; "RIS records the work. AOS does the work."; Shamit's six-weeks story |
| **Proof and economics** | 26 Oct to 15 Nov | exam-itemized 25%, proof 25%, get-paid 20%, referral-loop 15%, industry-signal 15% | "Your exam, itemized" carousel; Tower Radiology proof series; "$39 of paper vs $19 for the read"; "Authorized before arrival" |
| **RSNA countdown** | 16 to 28 Nov | three-leaks 25%, proof 20%, order-to-exam 20% (the voice-agent demo), referral-loop 15%, founder 20% | "Come be the patient": our voice agent calls your phone at the booth; booth number on everything; meeting-booking CTA |
| **RSNA live** | 29 Nov to 3 Dec | Real-time: booth moments, sessions, "the call" clips, one takeaway a day | X is primary; LinkedIn daily recap; IG stories and reels. "Radiology" allowed in copy this week |
| **Follow-up** | 4 to 18 Dec | proof, exam-itemized, "what we heard at RSNA" | Offer "your exam, itemized" to everyone we met |

## Evergreen angles bank (seed ideas; the research module adds to it)

- The three questions nobody can answer: referrals lost last month, orders that never became exams, exams never fully paid.
- The empty seat at takeoff: a 3:15 Tuesday MRI slot is gone forever at 3:16.
- The takeout menu in the fax tray: what actually arrives by fax (IDs, insurance cards, progress notes, orders, records requests).
- "Kind of describes your current life?": a day at a center (full fax tray, phones on hold, four payer portals open, a denial from six weeks ago).
- How many systems does one order touch before you get paid? (poll)
- A referrer who sent 40 orders a month sends 12 this month. Most centers find out a quarter later.
- The denial you get in six weeks is a scheduling-stage mistake made today.
- Airlines 85%, imaging 65%: "You don't have a capacity problem. You have a leakage problem."
- Your worklist becomes an exception list.
- One order, start to finish: referral → order → schedule → authorization → check-in → exam → report delivered → charges → claim → payment.
- The five AOS tests as questions to put in an RFP.
- Level 0 to Level 3: where is each of your workflows today?
- What an AOS is not: not a PACS, not diagnostic AI, not RPA, not a chatbot.
- "We don't read the scan. We make sure it gets back."
- The order is finished when the report is back, because that's when the referrer decides where the next order goes.
- Values in practice: Hunger (we do the job before we automate it), Innovation (we build what the work needs), Customer Success (every employee owns the customer's outcome).
- The nine RFP questions as a series, one a day (`brand/aos-definition.md`); question 9 is the referring office's experience.
- Level 0 to Level 3: "Most 'AI-powered' imaging software sits at Level 1." Where does each of your workflows sit?
- "It is not an agentic operating system": an operating system runs other software; an Agentic Operations System runs an operation.
- The comparison table: CRM, RIS, RCM, AOS. "When volume doubles: hire, hire, hire. Cost per transaction falls."
- "A referrer going quiet is noticed in days, not quarters": 40 orders a month becomes 12, flagged on day nine (demo story; mark as illustrative).
- "Nothing was handed off. That's what one system means.": the approval that lands before the patient does.
- The capacity parity line: demand above the line, slots to fill below it. "This is what 65 percent looks like."
- For CFOs: 60% of healthcare CFOs target two points of margin in two years (Deloitte 2026, B17); the paper line is the cost they control.
- For CIOs: 62% want one AI partner, 13% have one (Qventus 2026, B16); one system instead of six.
