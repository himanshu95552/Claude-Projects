"""Inline the official Alpha Nodus v2 logo SVG (brand-guidelines/assets) as a group.

ids are namespaced so two copies can live in one document; the clip-path wrapper
is dropped (it only clips to the full viewBox) so design tools import plain paths.
"""
import re
from pathlib import Path

def official_logo(svg_path, x, y, h, K, ns, gid="AlphaNodus logo"):
    s = Path(svg_path).read_text()
    vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', s).group(1).split()]
    body = re.search(r"<svg[^>]*>(.*)</svg>", s, re.S).group(1)
    defs = re.search(r"<defs>(.*?)</defs>", body, re.S)
    defs = defs.group(1) if defs else ""
    body = re.sub(r"<defs>.*?</defs>", "", body, flags=re.S)
    body = re.sub(r'<g clip-path="url\(#[^)]+\)">', "<g>", body)
    defs = re.sub(r"<clipPath.*?</clipPath>", "", defs, flags=re.S)
    for old in re.findall(r'id="([^"]+)"', defs):
        new = f"{ns}_{old}"
        defs = defs.replace(f'id="{old}"', f'id="{new}"')
        body = body.replace(f"url(#{old})", f"url(#{new})")
    sc = h / vb[3]
    return (f'<defs>{defs}</defs>\n<g id="{gid}" transform="translate({x * K:.3f} {y * K:.3f}) scale({sc * K:.6f})">'
            f"{body}</g>")
