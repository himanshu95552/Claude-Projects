# Alpha Nodus Brand Guidelines — full written spec

**v2.0 · September 2026 · Owner: Shamit Patel · Governs Alpha Nodus and the Gravity product**

This is the written form of `reference/brand-guidelines.html`, kept in step with it. Every value is in `reference/plum-tokens.css`; copy that file rather than retyping a hex. The reasoning behind each decision is in the project doc *Brand Guidelines v2 — Decision Log*; the verbal system is the Message House (`alpha-nodus:message-house`). Section numbers below are the ones the token file's comments point at (§9 the ten rules, §11 Gravity).

---

## One system, two surfaces

The brand guidelines for Alpha Nodus, and for Gravity. One set of tokens for the company and the product. A neutral lion, a plum-black ink, one violet called Plum, one teal called Lagoon for outcomes, a line that ends in a node, and the Alpha Nodus message. Everything the company puts in front of a customer, a partner, a candidate or a journalist is derived from this document, and so is the product interface.

**What this governs.** alphanodus.com, decks, documents, email, social, the RSNA booth, print and merchandise, and the Gravity product interface. There is no separate product palette: Gravity uses these tokens, with its own layout and components (§11).

**Who this is for.** Anyone making something with our name on it: marketing, sales, customer success, engineering, an agency, a booth builder, a new hire on day one. If a claim, a colour or a line is not here, it does not ship.

**How to use it.** Read the ten rules (§9) first. Copy `plum-tokens.css` rather than retyping a hex. Pull copy from the copy blocks (§8) and never from memory. Everything in this document is decided; anything not in it is not approved.

---

## 1 · Who we are

The parts of the company that are not instruments. A category, a product and a palette can all be replaced without these changing.

**Vision: Just-in-time care.** Just-in-time exists in manufacturing, logistics, every industry you can name, except healthcare, where patients wait weeks for something the building could do this afternoon.

**Mission: Automate and accelerate every patient journey.** We started in diagnostic imaging because the delay is easiest to measure there and the fix is easiest to prove.

**Values**

- **Hunger.** We do the job before we automate it, and we are never done.
- **Innovation.** We build what the work needs, not what the market already sells.
- **Customer Success.** Every employee owns the customer's outcome.

**Origin.** Founded 2015. A founder from semiconductors who could not get a scan for six weeks. Sensors in imaging centers found 60 to 65 percent utilization while patients waited: the constraint was the operation, not the machines. A year doing every job on the front desk before a line of code. Austin, Sunrise, Bangalore.

**The names.** *Alpha Nodus.* Nodus is Latin for knot, or node. The mark is a lion, an alpha, drawn as a loop. *Gravity.* The pull toward a single center. *AOS.* The Agentic Operations System, the category we authored and the instrument of the mission, never its identity.

---

## 2 · The logo

Version 2. The lion and the wordmark ship in black and in white, and are placed, never redrawn.

### The files

Eight SVGs in the skill's `assets/`. Black files use `#0E0E0E` with `#DADADA` shading on the alpha; white files use `#FFFFFF` with the same shading. The shading is part of the mark and stays.

| File | What it is | Where it goes |
|---|---|---|
| `logo-horizontal-black.svg` | Horizontal lockup, black | The default. White, paper, any tint. |
| `logo-horizontal-white.svg` | Horizontal lockup, white | On ink. |
| `logo-vertical-black.svg` | Vertical lockup, black | Square frames, the booth. |
| `logo-vertical-white.svg` | Vertical lockup, white | On ink, or on a Plum field (print only). |
| `logomark-black.svg` / `logomark-white.svg` | The lion alone | At 24px or larger. |
| `logotype-black.svg` / `logotype-white.svg` | The wordmark alone | When space is tight; the only choice below 24px. |

### Which file where

| Surface | File |
|---|---|
| White, paper, any tint | Black |
| Ink field, plum field, product screenshot frame | White |
| Photography | Not permitted (see §7, Imagery) |
| Below 24px tall | Logotype only. The lion loses its face. |

### Clear space and minimum size

Clear space on all sides equals the height of the lion's head at the size in use. Nothing enters it: type, rules, the node, a panel edge. Minimum height 24px for the horizontal lockup, 24px for the lion alone, 14px for the logotype.

### Never

- Recolour the lion or the wordmark, in Plum or anything else. Black or white only.
- Place the logo on a gradient, a photograph, or a busy product screenshot.
- Rotate, stretch, outline, add a shadow, or put the lockup in a coloured container.
- Use the lion as a bullet, an icon, a favicon smaller than 24px, or a watermark. The node does that work.

Where an SVG cannot be embedded (some slide and document tools), rasterize the SVG to a PNG at the size needed. Never typeset the company name as a stand-in for the logo.

---

## 3 · Colour

A monochrome core in plum-black and paper, one violet called Plum, and one teal called Lagoon reserved for outcomes. Ink and paper carry about 85 percent of every surface. Plum appears once per surface at full strength. Neutrals, text and status colours are shared with the Gravity product, so the website and the app are the same values.

### Plum

The brand colour. A violet shifted toward red, on a plum-black ink. The violet is the company's: Nodus is node, the mark is a loop, and the founders came from semiconductors, where violet is what a wafer looks like under light. The red lean carries the founding story, warmth without a warm hue. It sits on the blue–yellow axis, so it survives red–green colour vision.

The ramp, 50 to 900:

