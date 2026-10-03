#!/usr/bin/env python3
"""Merge Crustdata name-lookup results into the People table.

  python3 merge_crustdata_people.py --people final/people_final.csv --matches final/names_full_matches.csv --out final/people_with_crustdata.csv

Adds columns to every person (matched on org_id + name, the same names the lookup used):
  cd_status         title_added | same_title | title_differs | ours_not_found | (blank = not looked up)
  cd_linkedin       LinkedIn profile URL from Crustdata (person found at the organization's website domain)
  cd_title          current title found on the profile
  title_final       our listed title if we had one, otherwise the Crustdata title (title_added)
  title_source      listed | crustdata | none
  linkedin_final    employer-verified URL we already had, else Crustdata's
  linkedin_source   existing | crustdata | both_agree | CONFLICT (two different URLs: review) | none
"""
import argparse, csv, collections, re

slug = lambda u: re.sub(r"[?#].*", "", (u or "").lower().rstrip("/"))


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--people", required=True); ap.add_argument("--matches", required=True)
    ap.add_argument("--out", required=True); a = ap.parse_args()
    m = {(r["org_id"], r["name"]): r for r in csv.DictReader(open(a.matches, newline="", encoding="utf-8"))}
    rows = list(csv.DictReader(open(a.people, newline="", encoding="utf-8")))
    add = ["cd_status", "cd_linkedin", "cd_title", "title_final", "title_source", "linkedin_final", "linkedin_source"]
    cnt = collections.Counter()
    with open(a.out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]) + add); w.writeheader()
        for r in rows:
            x = m.get((r["org_id"], r["name"]), {})
            st, cu, ct = x.get("status", ""), x.get("linkedin_url", ""), x.get("found_title", "")
            lt = (r.get("listed_title") or r.get("title") or "").strip()
            ex = (r.get("linkedin_url") or "").strip()
            if st == "ours_not_found": cu = ct = ""
            tf, ts = (lt, "listed") if lt else ((ct, "crustdata") if ct and st in ("title_added", "title_differs", "same_title") else ("", "none"))
            if ex and cu: lf, ls = (ex, "both_agree") if slug(ex) == slug(cu) else (ex, "CONFLICT")
            elif ex: lf, ls = ex, "existing"
            elif cu: lf, ls = cu, "crustdata"
            else: lf, ls = "", "none"
            r.update(cd_status=st, cd_linkedin=cu, cd_title=ct, title_final=tf, title_source=ts, linkedin_final=lf, linkedin_source=ls)
            cnt[ls] += 1; w.writerow(r)
    print("linkedin:", dict(cnt)); have = sum(1 for k in cnt if k != "none" for _ in range(cnt[k])); print(f"people with a LinkedIn URL: {have}/{len(rows)} -> {a.out}")


if __name__ == "__main__":
    main()
