---
name: alphanodus-brand
description: Alpha Nodus / Gravity brand system v2.0 (Plum, AN27 messaging). Use whenever producing or reviewing anything customer-facing or branded for Alpha Nodus or Gravity - web pages, decks, documents, charts, emails, booth or print, UI, logos, colours, fonts, headlines, product copy, taglines, boilerplate. Enforces the ten rules, plum-tokens.css, the lexicon and approved copy blocks. Triggers on AlphaNodus, Alpha Nodus, Gravity AOS, Plum, Lagoon, brand guidelines, on-brand, AN27.
---

# AlphaNodus brand (internal)

Internal skill for Alpha Nodus. Brand Guidelines v2.0 (September 2026) and the AN27 Messaging Package v1.0; owner Shamit Patel. One system, two surfaces: paper and ink.

## Use

1. Decide the output type (web, deck, document, chart, booth/print, UI, copy only) and the surface (paper or ink).
2. Load the reference that fits, mandatory before drafting:
   - any visual output: `references/visual-system.md`
   - any words a customer or partner will read: `references/voice-and-language.md`
3. For code, link or inline `assets/plum-tokens.css`; use its variables, never raw hex. Set `data-surface="paper|ink"` on each frame. Logos are in `assets/logo/` (horizontal default); component reference screenshots in `assets/component-reference/`.
4. Run the pre-flight below before delivering.

## The ten rules

1. The logo is black or white. Never recoloured, never on a gradient.
2. One accent per surface, at full strength. Quiet = tint, never a faded accent.
3. No gradients as colour. Anywhere, including product buttons.
4. On ink, the accent is Plum 300. Plum 600 on ink (2.9:1) is forbidden.
5. Accent as text is Plum 700. Plum 600 is for fills.
6. Lagoon is an outcome, never a status. Once per surface; a block, number or node, never a pill beside a success pill; never a web field.
7. On ink, hierarchy comes from weight and size. Never opacity.
8. One node per surface as a graphic. It never pulses and never becomes a network.
9. Status colours mean the same thing on the website and in the product.
10. Retired means retired: the arc, orange, magenta and personas.

When in doubt: What surface is this on? (Paper: Plum 600 fills, Plum 700 text. Ink: Plum 300, white text.) Has Plum already appeared on this surface? (Then the answer is a tint, a hairline, or nothing.) Is the line in the copy blocks? (If not, it is not approved: ask for a new block.)

## Defaults that change every output

- Headings Urbanist 600, body Inter, numbers and eyebrows JetBrains Mono. Sentence case; the eyebrow is the only all-caps. No emoji, no exclamation marks, no icon set.
- Say "system", "agentic", "get the order", "leaks" (referral, order or revenue). Never "platform", "AI-powered", "friction", "guarantee", "zero".
- Copy blocks are pasted, not paraphrased. Security wording is verbatim.
- Only image allowed is an unmodified Gravity screenshot. No stock imagery, no illustration.

## Pre-flight (check the output against this before delivering)

- Colours: every colour is a token from `plum-tokens.css`; Plum appears once per surface; no retired colour (#E8521F, #FE4BD1, #0C0B1F as canvas, orange/yellow accents); no gradient; Lagoon at most once per surface and not as a status.
- On ink: accent is Plum 300; no Plum 600; hierarchy by weight and size, not opacity.
- Type: headings 600 not 700; sentence case; eyebrow only all-caps; body measure 65 to 74 characters.
- Logo: black or white, native file, clear space respected, 24px minimum.
- Device: one node graphic per surface, flat, not animated.
- Copy: every claim line is from the copy blocks or consistent with them; no item from the "never say" list; AOS spelled out on first use; no unsourced number; Gravity's agents not named publicly.
- Buttons: one primary per section, 44px minimum target.

## Provenance and gaps

- Built from the v2.0 guideline screenshots, the logo bundle and the component images. Token hex values were transcribed from screenshots, so verify them against the owner's canonical `plum-tokens.css` before production use, and replace `assets/plum-tokens.css` with it when available (keeping this skill's class/semantic additions if still wanted).
- Not supplied, so not in this skill: boilerplate 50 text, Black vertical lockup, Black horizontal SVG (only `Horizontal/Black.png`), fonts files, section 08 component specs beyond the images provided.
- Observations about this skill belong in the task-observer log naming `alphanodus-brand`.