| Step | Hex | Job |
|---|---|---|
| 50 | `#F3EEFE` | Tint: callouts, highlighted rows, tag backgrounds |
| 100 | `#E7DDFC` | Strong tint: selected rows, chip backgrounds |
| 200 | `#CDB9F8` | Data series 3 |
| 300 | `#C9B3FF` | **The accent on ink.** 9.6:1 on `--an-ink` |
| 400 | `#8E67EA` | Data series 2; never text |
| 500 | `#7B4FE6` | Reserved |
| 600 | `#6B3FE4` | **Primary.** Fills, buttons, the node. White text 6.1:1 |
| 700 | `#5B2FD1` | Hover; **accent as text** on paper 6.9:1 (7.6:1 on white) |
| 800 | `#4A25AD` | Pressed; emphasis text 9.7:1 on white |
| 900 | `#3A1C86` | Deepest; rare |

The five that matter most:

| Name | Hex | Use | Contrast |
|---|---|---|---|
| Plum 600 · primary | `#6B3FE4` | Fills, buttons, the node | white text 6.1:1 |
| Plum 700 · text | `#5B2FD1` | Accent as type on paper, hover | 6.9:1 paper · 7.6:1 white |
| Plum 300 · on ink | `#C9B3FF` | The accent on any ink surface | 9.6:1 on ink |
| Plum 50 · tint | `#F3EEFE` | Callouts, highlighted rows, tags | ink text 15.5:1 |
| Ink | `#1B1430` | The only dark field | white text 17.7:1 |

Semantic aliases in the token file: `--an-primary` (600), `--an-primary-hover` (700), `--an-primary-press` (800), `--an-primary-text` (700), `--an-on-ink` (300), `--an-link` (700), `--an-link-hover` (800), `--an-focus` (600).

### Ink, paper and the shared neutrals

| Name | Hex | Use | Note |
|---|---|---|---|
| Paper | `#F6F4FA` | Page canvas, tinted a hair toward plum | ink text 16.4:1 |
| Surface | `#FFFFFF` | Cards, nav, content | shared with product |
| Surface muted | `#F8FAFC` | Alternating sections, table headers | shared with product |
| Ink | `#1B1430` | Plum-black. The only dark field: booth, hero band, dark cards | white text 17.7:1 |
| Ink raised | `#2A2050` | Cards sitting inside an ink field | white text 14.8:1 |
| Border | `#E5E7EB` | Dividers, inputs, hairlines | shared with product |
| Border strong | `#CBD5E1` | Secondary buttons, input hover | shared with product |
| Border on ink | `rgba(255,255,255,.18)` | Dividers inside an ink field | |

### Text (shared with the product)

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--an-text` | `#0F172A` | Headings, values | 16.4:1 on paper |
| `--an-text-secondary` | `#334155` | Body copy | 9.5:1 on paper |
| `--an-text-tertiary` | `#64748B` | Labels, on white only | 4.8:1 on white (4.4:1 on paper: fails) |
| `--an-text-tertiary-alt` | `#5B6878` | Labels, on paper | 5.2:1 |
| `--an-text-muted` | `#94A3B8` | Decorative only, never for meaning | |
| `--an-text-on-ink` | `#FFFFFF` | Everything on ink | 17.7:1 |
| `--an-text-on-ink-muted` | `#B4A8D6` | Captions on ink, the only muted tone on ink | 8.0:1 |

### Lagoon: the outcome colour

One second colour, with one job. Plum is what Gravity is; Lagoon is what it produces. Lagoon marks the single "it landed, it got paid" moment on a chart, a deck slide or a booth panel. It is Plum's split complement on the cool side: a cyan-leaning teal, a different family from the violet, so the pair reads as system and signal rather than two shades of one thing. There is no yellow, orange or red in the system outside the status colours.

| Name | Hex | Use | Contrast |
|---|---|---|---|
| Lagoon | `#22C1CE` | The outcome mark, on paper | ink text 8.1:1 |
| Lagoon text | `#0B6E78` | Outcome as type on paper | 5.5:1 paper · 6.0:1 white |
| Lagoon, on ink | `#67E3EE` | The outcome on the dark field | 11.6:1 |
| Lagoon tint | `#DDF6F8` | Outcome pill background | |

**Rules.** Once per surface. Never a status colour: "Authorized" and "Eligibility verified" stay success green `#10B981`, and because teal and green sit close for some colour vision, the outcome is a block, a number or the final node, never a small pill or dot next to a success pill. Never a large field on the website. Ink text on Lagoon, never white (white on `#22C1CE` is 3.1:1).

**Lagoon in use, three specimens**

- *Deck, the closer (slide 21).* Two figures side by side: "Net income today · $216,000" in ink, and "With Gravity · $585,000" as ink type on a Lagoon block, with "before Gravity's price" beneath. One Lagoon figure per slide, the number the buyer takes home. Everything else in ink.
- *Product, the order lifecycle.* Received → Authorized → Scheduled → Completed → Paid. Every earlier node is Plum; the last node is the outcome, so it is Lagoon. Beside it, "Paid · $312.40" is an outcome pill and "Report delivered" is a success pill: a state stays green, and the outcome is a node while the state is a pill. Different shapes on purpose.
- *Booth, the proof panel.* "Tower Radiology · RSNA 2021" on ink: "+7% exams a week. 71% shorter wait." in white, "$2.3M added revenue." as the one Lagoon line, then "These are their numbers, not projections." in the muted-on-ink tone.

**Do**

- One Lagoon element per surface: the closer number, the final node, the highest bar, the "Paid" pill when no success pill is beside it, the last line of a proof panel.
- Ink text on Lagoon (`#1B1430`, 8.1:1). Lagoon as text on paper uses `#0B6E78`; on ink it brightens to `#67E3EE`.
- Pair it with Plum on the same surface only when Plum is doing structure (the earlier nodes, the series) and Lagoon is doing the result.
- In charts, Lagoon is the highlight for a single point or bar, with the outline in the surface colour so it sits on top of the series.

**Don't**

