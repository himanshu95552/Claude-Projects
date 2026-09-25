#!/usr/bin/env python3
"""Import Calendly bookings into reports/outcomes.csv, attributed to the post that earned them.

  python3 scripts/import_calendly.py ~/Downloads/calendly-export.csv [--dry-run]

Export from Calendly: Calendar (Meetings) -> Filter -> Tracking IDs: All IDs -> Export (CSV).
Rows whose utm_content is a Gravity post id (e.g. 2026-W40-li-co-03) become outcome rows:
  demo_request            by default
  exam_itemized_request   when the event type name contains a keyword in config calendly.exam_itemized_event_keywords
Bookings without a post id are counted and reported, not imported.

Privacy: only the booker's company email domain is kept (free-mail domains become "individual").
Names and emails are never written to the repo. A short one-way hash of the booking keeps
re-imports from double counting.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import re
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gs_common import ROOT, config  # noqa: E402

POST_ID = re.compile(r"^\d{4}-W\d{2}-(li-co|li-sp|x|ig|yt)-\d{2}$")
OUT = ROOT / "reports" / "outcomes.csv"
FIELDS = ["date", "post_id", "outcome", "organization", "value_usd", "notes"]


def col(row: dict, *names: str) -> str:
    """Case- and punctuation-insensitive column lookup, since Calendly export headers vary by plan."""
    norm = {re.sub(r"[^a-z]", "", k.lower()): v for k, v in row.items() if k}
    for n in names:
        v = norm.get(re.sub(r"[^a-z]", "", n.lower()))
        if v not in (None, ""):
            return str(v).strip()
    return ""


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("export")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    cfg = config().get("calendly", {})
    keywords = [k.lower() for k in cfg.get("exam_itemized_event_keywords", [])]
    free = {d.lower() for d in cfg.get("free_email_domains", [])}

    existing = set()
    if OUT.exists():
        with open(OUT, newline="", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                m = re.search(r"calendly:([0-9a-f]{12})", r.get("notes", ""))
                if m:
                    existing.add(m.group(1))

    with open(a.export, newline="", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))
    new, skipped = [], Counter()
    for r in rows:
        utm_content = col(r, "UTM Content", "utm_content", "Tracking utm_content")
        if not POST_ID.match(utm_content):
            skipped["no post id" if not utm_content else "not a post id"] += 1
            continue
        if col(r, "Canceled", "Cancelled", "Status").lower() in ("true", "yes", "canceled", "cancelled"):
            skipped["canceled"] += 1
            continue
        email = col(r, "Invitee Email", "Email")
        start = col(r, "Start Date & Time", "Start Time", "Event Start Time", "Start Date")
        created = col(r, "Event Created Date & Time", "Created At", "Scheduled At") or start
        event = col(r, "Event Type Name", "Event Type", "Event Name")
        key = hashlib.sha256(f"{email.lower()}|{start}|{event}".encode()).hexdigest()[:12]
        if key in existing:
            skipped["already imported"] += 1
            continue
        domain = email.split("@")[-1].lower() if "@" in email else ""
        org = "individual" if (not domain or domain in free) else domain
        outcome = "exam_itemized_request" if any(k in event.lower() for k in keywords) else "demo_request"
        date = (re.search(r"\d{4}-\d{2}-\d{2}", created) or re.search(r"\d{4}-\d{2}-\d{2}", start))
        new.append({"date": date.group(0) if date else "", "post_id": utm_content, "outcome": outcome,
                    "organization": org, "value_usd": "", "notes": f"calendly:{key} {event}".strip()})
        existing.add(key)

    for r in new:
        print(f"  + {r['date']}  {r['post_id']:20} {r['outcome']:22} {r['organization']}")
    print(f"{len(new)} new outcome(s) from {len(rows)} booking(s); skipped: {dict(skipped) or 'none'}")
    if new and not a.dry_run:
        write_header = not OUT.exists() or OUT.stat().st_size == 0
        with open(OUT, "a", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=FIELDS)
            if write_header:
                w.writeheader()
            w.writerows(new)
        print(f"Appended to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
