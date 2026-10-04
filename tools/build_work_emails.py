#!/usr/bin/env python3
"""Put the best WORK email on each person, with how sure we are. Business addresses only.

  python3 build_work_emails.py --people final/people_with_crustdata.csv --out final/people_with_emails.csv \
      [--crustdata final/work_emails.csv] [--verified final/inferred_emails_verified.csv]

Priority per person (first that exists wins):
  1 published        an address the organization itself published for that person (people_final.published_email)
  2 crustdata        Crustdata's work email, only where its domain matches the organization (domain_matches_org = yes)
  3 inferred_valid   guessed from the organization's pattern AND a verifier says deliverable
  4 inferred_unproven guessed, but the domain accepts everything (accept-all): cannot be confirmed. Do not send a campaign.
Columns added: work_email_final, work_email_how, work_email_confidence (high / medium / unproven / none).
Guesses a verifier called undeliverable are dropped.
"""
import argparse, csv, collections, os


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--people", required=True); ap.add_argument("--out", required=True)
    ap.add_argument("--crustdata", default=""); ap.add_argument("--verified", default=""); a = ap.parse_args()
    cd = {}
    if a.crustdata and os.path.exists(a.crustdata):
        cd = {r["person_id"]: r["work_email"] for r in csv.DictReader(open(a.crustdata, newline="", encoding="utf-8"))
              if r.get("work_email") and r.get("domain_matches_org") == "yes"}
    inf = {}
    if a.verified and os.path.exists(a.verified):
        inf = {r["person_id"]: r for r in csv.DictReader(open(a.verified, newline="", encoding="utf-8"))}
    rows = list(csv.DictReader(open(a.people, newline="", encoding="utf-8")))
    add = ["work_email_final", "work_email_how", "work_email_confidence"]; cnt = collections.Counter()
    with open(a.out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]) + [c for c in add if c not in rows[0]]); w.writeheader()
        for p in rows:
            e, how, conf = "", "none", "none"; i = inf.get(p["person_id"], {})
            if (p.get("published_email") or "").strip(): e, how, conf = p["published_email"].strip(), "published", "high"
            elif p["person_id"] in cd: e, how, conf = cd[p["person_id"]], "crustdata", "high"
            elif i.get("verification") == "valid": e, how, conf = i["inferred_email"], "inferred_valid", "high"
            elif i.get("verification") == "catch_all": e, how, conf = i["inferred_email"], "inferred_unproven", "unproven"
            elif i.get("verification") in ("", None, "not_checked") and i.get("inferred_email"): e, how, conf = i["inferred_email"], "inferred_unchecked", "unproven"
            p.update(work_email_final=e, work_email_how=how, work_email_confidence=conf); cnt[how] += 1; w.writerow(p)
    print(dict(cnt), "->", a.out)


if __name__ == "__main__":
    main()
