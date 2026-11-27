# RSNA 2026 postcard: brand check against Alpha Nodus guidelines v2.0

The postcard was checked against these sources from the `alpha-nodus` plugin bundle:
- `brand-guidelines/SKILL.md` and `reference/full-guidelines.md` (v2.0, September 2026)
- `message-house/reference/message-house.md`
- the official logo files in `brand-guidelines/assets/`

Severity:
- **Fix:** breaks a numbered rule or the message house.
- **Decide:** a deliberate creative choice the guidelines don't allow. The brand owner (Shamit) approves or rejects it.
- **OK:** compliant.

## Already applied

| Item | Before | Now |
|---|---|---|
| Logo, both sides | Traced from the raster artwork | Official `logo-horizontal-white.svg` on ink, same position and size as the original art, with the grey shading kept |

## Front ("3 ways your imaging center loses money")

| # | Finding | Rule | Severity |
|---|---|---|---|
| F1 | Ink field `#1B1430` | §2 ink | OK |
| F2 | Copy: "Imaging centers don't lose money in the scanner. They lose it between the referral and the payment." | Approved copy block ("deck opener"), used verbatim | OK |
| F3 | "Gravity runs the imaging order at more than 460 centers." | 460+ is the approved scale number. The approved wording says "imaging centers", e.g. "More than 460 imaging centers run on Gravity." | Fix (wording) |
| F4 | Lagoon `#67E3EE` is used 5 times: the eyebrow, headline line 3, number circles 2 and 3, and the booth pill | Rule 6: Lagoon is the outcome colour, used once per surface. On ink the accent is Plum 300 `#C9B3FF` (rule 4). Print/booth rule: Plum 300 headline line | Fix |
| F5 | Number circle 1 is light blue `#68B7EB` | Not a brand colour. "Hospital blue" is retired | Fix |
| F6 | Body text on ink in lilac `#E2DCF7` / `#D9D3EE` | On ink, text is white `#FFFFFF`. The only muted tone is `#B4A8D6`. Rule 7: hierarchy comes from weight and size | Fix |
| F7 | "WHY SCAN?" in Plum 600 `#6B3FE4` as text on white | Rule 5: accent as text is Plum 700 `#5B2FD1`. Plum 600 is for fills | Fix |
| F8 | Card text colours `#1B1430` / `#4A4460` | Text tokens are `#0F172A` / `#334155` | Fix (minor) |
| F9 | Headline in Urbanist ExtraBold (~800), step titles in Bold (700) | §4: headings are Urbanist 600, never 700 | Fix |
| F10 | Purple radial glow in the bottom-right corner | Rule 3: no gradients as colour, anywhere. Print allows flat ink or Plum fields only | Fix |
| F11 | Three photographs with purple gradient fades | §6: no photography. The only image allowed is an unmodified Gravity screenshot | **Decide.** The mockumentary concept depends on the photos |
| F12 | No line-and-node device | Print/booth: one node graphic per panel | Decide (optional) |
| F13 | Logo height 0.16 in (≈15 CSS px) | Minimum 24 px for the horizontal lockup. Below that, use the logotype only | Decide: enlarge to ≥ 0.25 in, or confirm the screen minimum doesn't apply to print |
| F14 | "Booth 6537 · North Hall, Level 3" | The guidelines write the booth as **N6537** | Confirm the official booth number |
| F15 | Sentence-case headlines, no exclamation marks, "imaging" (not "radiology"), no persona names | Lexicon | OK |

## Back (Sunrise Imaging)

Sunrise Imaging is a fictional customer, the demo center. Its navy, teal and orange are the customer's brand, not Alpha Nodus's, so the palette rules apply only to the Alpha Nodus parts of this side.

| # | Finding | Rule | Severity |
|---|---|---|---|
| B1 | Step titles: "Get the order. / Complete the exam. / Get paid." | Approved copy block ("alt"), used verbatim | OK |
| B2 | Footer on ink with the white logo | §1 / §2 | OK |
| B3 | Footer text in lilac `#E2DCF7` | On ink: white, or `#B4A8D6` for muted text | Fix (minor) |
| B4 | "RUNS ON GRAVITY / FROM ALPHA NODUS" set in Sunrise orange | Alpha Nodus text in orange, which is retired. Gravity uses a "neutral attribution chip" (§11) | Decide: make it neutral (white or `#B4A8D6`), or accept it as Sunrise's styling |
| B5 | "Or book a demo: alphanodus.com/sunrise-imaging/rsna" | Approved microcopy is "Book a demo →". Check that the destination page lets people book | Confirm |
| B6 | Phone photo, drop shadow on the photo card | Not an Alpha Nodus surface, so the photography rule doesn't apply. The shadow is now vector | OK, as the customer's styling |
| B7 | Logo height ≈0.13 in | Same as F13 | Decide |

## QR codes (decode-tested in every output)

- Front: `alphanodus.com/the-imaging-center?utm_source=rsna2026&utm_medium=postcard&utm_campaign=rsna2026_booth&utm_content=series_qr`
- Back: `alphanodus.com/sunrise-imaging/rsna?utm_source=rsna2026&utm_medium=postcard&utm_campaign=rsna2026_booth&utm_content=demo_qr`