- Lagoon as a status: "Authorized" and "Verified" are success green, not Lagoon. A Lagoon pill never sits next to a green pill; the outcome takes a different shape.
- Lagoon headlines, Lagoon buttons, Lagoon section backgrounds, Lagoon on the website as anything larger than a number or a block.
- White text on Lagoon (3.1:1). Lagoon text on paper at full strength (use `#0B6E78`).
- Two Lagoon marks on one slide or chart. If two things both matter, the second one is Plum, or it is a second slide.
- Lagoon next to the lion. The logo is black or white and nothing coloured touches its clear space.

### Status and data

Status colours are the product's, unchanged, so a pill means the same thing on the website as in the application. Never invent a marketing-only status colour, and never let colour be the only signal: every state carries a written label.

| State | Dot / fill | Background | Text | Example pill |
|---|---|---|---|---|
| Success | `#10B981` | `#ECFDF5` | `#047857` | Authorized |
| Warning | `#F59E0B` | `#FFFBEB` | `#B45309` | Auth pending · 3 |
| Danger | `#EF4444` | `#FEF2F2` | `#B91C1C` | Denied |
| Info (no state claim) | — | `#F1F5F9` | `#334155` | 1,284 claims |
| Tag (a category, not a state) | — | Plum 50 `#F3EEFE` | Plum 700 `#5B2FD1` | AOS |
| Outcome | — | Lagoon tint `#DDF6F8` | Lagoon text `#0B6E78` | Paid |

**Data series**, in order: Plum 600 `#6B3FE4`, Plum 400 `#8E67EA`, Plum 200 `#CDB9F8`, slate `#64748B`. Three lightness steps of one hue separate cleanly and never look like three products. The highlight (one point, one bar) is Lagoon `#22C1CE`, on ink `#67E3EE`. Grid lines are the border colour `#E5E7EB`. On ink the series are Plum 300 `#C9B3FF`, `#8E86B8`, `#4A4270`. Never a gradient fill on a data mark.

### The ratio

| Colour | Share of a page | Discipline |
|---|---|---|
| Neutrals: paper, white, ink type | ~85% | The default for everything. Reach for a neutral first. |
| Plum tint | ~10% | Section backgrounds, callouts, tags. The answer whenever a surface should feel quieter. |
| Plum, full strength | ~5% | Once per surface: a button, a headline word, a node, a rule. Never a seventh. |
| Ink field | One band per page | Hero band, proof band or footer. Exactly one on the web; a whole panel on the booth. |
| Lagoon | One mark | The outcome, on data, deck and one line on an ink panel. |
| Status | As the data requires | Only where a real state is named. |

### Retired

Do not use, anywhere, including old collateral that resurfaces: the arc (`#FF6B34 → #F900C8 → #0E59FF`) and every draw of it, the wordmark orange `#E8521F`, the magenta `#FE4BD1` and the magenta–blue gradient, navy `#0C0B1F` as a canvas, any orange or yellow accent, hospital blue, the product's former blues (`#002eed`, `#2563EB`, antd `#1677ff`), and the agent accent colours (`#8B5CF6`, `#06B6D4`, `#EAB308`). The personas are internal and so were their colours.

---

## 4 · The device: a line that ends in a node

The brand signature. A hairline travels and terminates in a filled point. It says Nodus. It says the order landed. It is the Gravity argument in one gesture: work travels a line, and every leak is a line that never reaches its node.

### Where it lives

| Use | Node | Line |
|---|---|---|
| Eyebrow marker | 7px | 22px hairline before the label |
| List marker | 9px | 14px hairline |
| Chart endpoint, one per chart | 9px, Lagoon | The bar or line it sits on |
| Section closer, hero rule | 14px | Full-width hairline |
| Booth panel, one per panel | 26px+ | A 2px line across the panel |
| Gravity product | The lifecycle stepper node | The stepper track |

### Rules

- One node per surface as a graphic. As a marker for eyebrows, lists and endpoints it may repeat.
- The node is Plum 600 on paper, Plum 300 on ink, Lagoon only when it is the outcome or the chart highlight.
- The line is always a hairline in the border colour (or 35% white on ink). Never Plum, never thick.
- It never pulses, glows, animates or grows arrows. It never becomes a network diagram: one line, one node.
- It replaces icons. There is no icon set, no emoji, no unicode glyph pressed into service as a pictogram. Meaning is carried by words, the node, labelled dots and the `→` character.

### Building it in CSS

The eyebrow marker, line and node in one pseudo-element:

```css
.eb{font:var(--an-eyebrow);letter-spacing:var(--an-eyebrow-tracking);text-transform:uppercase;
    color:var(--an-primary-text);display:flex;align-items:center;gap:8px}
.eb::before{content:"";flex:none;width:30px;height:8px;
  background:radial-gradient(circle at 26px 4px,var(--an-primary) 3.4px,transparent 4px),
             linear-gradient(var(--an-text-tertiary-alt),var(--an-text-tertiary-alt)) 0 50%/22px 1px no-repeat}
.on-ink .eb{color:var(--an-on-ink)}
.on-ink .eb::before{background:radial-gradient(circle at 26px 4px,var(--an-on-ink) 3.4px,transparent 4px),
  linear-gradient(rgba(255,255,255,.45),rgba(255,255,255,.45)) 0 50%/22px 1px no-repeat}
```

The section closer (a full-width hairline ending in a 14px node) and the node list marker:

