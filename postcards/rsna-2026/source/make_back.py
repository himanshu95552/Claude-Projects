"""Rebuild the Sunrise Imaging side of the RSNA postcard as vector SVG.

Coordinates are authored in the original 300-dpi pixel grid (1200 x 1800 trim)
and converted to points (x 0.24) so the SVG is a true 4 x 6 in card plus
0.125 in bleed on every side (306 x 450 pt overall).
"""
import base64, io, re, sys
from pathlib import Path
from PIL import Image
import segno

SRC = Path(sys.argv[1])          # scratchpad/src
OUT = Path(sys.argv[2])          # output svg
URL = ("https://alphanodus.com/sunrise-imaging/rsna?utm_source=rsna2026&utm_medium=postcard"
       "&utm_campaign=rsna2026_booth&utm_content=demo_qr")   # same UTM scheme as the front (series_qr)
PRINTED_URL = "alphanodus.com/sunrise-imaging/rsna"

import os
DISP = os.environ.get("DISP","Inter Display")
K = 0.24                         # px@300dpi -> pt
BLEED = 37.5                     # 0.125 in in px
W, H = 1200, 1800

def p(v):
    return f"{v * K:.3f}".rstrip("0").rstrip(".")

NAVY, INK, TEAL, ORANGE, PEACH = "#12283a", "#0b2b3c", "#0e7490", "#f08a3c", "#f8b27a"
SLATE, BG, RULE, FOOT, LILAC, MIST = "#3b5566", "#f4f7fa", "#c9d6e2", "#1b1430", "#e2dcf7", "#b8c8d6"

out = []
a = out.append

def rect(x, y, w, h, fill, r=0, extra=""):
    rr = f' rx="{p(r)}"' if r else ""
    a(f'<rect x="{p(x)}" y="{p(y)}" width="{p(w)}" height="{p(h)}"{rr} fill="{fill}"{extra}/>')

def text(x, y, s, size, weight, fill, anchor="start", ls=0.0, ident=None, fam="Inter"):
    lsa = f' letter-spacing="{p(size * ls)}"' if ls else ""
    an = f' text-anchor="{anchor}"' if anchor != "start" else ""
    idt = f' id="{ident}"' if ident else ""
    a(f'<text{idt} x="{p(x)}" y="{p(y)}" font-family="{fam}" font-size="{p(size)}" '
      f'font-weight="{weight}" fill="{fill}"{an}{lsa}>{s}</text>')

# ---------- canvas ----------
tw, th = W + 2 * BLEED, H + 2 * BLEED
a(f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
  f'width="{p(tw)}" height="{p(th)}" viewBox="{p(-BLEED)} {p(-BLEED)} {p(tw)} {p(th)}">')
a('<title>Sunrise Imaging postcard back (4x6 in, 0.125 in bleed)</title>')
a('<defs>')
a(f'<clipPath id="photoClip"><rect x="{p(652)}" y="{p(464)}" width="{p(476)}" height="{p(744)}" rx="{p(36)}"/></clipPath>')
a(f'<filter id="cardShadow" x="{p(600)}" y="{p(440)}" width="{p(580)}" height="{p(860)}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">'
  f'<feFlood flood-opacity="0" result="BackgroundImageFix"/>'
  f'<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>'
  f'<feOffset dy="{p(22)}"/><feGaussianBlur stdDeviation="{p(22)}"/>'
  f'<feColorMatrix type="matrix" values="0 0 0 0 0.0706 0 0 0 0 0.157 0 0 0 0 0.227 0 0 0 0.2 0"/>'
  f'<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>'
  f'<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter>')
a('</defs>')

# background (bleeds)
a('<g id="Background">')
rect(-BLEED, -BLEED, tw, th, BG)
a('</g>')

# ---------- header ----------
a('<g id="Header">')
rect(-BLEED, -BLEED, tw, 155 + BLEED, NAVY)
a('<g id="Sun icon">')
a(f'<path d="M{p(93.25)} {p(85.5)} A{p(18.75)} {p(18.75)} 0 0 1 {p(130.75)} {p(85.5)} Z" fill="{ORANGE}"/>')
for x1, y1, x2, y2 in [(75.5, 80.5, 88, 80.5), (135, 80.5, 147.5, 80.5), (111.75, 45, 111.75, 56),
                       (86, 56, 93.75, 63.5), (137.5, 56, 129.75, 63.5)]:
    a(f'<line x1="{p(x1)}" y1="{p(y1)}" x2="{p(x2)}" y2="{p(y2)}" stroke="{ORANGE}" stroke-width="{p(4.5)}" stroke-linecap="round"/>')
for x1, x2, y in [(79, 145, 94), (90, 134, 104.5)]:
    a(f'<line x1="{p(x1)}" y1="{p(y)}" x2="{p(x2)}" y2="{p(y)}" stroke="#ffffff" stroke-width="{p(4)}" stroke-linecap="round"/>')
a('</g>')
text(177, 76, "Sunrise Imaging", 50, 600, "#ffffff", ls=-0.03, fam=DISP)
text(178, 114, "The imaging center in the series", 26, 500, MIST)
text(1127, 70, "RUNS ON GRAVITY", 22.5, 600, PEACH, anchor="end", ls=0.104)
text(1127, 100, "FROM ALPHA NODUS", 22.5, 600, PEACH, anchor="end", ls=0.104)
a('</g>')

