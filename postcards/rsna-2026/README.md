# RSNA 2026 postcard: vector rebuild with print bleed

Both sides of the "photo-in-hand" postcard, rebuilt as vector. The original PDF
had only flat 300-dpi images.

- **Size:** 4 × 6 in trim, 0.125 in bleed on every side, so 4.25 × 6.25 in (306 × 450 pt) overall.
- **Vector:** all text, the QR codes, the logos, the shapes and the gradients. The only images are the photos, at 300 ppi.
- **Fonts:** Urbanist, Inter, Inter Display and JetBrains Mono. All are Google Fonts, available in Figma.

| Side | Figma (editable text) | Figma (text outlined) | Print PDF | Print PDF with crop marks |
|---|---|---|---|---|
| Front ("3 ways…") | `front-figma.svg` | `front-outlined.svg` | `front-print-bleed.pdf` | `front-print-cropmarks.pdf` |
| Back (Sunrise Imaging) | `sunrise-back-figma.svg` | `sunrise-back-outlined.svg` | `sunrise-back-print-bleed.pdf` | `sunrise-back-print-cropmarks.pdf` |

`postcard-front-and-back-print-bleed.pdf` holds both sides as pages 1 and 2, ready for a printer.

## QR codes (all decode-tested in every output)

- **Front:** unchanged destination, `alphanodus.com/the-imaging-center?utm_source=rsna2026&…&utm_content=series_qr`.
  It is regenerated as vector, version 6, with 0.47 mm modules.
- **Back:** `https://alphanodus.com/sunrise-imaging/rsna?utm_source=rsna2026&utm_medium=postcard&utm_campaign=rsna2026_booth&utm_content=demo_qr`.
  It uses the same UTM scheme as the front, with `utm_content=demo_qr` (the value the old Sunrise QR used). Version 6, 0.41 mm modules, 4-module quiet zone.
  The printed footer URL stays short and clean, `alphanodus.com/sunrise-imaging/rsna`, with no UTM so people can type it.

## Importing into Figma

1. Drag the `*-figma.svg` onto the canvas, or press Cmd/Ctrl+Shift+K.
2. The frame should be 306 × 450. Don't resize it.
3. Trim guides are at x 9 / 297 and y 9 / 441. Keep text a further 9 px inside them.
4. To export, select the frame and add a PDF export. It comes out at 4.25 × 6.25 in with the bleed included.

## What changed from the original, and what to check before print

**Front**
1. The step text on the three photos was baked into the images. It was removed from the photos and set again as live text in the same positions.
2. The left and right photos reach the edge of the card. They were extended 0.125 in into the bleed by mirroring their outer edges, because no image exists beyond the original edge. You only see this area if the cut drifts.
3. Panel 1's text moved 6 px at 300 dpi (0.5 mm) to the right, so it clears the 0.125 in safe zone.

**Back**
1. The footer moved up by 20 px at 300 dpi (≈1.7 mm) so the URL clears the safe zone.
2. The footer now reads "Or book a demo: alphanodus.com/sunrise-imaging/rsna". Check that this page has a way to book a demo.
3. The QR carries the UTM tags. The printed URL does not.

**Both sides**
- The logos are the official `logo-horizontal-white.svg` from the brand guidelines (v2.0). See `BRAND-CHECK.md` for the full brand audit.
- The files are RGB, because Figma only works in RGB. Ask the printer for a CMYK proof, since the navy, purple and cyan may shift.

## Rebuild (source/)

`clean_panels.py` → `fit_front.py` → `make_front.py`; `make_back.py`; then
`rsvg-convert -f pdf` (on a copy with width/height in `pt`; the back uses `SHADOW=vector`) → `boxes.py` (sets TrimBox/BleedBox, crop-mark version).
Outlined SVGs: `outline.py <svg> <out>` outlines the text only, so every graphic stays vector.
