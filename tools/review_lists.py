#!/usr/bin/env python3
"""Free review lists, written to final/review/ (nothing is changed in the main files).

  python3 review_lists.py --final final

  1_title_differs.csv          Crustdata's title differs from ours: wording-only vs possible real role change
  2_linkedin_conflicts.csv     existing LinkedIn link vs Crustdata's link for the same person
  3_people_review_priority.csv review_needed.csv sorted: decision-makers first, with a suggested action
  4_org_linkedin_review.csv    organization LinkedIn matches to check, largest organizations first
  5_facilities_unmatched.csv   facilities whose org_id is not in orgs_final.csv
  6_spot_check_sample.csv      20 random high-confidence people to check by hand on LinkedIn
Columns are looked up by name; anything missing is left blank and listed at the start.
"""
import argparse, csv, os, random, re, urllib.parse

DM = re.compile(r"\b(chief|ceo|coo|cfo|cio|cmo|cto|president|vice president|vp|owner|partner|founder|administrator|director|manager|head of|officer|executive|medical director|radiologist)\b", re.I)
W = re.compile(r"[a-z]+")


def rd(p):
    return list(csv.DictReader(open(p, newline="", encoding="utf-8-sig"))) if os.path.exists(p) else []


def pick(r, *names):
    for n in names:
        if r.get(n): return r[n]
    return ""


def wr(path, rows, cols):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols, extrasaction="ignore"); w.writeheader(); w.writerows(rows)
    print(f"  {len(rows):>6} rows -> {path}")


def overlap(a, b):
    x, y = set(W.findall(a.lower())), set(W.findall(b.lower()))
    return len(x & y) / len(x | y) if x | y else 0


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--final", default="final"); ap.add_argument("--seed", type=int, default=7); a = ap.parse_args()
    F = lambda n: os.path.join(a.final, n); R = lambda n: os.path.join(a.final, "review", n)
    people = rd(F("people_with_emails.csv")) or rd(F("people_with_crustdata.csv"))
    orgs = {o["org_id"]: o for o in rd(F("orgs_with_linkedin.csv")) or rd(F("orgs_final.csv"))}
    print("people columns:", list(people[0]) if people else "NONE FOUND")
    oname = lambda p: (orgs.get(p.get("org_id"), {}) or {}).get("org_name", "")
    base = lambda p: {"person_id": p.get("person_id"), "name": p.get("name"), "organization": oname(p), "org_id": p.get("org_id")}
    ltitle = lambda p: pick(p, "listed_title", "title", "title_original")

    t = []
    for p in people:
        if p.get("cd_status") != "title_differs": continue
        old, new = ltitle(p), p.get("cd_title", "")
        wording = overlap(old, new) >= 0.5 or bool(DM.search(old)) == bool(DM.search(new)) and overlap(old, new) >= 0.3
        t.append({**base(p), "our_title": old, "crustdata_title": new, "kind": "wording_only" if wording else "possible_role_change",
                  "suggestion": "use crustdata title" if wording else "check LinkedIn: role may have changed", "title_final_now": p.get("title_final"),
                  "linkedin": p.get("linkedin_final")})
    t.sort(key=lambda r: (r["kind"] == "wording_only", not DM.search(r["crustdata_title"] or "")))
    wr(R("1_title_differs.csv"), t, ["person_id", "name", "organization", "our_title", "crustdata_title", "kind", "suggestion", "title_final_now", "linkedin"])

    c = [{**base(p), "title": p.get("title_final") or ltitle(p), "existing_linkedin": pick(p, "linkedin", "linkedin_url"), "crustdata_linkedin": p.get("cd_linkedin")}
         for p in people if p.get("linkedin_source") == "CONFLICT"]
    wr(R("2_linkedin_conflicts.csv"), c, ["person_id", "name", "organization", "title", "existing_linkedin", "crustdata_linkedin"])

    rv = rd(F("review_needed.csv")); rows = []
    for r in rv:
        ti = pick(r, "title_final", "listed_title", "title"); dm = bool(DM.search(ti))
        conf = pick(r, "confidence", "evidence_confidence").lower()
        act = "check by hand" if dm else ("drop if no other evidence" if conf in ("none", "") else "low priority")
        rows.append({**r, "is_decision_maker": "yes" if dm else "no", "suggested_action": act})
    rows.sort(key=lambda r: (r["is_decision_maker"] != "yes", r["suggested_action"] != "check by hand"))
    wr(R("3_people_review_priority.csv"), rows, (list(rv[0]) if rv else []) + ["is_decision_maker", "suggested_action"])

    ol = rd(F("orgs_linkedin_review.csv"))
    ol.sort(key=lambda r: -int(re.sub(r"\D", "", pick(r, "crustdata_employees")) or 0))
    wr(R("4_org_linkedin_review.csv"), ol, list(ol[0]) if ol else [])

    fac = rd(F("facilities_enriched.csv")) or rd(F("freestanding-mri-ct-facilities.csv"))
    un = [f for f in fac if (f.get("org_id") or "") not in orgs]
    wr(R("5_facilities_unmatched.csv"), un, list(fac[0]) if fac else [])

    hi = [p for p in people if pick(p, "confidence", "evidence_confidence").lower() == "high"]
    random.Random(a.seed).shuffle(hi)
    s = [{**base(p), "title": p.get("title_final") or ltitle(p), "linkedin": p.get("linkedin_final"), "email": p.get("work_email_final"),
          "search_link": "https://www.google.com/search?q=" + urllib.parse.quote(f'"{p.get("name")}" {oname(p)} linkedin'), "still_there_yes_no": ""} for p in hi[:20]]
    wr(R("6_spot_check_sample.csv"), s, ["person_id", "name", "organization", "title", "linkedin", "email", "search_link", "still_there_yes_no"])


if __name__ == "__main__":
    main()
