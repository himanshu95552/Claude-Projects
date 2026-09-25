# Reply playbook

Replies are public copy. The same rules apply: `brand/voice.md`, the guardrails, and the proof ledger. Every drafted reply is linted (`python3 scripts/gravity_lint.py --text "..." --platform linkedin-company`) and approved before it's sent. The exception is the reply bank below, whose lines are pre-approved and may be used as written.

## Shape of a good reply

1. Answer the actual question in the first sentence.
2. One specific detail (a mechanism, not an adjective).
3. If it's a lead: one clear next step, moved to a private channel.
4. Sign-off by name when a person is replying ("– Jay"). The company page never pretends to be a person, and nobody pretends to be a bot.

Keep it under 60 words on LinkedIn and under 280 characters on X.

## Pre-approved reply bank

| Situation | Reply |
|---|---|
| Praise, general | "Thank you. The fax tray and the phones are where most of it starts, so it's good to hear this lands." |
| Praise on a proof post | "Thank you. The credit for the Tower Radiology results belongs to their team, who presented them at RSNA." |
| "Is this RPA?" | "No. RPA replays recorded steps and breaks when a screen changes. Gravity's agents read the page and decide what to do next, the way a person would. The difference shows the first time a payer redesigns its portal." |
| "Do you read the images?" | "No. Gravity doesn't read the scan, write the report or store the images. It delivers the signed report and the images to the referring office the minute they're signed. We don't read the scan. We make sure it gets back." |
| "What's an AOS?" | "An Agentic Operations System (AOS) does the operational work a RIS records: intake, scheduling, eligibility, authorization, check-in, claims. RIS records the work. AOS does the work. The five tests are here: [aos link]" |
| "Does it replace our RIS?" | "It runs on top of your RIS and RCM, and your staff stop logging into them. Gravity does the work and writes to them. Nothing gets ripped out." |
| "Is it secure?" | "Hosted on AWS in US regions only, with a HIPAA Business Associate Agreement with every customer, and independently penetration-tested, most recently September 2026. Details are on our Trust Center: security.alphanodus.com" |
| Candidate | "Thanks for your interest. Please reach us through alphanodus.com/contact and mention the role you're after." |
| Patient redirect | "We're sorry you're dealing with this. Alpha Nodus makes software for imaging centers and can't see appointments, bills or results. Please contact your imaging center directly, and please don't share personal or health details here." |
| Lead, hot (public part) | "Happy to walk you through it on your own numbers. I'll send you a message now." (then DM) |
| RSNA meeting ask | "We'd love to. We're at booth [N], and you can be the patient in the demo: our voice agent will call your phone. I'll message you to find a time." |

## DM follow-up for a hot lead (draft, then approve)

> Hi [first name], thanks for asking. The fastest way to see whether Gravity fits is one of two things: a 30-minute demo where you play the patient (our voice agent calls your phone), or "your exam, itemized," where we take three numbers (exams by modality, collections, payroll by role) and show what one exam costs you between the referral and the payment. It's free for one workflow. Which would be more useful? – [name], Alpha Nodus

## Never in a reply

Pricing numbers · customer names (except Tower Radiology's published results) · any claim not in the proof ledger · anything about a competitor · a promise of a date for a roadmap item · patient details, even when repeating the commenter's own words.
