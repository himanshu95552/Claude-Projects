#!/usr/bin/env python3
"""Look up WORK (business) emails for people we already have a LinkedIn profile URL for, using Crustdata.
Business email only: personal emails and phone numbers are never requested, and are dropped if the API returns them.
Cost: roughly 1 credit per person found (+0.5 if --verified). Start with --limit 20. Needs a plan that allows contact data.

  read -s CRUSTDATA_KEY; export CRUSTDATA_KEY
  python3 crustdata_work_email.py --people final/people_with_crustdata.csv --orgs final/orgs_final.csv --out final/work_emails.csv --limit 20   # add --decision-makers-only for the full run

Output columns: person_id, org_id, name, linkedin_url, work_email, domain_matches_org (does the email's domain match the
organization's website: yes / no), note. Rows already in --out are skipped on re-run.

ASSUMPTIONS (verify with the first run): POST https://api.crustdata.com/person/enrich, headers Authorization: Bearer <key>,
x-api-version: 2025-11-01, body {professional_network_profile_urls: [<=25], fields: ["contact.business_emails"]}.
Any API error text is printed so the field name can be corrected quickly. The first raw reply is saved to <out>.raw.json.
"""
import argparse, csv, json, os, re, sys, time, urllib.error, urllib.request

try:
    import truststore; truststore.inject_into_ssl()
except ImportError:
    pass

URL = "https://api.crustdata.com/person/enrich"
EMAIL = re.compile(r"^[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")
DM = re.compile(r"\b(chief|ceo|coo|cfo|cio|cmo|cto|president|vice president|vp|owner|partner|administrator|director|manager|head of|supervisor|officer|controller|coordinator|executive|operations|billing|revenue|information technology|marketing|business development|practice|lead|medical director|radiologist)\b", re.I)
dom = lambda u: re.sub(r"^https?://(www\.)?", "", (u or "").strip().lower()).split("/")[0]


def business_emails(obj):
    """Collect strings that look like emails under keys naming a BUSINESS email; never personal ones."""
    out = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            kl = k.lower()
            if "personal" in kl or "phone" in kl: continue
            if "business" in kl or "work" in kl:
                out += [x for x in flatten(v) if EMAIL.match(x)]
            else: out += business_emails(v)
    elif isinstance(obj, list):
        for v in obj: out += business_emails(v)
    return out


def flatten(v):
    if isinstance(v, str): return [v]
    if isinstance(v, list): return [y for x in v for y in flatten(x)]
    if isinstance(v, dict): return [y for x in v.values() for y in flatten(x)]
    return []


def call(urls, key, verified):
    body = {"professional_network_profile_urls": urls, "fields": ["contact.business_emails"]}
    req = urllib.request.Request(URL, data=json.dumps(body).encode(), method="POST",
        headers={"Authorization": f"Bearer {key}", "x-api-version": "2025-11-01", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=90) as r: return json.loads(r.read())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"HTTP {e.code}: {e.read().decode('utf-8', 'ignore')[:500]}") from None


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--people", required=True); ap.add_argument("--orgs", required=True)
    ap.add_argument("--out", required=True); ap.add_argument("--limit", type=int, default=20, help="people to look up (0 = all)")
    ap.add_argument("--decision-makers-only", action="store_true", help="only people whose title looks like a decision-maker")
    ap.add_argument("--verified", action="store_true", help="ask for deliverability-checked emails only (costs 0.5 more per hit)")
    a = ap.parse_args()
    key = os.environ.get("CRUSTDATA_KEY") or sys.exit("set CRUSTDATA_KEY (read -s CRUSTDATA_KEY; export CRUSTDATA_KEY)")
    web = {o["org_id"]: dom(o["website"]) for o in csv.DictReader(open(a.orgs, newline="", encoding="utf-8"))}
    done = set()
    if os.path.exists(a.out): done = {r["person_id"] for r in csv.DictReader(open(a.out, newline="", encoding="utf-8"))}
    todo = [p for p in csv.DictReader(open(a.people, newline="", encoding="utf-8"))
            if (p.get("linkedin_final") or "").strip() and p["person_id"] not in done and p.get("linkedin_source") != "CONFLICT"]
    title = lambda p: (p.get("title_final") or p.get("listed_title") or p.get("title") or "")
    todo.sort(key=lambda p: 0 if DM.search(title(p)) else 1)   # decision-makers first, always
    if a.decision_makers_only: todo = [p for p in todo if DM.search(title(p))]
    print(f"{sum(1 for p in todo if DM.search(title(p)))} decision-makers among {len(todo)} people to look up")
    if a.limit: todo = todo[: a.limit]
    new = not os.path.exists(a.out)
    f = open(a.out, "a", newline="", encoding="utf-8")
    w = csv.DictWriter(f, fieldnames=["person_id", "org_id", "name", "linkedin_url", "work_email", "domain_matches_org", "note"])
    if new: w.writeheader()
    found = 0
    for i in range(0, len(todo), 25):
        chunk = todo[i:i + 25]; urls = [p["linkedin_final"].strip() for p in chunk]
        try: resp = call(urls, key, a.verified)
        except Exception as e: sys.exit(f"API call failed ({e}). Finished rows are saved; re-run to continue.")
        if i == 0 and new: open(a.out + ".raw.json", "w").write(json.dumps(resp, indent=1)[:60000])
        by = {}
        for item in (resp if isinstance(resp, list) else resp.get("results", [])):
            em = business_emails(item.get("matches", []))
            by[(item.get("matched_on") or "").lower().rstrip("/")] = em
        for p in chunk:
            em = by.get(p["linkedin_final"].strip().lower().rstrip("/"), [])
            e = em[0] if em else ""
            d = dom(e.split("@")[-1]) if e else ""
            ow = web.get(p["org_id"], "")
            match = "" if not e else ("yes" if ow and (d == ow or d.endswith("." + ow) or ow.endswith("." + d)) else "no")
            w.writerow({"person_id": p["person_id"], "org_id": p["org_id"], "name": p["name"], "linkedin_url": p["linkedin_final"],
                        "work_email": e, "domain_matches_org": match, "note": "" if e else "no business email returned"})
            found += bool(e)
        f.flush(); print(f"{min(i + 25, len(todo))}/{len(todo)} looked up, {found} work emails so far", flush=True); time.sleep(0.5)
    print(f"done: {found} work emails for {len(todo)} people -> {a.out}")


if __name__ == "__main__":
    main()
