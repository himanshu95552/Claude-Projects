#!/usr/bin/env python3
"""Put the best WORK email on each person, with how sure we are. Business addresses only.

  python3 build_work_emails.py --people final/people_with_crustdata.csv --out final/people_with_emails.csv \
      [--crustdata final/work_emails.csv] [--verified final/inferred_emails_verified.csv]

Priority per person (first that exists wins):
  1 published        an address the organization itself published for that person (people_final.published_email)
  2 crustdata        Crustdata's work email, only where its domain matches the organization (domain_matches_org = yes)
  2b finder_valid    Hunter Email Finder result marked valid (--finder, repeatable; person_id column kept from the upload)
  3 inferred_valid   guessed from the organization's pattern AND a verifier says deliverable
  3b finder_unproven Hunter found it but the domain accepts everything (accept_all)
  4 inferred_unproven guessed, but the domain accepts everything (accept-all): cannot be confirmed. Do not send a campaign.
  5 inferred_untestable / inferred_unchecked  guessed; a verifier could not tell, or it was never checked
  (finder_other_domain, confidence medium: Hunter's email is on a different domain than the organization's website, e.g. a parent company or a same-name person elsewhere; needs a check. Needs --orgs)
Columns added: work_email_final, work_email_how, work_email_confidence (high / medium / unproven / none).
Guesses a verifier called undeliverable are dropped.
"""
import argparse, csv, collections, os, re
from merge_email_verification import norm as vnorm


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--people", required=True); ap.add_argument("--out", required=True)
    ap.add_argument("--crustdata", default=""); ap.add_argument("--verified", default="")
    ap.add_argument("--orgs", default="", help="orgs_final.csv; a Hunter email whose domain differs from the organization's website is marked medium, not high")
    ap.add_argument("--verification", action="append", default=[], help="verifier result file as path:email_col:status_col (repeatable). Valid -> high confidence, invalid -> dropped, catch-all/unknown -> unchanged")
    ap.add_argument("--verification-valid-only", action="append", default=[], help="like --verification, but an 'invalid' answer is ignored (use for Reacher)")
    ap.add_argument("--guesses", default="", help="unverified pattern guesses (infer_email_patterns.py output); used only when nothing better exists, always unproven")
    ap.add_argument("--matched", default="", help="final/matched_emails.csv from match_emails.py (domain-list and Apollo matches)")
    ap.add_argument("--finder", action="append", default=[], help="Hunter bulk Email Finder result CSV (repeatable)"); a = ap.parse_args()
    vres = {}
    def load_ver(specs, trust_invalid):
        for spec in specs:
            path, ecol, scol = spec.rsplit(":", 2)
            for r in csv.DictReader(open(os.path.expanduser(path), newline="", encoding="utf-8-sig")):
                em = (r.get(ecol.strip("'\"")) or "").strip().lower(); st = vnorm(r.get(scol.strip("'\""), ""))
                if st == "invalid" and not trust_invalid: st = "unknown"
                if em and (em not in vres or st == "valid"): vres[em] = st
    load_ver(a.verification, True); load_ver(a.verification_valid_only, False)
    gs = {}
    if a.guesses and os.path.exists(a.guesses):
        gs = {r["person_id"]: r for r in csv.DictReader(open(a.guesses, newline="", encoding="utf-8")) if r.get("inferred_email")}
    mt = {}
    if a.matched and os.path.exists(a.matched):
        mt = {r["person_id"]: r for r in csv.DictReader(open(a.matched, newline="", encoding="utf-8"))}
    odom = {}
    if a.orgs and os.path.exists(a.orgs):
        odom = {o["org_id"]: re.sub(r"^https?://(www\.)?", "", (o.get("website") or "").strip().lower()).split("/")[0] for o in csv.DictReader(open(a.orgs, newline="", encoding="utf-8"))}
    same = lambda e, p: (not odom) or not odom.get(p.get("org_id")) or e.lower().split("@")[-1].endswith(odom[p["org_id"]]) or odom[p["org_id"]].endswith(e.lower().split("@")[-1])
    fd = {}
    for path in a.finder:
        for r in csv.DictReader(open(path, newline="", encoding="utf-8-sig")):
            em, st = (r.get("Email") or "").strip(), (r.get("Verification status") or "").strip().lower()
            if r.get("person_id") and em and st in ("valid", "accept_all") and (r["person_id"] not in fd or st == "valid"):
                fd[r["person_id"]] = (em, st)
    cd = {}
    if a.crustdata and os.path.exists(a.crustdata):
        cd = {r["person_id"]: r["work_email"] for r in csv.DictReader(open(a.crustdata, newline="", encoding="utf-8"))
              if r.get("work_email") and r.get("domain_matches_org") == "yes"}
    inf = {}
    if a.verified and os.path.exists(a.verified):
        inf = {r["person_id"]: r for r in csv.DictReader(open(a.verified, newline="", encoding="utf-8"))}
    rows = list(csv.DictReader(open(a.people, newline="", encoding="utf-8")))
    add = ["work_email_final", "work_email_how", "work_email_confidence"]; cnt = collections.Counter()
    # an address guessed for two different people is dropped for both; the same person listed twice (Craig Brown / Craig M. Brown) is one cluster
    guess_count = collections.Counter(e for e in {(g["inferred_email"].lower(), g.get("cluster") or pid) for pid, g in gs.items()} for e in [e[0]])
    with open(a.out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]) + [c for c in add if c not in rows[0]]); w.writeheader()
        for p in rows:
            e, how, conf = "", "none", "none"; i = inf.get(p["person_id"], {})
            if (p.get("published_email") or "").strip(): e, how, conf = p["published_email"].strip(), "published", "high"
            elif p["person_id"] in cd: e, how, conf = cd[p["person_id"]], "crustdata", "high"
            elif p["person_id"] in mt and mt[p["person_id"]]["confidence"] == "high": e, how, conf = mt[p["person_id"]]["work_email"], "listed_" + mt[p["person_id"]]["source"], "high"
            elif fd.get(p["person_id"], ("", ""))[1] == "valid":
                e = fd[p["person_id"]][0]; how, conf = ("finder_valid", "high") if same(e, p) else ("finder_other_domain", "medium")
            elif i.get("verification") == "valid": e, how, conf = i["inferred_email"], "inferred_valid", "high"
            elif p["person_id"] in mt: e, how, conf = mt[p["person_id"]]["work_email"], "listed_" + mt[p["person_id"]]["source"], "medium"
            elif p["person_id"] in fd: e, how, conf = fd[p["person_id"]][0], "finder_unproven", "unproven"
            elif i.get("verification") == "catch_all": e, how, conf = i["inferred_email"], "inferred_unproven", "unproven"
            elif i.get("verification") == "unknown" and i.get("inferred_email"): e, how, conf = i["inferred_email"], "inferred_untestable", "unproven"   # a verifier could not tell: keep the guess, flagged
            elif i.get("verification") in ("", None, "not_checked") and i.get("inferred_email"): e, how, conf = i["inferred_email"], "inferred_unchecked", "unproven"
            if how == "none" and p["person_id"] in gs and guess_count[gs[p["person_id"]]["inferred_email"].lower()] == 1:   # an address guessed for two people is dropped for both
                e, how, conf = gs[p["person_id"]]["inferred_email"], "pattern_unverified", "unproven"
            if e and (conf in ("medium", "unproven")) and (how.startswith("listed_") or how in ("pattern_unverified", "finder_other_domain")):
                st = vres.get(e.lower())
                if st == "valid": how, conf = how + "_verified", "high"
                elif st == "invalid": e, how, conf = "", "dropped_invalid", "none"
            p.update(work_email_final=e, work_email_how=how, work_email_confidence=conf); cnt[how] += 1; w.writerow(p)
    print(dict(cnt), "->", a.out)


if __name__ == "__main__":
    main()
