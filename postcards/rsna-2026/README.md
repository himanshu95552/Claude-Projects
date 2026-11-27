# RSNA 2026 postcard: Sunrise Imaging side (back)

Vector rebuild of the Sunrise Imaging side of the "photo-in-hand" postcard. The
original PDF had only flat 300-dpi images. This version has the new QR and URL.

- **QR + printed URL:** `https://alphanodus.com/sunrise-imaging/rsna`
  (QR version 4, error correction Q, 4-module quiet zone, decode-tested).
  It replaces `alphanodus.com/sunrise-imaging?utm_…` (old QR) and `alphanodus.com/demo` (old footer link).
- **Size:** 4 × 6 in trim, 0.125 in bleed on every side, so 4.25 × 6.25 in (306 × 450 pt) overall.

| File | Use |
|---|---|
| `sunrise-back-figma.svg` | Import into Figma (drag in). Frame is 306 × 450, so 1 px = 1 pt and a Figma PDF export comes out at print size. Text stays editable (Inter / Inter Display). |
| `sunrise-back-outlined.svg` | The same artwork with all text converted to outlines. Use it if Figma replaces the fonts. |
| `sunrise-back-print-bleed.pdf` | Print-ready PDF for the printer: 4.25 × 6.25 in, TrimBox 4 × 6 in, CFF fonts embedded, 300-ppi photo |
| `sunrise-back-print-cropmarks.pdf` | The same PDF with crop marks and a slug line |
| `qr-sunrise-imaging-rsna*.svg` | The QR code on its own (navy and black), with the quiet zone |
| `source/` | Generator script and the original art it was rebuilt from |

## Things to check before print

1. **AlphaNodus logo:** the footer logo is traced from the raster. Swap in the official vector logo from the brand files.
2. **Footer moved up by 20 px at 300 dpi (≈1.7 mm).** The original URL line sat about 2 mm from the trim, inside the cut-risk zone. The text now ends about 3 mm from the trim.
3. **Footer copy:** it now reads "Or book a demo: alphanodus.com/sunrise-imaging/rsna". Check that this page has a demo-booking path, or reword the line.
4. **Color:** the file is RGB, because Figma only works in RGB. Ask the printer to convert to CMYK, or ask for a proof. Navy `#12283a` and orange `#f08a3c` may shift.
5. The UTM parameters from the old QR are gone because the new URL is used exactly as given.

Rebuild: `python3 source/make_back.py <dir with img-001.png + an.svg> out.svg`, then
`rsvg-convert -f pdf` (on a copy with width/height in `pt`), then `python3 source/boxes.py`.
