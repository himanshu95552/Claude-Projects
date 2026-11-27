"""Make an outlined-text SVG for design-tool import without rasterising anything.

Graphics stay exactly as in the source SVG (vector logo gradient, vector shadow);
only <text> elements are replaced by glyph outlines, produced by rendering a
text-only copy through rsvg-convert (PDF) and pdftocairo (SVG).
"""
import re, subprocess, sys, tempfile
from pathlib import Path

src, out = Path(sys.argv[1]), Path(sys.argv[2])
svg = src.read_text()
root = re.search(r"<svg[^>]*>", svg).group(0)
vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', root).group(1).split()]
texts = re.findall(r"<text\b.*?</text>", svg, re.S)
graphics = re.sub(r"<text\b.*?</text>\s*", "", svg, flags=re.S)
with tempfile.TemporaryDirectory() as td:
    td = Path(td)
    r2 = re.sub(r'width="[^"]+" height="[^"]+"', f'width="{vb[2]}pt" height="{vb[3]}pt"', root, count=1)
    (td / "t.svg").write_text(r2 + "\n" + "\n".join(texts) + "\n</svg>")
    subprocess.run(["rsvg-convert", "-f", "pdf", "-o", td / "t.pdf", td / "t.svg"], check=True)
    subprocess.run(["pdftocairo", "-svg", td / "t.pdf", td / "o.svg"], check=True)
    o = (td / "o.svg").read_text()
assert "<image" not in o, "text outlines unexpectedly contain an image"
o_body = re.search(r"<svg[^>]*>(.*)</svg>", o, re.S).group(1)
for i in sorted(set(re.findall(r'id="([^"]+)"', o_body)), key=len, reverse=True):
    o_body = re.sub(rf'(id="|#){re.escape(i)}(["\)])', rf"\1t_{i}\2", o_body)
o_body = re.sub(r'<rect[^>]*fill="rgb\(100%, ?100%, ?100%\)"[^>]*/>', "", o_body, count=1)  # page background, if any
outlined = graphics.replace("</svg>", f'<g id="Text (outlined)" transform="translate({vb[0]} {vb[1]})">{o_body}</g>\n</svg>')
out.write_text(outlined)
print(out.name, "texts outlined:", len(texts), "images:", outlined.count("<image"))
