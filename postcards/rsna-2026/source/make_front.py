"""Rebuild the front ("3 ways your imaging center loses money") as vector SVG.

Authored in the original 300-dpi pixel grid (1200 x 1800 trim), written out in
points (x 0.24): 4 x 6 in card + 0.125 in bleed = 306 x 450.
Photos are the three original panels with the baked-in text removed
(clean_panels.py), mirrored 38 px into the bleed on the outer edges.
"""
import base64, io, json, re, sys
from pathlib import Path
from PIL import Image
import segno

SRC = Path(sys.argv[1])      # dir with an.svg
BUILD = Path(sys.argv[2])    # dir with panel1..3.png + front_fit.json
OUT = Path(sys.argv[3])
QR_URL = ("https://alphanodus.com/the-imaging-center?utm_source=rsna2026&utm_medium=postcard"
          "&utm_campaign=rsna2026_booth&utm_content=series_qr")

K = 0.24
BLEED = 37.5
W, H = 1200, 1800
FIT = json.loads((BUILD / "front_fit.json").read_text())
# per-item tracking corrections (em), measured after a first render
ADJ = json.loads((BUILD / "front_adj.json").read_text()) if (BUILD / "front_adj.json").exists() else {}

def p(v):
    return f"{v * K:.3f}".rstrip("0").rstrip(".")

BG, CYAN, LILAC, LILAC2, VIOLET, SLATE = "#1b1430", "#67e3ee", "#e2dcf7", "#d9d3ee", "#6b3fe4", "#4a4460"
WEIGHT = {}   # optional overrides
out = []; a = out.append

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace('"', "&quot;")

def t(iid, fill, dx=0, weight=None, spans=None, size=None):
    f = FIT[iid]
    fam = f["family"]; w = weight or f["weight"]; sz = size or f["size"]
    ls = (f["ls_em"] + ADJ.get(iid, 0)) * sz
    body = esc(f["text"]) if spans is None else spans
    a(f'<text id="{iid}" x="{p(f["x"] + dx)}" y="{p(f["y"])}" font-family="{fam}" font-size="{p(sz)}" '
      f'font-weight="{w}" letter-spacing="{p(ls)}" fill="{fill}">{body}</text>')

tw, th = W + 2 * BLEED, H + 2 * BLEED
a(f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
  f'width="{p(tw)}" height="{p(th)}" viewBox="{p(-BLEED)} {p(-BLEED)} {p(tw)} {p(th)}">')
a('<title>Alpha Nodus postcard front (4x6 in, 0.125 in bleed)</title>')
a('<defs>')
a(f'<radialGradient id="glow" gradientUnits="userSpaceOnUse" cx="{p(1200)}" cy="{p(1800)}" r="{p(725)}" '
  f'gradientTransform="translate({p(1200)} {p(1800)}) scale(1 {420/725:.4f}) translate({p(-1200)} {p(-1800)})">'
  f'<stop offset="0" stop-color="#4b2e9c"/><stop offset="1" stop-color="{BG}"/></radialGradient>')
a('</defs>')

a('<g id="Background">')
a(f'<rect x="{p(-BLEED)}" y="{p(-BLEED)}" width="{p(tw)}" height="{p(th)}" fill="{BG}"/>')
a(f'<rect id="Purple glow" x="{p(-BLEED)}" y="{p(-BLEED)}" width="{p(tw)}" height="{p(th)}" fill="url(#glow)"/>')
a('</g>')

# logo (traced from the original at 8x)
svg = (SRC / "an.svg").read_text()
paths = re.findall(r'<path d="([^"]+)"', svg, re.S)
vbh = float(re.search(r'viewBox="([^"]+)"', svg).group(1).split()[3])
a(f'<g id="AlphaNodus logo" transform="translate({p(68)} {p(55)}) scale({K / 8:.6f}) translate(0 {vbh}) scale(0.1 -0.1)" fill="#ffffff">')
for d_ in paths:
    a(f'<path d="{" ".join(d_.split())}"/>')
