#!/usr/bin/env python3
"""Pull each organization's CURRENT employees from Crustdata (people dataset search) and compare with our list.
Costs about 0.03 credits per person returned (no results = no charge). Start with --limit 20.

  read -s CRUSTDATA_KEY; export CRUSTDATA_KEY
  python3 crustdata_roster.py --orgs final/orgs_final.csv --people final/people_final.csv --out final/roster --limit 20

Writes <out>_people.csv (every roster person) and <out>_matches.csv (our people compared with the roster):
  same_title        found, current title agrees with ours
  title_added       found at the organization and we had NO title for them: the found title fills the gap
  title_differs     found at the organization, title wording differs from ours (review: promotion, move, or just different wording)
  ours_not_found    on our list but not in the roster (may have left, or just not on LinkedIn)
  new_candidate     in the roster but not on our list (possible new joiner)

ASSUMPTIONS (verify with the first run): POST https://api.crustdata.com/person/search, headers
Authorization: Bearer <key> and x-api-version: 2025-11-01, body {filters, fields, limit, cursor}.
The first raw response is saved to <out>_raw_first.json so the parser can be fixed quickly if the shape differs.
"""
import argparse, csv, json, os, random, re, sys, time, urllib.error, urllib.request

try:
    import truststore; truststore.inject_into_ssl()
except ImportError:
    pass

URL = "https://api.crustdata.com/person/search"
CREDIT = 0.03
FIELDS = ["basic_profile.name", "basic_profile.headline", "experience.employment_details.current.title",
          "experience.employment_details.current.name", "social_handles.professional_network_identifier.profile_url"]
dom = lambda u: re.sub(r"^https?://(www\.)?", "", (u or "").strip().lower()).split("/")[0]
CRED = re.compile(r"\b(m\.?d\.?|d\.?o\.?|ph\.?d\.?|r\.?n\.?|rt|rdms|rrt|dr|jr|sr|ii|iii|np|pa-c|crna|dpt|mba|msn|bsn|facr)\b\.?", re.I)


def key_name(n):
    t = [x for x in re.findall(r"[a-z]+", CRED.sub(" ", re.sub(r"\(.*?\)", " ", (n or "").lower()))) if len(x) > 1]
    return (t[0], t[-1]) if len(t) >= 2 else None


def dig(d, path):
    for p in path.split("."):
        d = d.get(p) if isinstance(d, dict) else None
    return d


def name_variants(n):
    """Exact-case spellings to ask Crustdata for: the cleaned name, and first + last only (keeps McAneny-style capitals)."""
    clean = re.sub(r"\s+", " ", CRED.sub(" ", re.sub(r"\(.*?\)", " ", n or ""))).strip(" ,.")
    t = [x for x in clean.replace(",", " ").split() if len(x.strip(".")) > 1]
    v = {clean}
    if len(t) >= 2: v.add(f"{t[0]} {t[-1]}")
    return {x for x in v if " " in x}


