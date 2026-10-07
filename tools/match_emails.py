#!/usr/bin/env python3
"""Match a list of known business emails to the people in our sheet. FREE, no API calls.

  python3 match_emails.py --people final/people_with_crustdata.csv --orgs final/orgs_final.csv \
      --emails data/hunter_radnet_domain_emails.txt --source hunter_domain_list \
      --emails data/apollo_screenshot_emails.csv --source apollo_manual --out final/matched_emails.csv

--emails takes a .txt (one email per line) or a .csv with an `email` column and optional `name` and `apollo_status` columns.
Give one --source label per --emails, in the same order. A person matches when the email domain equals their organization's
website domain AND the part before @ fits their name (first.last, flast, first, ...). If a CSV gives a name, the name must also match.
Output (final/matched_emails.csv): person_id, name, organization, work_email, domain_matches_org (yes), source, match, confidence
  (high = both names appear in the address, or Apollo says verified; medium = initial+last name or first name only, or unverified)
  plus final/matched_emails_unmatched.csv for emails that fit nobody.
The output can also be passed to infer_email_patterns.py --extra-emails to spread the confirmed pattern to colleagues.
"""
import argparse, csv, os, re, collections
from infer_email_patterns import PATTERNS, fl, dom


def read(path):
    if path.lower().endswith(".csv"):
        return [{"email": (r.get("email") or "").strip(), "name": r.get("name", ""), "status": (r.get("apollo_status") or "").lower()}
                for r in csv.DictReader(open(path, newline="", encoding="utf-8-sig"))]
    return [{"email": l.strip(), "name": "", "status": ""} for l in open(path, encoding="utf-8") if "@" in l]


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--people", required=True); ap.add_argument("--orgs", required=True)
    ap.add_argument("--emails", action="append", required=True); ap.add_argument("--source", action="append", required=True)
    ap.add_argument("--out", required=True); a = ap.parse_args()
    if len(a.emails) != len(a.source): ap.error("give one --source per --emails")
    orgs = {o["org_id"]: o for o in csv.DictReader(open(a.orgs, newline="", encoding="utf-8"))}
    by_dom = collections.defaultdict(list)
    for p in csv.DictReader(open(a.people, newline="", encoding="utf-8")):
        o, n = orgs.get(p.get("org_id")), fl(p.get("name"))
        if o and n and dom(o.get("website")): by_dom[dom(o["website"])].append((p, o, n))
    matched, unmatched, seen = [], [], set()
    for path, src in zip(a.emails, a.source):
        for r in read(path):
            e = r["email"]; local, _, d = e.lower().partition("@"); d = dom(d); base = re.sub(r"\d+$", "", local)
            hits = []
            for p, o, (f, l) in by_dom.get(d, []):
                if r["name"] and fl(r["name"]) != (f, l): continue
                for pn, fn in PATTERNS.items():
                    if base == fn(f, l):
                        hits.append((p, o, pn)); break
            if len(hits) == 1:
                p, o, pn = hits[0]
                strong = pn in ("first.last", "firstlast", "first_last", "last.first") or r["status"] == "verified"
                conf = "high" if strong and r["status"] != "unverified" else "medium"
                matched.append({"person_id": p["person_id"], "name": p["name"], "organization": o["org_name"], "work_email": e.lower(),
                                "domain_matches_org": "yes", "source": src, "match": pn, "confidence": conf})
            else:
                unmatched.append({"email": e, "source": src, "reason": "no person fits" if not hits else f"{len(hits)} people fit"})
    # one email per person: prefer high, then the full first.last form
    best = {}
    for m in matched:
        k = m["person_id"]; rank = (m["confidence"] == "high", m["match"] == "first.last")
        if k not in best or rank > best[k][0]: best[k] = (rank, m)
    rows = [m for _, m in best.values()]
    fields = ["person_id", "name", "organization", "work_email", "domain_matches_org", "source", "match", "confidence"]
    os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
    with open(a.out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields); w.writeheader(); w.writerows(rows)
    un = a.out.replace(".csv", "_unmatched.csv")
    with open(un, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["email", "source", "reason"]); w.writeheader(); w.writerows(unmatched)
    print(f"matched {len(rows)} people ({sum(1 for r in rows if r['confidence']=='high')} high) -> {a.out}; {len(unmatched)} emails matched nobody -> {un}")


if __name__ == "__main__":
    main()
