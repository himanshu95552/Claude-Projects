#!/usr/bin/env python3
"""Build the one-page morning brief from the files the other modules keep.

  python3 scripts/morning_brief.py                 # writes reports/daily/<today>.md and prints it
  python3 scripts/morning_brief.py --days 7 --date 2026-10-12

The report skill first refreshes reports/metrics/<date>.json from Metricool, then runs
this, then adds one or two sentences of judgement where the brief says [Claude: ...].
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gs_common import ROOT, all_posts, load_yaml  # noqa: E402

OUTCOMES = ["demo_request", "exam_itemized_request", "opportunity", "customer"]


def read_csv(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def in_window(date_str: str, start: dt.date, end: dt.date) -> bool:
    try:
        d = dt.date.fromisoformat(str(date_str)[:10])
    except ValueError:
        return False
    return start <= d <= end


def collect(today: dt.date, days: int = 7) -> dict:
    start = today - dt.timedelta(days=days - 1)
    data: dict = {"today": today.isoformat(), "from": start.isoformat(), "days": days}

    # Queue
    queue = {st: all_posts([st]) for st in ["pending", "approved", "scheduled", "published", "rejected"]}
    data["queue"] = {st: len(v) for st, v in queue.items()}
    data["pending"] = [{"id": p.id, "platform": p.platform, "format": p.meta.get("format"),
                        "scheduled_for": str(p.meta.get("scheduled_for", "")), "lint": p.meta.get("lint", "")}
                       for p in queue["pending"]]
    stale = [p.id for p in queue["approved"] + queue["scheduled"]
             if p.meta.get("content_hash") and p.meta.get("content_hash") != p.content_hash()]
    data["changed_after_approval"] = stale

    # Metrics (latest value per post across the window's files)
    per_post: dict[str, dict] = defaultdict(lambda: defaultdict(float))
    followers: dict[str, dict] = {}
    for f in sorted((ROOT / "reports" / "metrics").glob("*.json")):
        if not in_window(f.stem, start, today):
            continue
        m = json.loads(f.read_text(encoding="utf-8"))
        for row in m.get("posts", []):
            pp = per_post[row["post_id"]]
            pp["platform"] = row.get("platform", "")
            for k in ["impressions", "engagements", "comments", "shares", "clicks"]:
                if k in row:
                    pp[k] = max(pp.get(k, 0), row[k] or 0)
        for acc in m.get("accounts", []):
            followers[acc["platform"]] = acc
    data["metrics_available"] = bool(per_post)

    # Outcomes from CRM / forms
    outcomes = [r for r in read_csv(ROOT / "reports" / "outcomes.csv") if in_window(r.get("date", ""), start, today)]
    for r in outcomes:
        if r.get("outcome") in OUTCOMES:
            per_post[r["post_id"]][r["outcome"]] += 1
            per_post[r["post_id"]]["value_usd"] += float(r.get("value_usd") or 0)

    # Leads from comments / DMs
    leads = [r for r in read_csv(ROOT / "community" / "leads.csv") if in_window(r.get("date", ""), start, today)]
    for r in leads:
        if r.get("source_post"):
            per_post[r["source_post"]]["leads"] += 1
    data["leads"] = leads

    # Inbox items waiting on a person
    waiting = []
    for f in sorted((ROOT / "community" / "inbox").glob("*.yaml")):
        batch = load_yaml(f) or {}
        for it in batch.get("items", []) or []:
            if it.get("route") == "person" and it.get("reply_status", "pending") == "pending":
                waiting.append({"file": f.name, "id": it.get("id"), "intent": it.get("intent"),
                                "author": it.get("author"), "text": str(it.get("text", ""))[:140]})
            elif it.get("route") in ("draft-reply", "reply-bank") and it.get("reply_status", "pending") == "pending":
                waiting.append({"file": f.name, "id": it.get("id"), "intent": it.get("intent"),
                                "author": it.get("author"), "text": "reply drafted, needs approval", "draft": True})
    data["inbox_waiting"] = waiting

    rows = []
    for pid, v in per_post.items():
        rows.append({"post_id": pid, **{k: (int(x) if isinstance(x, float) and x.is_integer() else x) for k, x in v.items()}})
    rows.sort(key=lambda r: (sum(r.get(k, 0) for k in OUTCOMES) + r.get("leads", 0), r.get("clicks", 0), r.get("engagements", 0)), reverse=True)
    data["posts"] = rows
    data["followers"] = followers
    data["totals"] = {k: sum(r.get(k, 0) for r in rows) for k in
                      ["impressions", "engagements", "clicks", "leads", *OUTCOMES, "value_usd"]}
    data["totals"]["followers_delta"] = sum(int(a.get("followers_delta", 0) or 0) for a in followers.values())

    # Latest research brief
    briefs = sorted((ROOT / "research" / "briefs").glob("*.yaml"))
    data["research"] = load_yaml(briefs[-1]) if briefs else {}
    data["research_file"] = briefs[-1].name if briefs else ""
    return data


def best_and_skip(rows):
    best = next((r for r in rows if sum(r.get(k, 0) for k in OUTCOMES) + r.get("leads", 0) > 0), None)
    if not best and rows:
        best = max(rows, key=lambda r: r.get("clicks", 0)) if any(r.get("clicks") for r in rows) else None
    skip = None
    no_result = [r for r in rows if not r.get("clicks") and not sum(r.get(k, 0) for k in OUTCOMES) and not r.get("leads")]
    if no_result:
        skip = max(no_result, key=lambda r: r.get("engagements", 0))
    return best, skip


def render(d: dict) -> str:
    t = d["totals"]
    best, skip = best_and_skip(d["posts"])
    res = d.get("research") or {}
    L = []
    L.append(f"# Gravity morning brief · {d['today']}")
    L.append(f"_Last {d['days']} days ({d['from']} to {d['today']}). Internal. One page._\n")
    L.append("| Pipeline from social | Demo requests | Exam itemized requests | Leads from comments/DMs | Link clicks | New followers |")
    L.append("|---|---|---|---|---|---|")
    L.append(f"| ${t.get('value_usd', 0):,.0f} | {t.get('demo_request', 0)} | {t.get('exam_itemized_request', 0)} | "
             f"{len(d['leads'])} | {t.get('clicks', 0)} | {t.get('followers_delta', 0)} |")
    if not d["metrics_available"]:
        L.append("\n> Metricool has no connected networks yet, so reach, clicks and followers are empty. Connect LinkedIn, X and Instagram in Metricool to fill them.")
    L.append("\n## Five things\n")
    if best:
        L.append(f"- **Best post:** `{best['post_id']}`: {best.get('clicks', 0)} clicks, "
                 f"{sum(best.get(k, 0) for k in OUTCOMES)} outcomes, {best.get('leads', 0)} leads. [Claude: why it worked, and the part-2 idea.]")
    else:
        L.append("- **Best post:** nothing has produced a click, lead or request yet this week.")
    if skip:
        L.append(f"- **Engaged but went nowhere:** `{skip['post_id']}`: {skip.get('engagements', 0)} engagements, 0 clicks, 0 leads. [Claude: which pattern to drop.]")
    pend = d["queue"].get("pending", 0)
    L.append(f"- **Waiting for your approval:** {pend} post(s). Open `content/dashboard.html` → Content, or say \"show me the queue.\"")
    people = [w for w in d["inbox_waiting"] if not w.get("draft")]
    drafts = [w for w in d["inbox_waiting"] if w.get("draft")]
    L.append(f"- **Needs you personally:** {len(people)} message(s) never auto-replied"
             + (f" ({', '.join(sorted({str(w['intent']) for w in people}))})" if people else "")
             + f"; {len(drafts)} drafted replies waiting for a yes.")
    trend = res.get("trend_to_ride") or {}
    if trend:
        L.append(f"- **Signal to ride:** {trend.get('topic', '')}: {trend.get('why', '')} (from {d['research_file']}).")
    else:
        L.append("- **Signal to ride:** no research brief this week yet. Run the research module.")
    if d["changed_after_approval"]:
        L.append(f"\n**Attention:** {len(d['changed_after_approval'])} approved post(s) changed after approval and will be blocked: {', '.join(d['changed_after_approval'])}.")
    if d["posts"]:
        L.append("\n## Which posts moved pipeline\n")
        L.append("| Post | Platform | Impressions | Engagements | Clicks | Leads | Demo | Itemized |")
        L.append("|---|---|---|---|---|---|---|---|")
        for r in d["posts"][:10]:
            L.append(f"| {r['post_id']} | {r.get('platform', '')} | {r.get('impressions', 0)} | {r.get('engagements', 0)} | "
                     f"{r.get('clicks', 0)} | {r.get('leads', 0)} | {r.get('demo_request', 0)} | {r.get('exam_itemized_request', 0)} |")
    L.append(f"\n**Queue:** {d['queue'].get('pending', 0)} pending · {d['queue'].get('approved', 0)} approved · "
             f"{d['queue'].get('scheduled', 0)} scheduled · {d['queue'].get('published', 0)} published")
    return "\n".join(L) + "\n"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--date", default=dt.date.today().isoformat())
    ap.add_argument("--days", type=int, default=7)
    a = ap.parse_args()
    d = collect(dt.date.fromisoformat(a.date), a.days)
    md = render(d)
    out = ROOT / "reports" / "daily" / f"{a.date}.md"
    out.write_text(md, encoding="utf-8")
    print(md)
    print(f"(written to {out.relative_to(ROOT)})")


if __name__ == "__main__":
    main()
