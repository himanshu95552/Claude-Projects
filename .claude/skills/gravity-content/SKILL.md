---
name: gravity-content
description: Module 2 of the Gravity Social OS. Turns the weekly research brief into a full week of platform-native posts for Alpha Nodus / Gravity (LinkedIn company page, Shamit Patel's LinkedIn, X, Instagram, YouTube Shorts) in the Gravity brand voice. Writes carousels, threads, polls, captions, reel scripts, alt text and UTM links, then lints every post against the AN27 guardrails and proof ledger, renders carousels, and leaves everything waiting in the approval queue. Use for "write next week's posts", "draft a LinkedIn carousel / X thread / reel about...", or any Gravity social copy.
---

# Gravity content: the studio

Every post lands in `gravity-social/content/queue/pending/` as one Markdown file per post (format: `templates/post.md`) and **stays there until a person approves it**. You never approve, schedule or publish.

## Inputs, read every time

- The latest `research/briefs/<week>.yaml` and `.md`: the angles, hooks, signals and questions.
- `brand/aos-definition.md` for every aos-category post: the definition, the five tests, the comparison table, the maturity model, what an AOS is not, and the nine RFP questions, quoted verbatim from AOS Definitional Page v1.1.
- `brand/voice.md` (the voice, the approved lines, the two spoken images), `brand/messaging.md` (pillars, capability status, CTAs, audiences), `brand/proof-ledger.yaml` (the only numbers allowed), `brand/guardrails.yaml` (what the linter blocks), `brand/visual.md`, `brand/search-vocabulary.md`.
- `platforms/<platform>.md` for every platform you write for, and `platforms/limits.yaml`.
- `content/pillars.md` for phase weighting and the weekly mix.
- `config.yaml` for enabled platforms, posts per week and links.

## One angle, written natively for each platform

An angle from the brief becomes a **different piece per platform**, not the same text resized:

| Platform | The same angle becomes |
|---|---|
| LinkedIn company | A 6 to 10 frame document carousel that teaches the argument, or a 900 to 1,500 character post with a first line that survives mobile truncation; link in the first comment |
| LinkedIn founder | Shamit, first person: the moment that taught him this, one sentence about Gravity at most, an honest question |
| X | One sharp line, or a numbered 5 to 8 part thread; source named for every stat; one hashtag at most |
| Instagram | A typographic carousel with shorter frames and more swipe tension, or a reel script with on-screen text in the first 1.5 seconds; "Link in bio" |
| YouTube Shorts | The reel script, with a search-phrase title and description (only if enabled) |

## Writing each post

1. **Pick the hook** from the brief's hook lab (Gravity's version), or write one in the same pattern. Put the original in `hook_source_text` so the linter checks we kept the pattern, not the words.
2. **Write the body** in the voice: specific scenes (the fax tray, the 3:15 Tuesday slot, four payer portals open), short sentences, calm. Use at most one approved line, verbatim.
3. **Claims:** every $, %, multiplier or count must be a figure from `brand/proof-ledger.yaml`. List every ledger id you use in `claims:` and follow its `must_say` (for example "about," "modeled," or naming Tower Radiology and RSNA 2021). Unit-economics figures always say *modeled*, and the $31 expected case always travels with the $21 conservative case. If the angle needs a number that isn't in the ledger, leave it out and note it in Reviewer notes.
4. **Capability status:** describe only what ships (`brand/messaging.md` capability table). Beta features say "beta." Committed-for-RSNA features are not described as live.
5. **CTA:** one per post, from the ladder (aos-page, exam-itemized, demo, rsna-booth). Build the link: `python3 scripts/utm.py --cta <cta> --platform <platform> --post <id>`. Put it in `link:`. On LinkedIn it goes in `## First comment`; on X it goes in the last part; on Instagram the caption says "Link in bio."
6. **Slides:** for carousels, write the `## Slides` yaml using the templates in `brand/visual.md` (cover, statement, three-leaks, timeline, itemized, stat, question, cta, text). Keep frames short (LinkedIn 12 to 35 words, Instagram 12 to 25). Use `**word**` for accent colour, `==word==` for highlight. Add `beta: true` on frames showing beta features and a `footnote` with "modeled" wherever unit economics appear.
7. **Alt text** for every image or frame: what's shown plus all of its text.
8. **Video:** reels and Shorts get a `## Video script` table (time, shot, VO, on-screen text). Shots are recorded on the **demo tenant** with the demo patient (Maria Lopez, 52, knee MRI, referred by Dr. Patel's office) or with the team. Never real patients or real screens.
9. **Reviewer notes:** anything the approver must decide: a "radiology" exception (`radiology_ok: true`), an illustrative number (the demo's "40 orders a month, then 12"), a tag, a dependency ("post after the booth number is confirmed").
10. **Schedule:** set `scheduled_for` in US Central on the platform's default slots (`platforms/*.md`) until Metricool best-time data exists. Keep at least 18 hours between company-page LinkedIn posts.

File name and id: `<YYYY>-W<ww>-<code>-<nn>.md` with codes `li-co` (company), `li-sp` (Shamit), `x`, `ig`, `yt`. The `id:` in the frontmatter matches the file name.

## Check, fix, render, show

```bash
cd gravity-social
python3 scripts/gravity_lint.py --state pending --write     # fix every ERROR; re-run until none remain
python3 scripts/render_carousel.py --state pending          # PNG frames + PDF per carousel; fix any OVERFLOW
python3 scripts/build_dashboard.py                           # Content tab: week grid + approval queue with previews
```

- Treat every lint ERROR as a bug in the draft: rewrite, never weaken a rule to pass. Warnings need either a fix or a Reviewer note explaining why the warning is acceptable.
- Look at the rendered frames (read the PNGs). Check contrast, overflow, one idea per frame, that frame 1 works alone, and that the numbers match the post.
- Finish with a short summary for the person: how many posts per platform, the angles, anything flagged for their decision, and "N posts waiting for your approval in content/dashboard.html." Offer to publish the dashboard as a private artifact so they can review it on their phone.

## Things this module never does

- Approve, schedule or publish.
- Write the same text for two platforms.
- Name a competitor, a persona, or a customer other than Tower Radiology (with its published results).
- Use a figure outside the ledger, or drop a qualifier from one inside it.
- Invent a testimonial, a quote, a statistic or a customer story.