```css
.closer{display:flex;align-items:center;margin-top:40px}
.closer::before{content:"";flex:1;height:1px;background:var(--an-border)}
.closer i{width:var(--an-node-hero);height:var(--an-node-hero);border-radius:50%;background:var(--an-primary);flex:none}

ul.node{list-style:none;padding:0;margin:0 0 14px}
ul.node li{position:relative;padding-left:26px;margin-bottom:8px}
ul.node li::before{content:"";position:absolute;left:0;top:.62em;width:14px;height:1px;background:var(--an-text-tertiary-alt)}
ul.node li::after{content:"";position:absolute;left:9px;top:.62em;transform:translateY(-50%);
  width:var(--an-node-list);height:var(--an-node-list);border-radius:50%;background:var(--an-primary)}
```

The `radial-gradient` and `linear-gradient` functions here draw a solid dot and a solid hairline; they are not colour gradients and do not break rule 3.

*Specimen, on ink:* "Every referral captured. Every report returned." in white, a node list "Get the order · Complete the exam · Get paid", and one Plum 300 closer node.

---

## 5 · Typography

Three faces, three jobs. Urbanist for display, because its round o and d echo the geometric wordmark. Inter for all text on every surface, corporate and product. JetBrains Mono for numbers, tokens, code and the eyebrow.

| Token | Face | Size / line-height / weight | Tracking | Specimen |
|---|---|---|---|---|
| display | Urbanist | 56 / 1.04 / 600 | −.025em | No referral leaks. |
| h1 | Urbanist | 40 / 1.1 / 600 | −.02em | Get the order. Complete the exam. Get paid. |
| h2 | Urbanist | 30 / 1.16 / 600 | −.015em | Just-in-time care. |
| h3 | Urbanist | 20 / 1.3 / 600 | −.01em | Built by people who build hard things. |
| lead | Inter | 19 / 1.6 / 400 | 0 | Imaging centers don't lose money in the scanner. They lose it between the referral and the payment. |
| body | Inter | 16 / 1.65 / 400 | 0 | Every order can be lost three times: before it arrives, before it's scanned, and before it's paid. |
| small | Inter | 14 / 1.6 / 400 | 0 | Runs in the browser on any computer; check-in runs on an iPad. |
| caption | Inter | 13 / 1.5 / 400 | 0 | |
| eyebrow | JetBrains Mono | 11 / 1.4 / 600, all-caps | .14em | THE AGENTIC OPERATIONS SYSTEM (AOS) FOR IMAGING |
| data | JetBrains Mono, tabular | | | +7% exams a week · 71% shorter wait · $2.3M added revenue |

On the web, display and h1–h3 scale down with `clamp()` (display `clamp(36px,5vw,56px)`, h1 `clamp(28px,3.6vw,40px)`, h2 `clamp(20px,2.4vw,26px)`).

**Five rules**

- Headings at 600, never 700. Semibold holds authority without shouting.
- Negative tracking scales with size: tight at display, zero at body.
- The eyebrow is the only all-caps. Set source text in sentence case and let CSS uppercase it.
- Body measure 65 to 74 characters. Leads cap at 62.
- Urbanist never sets body copy; Inter never sets a display headline.

**Loading.** Google Fonts: `Urbanist:wght@500;600;700`, `Inter:wght@400;500;600`, `JetBrains+Mono:wght@400;500;600`.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Urbanist:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap">
```

Fallbacks are in the token file (`'Avenir Next', 'Century Gothic', system-ui` for display; `system-ui, -apple-system, 'Segoe UI', Roboto` for text; `ui-monospace, SFMono-Regular, Menlo, Consolas` for mono). For PPTX and DOCX where the fonts are not installed, use Avenir Next or Century Gothic for display and Inter (or Arial) for text.

**Retired faces.** Museo Sans and Figtree are not part of the system. Do not reintroduce Museo Sans in print.

---

## 6 · Components

Six things, drawn twice: on paper and on ink. The surface underneath decides the variant before emphasis does.

| Component | On paper | On ink | Rule |
|---|---|---|---|
| Primary button | Plum 600 fill, white label | Plum 300 fill, ink label | One per section. Label names the action and its object. `→` on forward actions only. |
| Secondary button | White, border-strong | Transparent, 1.5px white border at full opacity | Never two primaries side by side. |
| Quiet button / link | Plum 700 text | Plum 300 text | Inline actions and links. Underline on hover. |
| Tag | Plum 50 background, Plum 700 text, mono caps | 8% white background, Plum 300 text | Categories, not states. |
| Status pill | Product colours | Not used on ink | Always a written label. |
| Outcome pill | Lagoon tint, Lagoon text | Lagoon on ink `#67E3EE` | "Paid", "Landed". Never a status, never beside a success pill. |
| Quote / callout | Node marker, no left border | Node marker in Plum 300 | One per section. |
| Card | White, 1px border, radius 14, no shadow at rest | Ink-raised, no border | Shadows only for things that float (a screenshot). |

**Geometry.** Radius 8px on buttons, 14px on cards, 20px on frames. Minimum target 44px. Focus is a 2px Plum 600 ring at 2px offset and is never removed. Hover is a one-stop darkening and a 1px lift; no scale, no bounce. Disabled is 50% opacity.

**The specimen set** (the same six things drawn on paper and on ink): buttons "Book a working session →" (primary), "Download the overview" (secondary), "Read the AOS tests" (quiet); pills "Authorized" (tag), "Eligibility verified" (success), "1,284 claims" (info), and on ink "Paid" (outcome); the callout "Information systems record the work. An AOS does the work." with a node marker; a small-text link "Read the nine AOS tests, including the ones we fail today."; and a two-series bar chart with one Lagoon highlight.

Button CSS, both surfaces:

