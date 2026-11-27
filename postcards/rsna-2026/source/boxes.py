import sys, pymupdf
src, out_bleed, out_marks = sys.argv[1:4]
LABEL = sys.argv[4] if len(sys.argv) > 4 else "Sunrise Imaging postcard - BACK - trim 4 x 6 in - bleed 0.125 in - QR: alphanodus.com/sunrise-imaging/rsna"
TITLE = sys.argv[5] if len(sys.argv) > 5 else "Sunrise Imaging postcard back - 4x6 in, 0.125 in bleed"
B = 9  # 0.125 in bleed in pt
d = pymupdf.open(src); pg = d[0]
pg.set_bleedbox(pg.mediabox); pg.set_trimbox(pymupdf.Rect(B, B, 306 - B, 450 - B))
d.set_metadata({"title": TITLE, "creator": "Alpha Nodus RSNA 2026"})
d.save(out_bleed, garbage=3, deflate=True)
# crop-mark version: 0.5 in slug around the bleed
SL = 36; W, H = 306 + 2 * SL, 450 + 2 * SL
m = pymupdf.open(); p = m.new_page(width=W, height=H)
p.show_pdf_page(pymupdf.Rect(SL, SL, SL + 306, SL + 450), d, 0)
tx0, ty0, tx1, ty1 = SL + B, SL + B, SL + 306 - B, SL + 450 - B
L, G = 18, 3  # mark length, gap from bleed edge
reg = (0, 0, 0)
def ln(a, b): p.draw_line(a, b, color=reg, width=0.25)
for x in (tx0, tx1):
    ln((x, SL - G - L), (x, SL - G)); ln((x, SL + 450 + G), (x, SL + 450 + G + L))
for y in (ty0, ty1):
    ln((SL - G - L, y), (SL - G, y)); ln((SL + 306 + G, y), (SL + 306 + G + L, y))
p.insert_text((SL, H - 10), LABEL, fontsize=5, color=reg)
p.set_bleedbox(pymupdf.Rect(SL, SL, SL + 306, SL + 450)); p.set_trimbox(pymupdf.Rect(tx0, ty0, tx1, ty1))
m.save(out_marks, garbage=3, deflate=True)
