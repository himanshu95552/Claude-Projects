---
name: gravity-graphics
description: "Brand graphics system for Alpha Nodus / Gravity (the Agentic Operations System for imaging centers). Use whenever making any visual for Alpha Nodus or Gravity: Instagram Reels and covers, LinkedIn or X post images, poll visuals, carousels, profile banners, cover images, animated loops, or any on-screen copy for them. Holds the exact brand tokens, fonts, logo files, layout grids and safe zones per platform, the illustration library, motion rules, AN27 copy rules, working HTML templates and render scripts for PNG and MP4."
metadata:
  version: "1.0.0"
  owner: "Alpha Nodus marketing"
---

# Gravity graphics playbook

Everything here was worked out on real deliverables (Reels, banners, LinkedIn and X posts) and approved by the marketing team. Follow it exactly; the user's own words in a request always win over it.

## 0. Before you start (every time)

1. Run `bash .claude/skills/gravity-graphics/scripts/setup.sh` (installs Urbanist + Geist Mono, Pillow, a bundled ffmpeg; links fonts into every template folder).
2. Read the brand templates in `assets/brand-templates/` once, so you see the real look before building.
3. If the AN27 docs (Positioning v1.7, Messaging Package v1.0) are attached, they are the source of truth for every word. Section 7 below is the short version.
4. Load the `artifact-design` skill for the design fundamentals, and `ai-copywriter` for any copy. The brand system here overrides their generic choices.

## 1. Brand tokens (exact values, sampled from the brand files)

| Token | Value |
|---|---|
| Page background | `#F5F7FA` |
| Text | `#0F172A` |
| Blue (dot, emphasis phrase, mono labels, checks) | `#1D4ED8` |
| Red eyebrow (the one eyebrow line only) | `#B21500` |
| Arc gradient | `#FF6B34` > `#F900C8` > `#0E59FF`, blended in OKLCH (`linear-gradient(in oklch 90deg, #FF6B34, #F900C8, #0E59FF)`) |
| Card / sheet fill | `#FFFFFF` |
| Hairline / path | `#E2E8F0` (derived from the reference post; confirm) |
| Illustration stroke | `#CBD5E1` (derived; confirm) |
| Soft blue fill | `#EAF0FE` (derived; confirm) |
| Muted text | `#64748B` (derived; confirm) |

Rules:
- Single light theme. There is no dark variant.
- Blue has ONE meaning: the order, an action being done, or the one emphasised phrase. Never decorate with it.
- Exactly ONE Arc gradient moment per graphic (for example the "scheduled, authorized" bar in the reference). Never on text, backgrounds or more than one element.
- No other gradients, no glows, no shadows, no extra colours. No semantic green; a "denied" or "missing" state uses blue as an outline or dashes. Red is only for the eyebrow.

## 2. Type

| Role | Face | Weight | Notes |
|---|---|---|---|
| Headlines | Urbanist | 600 (SemiBold) | letter-spacing -0.022em to -0.028em, line-height 1.02 to 1.04; matches the brand banners glyph for glyph |
| Body / sublines | Urbanist | 500 | 32 to 44 px on 1080-wide canvases |
| Eyebrows, labels, UI chips | Geist Mono | 500 | UPPERCASE, letter-spacing .14em to .24em, 17 to 24 px |

Headline sizes that worked: Reel 88 to 104 px; 4:5 post 78 to 88 px; wide banner 68 px; reel banner 100 px. One emphasised phrase per headline in the accent colour (for example "Get paid." or "gets paid?").

Never use Inter, Space Grotesk, system fonts, serif display faces or emoji.

## 3. Logo and the header motif

The brand's signature: AlphaNodus logo on the left, a thin hairline running right, ending in an accent dot.