```css
.btn{display:inline-flex;align-items:center;gap:6px;font:600 15px var(--an-font);padding:12px 22px;
     border-radius:var(--an-radius-md);border:1.5px solid transparent;min-height:44px}
.btn.primary{background:var(--an-primary);color:#fff}
.btn.secondary{background:var(--an-surface);color:var(--an-text);border-color:var(--an-border-strong)}
.btn.quiet{background:none;color:var(--an-link);padding-inline:6px}
.on-ink .btn.primary{background:var(--an-on-ink);color:var(--an-ink)}
.on-ink .btn.secondary{background:transparent;color:#fff;border-color:#fff}
.on-ink .btn.quiet{color:var(--an-on-ink)}
```

Pill CSS:

```css
.pill{display:inline-block;font:var(--an-eyebrow);letter-spacing:.08em;text-transform:uppercase;padding:5px 9px;border-radius:4px}
.pill.tag{background:var(--an-plum-50);color:var(--an-primary-text)}
.pill.ok{background:var(--an-success-bg);color:var(--an-success-text)}
.pill.warn{background:var(--an-warning-bg);color:var(--an-warning-text)}
.pill.bad{background:var(--an-danger-bg);color:var(--an-danger-text)}
.pill.info{background:var(--an-info-bg);color:var(--an-info-text)}
.pill.out{background:var(--an-outcome-tint);color:var(--an-outcome-text)}
.on-ink .pill.out{background:rgba(255,255,255,.08);color:var(--an-outcome-on-ink)}
.on-ink .pill.tag{background:rgba(255,255,255,.08);color:var(--an-on-ink)}
```

---

## 7 · Layout, space, elevation, motion, imagery

**Grid.** 1200px container, 32px gutter, 4px base unit. Section padding 96px on desktop, 48px between sub-sections, 24px inside cards. Sections alternate white and paper. The navigation sits on the paper, not in a bar. Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96. Radii: 6 (sm), 8 (md), 14 (lg), 20 (xl), 999 (full).

**Backgrounds, the complete list.** White. Paper. Plum tint. The ink field, one band per page. A Plum field on the booth and in print only. That is all: no photography, no illustration, no pattern, no texture, no grain, no glass, no blur, no gradient.

**Elevation.** `--an-shadow-sm: 0 1px 3px rgba(27,20,48,.06)` · `--an-shadow-md: 0 4px 12px rgba(27,20,48,.08)` · `--an-shadow-lg: 0 14px 34px rgba(27,20,48,.16)`. Cards have no shadow at rest; shadows are for things that float.

**Motion.** One easing (`cubic-bezier(.4,0,.2,1)`), three durations (120, 200, 360ms), one gesture (1px lift plus a shadow step). No parallax, no scroll-jacking, and the node never animates. `prefers-reduced-motion` disables the lift.

**Accessibility floor.** Body text 9.5:1, headings 16:1, every accent-as-text pairing at or above 5.2:1. Colour is never the sole carrier of meaning. On ink, hierarchy comes from weight and size, never opacity: 88% white on ink measures under AA at small sizes, so every text element on ink is solid white or the muted-on-ink token.

### Imagery

The only imagery in the system is a **Gravity screenshot**, unmodified, placed on an ink band or inside a 1px border on paper, lifted with `--an-shadow-lg`. Never tint, dark-mode, recolour or restyle the product to match marketing: the point of one system is that it already matches. Capture Gravity as shipped, at 1600px or wider.

No stock photography, no smiling patients, no stethoscopes, no DICOM imagery, no neural nodes, glowing brains, chat bubbles or circuit traces. Team photographs appear only on the team slide and the careers page, in colour, unfiltered, on a white card.

Diagrams use the device: hairlines and nodes, Plum on paper, in the three data steps. No arrows other than the `→` character in copy.

---

## 8 · Voice, language and copy blocks

The verbal system is the Message House (`alpha-nodus:message-house`). This section carries the rules and the approved lines.

### The master message

> Gravity is the Agentic Operations System (AOS) for your CRM, RIS and RCM. It gets the order, completes the exam and gets it paid, so no referral, no order and no revenue leaks away.

Every other line is a shorter or longer version of that sentence. When the referring provider is in the room, add: **Every referral captured. Every report returned.**

### Who is speaking, to whom

We speak as **we**: operators who did the jobs before automating them. The reader is **you**, **your team**, **your referring community**. The people in our stories are schedulers, authorization specialists, front-desk staff, referring offices and patients. Never "users." Never "clients."

### Register

Analyst-adjacent operator. Plain, willing to concede, precise about claims, direct about consequences, structural before promotional. The tell: we explain the mechanism; competitors assert the outcome. If a paragraph could have been written by a marketing department, it is off-voice.

### Delay in units, not feelings

The vision invites warmth, and warmth is where healthcare marketing goes to die. Days, not journeys. Weeks waited, not lives changed. Numbers are always concrete, labelled in full, dated, and framed as measured rather than projected: *"These are their numbers, not projections."*

### The three pillars

One leak and one verb each; the same argument at three points in the journey, never three products. They are distinguished by position and number, never by colour.

- **No referral leaks: get the order.** "We don't just run your orders. We go get them."
- **No order leaks: complete the exam.** "Your staff will never log into your RIS again."
- **No revenue leaks: get paid.** "Every exam you complete, you get paid for."

### How to read "no leaks"

A headline standard, not a guarantee. In body copy and conversation, say what Gravity *stops* or *closes* and by how much. Never "guarantee," never "zero." Asked "zero, really?": *Every leak is visible, and the routine ones close on their own. What's left goes to a person with everything they need to fix it.*

### Lexicon

