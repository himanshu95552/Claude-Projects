#!/usr/bin/env python3
"""Order the still-unsearched people so a limited Exa budget goes where it adds most.

  python3 prioritize.py --final final --people ~/Downloads/people_cleaned.csv

Writes people_priority.csv (only unsearched people, untitled first) and orgs_priority.txt
(organizations ordered by how many high-value people they hold). Feed them to exa_run.py:
  --people people_priority.csv --orgs orgs_priority.txt
Tier 1: no listed title (a search also finds the missing title). Tier 2: has a title.
"""
import argparse, csv, collections
from pathlib import Path

a = argparse.ArgumentParser(); a.add_argument("--final", default="final"); a.add_argument("--people", required=True)
a = a.parse_args()
todo = {r["person_id"]: r for r in csv.DictReader(open(Path(a.final) / "people_final.csv", newline="", encoding="utf-8"))
        if r["confidence"] == "not_searched"}
rows = [r for r in csv.DictReader(open(a.people, newline="", encoding="utf-8")) if r["person_id"] in todo]
tier = lambda r: 1 if not (todo[r["person_id"]].get("listed_title") or r.get("title") or "").strip() else 2
rows.sort(key=lambda r: tier(r))
score = collections.Counter()
for r in rows: score[r["org_id"]] += 3 if tier(r) == 1 else 1
with open("people_priority.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)
Path("orgs_priority.txt").write_text("\n".join(o for o, _ in score.most_common()) + "\n")
t1 = sum(tier(r) == 1 for r in rows)
print(f"unsearched people: {len(rows)}  (no title: {t1}, with title: {len(rows) - t1})  organizations: {len(score)}")
