#!/usr/bin/env python3
"""Turn Metricool analytics rows into reports/metrics/<date>.json, keyed by our post ids.

  python3 scripts/record_metrics.py rows.json [--date 2026-10-05]

rows.json (written by the report skill from getAnalyticsDataByMetrics):
  {"period": {"from": "...", "to": "..."},
   "accounts": [{"platform": "linkedin-company", "followers": 1234, "followers_delta": 18}],
   "posts": [{"metricool_post_id": "...", "network": "linkedin", "text": "...", "published": "2026-10-06",
              "impressions": 0, "engagements": 0, "comments": 0, "shares": 0, "clicks": 0}]}

Each row is matched to a queue post by metricool_post_id first, then by its text (the post's
main text, whitespace-normalized, first 120 characters). Unmatched rows are listed, not guessed.
"""
import argparse
import datetime as dt
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gs_common import ROOT, all_posts, normalize  # noqa: E402

NETWORK = {"linkedin": "linkedin-company", "twitter": "x", "x": "x", "instagram": "instagram", "youtube": "youtube-shorts"}
KEYS = ["impressions", "engagements", "comments", "shares", "clicks"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("rows")
    ap.add_argument("--date", default=dt.date.today().isoformat())
    a = ap.parse_args()
    data = json.loads(Path(a.rows).read_text(encoding="utf-8"))
    posts = all_posts(["scheduled", "published", "approved"])
    by_mid = {str(p.meta.get("metricool_post_id")): p for p in posts if p.meta.get("metricool_post_id")}
    by_text = {(p.platform, normalize(p.main_text())[:120]): p for p in posts}
    out_rows, unmatched = [], []
    for r in data.get("posts", []):
        plat = NETWORK.get(str(r.get("network", "")).lower(), r.get("network"))
        p = by_mid.get(str(r.get("metricool_post_id"))) or by_text.get((plat, normalize(str(r.get("text", "")))[:120]))
        if not p:
            unmatched.append(str(r.get("text", ""))[:60])
            continue
        out_rows.append({"post_id": p.id, "platform": p.platform, "published": r.get("published", ""),
                         **{k: r.get(k, 0) or 0 for k in KEYS}})
    out = {"period": data.get("period", {}), "accounts": data.get("accounts", []), "posts": out_rows}
    dest = ROOT / "reports" / "metrics" / f"{a.date}.json"
    dest.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(f"{len(out_rows)} post(s) matched, {len(unmatched)} unmatched -> {dest.relative_to(ROOT)}")
    for u in unmatched:
        print(f"  unmatched: {u}...")


if __name__ == "__main__":
    main()