| Use | Not | Because |
|---|---|---|
| System | Platform | Sits in the same slot as RIS and RCM. "Platform" is passive and owned by a competitor here. It appears nowhere. |
| Agentic | AI-powered | A competitive line, not a style preference. "AI-powered" appears nowhere. |
| Agentic Operations System (AOS) | AOS alone, "agentic OS" | Spelled out on first use in every asset. "Agentic OS" is allowed in speech only. |
| Imaging | Radiology | Radiology names the specialty; imaging names the business, and the business signs. Exception: RSNA floor, trade press, and search metadata. |
| Get the order | Get the referral | The referring provider refers; what arrives is an order. Referral names the act and the first leak; order names the object. |
| Leaks (verb), leakage (noun) | Inefficiency, friction | Always one of the three: referral, order, revenue. Orders leak; staff never do. |
| Latency, delay, waiting | Friction | Names what the patient experiences. |
| Patient journey | Patient experience | A journey has a duration, and duration is what we change. |
| Just-in-time care | Real-time care, instant care | JIT has thirty years of meaning behind it. Real-time is a vendor word. |
| Gravity's agents | Sasha, Sandra, Susan | Personas are internal. Gravity is the subject of every public sentence. The one exception is the voice agent's spoken name in the product. |
| Orders | Accessions | Consistency beats precision in reference material. |
| Delivered (of the report) | Produced | "We don't read the scan. We make sure it gets back." |

### Retired and prohibited

| Never | Because |
|---|---|
| "Replaces your RIS" · "We will never replace the RIS" | Both retired. The channel-safe form: "Runs on top of your CRM, RIS and RCM today. When you're ready, it can replace them." |
| "Cut staff," headcount reduction | The story is exceptions and redeployment. The staff conversation belongs with the buyer's leadership, not in our copy. |
| "Bots," "robots," "RPA" as the idea | Agents complete the work; they are not scripts. |
| "SOC 2 certified," "HIPAA certified," "more secure," ISO, HITRUST | No audit exists. Say: AWS US regions only; a BAA with every customer; independently penetration-tested (September 2026); AES-256 at rest with per-tenant keys; MFA on production, SSO on Enterprise; continuous monitoring with a public Trust Center. "Fewer things to secure," never "more secure." |
| "Revolutionary," "next-generation," "cutting-edge," "seamlessly leverage" | Generic SaaS register. It reads as having nothing specific to say. |
| "Sidekick" (to scheduling audiences), "replaces your reps" (to marketing leads), "drives efficiency" (to CFOs) | Audience-specific do-not-says from the Messaging Package §5. |
| Four Centers, "the front office of healthcare," the fast-food analogy in written copy, any unverified number ("73%," "22 centers," "800 imaging centers") | Retired framing and unsourced figures. The proof inventory in the Open Items Register is the only source of numbers. |
| Emoji, exclamation marks, title case headlines | Anywhere. Sentence case everywhere; the eyebrow is the only all-caps. |

### Attribution and proof

Testimonials are credited by role and organisation type, never by personal name. The one named outcome is Tower Radiology, RSNA 2021 Quality Improvement Award, presented publicly by the customer's own physicians: +7% exams a week in MRI, CT and mammography; 71% shorter wait for nudged patients; $2.3M added revenue; MRI slot utilization 65% to 70%. One person handles about 350 orders a day with Gravity. Logos: current customers only, "Trusted by imaging groups across the US," no count. KLAS quoted only as published. Referral lift and post-service revenue results are modeled, never claimed.

### Copy blocks

Approved and ready to paste. Do not paraphrase; if a block does not fit, ask for a new block.

| Block | Copy |
|---|---|
| 5 seconds | No referral leaks. No order leaks. No revenue leaks. |
| 5 seconds, alternate | Get the order. Complete the exam. Get paid. |
| 5 seconds, the loop | Every referral captured. Every report returned. |
| Category, five seconds | Information systems record the work. An AOS does the work. |
| 15 seconds | Imaging centers lose money in three places: referrals that go elsewhere, orders that never become exams, and exams that never get paid. Gravity is the Agentic Operations System (AOS) for your CRM, RIS and RCM, and its agents close all three leaks. |
| 30 seconds | Every order can be lost three times: before it arrives, before it's scanned, and before it's paid. Each of those leaks lives in a different system with a different team, so nobody sees the whole picture and staff patch the gaps by hand. Agents can now do that work. Gravity is the Agentic Operations System (AOS) for your CRM, RIS and RCM: it gets the order, completes the exam, gets the report back to the referrer, and gets it paid, as one system. |
| Boilerplate, 25 words | Gravity, from Alpha Nodus, is the Agentic Operations System (AOS) for imaging. It gets the order, completes the exam and gets it paid, as one system. |
| Boilerplate, 50 words | Gravity, from Alpha Nodus, is the Agentic Operations System (AOS) for imaging. Its agents do the work of the CRM, RIS and RCM in one cloud system: bringing in referrals, completing exams, returning reports to referring providers, and getting every exam paid. Phone, fax and text are built in. |
| Website hero | **No referral leaks. No order leaks. No revenue leaks.** / Gravity is the Agentic Operations System (AOS) for imaging centers and radiology groups. Its agents get the order, complete the exam and get it paid, as one system. |
| Booth banner | No referral leaks. No order leaks. No revenue leaks. |
| Provocation | Your staff will never log into your RIS again. |
| Email opener | How many referrals did you lose last month? Most imaging centers can't say, because the answer is split across three systems. |
| Deck opener | Imaging centers don't lose money in the scanner. They lose it between the referral and the payment. |
| Demo framing | Watch one order go from referral to report to payment without anyone having to carry it. |
| The closer, CFO | A typical imaging center makes $216,000 a year on $4.4 million. With Gravity, it can make $585,000, before Gravity's price: more exams from the orders and referrers it already has, fewer denials and fewer vendors, with the same team. |
| Competitive, on request only | Their platform helps your staff work faster. An AOS means you need less staff. |
| Team headline | Built by people who build hard things. · None of us came from healthcare software. All of us have done the jobs. |
| Microcopy | Book a demo → · Book a working session → · See Gravity in action → · Read the AOS tests · Download the overview · Talk to our team · Partner with us → |