| Canvas | Logo file | Logo position | Hairline | Dot |
|---|---|---|---|---|
| Reel 1080x1920 | the light logo crop (370x82) | left 90, top 290 | x 510 to 984, y 332, 1px | centre (984, 332), r 13 |
| Post 1080x1350 | `templates/post-4x5/logo_*.png` | left 82, top 90, height 71 | x 476 to 978, y 126 | centre (991, 126), r 13 |
| Square 1080x1080 | reuse 4:5 logo | left 88, top 88 | y 118 | centre (991, 118) |
| Banner 2000x500 | `templates/banner/logo_*.png` | centred on the path, or bottom right | path at y 415 | the end dot becomes the payment check |

Logo crops were taken from the brand files on their own background colour, so they sit seamlessly only on the matching background (the logo is placed on `#F5F7FA`; re-crop it from the new reference post). Never recolour, stretch, outline or put the logo on another colour.

Eyebrow pattern (used everywhere): `● ——  LABEL · LABEL` (10 px accent dot, 34 px hairline, mono uppercase). Centred layouts mirror it: `● —— LABEL —— ●`.

## 4. Visual language: the order's path

The whole brand story is one order travelling from referral to payment. Draw it that way.

- **The path**: the hairline becomes the floor. Label the ends `REFERRAL` (left) and `PAYMENT` (right) in mono.
- **The order**: an accent dot travelling along the path; the traversed part of the path turns accent.
- **Leaks**: markers `01 02 03` on the path. A leak is shown as the order dot falling off the path; the marker becomes an accent outline.
- **Gravity closing the leaks**: the dot travels all the way, markers fill solid, payment becomes a filled accent circle with a check.
- **Progress bar in Reels**: the header hairline fills with accent as the Reel plays and the header dot slides so it lands exactly on the template's position on the last frame.

### Illustration library (flat line art, 1.5 to 2 px strokes, fills from the sheet tokens)

Every story beat gets ONE concrete object the buyer recognises. Abstract shapes alone were rejected; concrete objects were approved ("easy to understand, better quality and context").

| Object | Use for | How it is drawn |
|---|---|---|
| Fax stack | referral, order intake, leak 01 | two tilted sheets, header `FAX · PG 1/1`, "Imaging order", grey text bars, accent checkbox, signature squiggle; more sheets sliding in = unworked pile |
| MRI gantry | the exam, "complete the exam" | rounded housing, bore rings, patient table with legs and base, faint concentric rings, accent scan arc that rotates, label `MRI · 1.5T` |
| Patient | exam happening | accent capsule plus head circle sliding into the bore |
| Schedule card | leak 02, open slots | `SCHEDULE · MRI 1`, time rows 09:00 to 10:30, filled bars, one dashed accent row `OPEN SLOT` (pulses) |
| Claim card | leak 03, denials | `CLAIM · MRI LUMBAR`, Eligibility ✓, Exam completed ✓, Authorization `MISSING`, rotated outline stamp `DENIED` |
| Tool chips | "held shut by hand" | pill chips `FAX` / `PHONE` / `PORTAL` with small line icons |
| Payment | get paid | dashed ring = unpaid or at risk; filled accent + check = paid |
| Order record card | RIS vs AOS comparisons | `ORDER · MRI`, "MRI lumbar spine", rows for fax / patient call / payer portal; grey and "in a queue" on the RIS side, accent with ✓ outcomes on the AOS side |
| System chips on a winding path | polls, "how many systems" | pill chips (Fax server, Phone system, CRM, RIS, Texting vendor, Interface engine, Payer portal, RCM) on a serpentine path; CRM/RIS/RCM in accent; a dashed `YOURS?` chip; ends at dashed `PAID?` |
| RSNA medal | Tower Radiology proof | circle medal with ribbon, `RSNA` / `2021` |

Illustrative details (times, exam names) are fine as long as they are generic. Never show a real patient, a real center's data, or a named person.

## 5. Layout and safe zones per platform

