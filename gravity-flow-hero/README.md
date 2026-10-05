# Gravity Flow hero animation

**Primary (matches the home page hero, AN27 `web-product-ink-b`):** `gravity-flow-hero-ink-b.html` (preview), `flow-hero-embed.html` (drop-in `<figure class="ga">` + CSS using the home page's own `.ga` classes and 12s animation language), `export/gravity-flow-hero-ink-b-*` (MP4, WebM, poster; 1600x1200, 12s seamless loop). Rebuild with `python3 src/build_ink_b.py`.

- `concept-a-onbrand.html`: flat on-brand ink panel, now with text labels (vector).
- `concept-b-3d.html`: real 3D (three.js, PBR materials, reflections, bloom), with labels. Needs WebGL. Breaks brand rules (gradients, lighting); exception to approve.
- `concept-c2-explainer.html`: in-depth 58s explainer on re-skinned product screens (vector). Covers every workflow, rule, control and number on the Gravity Flow page.
- `concept-c-hybrid.html`: the earlier 30s overview.
- `export/`: MP4 (H.264) and WebM (VP9) of C2 and C at 1600x1200, 30fps, plus posters for A, B, C and C2.
- `fonts/`: Urbanist, Inter, JetBrains Mono (OFL, self-hosted). `vendor/`: three.js (MIT) and the bundled concept B script. `src/`: concept B source.

Rebuild B: `esbuild src/concept-b3d.js --bundle --minify --format=iife --alias:three=./vendor/three/three.module.js --alias:three/addons=./vendor/three/addons --outfile=vendor/concept-b.bundle.js`

Embed video muted: `<video autoplay muted loop playsinline poster="...">` with the WebM source first, MP4 second.
