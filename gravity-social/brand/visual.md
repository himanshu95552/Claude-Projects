# Visual direction for social

Source: Deck Outline v2.1 (slide 1 and slide 21 visual notes, house rules), plus the live alphanodus.com stylesheet (colours and fonts, read 25 Sep 2026). Positioning decision 7 (a new logo and palette that say "system") is not started. When it lands, change `scripts/carousel-theme.json` and this file; every template follows.

## Principles

1. **Typographic and calm.** The words are the visual. Big type, lots of space, one idea per frame.
2. **The leak is a line item.** No pipes, funnels, dripping taps or leaking anything. Show leakage as numbers, as an itemized statement, as a timeline with a gap.
3. **Real operational objects, drawn plainly:** a fax page, a work queue, a slot grid, a payer-portal tab, a timeline of one order. Schematic, not photographic.
4. **No robots, handshakes, glowing brains, stock patients, or stock doctors pointing at screens.** No AI sparkle icons.
5. **Product screenshots only from the demo tenant**, using the realistic demo patient (Maria Lopez, 52, knee MRI, referred by Dr. Patel's office). Never a real patient, never real PHI, never cartoon names.
6. **Beta capabilities show a visible "Beta" tag** in any frame that depicts them.

## Palette (live site, current)

| Token | Hex | Use |
|---|---|---|
| ink | `#0C0B1F` | Primary background for dark frames; body text on light frames |
| ink-2 | `#0F0E29` | Secondary dark surface |
| ink-3 | `#202052` | Cards and dividers on dark |
| blue | `#002EED` | Primary accent: the verb, the key number, "With Gravity" |
| magenta | `#FE4BD1` | Highlight, used once per frame at most: the net, the leak |
| lavender | `#F0E3FF` | Light background |
| gray | `#CBCDD3` | Secondary text on dark, rules |
| white | `#FFFFFF` | Text on dark |

Contrast: body text is white on ink or ink on lavender/white. Magenta is used for large numbers and highlights, never for body text on white.

## Type

- **Space Grotesk** for headlines and big numbers (600 to 700).
- **Inter** for body, labels and footnotes (400 to 600).
- Headline 72 to 96 px on a 1080-wide frame. Body 34 to 40 px. Footnote 22 to 24 px.
- Sentence case. No all-caps sentences (a short kicker label in caps is fine).

## Formats and sizes

| Platform | Format | Size | Notes |
|---|---|---|---|
| LinkedIn | Document carousel (PDF) | 1080 x 1350, 6 to 10 frames | First frame = hook, last frame = CTA plus "Gravity, from Alpha Nodus" |
| LinkedIn | Single image | 1200 x 1500 (4:5) or 1200 x 627 for link-style | |
| LinkedIn / Instagram / Shorts | Video | 1080 x 1920 (9:16) or 1080 x 1350 feed | Burned-in captions always; hook text on screen in the first 1.5 seconds |
| Instagram | Carousel | 1080 x 1350, up to 10 frames | Frame 1 must work as a stand-alone post |
| X | Image | 1600 x 900 (16:9) or 1080 x 1350 | Readable at phone width; 6 words or fewer on the image |

## Recurring templates (rendered by scripts/render_carousel.mjs)

| Template | Looks like | For |
|---|---|---|
| `cover` | Ink background, kicker, 2 to 3 line headline, blue verb | Carousel frame 1 |
| `statement` | One sentence, very large | The approved lines |
| `itemized` | Two-column receipt: Today vs With Gravity, net highlighted in magenta | Unit-economics posts (always carries the "modeled" footnote) |
| `three-leaks` | Three stacked rows: leak, what it looks like, verb that closes it | The core argument |
| `timeline` | One order's steps on a vertical line, exit ramps marked | The loop / "one order" posts |
| `stat` | One huge number, a source line under it | Proof and benchmarks |
| `question` | A question the reader can't answer | Hooks and polls |
| `cta` | The ask, link text, Gravity sign-off | Final frame |

Every frame carries a small footer: "Gravity · Agentic Operations System (AOS)" at left, frame number at right.
