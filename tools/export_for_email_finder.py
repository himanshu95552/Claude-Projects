#!/usr/bin/env python3
"""Make an upload file for an email-finder service (Hunter, Apollo, Snov, Findymail and similar bulk tools).

  python3 export_for_email_finder.py --people final/people_with_crustdata.csv --orgs final/orgs_final.csv --out final/email_finder_upload.csv [--decision-makers-only]

One row per person with first_name, last_name, company, domain, title (and person_id so results can be matched back).
Skips people we already have a work email for (published_email in people_final, or final/work_emails.csv when present).
Decision-makers come first. Business lookups only: do NOT enable phone or personal-email options in the service.
"""
import argparse, csv, html, os, re

CRED = re.compile(r"\b(m\.?d\.?|d\.?o\.?|ph\.?d\.?|r\.?n\.?|rt|rdms|rrt|dr|jr|sr|ii|iii|np|pa-c|crna|dpt|mba|msn|bsn|facr)\b\.?", re.I)
DM = re.compile(r"\b(chief|ceo|coo|cfo|cio|cmo|cto|president|vice president|vp|owner|partner|administrator|director|manager|head of|supervisor|officer|controller|coordinator|executive|operations|billing|revenue|practice|lead|medical director|radiologist)\b", re.I)
TOP = re.compile(r"\b(chief|ceo|coo|cfo|cio|cmo|cto|president|vice president|vp|owner|co-?owner|partner|founder|administrator|managing|medical director|director of (radiology|imaging|operations)|practice manager|executive director|radiology director|imaging director|head of)\b", re.I)
dom = lambda u: re.sub(r"^https?://(www\.)?", "", (u or "").strip().lower()).split("/")[0]


def split(name):
    t = [x for x in CRED.sub(" ", re.sub(r"\(.*?\)", " ", name or "")).replace(",", " ").split() if len(x.strip(".")) > 1]
    return (t[0], t[-1]) if len(t) >= 2 else None


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--people", required=True); ap.add_argument("--orgs", required=True)
    ap.add_argument("--out", required=True); ap.add_argument("--decision-makers-only", action="store_true")
    ap.add_argument("--top-tier-only", action="store_true", help="only owners, C-suite, presidents, administrators, medical and practice directors")
    ap.add_argument("--exclude", action="append", default=[], help="earlier finder result/upload CSV with a person_id column; those people are skipped (repeatable)")
    a = ap.parse_args()
    orgs = {o["org_id"]: o for o in csv.DictReader(open(a.orgs, newline="", encoding="utf-8"))}
    have = set()
    wf = os.path.join(os.path.dirname(a.out) or ".", "work_emails.csv")
    if os.path.exists(wf): have = {r["person_id"] for r in csv.DictReader(open(wf, newline="", encoding="utf-8")) if r.get("work_email")}
    for path in a.exclude: have |= {r["person_id"] for r in csv.DictReader(open(path, newline="", encoding="utf-8-sig")) if r.get("person_id")}
    rows = []
    for p in csv.DictReader(open(a.people, newline="", encoding="utf-8")):
        if p.get("published_email") or p["person_id"] in have: continue
        o, n = orgs.get(p["org_id"]), split(p["name"])
        if not o or not n or not dom(o["website"]): continue
        t = html.unescape(p.get("title_final") or p.get("listed_title") or p.get("title") or "").replace("\n", " ").strip()
        dm = bool(DM.search(t))
        if a.decision_makers_only and not dm: continue
        if a.top_tier_only and not TOP.search(t): continue
        rows.append((0 if dm else 1, {"first_name": n[0].title(), "last_name": n[1].title(), "company": o["org_name"], "domain": dom(o["website"]),
                     "title": t, "person_id": p["person_id"]}))
    rows.sort(key=lambda r: r[0])
    with open(a.out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["first_name", "last_name", "company", "domain", "title", "person_id"]); w.writeheader()
        w.writerows(r for _, r in rows)
    print(f"{len(rows)} people ({sum(1 for k, _ in rows if k == 0)} decision-makers) -> {a.out}")


if __name__ == "__main__":
    main()