def search(domain, key, limit, cursor=None, names=None):
    flt = {"field": "experience.employment_details.current.company_website_domain", "type": "=", "value": domain}
    if names: flt = {"op": "and", "conditions": [flt, {"field": "basic_profile.name", "type": "in", "value": sorted(names)}]}
    body = {"filters": flt, "fields": FIELDS, "limit": limit}
    if cursor: body["cursor"] = cursor
    req = urllib.request.Request(URL, data=json.dumps(body).encode(), method="POST",
        headers={"Authorization": f"Bearer {key}", "x-api-version": "2025-11-01", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=90) as r: return json.loads(r.read())
    except urllib.error.HTTPError as e:  # show Crustdata's own explanation, never the key
        raise RuntimeError(f"HTTP {e.code}: {e.read().decode('utf-8', 'ignore')[:400]}") from None


def profiles_of(resp):
    if isinstance(resp, list): return resp
    for k in ("profiles", "results", "data", "people"):
        if isinstance(resp.get(k), list): return resp[k]
    return []


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--orgs", required=True); ap.add_argument("--people", required=True)
    ap.add_argument("--out", required=True); ap.add_argument("--limit", type=int, default=20, help="number of organizations")
    ap.add_argument("--max-per-org", type=int, default=100); ap.add_argument("--max-credits", type=float, default=15.0)
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--mode", choices=["roster", "names"], default="roster",
                    help="roster = pull everyone currently at the organization; names = ask only for the people on OUR list (cheaper, no 100-person cap)")
    ap.add_argument("--domains", default="", help="comma-separated website domains to run instead of a random sample")
    a = ap.parse_args()
    key = os.environ.get("CRUSTDATA_KEY") or sys.exit("set CRUSTDATA_KEY (read -s CRUSTDATA_KEY; export CRUSTDATA_KEY)")
    ours = {}
    for p in csv.DictReader(open(a.people, newline="", encoding="utf-8")): ours.setdefault(p["org_id"], []).append(p)
    orgs = [o for o in csv.DictReader(open(a.orgs, newline="", encoding="utf-8")) if o["org_id"] in ours and "." in dom(o["website"])]
    seen, cand = set(), []
    for o in orgs:  # test set: smaller organizations first (3-40 people), shuffled; one org per domain
        d = dom(o["website"])
        if d not in seen and 3 <= len(ours[o["org_id"]]) <= 40: seen.add(d); cand.append(o)
    random.Random(a.seed).shuffle(cand); cand = cand[: a.limit]
    if a.domains:
        want = {d.strip().lower() for d in a.domains.split(",") if d.strip()}
        cand = [o for o in orgs if dom(o["website"]) in want]; seen2 = set(); cand = [o for o in cand if not (dom(o["website"]) in seen2 or seen2.add(dom(o["website"])))]
    spent, roster_rows, match_rows = 0.0, [], []
    for i, o in enumerate(cand):
        d = dom(o["website"])
        names = set().union(*(name_variants(p["name"]) for p in ours[o["org_id"]])) if a.mode == "names" else None
        if a.mode == "names" and not names: continue
        try: resp = search(d, key, a.max_per_org if a.mode == "roster" else min(1000, max(50, len(names))), names=names)
        except Exception as e: sys.exit(f"API call failed ({e}); check the assumptions in the docstring")
        if i == 0: open(a.out + "_raw_first.json", "w").write(json.dumps(resp, indent=1)[:60000])
        profs = profiles_of(resp); spent += CREDIT * len(profs)
        found = {}
        for p in profs:
            nm = dig(p, "basic_profile.name"); t = dig(p, "experience.employment_details.current.title") or dig(p, "basic_profile.headline") or ""
            url = dig(p, "social_handles.professional_network_identifier.profile_url") or ""
            roster_rows.append({"org_id": o["org_id"], "domain": d, "name": nm, "current_title": t, "headline": dig(p, "basic_profile.headline") or "", "linkedin_url": url})
            k = key_name(nm)
            if k: found[k] = (nm, t, url)
        used = set()
        for p in ours[o["org_id"]]:
            k = key_name(p["name"]); hit = found.get(k) if k else None
            lt = (p.get("listed_title") or p.get("title") or "").strip()
            if hit:
                used.add(k); same = lt and (set(re.findall(r"[a-z]+", lt.lower())) & set(re.findall(r"[a-z]+", hit[1].lower())) - {"of", "the", "and"})
                st = "title_added" if not lt else ("same_title" if same else "title_differs")
                match_rows.append({"org_id": o["org_id"], "domain": d, "name": p["name"], "listed_title": lt, "found_title": hit[1], "linkedin_url": hit[2], "status": st})
            else: match_rows.append({"org_id": o["org_id"], "domain": d, "name": p["name"], "listed_title": lt, "found_title": "", "linkedin_url": "", "status": "ours_not_found"})
        for k, (nm, t, url) in (found.items() if a.mode == "roster" else []):
            if k not in used: match_rows.append({"org_id": o["org_id"], "domain": d, "name": nm, "listed_title": "", "found_title": t, "linkedin_url": url, "status": "new_candidate"})
        print(f"{i + 1}/{len(cand)} {d}: roster {len(profs)}  (credits so far ~{spent:.1f})", flush=True)
        if spent >= a.max_credits: print("credit cap reached, stopping"); break
        time.sleep(0.5)
    for suffix, rows in (("_people.csv", roster_rows), ("_matches.csv", match_rows)):
        if rows:
            with open(a.out + suffix, "w", newline="", encoding="utf-8") as f:
                w = csv.DictWriter(f, fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)
    import collections; print(dict(collections.Counter(r["status"] for r in match_rows)), f"~{spent:.1f} credits")


if __name__ == "__main__":
    main()
