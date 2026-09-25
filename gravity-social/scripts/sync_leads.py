#!/usr/bin/env python3
"""Copy classified leads from community/inbox/*.yaml into community/leads.csv (no duplicates).

  python3 scripts/sync_leads.py

An inbox item becomes a lead when its intent is lead-hot or lead-warm. lead_score = fit + intent_score
(community/intent-taxonomy.md). Existing rows are matched on inbox_id, so re-running is safe.
leads.csv is private (git-ignored): it holds people's names and must never be pushed to the public repo.
"""
import csv
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gs_common import ROOT, load_yaml  # noqa: E402

FIELDS = ["date", "platform", "handle", "name", "title", "organization", "source_post", "message_url", "intent",
          "fit", "intent_score", "lead_score", "summary", "next_step", "owner", "status", "crm_id", "inbox_id"]
LEADS = ROOT / "community" / "leads.csv"


def main():
    have = set()
    rows = []
    if LEADS.exists() and LEADS.stat().st_size:
        with open(LEADS, newline="", encoding="utf-8") as f:
            rows = list(csv.DictReader(f))
            have = {r.get("inbox_id") for r in rows}
    added = []
    for fp in sorted((ROOT / "community" / "inbox").glob("*.yaml")):
        batch = load_yaml(fp) or {}
        for it in batch.get("items", []) or []:
            if it.get("intent") not in ("lead-hot", "lead-warm") or it.get("id") in have:
                continue
            fit, isc = int(it.get("fit") or 0), int(it.get("intent_score") or 0)
            added.append({
                "date": str(batch.get("collected_at", ""))[:10], "platform": batch.get("platform", ""),
                "handle": it.get("handle", ""), "name": it.get("author", ""), "title": it.get("author_title", ""),
                "organization": it.get("organization", ""), "source_post": it.get("on_post", ""),
                "message_url": it.get("url", ""), "intent": it.get("intent"), "fit": fit, "intent_score": isc,
                "lead_score": fit + isc, "summary": it.get("summary", str(it.get("text", ""))[:140]),
                "next_step": it.get("next_step", ""), "owner": it.get("owner", ""), "status": "new", "crm_id": "",
                "inbox_id": it.get("id", ""),
            })
            have.add(it.get("id"))
    with open(LEADS, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS, extrasaction="ignore")
        w.writeheader()
        w.writerows(rows + added)
    for r in added:
        print(f"  + {r['intent']:9} score {r['lead_score']}  {r['organization'] or '-'}  (from {r['source_post'] or r['platform']})")
    print(f"{len(added)} new lead(s); {len(rows) + len(added)} total")


if __name__ == "__main__":
    main()
