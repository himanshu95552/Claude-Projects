---
id: 2026-W41-li-co-01            # <ISO week>-<platform code>-<nn>; codes: li-co, li-sp (Shamit), x, ig, yt
platform: linkedin-company        # linkedin-company | linkedin-founder | x | instagram | youtube-shorts
format: document-carousel         # see platforms/limits.yaml -> formats
pillar: three-leaks               # content/pillars.md
leak: all                         # referral | order | revenue | all | none
audience: [owner, coo]            # owner, cfo, coo, marketing, rcm, scheduling, it, all
angle: "One line: the idea this post carries this week"
hook_ref: "research/briefs/2026-W41.md#hooks"   # which researched hook pattern it adapts
hook_source_text: ""              # the original hook's words; the linter checks we kept the pattern, not the phrasing (max 20% copied)
claims: [P10]                     # proof-ledger ids for every figure/claim used; [] if none
cta: exam-itemized                # aos-page | exam-itemized | demo | rsna-booth | none
link: ""                          # UTM'd link from scripts/utm.py (goes in first comment on LinkedIn)
media_urls: []                    # public URLs of the rendered frames / video (needed by Metricool for IG and LinkedIn documents)
scheduled_for: 2026-10-06T08:30:00-05:00
radiology_ok: false               # true only for X/RSNA/trade-press posts that use "radiology" in copy
status: pending                   # managed by scripts/gate.py; don't edit by hand
lint: ""                          # written by scripts/gravity_lint.py --write
approved_by: ""
approved_at: ""
content_hash: ""
metricool_post_id: ""
published_url: ""
---

## Post

The public text. For X threads use "## Thread" instead. For Instagram this is the caption.

## Thread

### 1
First post of an X thread (delete this section for non-threads).

### 2
Second post.

## First comment

LinkedIn: the link and any sources go here.

## Poll

```yaml
question: "How many systems does one order touch before you get paid?"
options: ["3 to 4", "5 to 6", "7 or more", "Never counted"]
duration: THREE_DAYS
```

## Slides

```yaml
theme: dark            # dark | light
slides:
  - template: cover
    kicker: "Imaging operations"
    headline: "Every order can be lost three times."
    sub: "Swipe for where, and why nobody sees it."
  - template: three-leaks
    rows:
      - {leak: "Referral leakage", what: "The referrer sends it elsewhere, or the fax is never worked.", verb: "Get the order."}
      - {leak: "Order leakage", what: "It sits unscheduled. The slot goes empty.", verb: "Complete the exam."}
      - {leak: "Revenue leakage", what: "A missing authorization. A denial six weeks later.", verb: "Get paid."}
  - template: cta
    headline: "Pick one leak. We'll measure it with you."
    sub: "Your exam, itemized, free for one workflow."
    link_text: "alphanodus.com"
```

## Video script

For reels, Shorts and LinkedIn video: timestamped beats, voiceover (VO) and on-screen text (OST).

| Time | Shot | VO | OST |
|---|---|---|---|
| 0:00-0:02 | | | Hook text |

## Title

YouTube only.

## Description

YouTube only.

## Alt text

One entry per image or slide, describing what is shown and all of its text.

## Visual brief

For the designer or video editor (not public).

## Sources

For each claim id: the source wording (not public; the linter uses the ledger).

## Reviewer notes

Anything the approver must decide: a "radiology" exception, a beta mention, a tag, a timing dependency (not public).
