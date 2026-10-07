#!/usr/bin/env python3
"""List the organizations where a Snov.io / Hunter extension visit would pay off most. FREE.

  python3 top_orgs_for_scrape.py --final final --min-employees 50 --top 150 --out final/orgs_to_scrape.csv

One row per website domain: how many of OUR people work there, how many of them still have no work email, the
organization's size (Crustdata employee range when known) and its LinkedIn page. Sorted by people without an email,
so the first rows are the best places to run the extension (one visit, many matches via match_emails.py).
"""
import argparse, csv, collections, os, re

dom = lambda u: re.sub(r"^https?://(www\.)?", "", (u or "").strip().lower()).split("/")[0]


def lower_bound(s):
    m = re.findall(r"\d[\d,]*", s or ""); return int(m[0].replace(",", "")) if m else 0


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--final", default="final"); ap.add_argument("--out", default="final/orgs_to_scrape.csv")
    ap.add_argument("--min-employees", type=int, default=0, help="keep organizations whose Crustdata size is at least this, or whose size is unknown but who have >= --min-people of ours")
    ap.add_argument("--min-people", type=int, default=5); ap.add_argument("--top", type=int, default=150); a = ap.parse_args()
    F = lambda n: os.path.join(a.final, n)
    orgs = {o["org_id"]: o for o in csv.DictReader(open(F("orgs_with_linkedin.csv") if os.path.exists(F("orgs_with_linkedin.csv")) else F("orgs_final.csv"), newline="", encoding="utf-8"))}
    ppl = list(csv.DictReader(open(F("people_with_emails.csv") if os.path.exists(F("people_with_emails.csv")) else F("people_with_crustdata.csv"), newline="", encoding="utf-8")))
    g = collections.defaultdict(lambda: {"people": 0, "noemail": 0, "dm_noemail": 0, "names": set(), "emp": 0, "li": "", "site": ""})
    DM = re.compile(r"\b(chief|ceo|coo|cfo|president|owner|partner|administrator|director|manager|head of|officer|executive)\b", re.I)
    for p in ppl:
        o = orgs.get(p.get("org_id")); d = dom(o.get("website")) if o else ""
        if not d: continue
        r = g[d]; r["people"] += 1; r["names"].add(o["org_name"]); r["site"] = o["website"]
        r["emp"] = max(r["emp"], lower_bound(o.get("crustdata_employees"))); r["li"] = r["li"] or o.get("linkedin_final") or o.get("linkedin", "")
        if not (p.get("work_email_final") or "").strip():
            r["noemail"] += 1
            if DM.search(p.get("title_final") or p.get("listed_title") or ""): r["dm_noemail"] += 1
    rows = [{"domain": d, "website": r["site"], "organization": " / ".join(sorted(r["names"]))[:80], "people_in_list": r["people"],
             "people_without_email": r["noemail"], "decision_makers_without_email": r["dm_noemail"], "employees_crustdata_min": r["emp"] or "", "linkedin": r["li"]}
            for d, r in g.items() if r["noemail"] and ((r["emp"] and r["emp"] >= a.min_employees) or (not r["emp"] and r["people"] >= a.min_people) or r["people"] >= a.min_people)]
    if a.min_employees: rows = [x for x in rows if (x["employees_crustdata_min"] or 0) >= a.min_employees or x["people_in_list"] >= max(a.min_people, 20)]
    rows.sort(key=lambda x: (-x["people_without_email"], -x["people_in_list"])); rows = rows[:a.top]
    with open(a.out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]) if rows else ["domain"]); w.writeheader(); w.writerows(rows)
    print(f"{len(rows)} organizations -> {a.out}; together they hold {sum(x['people_without_email'] for x in rows)} of our people with no email yet")
    for x in rows[:15]: print(f"  {x['domain']:<34} {x['people_without_email']:>4} without email / {x['people_in_list']:>4} in list  (employees ≥ {x['employees_crustdata_min'] or '?'})")


if __name__ == "__main__":
    main()