| Format | Size | Keep clear | Notes |
|---|---|---|---|
| Instagram Reel | 1080x1920, 30 fps | top 250 px (IG header), bottom 420 px (caption, audio), right 130 px from y 1100 down (buttons) | text block starts y ~470; illustration stage y ~1000 to 1460; path at y 1400 ends at x 920 |
| Reel cover / grid | same file | grid shows a 3:4 centre crop (y 240 to 1680) | hook must sit inside it; cover = frame 0 |
| LinkedIn / X feed image | 1080x1350 (4:5) | 96 px side margins | tallest feed size on mobile; headline in the top third |
| LinkedIn poll | none | LinkedIn polls cannot carry images | post the visual as the first comment on the poll, or as its own post the day before |
| Wide banner | 2000x500 | LinkedIn profile photo covers the bottom left | nothing essential bottom left; export LinkedIn company 1128x191, personal 1584x396, X 1500x500 when asked |
| Square | 1080x1080 | 88 px margins | |

Composition that worked: text top-left aligned for Reels and 4:5 posts (template style); centred stacks for banners and the reel banner. Content should fill the frame: headline, then illustration, then a footer rule with a one-line takeaway on the left and a mono tag on the right.

## 6. Motion rules (Reels and animated loops)

- Built as HTML with a deterministic `window.render(t)`; frames rendered by `scripts/render-video.js`. No CSS transitions or timers.
- Hook fully visible on frame 0 (it is also the thumbnail). No blank first frame.
- Change what's on screen every 2 to 3 seconds; max about 10 words per text beat.
- Word-by-word entrance: each word starts 0.065 s after the previous, slides up 38 px and fades in over 0.38 s (ease-out cubic). Scene exit: fade and lift 28 px over the last 0.22 s.
- Numbers count up over 0.9 s. Strike-through draws over 0.4 s.
- One orchestrated motion per scene (dot travels, card pops in with the world dimmed to ~30%, stamp lands). Nothing else moves.
- Loop-friendly ending: the last frame leads back into the first.
- Length: 30 s for a story Reel, 8 s for a banner loop. Export H.264 High, yuv420p, `+faststart`, with a silent AAC track (music is added in the Instagram app from its licensed library, low volume).
- Keep files under ~2 MB when they must be sent back through chat (flat colours compress well at CRF 20 with `-tune animation`).

Proven Reel structure (30.5 s): hook with strike-through (0 to 2.5) → "between the referral and the payment" (to 5.2) → "lost three times" (to 7.6) → leak 01 / 02 / 03, 2.6 s each (to 15.4) → "held shut by hand" (to 17.8) → "Gravity's agents do that work" then the three verbs (to 21.9) → proof with count-ups (to 27.3) → CTA "Watch one order go from referral to payment." plus `LINK IN BIO →` chip, full journey replays.

## 7. Copy rules (AN27, short version)

Approved lines to reuse verbatim:
- Master: "Gravity is the Agentic Operations System (AOS) for your CRM, RIS and RCM. It gets the order, completes the exam and gets it paid, so no referral, no order and no revenue leaks away."
- Promise (headlines only): "No referral leaks. No order leaks. No revenue leaks."
- Three verbs: "Get the order. Complete the exam. Get paid."
- Opener: "Imaging centers don't lose money in the scanner. They lose it between the referral and the payment."
- "Every order can be lost three times: before it arrives, before it's scanned, and before it's paid."
- "RIS records the work. AOS does the work." / "Every referral captured. Every report returned." (always followed by "We don't read the scan. We make sure it gets back.")
- Provocation for social: "Your staff will never log into your RIS again."
- Email/social opener: "How many referrals did you lose last month? Most imaging centers can't say, because the answer is split across three systems."

