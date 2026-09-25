#!/usr/bin/env python3
"""Render a post's ## Slides block to PNG frames + a PDF (for LinkedIn documents).

  python3 scripts/render_carousel.py content/queue/pending/2026-W41-li-co-01.md
  python3 scripts/render_carousel.py --state pending        # every post with slides

Output: content/assets/<post-id>/frame-01.png ... carousel.pdf carousel.html
Slide templates and fields: brand/visual.md and scripts/render_carousel.cjs.
Markup inside slide text: **word** = accent colour, ==word== = highlight colour.
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gs_common import ROOT, Post, all_posts  # noqa: E402

CJS = Path(__file__).resolve().parent / "render_carousel.cjs"


def render(post: Post) -> dict | None:
    spec = post.slides()
    if not spec:
        return None
    out = ROOT / "content" / "assets" / post.id
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
        json.dump(spec, f)
        spec_path = f.name
    env = dict(os.environ)
    if not env.get("CHROMIUM_PATH"):
        for cand in sorted(Path("/opt/pw-browsers").glob("chromium-*/chrome-linux/chrome")):
            env["CHROMIUM_PATH"] = str(cand)
    r = subprocess.run(["node", str(CJS), spec_path, str(out)], capture_output=True, text=True, env=env)
    os.unlink(spec_path)
    if r.returncode != 0:
        print(r.stderr, file=sys.stderr)
        raise SystemExit(f"Render failed for {post.id}")
    result = json.loads(r.stdout.strip().splitlines()[-1])
    return result


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="*")
    ap.add_argument("--state")
    a = ap.parse_args()
    posts = [Post(Path(f)) for f in a.files] if a.files else all_posts([a.state or "pending"])
    for p in posts:
        res = render(p)
        if res is None:
            continue
        rel = Path(res["pdf"]).parent.relative_to(ROOT)
        warn = f"  OVERFLOW on frame(s) {res['overflow']}: shorten the text" if res["overflow"] else ""
        print(f"{p.id}: {len(res['frames'])} frames -> {rel}/{warn}")


if __name__ == "__main__":
    main()
