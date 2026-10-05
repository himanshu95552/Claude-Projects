# Gravity Flow hero animation

**Flow banner, two options (4:3, 3200x2400):** `flow-banners/banner-flow-A-real-screens.png` (real product screens restyled to the brand) and `banner-flow-B-diagram-with-screens.png` (numbered diagram with the real screens embedded). Source: `src/screens.py`, `src/build_flow_banners.py`.

**Placeholder programme:** `research/placeholder-inventory.md` (every placeholder by page), `research/placeholders/` (notes per section), `sections/` (variants). Section 1 done: `sections/01-get-the-order/` (`python3 src/build_s1.py && python3 src/render_sections.py sections/01-get-the-order`).

**All-in-one banner:** `banners/banner-all-in-one.png` (`python3 src/build_banner_all.py`) carries all seven points of the Flow summary, numbered 01 to 07.

**Current stage: static banner concepts (no animation until one is chosen).** `banners/` has three variations as 3200x2400 PNG plus HTML source: 1 one engine / three ways in, 2 supervised first, 3 every pillar. Research and rationale: `research/gravity-flow-notes.md`. Rebuild: `python3 src/build_banners.py && python3 src/render_banners.py`.

**Latest, original composition: "one run, traced"** `gravity-flow-hero-trace.html` (preview), `flow-trace-embed.html` (drop-in), `export/gravity-flow-hero-trace-*` (MP4, WebM, poster; 16s loop). Rebuild: `python3 src/build_trace.py`. The earlier `ink-b` file copies the home diagram's layout and is kept only as a reference.

**Primary (matches the home page hero, AN27 `web-product-ink-b`):** `gravity-flow-hero-ink-b.html` (preview), `flow-hero-embed.html` (drop-in `<figure class="ga">` + CSS using the home page's own `.ga` classes and 12s animation language), `export/gravity-flow-hero-ink-b-*` (MP4, WebM, poster; 1600x1200, 12s seamless loop). Rebuild with `python3 src/build_ink_b.py`.

- `concept-a-onbrand.html`: flat on-brand ink panel, now with text labels (vector).
- `concept-b-3d.html`: real 3D (three.js, PBR materials, reflections, bloom), with labels. Needs WebGL. Breaks brand rules (gradients, lighting); exception to approve.
- `concept-c2-explainer.html`: in-depth 58s explainer on re-skinned product screens (vector). Covers every workflow, rule, control and number on the Gravity Flow page.
- `concept-c-hybrid.html`: the earlier 30s overview.
- `export/`: MP4 (H.264) and WebM (VP9) of C2 and C at 1600x1200, 30fps, plus posters for A, B, C and C2.
- `fonts/`: Urbanist, Inter, JetBrains Mono (OFL, self-hosted). `vendor/`: three.js (MIT) and the bundled concept B script. `src/`: concept B source.

Rebuild B: `esbuild src/concept-b3d.js --bundle --minify --format=iife --alias:three=./vendor/three/three.module.js --alias:three/addons=./vendor/three/addons --outfile=vendor/concept-b.bundle.js`

Embed video muted: `<video autoplay muted loop playsinline poster="...">` with the WebM source first, MP4 second.