a('</g>')

a('<g id="Eyebrow">'); t("mono1", CYAN); t("mono2", CYAN); a('</g>')
a('<g id="Headline">'); t("h1a", "#ffffff"); t("h1b", "#ffffff"); t("h1c", CYAN); a('</g>')

# photo panels
a('<g id="Photo panels">')
for i, (x, w) in enumerate([(-38, 434), (402, 396), (804, 434)]):
    buf = io.BytesIO(); Image.open(BUILD / f"panel{i+1}.png").convert("RGB").save(buf, "JPEG", quality=95, subsampling=0)
    b64 = base64.b64encode(buf.getvalue()).decode()
    a(f'<image id="Photo {i+1}" x="{p(x)}" y="{p(408)}" width="{p(w)}" height="{p(658)}" preserveAspectRatio="none" '
      f'xlink:href="data:image/jpeg;base64,{b64}"/>')
a('</g>')

# panel copy (panel 1 nudged 6 px right so it clears the 0.125 in safe zone)
a('<g id="Panel copy">')
for i, (cx, ccol, num, tcol, ids, dx) in enumerate([
        (61.5, "#68b7eb", "1", "#ebe5fb", ("t1a", "t1b", "b1a", "b1b", "b1c"), 6),
        (463.5, "#67dfee", "2", "#ffffff", ("t2a", "t2b", "b2a", "b2b", "b2c"), 0),
        (865.5, CYAN, "3", "#ffffff", ("t3a", "t3b", "b3a", "b3b"), 0)]):
    a(f'<g id="Panel {num}">')
    a(f'<circle cx="{p(cx + dx)}" cy="{p(789.5)}" r="{p(29.5)}" fill="{ccol}"/>')
    a(f'<text x="{p(cx + dx)}" y="{p(801.5)}" font-family="Urbanist" font-size="{p(34)}" font-weight="700" '
      f'fill="{BG}" text-anchor="middle">{num}</text>')
    for iid in ids:
        t(iid, tcol if iid.startswith("t") else LILAC, dx=dx)
    a('</g>')
a('</g>')

a('<g id="Body copy">')
t("p1", LILAC)
t("p2", LILAC, spans='between the referral and the payment. <tspan font-weight="800" fill="#ffffff">So we set a comedy there.</tspan>')
a('</g>')

# QR card
a('<g id="Scan card">')
a(f'<rect x="{p(72)}" y="{p(1296)}" width="{p(1056)}" height="{p(284)}" rx="{p(30)}" fill="#ffffff"/>')
qr = segno.make(QR_URL, error="l", micro=False)  # boost_error lifts it to the highest level that fits v6
n = qr.symbol_size(border=0)[0]; mod = 225 / n; ox, oy = 101, 1325
d = []
for r, row in enumerate(qr.matrix):
    c = 0
    while c < n:
        if row[c]:
            s = c
            while c < n and row[c]: c += 1
            d.append(f"M{p(ox + s * mod)} {p(oy + r * mod)}h{p((c - s) * mod)}v{p(mod)}h{p(-(c - s) * mod)}z")
        else:
            c += 1
a(f'<path id="QR the-imaging-center" d="{"".join(d)}" fill="{BG}"/>')
t("why", VIOLET); t("one", BG); t("see", SLATE)
a('</g>')

a('<g id="Booth">')
a(f'<rect x="{p(180)}" y="{p(1612)}" width="{p(188)}" height="{p(55)}" rx="{p(27.5)}" fill="{CYAN}"/>')
t("booth", BG); t("hall", LILAC2)
a('</g>')
t("made", LILAC2, spans='<tspan font-weight="800" fill="#ffffff">Made by Alpha Nodus.</tspan> Gravity runs the imaging order at more than 460 centers.')

a('</svg>')
OUT.write_text("\n".join(out))
print("QR v", qr.version, qr.error, n, "modules, module", round(mod, 2), "px =", round(mod / 300 * 25.4, 3), "mm")
