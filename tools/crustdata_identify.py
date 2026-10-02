#!/usr/bin/env python3
"""Find LinkedIn company pages for organizations that lack one, using Crustdata's FREE
company-identify endpoint (domain -> company record). Business data only; no credits used.

  read -s CRUSTDATA_KEY; export CRUSTDATA_KEY
  python3 crustdata_identify.py --orgs final/orgs_final.csv --out final/linkedin_lookup.csv [--limit 50]

ASSUMPTIONS (verify with --limit 25 first): POST https://api.crustdata.com/company/identify,
headers Authorization: Bearer <key> and x-api-version: 2025-11-01, body {"domains": [...]}, max 25 per call.
Status per organization: single (one clean match), ambiguous (several: review), empty (placeholder only), none.
"""
import argparse, csv, json, os, re, sys, time, urllib.request

try:
    import truststore; truststore.inject_into_ssl()
except ImportError:
    pass

URL = "https://api.crustdata.com/company/identify"
dom = lambda u: re.sub(r"^https?://(www\.)?", "", (u or "").strip().lower()).split("/")[0]
SIZE = {"1": 1, "2-10": 2, "11-50": 3, "51-200": 4, "201-500": 5, "501-1000": 6, "1001-5000": 7, "5001-10000": 8, "10001+": 9}


def pick(domain, matches):
    """Return (status, chosen basic_info or None, all candidate summaries)."""
    cands = []
    for m in matches:
        b = (m.get("company_data") or {}).get("basic_info") or {}
        if b.get("professional_network_url") and b.get("name"):
            cands.append(b)
    if not matches: return "none", None, []
    if not cands: return "empty", None, []
    same = [b for b in cands if dom(b.get("primary_domain")) == domain] or cands
    if len(same) == 1 and len(cands) == 1: return "single", same[0], same
    best = sorted(same, key=lambda b: -SIZE.get(b.get("employee_count_range") or "", 0))
    return "ambiguous", best[0], cands


def call(domains, key):
    req = urllib.request.Request(URL, data=json.dumps({"domains": domains}).encode(), method="POST",
        headers={"Authorization": f"Bearer {key}", "x-api-version": "2025-11-01", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--orgs", required=True); ap.add_argument("--out", required=True)
    ap.add_argument("--limit", type=int, default=0, help="only the first N domains (test run)")
    ap.add_argument("--all", action="store_true", help="also look up organizations that already have LinkedIn (to cross-check)")
    a = ap.parse_args()
    key = os.environ.get("CRUSTDATA_KEY") or sys.exit("set CRUSTDATA_KEY (read -s CRUSTDATA_KEY; export CRUSTDATA_KEY)")
    rows = [r for r in csv.DictReader(open(a.orgs, newline="", encoding="utf-8")) if (a.all or not r["linkedin"].strip()) and "." in dom(r["website"])]
    by = {}
    for r in rows: by.setdefault(dom(r["website"]), []).append(r)
    ds = sorted(by)[: a.limit or None]
    out = []
    for i in range(0, len(ds), 25):
        chunk = ds[i:i + 25]
        try: resp = call(chunk, key)
        except Exception as e: sys.exit(f"API call failed ({e}); check the key/endpoint assumptions in the docstring")
        for item in resp:
            d = (item.get("matched_on") or "").lower()
            status, best, cands = pick(d, item.get("matches", []))
            for r in by.get(d, []):
                out.append({"org_id": r["org_id"], "org_name": r["org_name"], "domain": d, "status": status,
                            "linkedin_url": (best or {}).get("professional_network_url", ""), "linkedin_name": (best or {}).get("name", ""),
                            "employees": (best or {}).get("employee_count_range", ""), "existing_linkedin": r["linkedin"],
                            "candidates": " | ".join(f'{c.get("name")} {c.get("professional_network_url")}' for c in cands)})
        print(f"{min(i + 25, len(ds))}/{len(ds)} domains", flush=True); time.sleep(0.5)
    with open(a.out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(out[0])); w.writeheader(); w.writerows(out)
    import collections; print(dict(collections.Counter(o["status"] for o in out)), "->", a.out)


if __name__ == "__main__":
    main()
