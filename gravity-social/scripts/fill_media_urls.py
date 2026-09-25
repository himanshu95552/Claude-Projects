#!/usr/bin/env python3
"""Fill each post's media_urls with the public URLs of its rendered frames.

  python3 scripts/fill_media_urls.py --state pending [--check]

Uses config media.base_url + /<post-id>/frame-NN.png. The frames must be committed and
pushed before Metricool can fetch them; --check requests each URL and reports any that
aren't live yet. media_urls sits in the frontmatter, so filling it never changes the
approval hash. LinkedIn documents use every frame; Instagram carousels up to 10.
"""
from __future__ import annotations
import argparse
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gs_common import ROOT, Post, all_posts, config  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="*")
    ap.add_argument("--state", default="pending")
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args()
    base = config().get("media", {}).get("base_url", "").rstrip("/")
    if not base:
        sys.exit("Set media.base_url in config.yaml")
    posts = [Post(Path(f)) for f in a.files] if a.files else all_posts([a.state])
    for p in posts:
        frames = sorted((ROOT / "content" / "assets" / p.id).glob("frame-*.png"))
        if not frames:
            continue
        urls = [f"{base}/{p.id}/{f.name}" for f in frames][:10 if p.platform == "instagram" else 20]
        p.set_meta(media_urls=urls)
        bad = []
        if a.check:
            for u in urls:
                try:
                    with urllib.request.urlopen(urllib.request.Request(u, method="HEAD"), timeout=15) as r:
                        if r.status != 200:
                            bad.append(u)
                except Exception:
                    bad.append(u)
        print(f"{p.id}: {len(urls)} media url(s)" + (f", NOT LIVE YET: {len(bad)} (push the assets)" if bad else (", all live" if a.check else "")))


if __name__ == "__main__":
    main()