Hard rules:
- Spell out "Agentic Operations System (AOS)" on first use in every asset.
- Say "system", never "platform". Say "agentic", never "AI-powered". Say "imaging" in buyer copy ("radiology" only in hashtags, metadata, RSNA/trade press).
- Never "guarantee", never "zero". "No leaks" only in headlines; body copy says what Gravity stops or closes.
- Leakage is the enemy, never the staff. Write "held shut by hand" or "in a queue", not "waiting on staff" or "burnout".
- Sasha, Sandra, Susan are internal names; never on any graphic. Say "Gravity's agents".
- No "replace your RIS" in public copy until the RamSoft brief is cleared.
- Security, only these: hosted on AWS in US regions only; a HIPAA BAA with every customer; independently penetration-tested; AES-256 at rest with per-tenant keys; MFA on production access. Never "SOC 2", "HIPAA certified", "more secure".
- Proof: Tower Radiology, RSNA 2021 Quality Improvement Award: +7% exams a week (MRI, CT, mammography), $2.3M added revenue, 71% shorter wait. One person handles about 350 orders a day. Send Dr. Kedar a courtesy note before publishing Tower figures. ProScan figures need ProScan's OK. No other customer results; never invent a quote or number.
- No em dashes or en dashes. No emoji. No hype words (unlock, elevate, revolutionize, seamless, cutting-edge).
- CTAs: "Watch one order go from referral to payment." / "Book a working session." Instagram: "Link in bio" (caption links are not clickable).

## 8. Do and don't

Do:
- Start from the brand templates in `assets/brand-templates/`; match their header motif and margins.
- Give every beat a concrete illustration from section 4.
- Keep one accent meaning, one emphasised phrase, one moving thing per scene.
- Deliver the light theme, plus a cover frame for video.
- Tell the user platform limits that change how they post (LinkedIn polls, profile-photo overlap, IG link in bio).

Don't (each of these was tried or flagged and rejected):
- Abstract-only visuals (dots and lines with no objects) for explainers.
- Any gradient other than the single Arc moment, glows, glassmorphism, drop shadows, stock icons, 3D renders, photos of people.
- Rounded cards everywhere, emoji as markers, everything centred on posts, big empty areas.
- Text inside platform UI zones (Reel buttons and caption area).
- Headlines wider than their column: they collided with illustrations twice; check the contact sheet.
- Numbers, quotes, customers or awards that are not in section 7.

## 9. Workflow (what produced the approved results)

1. Pin the format and platform (table in section 5) and the one message.
2. Write the copy first with AN27 lines and the `ai-copywriter` rules; one idea per frame.
3. Plan the beats: for each, the words (≤10), the object from section 4, and the one motion.
4. Copy the closest template from `templates/` and edit it. Keep tokens and fonts; SVG `fill`/`stroke` attributes use `var(--token)` and a small script converts them to styles (keep that snippet).
5. Take ONE look before the final render: `python3 scripts/contact-sheet.py page.html sheet.png 0,2,4.5,7,...` for video, or `node scripts/render-still.js` for stills. Fix overlaps, wraps and safe-zone hits in one pass.
6. Render: `node scripts/render-still.js page.html out.png '#light'` or `node scripts/render-video.js page.html out.mp4 30.5 '#light'` (run with `NODE_PATH=$(npm root -g)`; Chromium lives at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, override with `CHROME=`).
7. Check: no em dashes, AOS spelled out, safe zones clear, file size, only the approved colours, one Arc moment.
8. Deliver files plus posting notes: cover frame, add IG music in-app, Trial Reel first, caption, first-comment trick for LinkedIn polls, Tower permission reminder.

## 10. Templates in this folder

| File | What it is |
|---|---|
| `templates/reel/reel-30s-three-leaks.html` | the approved 30.5 s Reel with illustrations (recolour to the light palette) |
| `templates/banner/reel-banner-8s-loop.html` | 1080x1920 centred banner, still (`render(-1)`) or 8 s loop; `#light` |
| `templates/banner/wide-2000x500.html` | centred 2000x500 banner with fax, path, logo node, MRI, payment; `#light` |
| `templates/post-4x5/poll-systems.html` | LinkedIn poll visual, systems on a winding path; `#light` |
| `templates/post-4x5/ris-vs-aos.html` | X/LinkedIn comparison post, order record card twice; `#light` |
| `assets/brand-templates/` | the original brand files: reel, 4:5, square, banner (legacy dark-purple set, superseded by the palette in section 1) |