# ---------- headline ----------
a('<g id="Headline">')
text(72, 262, "Try to lose an order here.", 74, 700, INK, ls=-0.025, fam=DISP)
text(72, 333, "We dare you.", 74, 700, TEAL, ls=-0.025, fam=DISP)
text(73, 399, "Follow yours from the referral to the payment.", 30.5, 600, SLATE, ls=0.008)
a('</g>')

# ---------- steps ----------
a('<g id="Steps">')
rect(104, 586, 4, 140, RULE)
rect(104, 796, 4, 180, RULE)
steps = [
    (551, TEAL, "1", "Get the order", ["Snap a picture of the page.", "Nobody types it in."]),
    (761, ORANGE, "2", "Complete the exam", ["The text and the call to", "book come to your own", "phone."]),
    (1011, TEAL, "3", "Get paid", ["Follow it to the claim."]),
]
for cy, col, n, head, body in steps:
    a(f'<g id="Step {n}">')
    a(f'<circle cx="{p(107)}" cy="{p(cy)}" r="{p(35)}" fill="{col}"/>')
    text(107, cy + 11.5, n, 32, 600, "#ffffff", anchor="middle")
    text(173, cy + 16, head, 45, 600, INK, ls=-0.032)
    for i, line in enumerate(body):
        text(174, cy + 66 + 40 * i, line, 29.5, 600, SLATE)
    a('</g>')
a('</g>')

# ---------- photo ----------
photo = Image.open(SRC / "img-001.png").convert("RGB").crop((654, 466, 1126, 1206))
buf = io.BytesIO(); photo.save(buf, "JPEG", quality=95, subsampling=0)
b64 = base64.b64encode(buf.getvalue()).decode()
a('<g id="Photo card">')
a(f'<rect x="{p(652)}" y="{p(464)}" width="{p(476)}" height="{p(744)}" rx="{p(36)}" fill="{NAVY}" filter="url(#cardShadow)"/>')
a(f'<image clip-path="url(#photoClip)" x="{p(652)}" y="{p(464)}" width="{p(476)}" height="{p(744)}" '
  f'preserveAspectRatio="none" xlink:href="data:image/jpeg;base64,{b64}"/>')
a('</g>')

# ---------- scan card ----------
a('<g id="Scan card">')
rect(72, 1272, 1056, 276, NAVY, r=30)
rect(92, 1292, 236, 236, "#ffffff", r=18)
qr = segno.make(URL, error="l", micro=False)   # boost_error raises the level if it still fits
n = qr.symbol_size(border=0)[0]
mod = 236 / (n + 8)                       # 4-module quiet zone inside the white tile
ox = oy = None
ox, oy = 92 + 4 * mod, 1292 + 4 * mod
d = []
for r, row in enumerate(qr.matrix):
    c = 0
    while c < n:
        if row[c]:
            s = c
            while c < n and row[c]:
                c += 1
            d.append(f"M{p(ox + s * mod)} {p(oy + r * mod)}h{p((c - s) * mod)}v{p(mod)}h{p(-(c - s) * mod)}z")
        else:
            c += 1
a(f'<path id="QR sunrise-imaging-rsna (utm demo_qr)" d="{"".join(d)}" fill="{NAVY}" shape-rendering="crispEdges"/>')
text(361, 1360, "WHY SCAN?", 22.5, 600, PEACH, ls=0.07)
text(360, 1415, "Send the order your team dreads.", 46, 700, "#ffffff", ls=-0.024)
text(361, 1469, "Then watch your phone.", 31, 600, PEACH, ls=-0.017)
a('</g>')
text(600, 1594, "Use your own mobile number and a made-up patient.", 28.5, 600, SLATE, anchor="middle", ls=-0.013)

# ---------- footer ----------
FT = 1640
a('<g id="Footer">')
rect(-BLEED, FT, tw, H + BLEED - FT, FOOT)
svg = (SRC / "an.svg").read_text()
paths = re.findall(r'<path d="([^"]+)"', svg, re.S)
vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', svg).group(1).split()]
lw = 218.0                                   # logo width on the card, px
s = lw / vb[2]
lh = vb[3] * s
lx, ly = 72, (FT + 1800) / 2 - lh / 2 - 5
# potrace: translate(0,H) scale(0.1,-0.1) in its own viewBox units
a(f'<g id="AlphaNodus logo" transform="translate({p(lx)} {p(ly)}) scale({s * K:.6f}) translate(0 {vb[3]}) scale(0.1 -0.1)" fill="#ffffff">')
for d_ in paths:
    a(f'<path d="{" ".join(d_.split())}"/>')
a('</g>')
y0 = 1688
text(320, y0, "A demonstration center built by Alpha Nodus.", 28, 500, LILAC)
a(f'<text x="{p(320)}" y="{p(y0 + 35)}" font-family="Inter" font-size="{p(28)}" font-weight="500" fill="{LILAC}">'
  f'<tspan font-weight="700" fill="#ffffff">See it live at booth 6537,</tspan> North Hall, Level 3. Or book a demo:</text>')
text(320, y0 + 70, PRINTED_URL, 28, 700, "#ffffff", ident="Printed URL")
a('</g>')

a('</svg>')
OUT.write_text("\n".join(out))
print("QR version", qr.version, qr.error, "modules", n, "module px", round(mod, 2), "-> mm", round(mod / 300 * 25.4, 3))
