#!/usr/bin/env python3
"""Build a UTM-tagged link so every click can be traced back to one post.

  python3 scripts/utm.py --cta exam-itemized --platform linkedin-company --post 2026-W41-li-co-01
  python3 scripts/utm.py --url https://www.alphanodus.com/contact --platform x --post 2026-W41-x-03 --campaign rsna-2026

utm_source   = the network (linkedin, x, instagram, youtube)
utm_medium   = social (config.yaml utm.medium)
utm_campaign = config utm.campaign_default, or the active campaign id
utm_content  = the post id   (this is what makes post -> click -> demo attribution possible)

Demo CTAs go straight to config links.calendly_demo when it is set, so the booking itself
carries the post id (Calendly records utm_* passed on its link). Otherwise they go to the
contact page, which only forwards UTMs to its Calendly embed once the page runs
reports/calendly-embed-snippet.html.
"""

import argparse
import sys
from pathlib import Path
from urllib.parse import urlencode, urlparse, urlunparse, parse_qsl

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gs_common import config  # noqa: E402

SOURCE = {"linkedin-company": "linkedin", "linkedin-founder": "linkedin", "x": "x",
          "instagram": "instagram", "youtube-shorts": "youtube"}
CTA_LINK = {"aos-page": "aos_definition", "exam-itemized": "exam_itemized", "demo": "demo",
            "rsna-booth": "demo", "home": "home"}


def build(url: str, platform: str, post_id: str, campaign: str | None, cfg: dict) -> str:
    u = urlparse(url)
    q = dict(parse_qsl(u.query))
    q.update({
        "utm_source": SOURCE.get(platform, platform),
        "utm_medium": cfg.get("utm", {}).get("medium", "social"),
        "utm_campaign": campaign or cfg.get("utm", {}).get("campaign_default", "an27"),
        "utm_content": post_id,
    })
    if platform == "linkedin-founder":
        q["utm_term"] = "founder"
    return urlunparse(u._replace(query=urlencode(q)))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url")
    ap.add_argument("--cta", choices=sorted(CTA_LINK))
    ap.add_argument("--platform", required=True, choices=sorted(SOURCE))
    ap.add_argument("--post", required=True, help="post id, e.g. 2026-W41-li-co-01")
    ap.add_argument("--campaign")
    a = ap.parse_args()
    cfg = config()
    url = a.url or cfg["links"][CTA_LINK[a.cta or "home"]]
    if not a.url and a.cta in ("demo", "rsna-booth") and cfg["links"].get("calendly_demo"):
        url = cfg["links"]["calendly_demo"]  # straight to the booking page; Calendly stores the UTMs on the booking
    print(build(url, a.platform, a.post, a.campaign, cfg))


if __name__ == "__main__":
    main()