---

## 9 · The ten rules

They live in the token file as comments so they travel with the code.

1. **The logo is black or white.** Never recoloured, never on a gradient, never in a coloured container. White on anything darker than paper.
2. **One accent per surface, at full strength.** If a surface needs to feel quieter, use the tint. A faded, blurred or translucent Plum is never the answer.
3. **No gradients as colour.** Anywhere: web, deck, booth, product buttons, insurance card. The arc was a gradient system; this is not.
4. **On ink, the accent is Plum 300.** Plum 600 on ink measures 2.9:1 and is forbidden for text and small marks. Buttons on ink use Plum 300 with an ink label.
5. **Accent as text is Plum 700; Plum 600 is for fills.** Plum 400 and lighter are never text on paper.
6. **Lagoon is an outcome, never a status.** Once per surface, on data, deck and one line on ink, ink text on it. Success stays green; a Lagoon mark is a block, a number or the final node, never a pill or dot beside a success pill, and never a field on the web.
7. **On ink, hierarchy comes from weight and size, never opacity.** Solid white for every text element; the single muted tone is `--an-text-on-ink-muted`.
8. **One node per surface as a graphic.** It never pulses, never grows an arrow, never becomes a network. As a marker for eyebrows, lists and chart endpoints it may repeat.
9. **Status colours mean the same thing on the website and in the product.** Never invent a marketing status colour; never let colour be the only signal.
10. **Retired means retired.** The arc, orange, magenta, hospital blue, the navy canvas, the product's former blues, the agent colours, Museo Sans, the Four Centers, the personas in public. Hunt them down in old collateral rather than letting them survive.

---

## 10 · Applying the system by surface

| Surface | Leads with | Colour | Type and device | Copy |
|---|---|---|---|---|
| alphanodus.com | The message (buyer surface); the vision on /company and /careers | Light-mode. Paper canvas, white cards, one ink band (proof or footer), Plum once per screen, no Plum fields. | Urbanist display, Inter text. Eyebrow node on every section. Hero closer node once. | Hero block verbatim. Search words in title tags, metas, one H2 and FAQs; brand words in headlines and body. |
| Sales deck | Cold open, then the message | White slides; slide 2 tint; one ink slide for proof; Plum 600 accent bar per slide; Lagoon for the closer's one number. | Headline 600 in Urbanist, body Inter, numbers Mono tabular. Pillar slide: three columns, numbered, no colours. | Deck opener, demo framing, closer from the copy blocks. No persona names on any slide. |
| Booth N6537 | The message at 20 feet | Ink panels with white logo and Plum 300 headline line; one Plum 600 panel allowed as the anchor; one node graphic per panel. | Urbanist only, 600. Nothing under 120pt on a wall. | Banner: the 5-second line. Demo station: the demo framing line. |
| Documents, proposals, SOWs | Plain | White page, ink text, Plum 700 eyebrows, tint callouts, a hairline-and-node under the title. | Inter throughout; Urbanist for the title only. | Boilerplate 50 in the footer. Security wording verbatim. |
| Email and outbound | One question | Plain text or white; Plum only on the one link. | Inter, no display type. | Email opener. Signature: name, role, Alpha Nodus, alphanodus.com. |
| Social | One line | Ink square, white logo, Plum 300 line, one node top-right. | Urbanist 600, ≤ 12 words. | Provocation or a copy block. No hashtags in the image. |
| Print and merchandise | The mark | Ink and Plum fields allowed at full bleed. Cards: ink front with node, white back. | Logo only on tees, plus the category line. | Business card: name, role, email, alphanodus.com. Nothing else. |
| Partner and channel | Partnership, never the replacement claim | As documents | | "Your customers keep your system of record; Gravity writes to it." |

---

## 11 · Gravity

Gravity uses these guidelines. It keeps its own layout, density, Inter, uppercase field labels, status pills, lifecycle stepper and audit timeline; it takes Plum as its primary, Lagoon as its outcome colour, flat fills instead of gradients, the node as the stepper marker, and a neutral attribution chip. Mockups of Gravity use the `gravity:gravity-design-system` skill for components and this document for every colour and type value.

### Token map

| Brand token | Product token | Value |
|---|---|---|
| `--an-primary` | `--gravity-color-brand-primary-500` | `#6B3FE4` |
| `--an-plum-400` | `--gravity-color-brand-primary-400` | `#8E67EA` |
| `--an-primary-hover` | antd `colorPrimaryHover` | `#5B2FD1` |
| `--an-link` | antd `colorLink` | `#5B2FD1` |
| `--an-outcome` / `-text` | `--gravity-color-outcome-500` / `-700` | `#22C1CE` / `#0B6E78` |
| `--an-focus` | focus ring | `#6B3FE4`, 2px, 2px offset |
| `--an-success / warning / danger` | `--gravity-color-success/warning/danger-500` | `#10B981` / `#F59E0B` / `#EF4444` |
| `--an-text`, `--an-border` | `--gravity-color-neutral-*` | `#0F172A`, `#334155`, `#64748B`, `#E5E7EB` |
| `--an-paper` | page background | `#F6F4FA` |
| (none) | `--gravity-color-brand-secondary-500` | removed |

### Rollout

| Tier | Work | When |
|---|---|---|
| 1 | Primary tokens to Plum, outcome tokens added, secondary removed, one root Ant Design `ConfigProvider theme` (`colorPrimary`, `colorPrimaryHover`, `colorLink`). | Before RSNA 2026 |
| 2 | Hard-coded `#002eed`, `#0f2de5`, `#1890ff`, `#1677ff` and inline colour props replaced with tokens; visual QA on the demo tenant. | First release after RSNA |
| 3 | Provider portal, greeter, link, browser extensions: one theme value each. | Following releases, referrer portal first |

