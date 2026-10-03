#!/usr/bin/env python3
"""Merge the site/search LinkedIn links in orgs_final.csv with Crustdata's domain-matched pages.

  python3 merge_linkedin.py --orgs final/orgs_final.csv --crosscheck final/linkedin_crosscheck.csv --out final/linkedin_merged.csv

linkedin_how values:
  verified          our link and Crustdata's page agree
  fixed_truncated   our link was cut short or differed only in punctuation; Crustdata's full URL used
  crustdata_new     we had no link; Crustdata's single clean match used
  crustdata_domain_only  we had no link; Crustdata's single record for the domain, but its name only loosely matches
  site_non_company_page  our link is a person, school or showcase page, not a company page
  crustdata_name_ok we had no link; several candidates, best one's name matches the organization's
  replaced_other    our link pointed to a different company (parent, partner or school page) and Crustdata's
                    domain-matched page fits the organization's name better; ours kept in linkedin_other
  site_only         we have a link, Crustdata has no page for that domain (unverified)
  needs_review      conflicting candidates, none clearly right (our link kept if any)
  none              nothing found
"""
import argparse, csv, re, collections

slug = lambda u: re.sub(r"[?#].*", "", (u or "").lower().rstrip("/")).split("/company/")[-1].strip("/")
norm = lambda s: re.sub(r"[^a-z0-9]", "", (s or "").lower())
CONF = {"verified": "high", "fixed_truncated": "high", "crustdata_new": "high", "crustdata_name_ok": "high", "replaced_other": "high",
        "crustdata_domain_only": "medium", "site_only": "medium", "none": "none"}
STOP = set("the of and inc llc pc pllc md ltd corp group center centre health healthcare imaging radiology medical services associates".split())


def toks(s):
    return {t for t in re.findall(r"[a-z0-9]+", (s or "").lower()) if t not in STOP and len(t) > 1}


def sim(org_name, domain, cand_name, cand_slug):
    """0..1 how well a LinkedIn page fits the organization, judged on the ORGANIZATION'S NAME.
    The website domain is not used as evidence for a named organization: a listed website can belong to a parent
    or a different company, and a page that merely matches that domain would then look right when it is not.
    Only when the organization name is itself a domain (e.g. 'nuvancehealth.org') is the domain stem used."""
    cand = toks(cand_name) | toks(cand_slug.replace("-", " "))
    if "." in org_name.strip() and " " not in org_name.strip():
        stem = norm(org_name.split(".")[0])
        return 0.9 if len(stem) > 4 and (stem in norm(cand_name) or stem in norm(cand_slug)) else 0.0
    a = toks(org_name)
    if not a or not cand: return 0.0
    return len(a & cand) / len(a)  # share of the organization's distinctive words found on the page


def slug_name_sim(org_name, domain, existing_slug):
    return sim(org_name, domain, existing_slug.replace("-", " "), existing_slug)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--orgs", required=True); ap.add_argument("--crosscheck", required=True)
    ap.add_argument("--out", required=True); a = ap.parse_args()
    cc = {}
    for r in csv.DictReader(open(a.crosscheck, newline="", encoding="utf-8")): cc[r["org_id"]] = r
    out, cnt = [], collections.Counter()
    for o in csv.DictReader(open(a.orgs, newline="", encoding="utf-8")):
        c = cc.get(o["org_id"]); ex = o["linkedin"].strip(); es = slug(ex)
        row = {"org_id": o["org_id"], "org_name": o["org_name"], "linkedin_final": ex, "linkedin_how": "none" if not ex else "site_only",
               "linkedin_other": "", "crustdata_name": "", "crustdata_employees": ""}
        if c and c["status"] in ("single", "ambiguous"):
            cu, cn, cs = c["linkedin_url"], c["linkedin_name"], slug(c["linkedin_url"])
            row["crustdata_name"], row["crustdata_employees"] = cn, c["employees"]
            fit = sim(o["org_name"], c["domain"], cn, cs)
            if not ex:
                if c["status"] == "single" and fit >= 0.5: row.update(linkedin_final=cu, linkedin_how="crustdata_new")
                elif c["status"] == "single": row.update(linkedin_final=cu, linkedin_how="crustdata_domain_only")
                elif fit >= 0.5 and c["status"] == "ambiguous": row.update(linkedin_final=cu, linkedin_how="crustdata_name_ok")
                else: row.update(linkedin_how="needs_review", linkedin_other=cu)
            elif es == cs: row["linkedin_how"] = "verified"
            elif norm(cs).startswith(norm(es)) or norm(es).startswith(norm(cs)):
                row.update(linkedin_final=cu, linkedin_how="fixed_truncated", linkedin_other=ex)
            else:
                efit = slug_name_sim(o["org_name"], c["domain"], es) if "/school/" not in ex and not es.isdigit() else 0
                if fit >= 0.5 and fit > efit: row.update(linkedin_final=cu, linkedin_how="replaced_other", linkedin_other=ex)
                else: row.update(linkedin_how="needs_review", linkedin_other=cu)
        elif c and ex: row["linkedin_how"] = "site_only"
        if row["linkedin_how"] == "site_only" and ex and "/company/" not in ex: row["linkedin_how"] = "site_non_company_page"
        row["linkedin_confidence"] = CONF.get(row["linkedin_how"], "low")
        cnt[row["linkedin_how"]] += 1; out.append(row)
    with open(a.out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(out[0])); w.writeheader(); w.writerows(out)
    have = sum(1 for r in out if r["linkedin_final"])
    print(dict(cnt)); print(f"organizations with a LinkedIn link: {have}/{len(out)} ({have * 100 // len(out)}%)  -> {a.out}")


if __name__ == "__main__":
    main()
