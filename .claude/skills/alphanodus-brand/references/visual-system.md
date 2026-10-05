# Visual system (Brand Guidelines v2.0)

Load before producing any visual output: web, deck, document, chart, booth or print. Token values live in `assets/plum-tokens.css`; use variables, never raw hex.

**Contents:** Logo · Colour · Typography · The device · Layout and surfaces · Components · By output type · Retired

## Logo

- Black or white only, never recoloured, not even Plum. Version 2, neutral: black files are #0E0E0E with #DADADA shading on the alpha; white files are #FFFFFF with the same shading. The shading is part of the mark.
- Black on white, paper and any tint. White on ink, a Plum field, or a product screenshot frame.
- Four lockups, two colours: horizontal (default), logomark (lion), logotype, vertical. Files in `assets/logo/`.
- Minimum size: 24px lockup, 24px lion, 14px logotype. Below 24px use the logotype only. Where SVG cannot be embedded, rasterize to PNG at the needed size. Never typeset the company name as a stand-in, never fake the lion.
- Clear space on all sides: the height of the lion's head at the size in use. Nothing enters it.
- Never: recolour; place on a gradient or photo; rotate, stretch, outline or shadow; put in a coloured container; use the lion as bullet, icon or watermark (the node does that work); use the old PNGs, the arc, or the orange wordmark.

## Colour

Plum is the one accent. Lagoon is the outcome. Neutrals about 85%, tint about 10%, Plum at full strength about 5% and once per surface. One ink band per web page. One Lagoon mark.

- Plum 600 fills; Plum 700 as text on paper; on ink the accent is Plum 300 (Plum 600 on ink is 2.9:1, forbidden).
- Ink `--ink` is the only dark field; `--ink-raised` for cards inside it.
- Lagoon (`--outcome`): the final lifecycle node, the closer number, one chart highlight, one line on an ink panel. Once per surface. Ink text on Lagoon fills, never white. Never beside a success pill; never a web field.
- Status colours (success, warning, danger, info) mean the same on the website and in the product, and every state carries a written label. Success stays green.
- Data series on paper: three lightness steps of one hue, never one colour per pillar. On ink use the `--series-ink-*` set.
- Surface mode: set `data-surface="paper|ink"` on a frame and the semantic tokens (`--accent-fill`, `--accent-text`, `--bg-canvas`, `--bg-surface`, `--bg-tint`, `--text-primary`, `--device-node`, ...) follow. Paper: Plum 600 fills, Plum 700 text. Ink: Plum 300, white text. Hierarchy on ink comes from weight and size, never opacity.

## Typography

- Urbanist 600 for display and headings, never 700, never body. Inter 400/500/600 for all text. JetBrains Mono for numbers, tokens, code and the eyebrow. Office fallbacks: Avenir Next or Century Gothic for display, Inter or Arial for text.
- Ramp (size / line-height / weight / tracking): display 56/1.04/600 -.025em · h1 40/1.1 -.02em · h2 30/1.16 -.015em · h3 20/1.3 -.01em · lead 19/1.6/400 · body 16/1.65/400, measure 65 to 74 characters · small 14/1.6 · caption 13/1.5 · eyebrow 11/1.4/600 mono, all caps, .14em · number 40/1.1/600 mono, tabular.
- The eyebrow is the only all-caps. Sentence case everywhere else, headlines included. No title-case headlines, no exclamation marks, no emoji.
- Tabular numerals for data. Delay in units, not feelings: days, not journeys.

## The device: a line that ends in a node

A 1px hairline terminating in a filled circle: Plum 600 on paper, Plum 300 on ink; Lagoon only as the outcome or chart highlight.

- Sizes: eyebrow marker 7px · list marker and chart endpoint 9px · hero and section closer 14px · booth panel 26px and up, one per panel.
- One node per surface as a graphic; as a marker (eyebrows, lists, endpoints) it may repeat.
- Lifecycle line: Referral, Order, Exam, Report in Plum, final node "Paid" in Lagoon.
- No icon set, no emoji, no unicode glyphs as pictograms. Meaning is carried by words, the node, labelled dots and the → character.
- Never: pulse, animate or grow arrows; become a network, constellation or circuit; replace the logo or be replaced by the lion; appear more than once as a graphic; be drawn as a gradient, glow or ring. A filled circle, flat.

## Layout and surfaces

- 1200px container, 32px gutter, 4px base unit, 96px section padding, 48px sub-sections, 24px card padding. Sections alternate white and paper. No photography, illustration, pattern, texture, grain, glass, blur or gradient.
- Radii: sm 6 inputs · md 8 buttons · lg 14 cards · xl 20 panels · full pills and node.
- Shadows only for things that float. Cards have none at rest; hover is one stop darker border plus a 1px lift, no scale, no bounce. Shadow/lg only for a screenshot on ink.
- Backgrounds, the complete list: White (cards, nav, alternating sections) · Paper (page canvas) · Plum tint (callouts, slide 2, highlighted rows) · Ink (one band per web page; whole panels on the booth) · Plum field (booth and print only, one anchor panel).
- Motion: `cubic-bezier(.4, 0, .2, 1)`, 120 / 200 / 360ms. The 1px lift only. The node never animates. Honour prefers-reduced-motion.
- Imagery: the only image is an unmodified Gravity screenshot on an ink band or inside a 1px border on paper, with Shadow/lg. No stock photography, smiling patients, stethoscopes, DICOM, neural nodes, glowing brains, chat bubbles or circuit traces.

## Components

The surface decides the variant first. One primary button per section. 44px minimum target. Reference images in `assets/component-reference/` (Button, Tag, Pill, Card, Callout, Eyebrow, Node, Surface demo); classes in `plum-tokens.css`.

- Button: primary (Plum fill, white label on paper / Plum 300 fill, ink label on ink) · secondary (white, strong border) · ghost/text link in accent text. Labels end in →. Flat fill, no gradient, hover one stop darker plus 1px lift.
- Tag: mono caps, Plum 50 field, Plum 700 text.
- Pill: written label, status tint with status text. Outcome pill uses Lagoon tint and once per surface.
- Callout: tint field, 9px node marker, body text.
- Card: white, 1px border, 14px radius; eyebrow with hairline and node, Urbanist title, Inter body.

## By output type

- Web: Paper background, white cards with 1px border, Urbanist 600 headings, Inter body, eyebrow with node on every section, one ink band, one hero closer node, no gradients.
- Decks: white slides; slide 2 on Plum 50; exactly one ink slide for proof; hairline ending in a 9px node under each title, never a coloured bar; pillar slide is three numbered columns with no colours.
- Documents: white page, Urbanist title only then Inter, Plum 700 mono-caps eyebrows, Plum 50 callouts, hairline-and-node under the title, boilerplate 50 in the footer, security wording verbatim.
- Charts: light background, series Plum 600 > 400 > 200 > slate, grid #E5E7EB, one Lagoon highlight, status colours only where a real state is encoded, never a gradient fill.
- Booth and print: ink panels, white logo, Plum 300 headline line, one node graphic per panel, one Plum 600 anchor panel, nothing under 120pt on a wall, business card ink front and white back.

## Retired: do not use, ever

The v1.0 arc and all four draws, the wordmark orange #E8521F, the magenta #FE4BD1 and any magenta-plum gradient, navy #0C0B1F as a canvas, any orange or yellow accent, hospital blue, the product's former blues (#002eed, #2563EB, #1677ff), the agent accent colours (#885CF8, #06B6D4, #EAB308), Museo Sans, Figtree, the Four Centers framing, and persona names in anything public. No gradients as colour, anywhere. No yellow, orange or red in the system outside the status colours.