The token inventory and file counts behind this plan are in *gravity3 Colour Token Audit*.

### In the product

The same layout, density, Inter and uppercase labels Gravity has today, with Plum as the primary, Lagoon on the final node, flat fills instead of gradients, the node as the stepper marker, and a neutral attribution chip.

| Product element | Was | Is |
|---|---|---|
| Primary button | Blue gradient `#2563EB → #1D4ED8` (antd default blue in most places) | Flat Plum 600, Plum 700 hover, white label |
| Links, active nav, selected row | `#002eed` / antd blue | Plum 700 text; Plum 50 selected row; Plum 50 active nav |
| Lifecycle stepper | Blue active node, grey track | Plum nodes on a hairline track; the current step ringed in Plum 100; the final, completed node in Lagoon. The device, in the product. |
| Insurance card | Blue gradient `#2563EB → #1E3A8A` | Flat Plum 600 with a PRIMARY/SECONDARY pill |
| Attribution chip | Persona colour dot (Sasha, Sandra, Susan) | Neutral dot, "Completed by Gravity · time" |
| Status pills | Green / amber / red / slate | Unchanged |
| Page canvas | `#F5F7FA` | Paper `#F6F4FA` |
| Focus ring | Blue | Plum 600, 2px, 2px offset |
| Type | Inter | Inter (unchanged); Urbanist never appears in the product |

**The product specimen** in the browsable guidelines is an order detail and worklist: a white sidebar (Worklist, Orders, Schedule, Authorizations, Charges, Referrers, Analytics, Admin, with the active item on Plum 50 in Plum 700), a page title in Inter 600, a "Send to scheduling →" primary button, the order lifecycle stepper (Received · Authorized · Scheduled · Completed · Report delivered; the current step ringed in Plum 100), uppercase field labels over values, status pills ("Eligibility verified", "Authorized", "Consent pending"), the neutral "Completed by Gravity · 09:31" chip, a flat Plum 600 insurance card with a PRIMARY pill, and a worklist table with the selected row on Plum 50. Three companions: a browser-extension panel (GravityAuth tag, "Attach to order →"), a referring-physician portal card with the stepper, and an iPad check-in screen on ink with a Plum 300 "Begin check-in →" button and the estimate in Plum 300.

---

## 12 · Specimens

The browsable guidelines show the system on nine real surfaces, with approved copy and the v2 logo files. Use these as the reference when a judgement call is not settled by the rules.

| Specimen | What it shows |
|---|---|
| alphanodus.com hero, light mode | Black horizontal logo in the nav; eyebrow "The Agentic Operations System (AOS) for imaging" with the node marker; display headline "No referral leaks. / No order leaks. / No revenue leaks." with the last line in Plum 700; the hero body block; "Book a demo →" primary and "Read the AOS tests" secondary; a full-width hairline ending in one 14px node. |
| Booth N6537 back wall panel | Ink field, white vertical logo, a 2px line across the panel ending in a 26px Plum 300 node, the 5-second line in Urbanist 600 with "No revenue leaks." in Plum 300, then "Gravity, from Alpha Nodus / The Agentic Operations System (AOS) for imaging". |
| Deck, slide 2 | White slide, a hairline with a 9px Plum node at the right, eyebrow "About Alpha Nodus", "Just-in-time care." and its one-line subtitle, the three values in three columns with the middle one on Plum 50, logomark and "Founded 2015 · Austin · Sunrise · Bangalore" in the footer. |
| Business card, 3.5×2 in | Front: ink, white logomark, a hairline near the bottom edge ending in a Plum 300 node. Back: white, black horizontal logo, name in Urbanist 600, role, email and alphanodus.com in mono. |
| Booth tees | Ink tee with the white logomark and "AOS does the work." under a small Plum 300 node; paper tee with the black logomark and the same line in Plum 700 under a Plum 600 node. |
| Document, first page | White page, black horizontal logo, "Scope of the Project" in Urbanist 600, "Prepared for … · date", a hairline-and-node rule, the boilerplate 25 as the opening line, and "Alpha Nodus · Austin · Sunrise · Bangalore · alphanodus.com" in mono in the footer. |
| Social, 1:1 | Ink square, white horizontal logo top-left, one 14px Plum 300 node top-right, "Your staff will never log into your RIS again." in Urbanist 600 with "RIS" in Plum 300. |
| Email, outbound | White, black logo, the email opener in bold, one paragraph in Inter, and one Plum 700 link "Book a working session →". |
| Gravity, order detail and worklist | See §11. |

---

## 13 · Governance

**Version.** v2.0 · September 2026. Neutral logo v2, Plum, Lagoon, the device, one token set for company and product, the Message House verbal system. Replaces v1.0 (August 2026) in full. Reviewed every 90 days and after RSNA 2026. Changes are recorded in the decision log before they appear here.

**Where things live.** Tokens: `plum-tokens.css` in the `alpha-nodus:brand-guidelines` skill. Logo files: the skill's `assets/`. Copy: the Message House (`alpha-nodus:message-house`). Product components: `gravity:gravity-design-system`. The why: *Brand Guidelines v2 — Decision Log*. The retired v1.0 arc system is recoverable from git history (commit `ff80544`, alpha-nodus 0.4.0) and nowhere else.

**The two questions.** What surface is this on? Paper takes Plum 600 fills and Plum 700 text; ink takes Plum 300 and white. Has Plum already appeared on this surface? If yes, the answer is a tint, a hairline, or nothing.

Alpha Nodus brand guidelines v2.0 · Owner: Shamit Patel · Internal until shared.
