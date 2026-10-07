#!/usr/bin/env python3
"""Infer likely WORK email addresses from each organization's own published pattern. FREE, no API calls.

  python3 infer_email_patterns.py --people final/people_final.csv --orgs final/orgs_final.csv --out final/inferred_emails.csv

How: for each organization, look at the named business emails we actually found (a person's published_email, plus the
organization's emails_named when the part before @ fits one of our people's names). If they agree on one pattern
(first.last, flast, firstl, ...), apply it to the other people at that organization.
Every row is INFERRED and UNVERIFIED. Also writes <out>_to_verify_all.csv and <out>_to_verify_decision_makers.csv (one 'email' column) for a verification service. Verify before sending (see notes in the chat: a verification service, or
Crustdata's reverse-email lookup). Domains where inference fails or patterns conflict are skipped.
"""
import argparse, csv, collections, re

dom = lambda u: re.sub(r"^https?://(www\.)?", "", (u or "").strip().lower()).split("/")[0]
CRED = re.compile(r"\b(m\.?d\.?|d\.?o\.?|ph\.?d\.?|r\.?n\.?|rt|rdms|rrt|dr|jr|sr|ii|iii|np|pa-c|crna|dpt|mba|msn|bsn|facr)\b\.?", re.I)
PATTERNS = {
    "first.last": lambda f, l: f"{f}.{l}", "flast": lambda f, l: f"{f[0]}{l}", "firstlast": lambda f, l: f"{f}{l}",
    "f.last": lambda f, l: f"{f[0]}.{l}", "firstl": lambda f, l: f"{f}{l[0]}", "first.l": lambda f, l: f"{f}.{l[0]}",
    "last.first": lambda f, l: f"{l}.{f}", "lastf": lambda f, l: f"{l}{f[0]}", "first": lambda f, l: f, "last": lambda f, l: l,
    "first_last": lambda f, l: f"{f}_{l}", "f_last": lambda f, l: f"{f[0]}_{l}",
}


def fl(name):
    t = [x for x in re.findall(r"[a-z]+", CRED.sub(" ", re.sub(r"\(.*?\)", " ", (name or "").lower()))) if len(x) > 1]
    return (t[0], t[-1]) if len(t) >= 2 else None


def local_domain(e):
    e = (e or "").strip().lower(); return tuple(e.split("@", 1)) if "@" in e else None


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--people", required=True); ap.add_argument("--orgs", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--extra-emails", default="", help="work_emails.csv from crustdata_work_email.py: its emails (domain_matches_org = yes) count as evidence and as known emails")
    ap.add_argument("--domain-lists", action="append", default=[], help="text/CSV of known emails at a domain (e.g. Hunter or Snov domain search). A domain where >=70% of >=5 addresses share one shape (first.last, first.l, f.last, first_last) gets that pattern, for organizations with no other evidence")
    ap.add_argument("--domain-patterns", default="", help="CSV domain,pattern[,source]: a pattern a finder tool states for a domain (e.g. Hunter shows flast@domain). Used only where there is no other evidence")
    a = ap.parse_args()
    tool_pat = {}
    if a.domain_patterns and __import__("os").path.exists(a.domain_patterns):
        tool_pat = {r["domain"].strip().lower(): r["pattern"].strip() for r in csv.DictReader(open(a.domain_patterns, newline="", encoding="utf-8")) if r.get("pattern", "").strip() in PATTERNS}
    dpat, dshape = {}, {}
    SHAPE_OF = {"first.last": "first.last", "first.l": "first.l", "f.last": "f.last", "first_last": "first_last"}   # every other pattern is a single token (flast, first, lastf ...)
    if a.domain_lists:
        cnt = collections.defaultdict(collections.Counter)
        SHAPES = [("first.last", r"[a-z]{2,}\.[a-z]{2,}"), ("first.l", r"[a-z]{2,}\.[a-z]"), ("f.last", r"[a-z]\.[a-z]{2,}"), ("first_last", r"[a-z]{2,}_[a-z]{2,}")]
        for path in a.domain_lists:
            for line in open(path, encoding="utf-8-sig"):
                m = re.search(r"[\w.+'-]+@[\w.-]+\.\w+", line)
                if not m: continue
                loc, d = m.group(0).lower().split("@")
                if loc in ("info", "contact", "support", "admin", "sales", "hello", "careers", "billing", "office"): continue
                loc = re.sub(r"\d+$", "", loc)
                cnt[dom(d)][next((n for n, rx in SHAPES if re.fullmatch(rx, loc)), "single" if re.fullmatch(r"[a-z]{3,}", loc) else "other")] += 1
        for d, c in cnt.items():
            n = sum(c.values()); pat, k = c.most_common(1)[0]
            if pat not in ("other", "single") and n >= 5 and k / n >= 0.7: dpat[d] = (pat, k, n)
        dshape = cnt
        print("domain patterns from lists:", {d: f"{p} {x}/{n}" for d, (p, x, n) in dpat.items()})
    orgs = {o["org_id"]: o for o in csv.DictReader(open(a.orgs, newline="", encoding="utf-8"))}
    ppl = list(csv.DictReader(open(a.people, newline="", encoding="utf-8")))
    if a.extra_emails and __import__("os").path.exists(a.extra_emails):
        known = {r["person_id"]: r["work_email"] for r in csv.DictReader(open(a.extra_emails, newline="", encoding="utf-8"))
                 if r.get("work_email") and r.get("domain_matches_org") == "yes"}
        for p in ppl:
            if p["person_id"] in known and not p.get("published_email"): p["published_email"] = known[p["person_id"]]
    by_org = collections.defaultdict(list)
    for p in ppl: by_org[p["org_id"]].append(p)
    out, stats = [], collections.Counter()
    for oid, people in by_org.items():
        o = orgs.get(oid); site = dom(o["website"]) if o else ""
        if not site: stats["no_website"] += 1; continue
        evid, domains = [], collections.Counter()   # (pattern, example email)
        cands = [(p["name"], p.get("published_email", ""), p["person_id"]) for p in people if p.get("published_email")]
        for e in re.split(r"[;,\s|]+", (o.get("emails_named") or "")):
            if "@" in e: cands += [(p["name"], e, p["person_id"]) for p in people if fl(p["name"]) and fl(p["name"])[1] in e.lower().split("@")[0]]
        for name, e, _pid in cands:
            ld = local_domain(e); k = fl(name)
            if not ld or not k: continue
            for pn, fn in PATTERNS.items():
                if fn(*k) == ld[0]: evid.append((pn, e)); domains[ld[1]] += 1
        if not evid and site in dpat:
            evid = [(dpat[site][0], f"domain list ({dpat[site][1]}/{dpat[site][2]} addresses)")] * dpat[site][1]; domains[site] = dpat[site][1]
            stats["from_domain_list"] += 1
        if not evid and site in tool_pat:
            evid = [(tool_pat[site], "pattern stated by a finder tool")] * 2; domains[site] = 2; stats["from_tool_pattern"] += 1
        if not evid: stats["no_evidence"] += 1; continue
        votes = collections.Counter(pn for pn, _ in evid)
        top = votes.most_common(2)
        if len(top) > 1 and top[0][1] == top[1][1]: stats["conflicting_pattern"] += 1; continue
        pat, n = top[0]; edom = domains.most_common(1)[0][0]
        c = dshape.get(site)
        if c and sum(c.values()) >= 5 and c[SHAPE_OF.get(pat, "single")] / sum(c.values()) < 0.7:
            stats["mixed_domain_skipped"] += 1; continue   # the domain list shows several address shapes: do not spread one pattern to everyone
        have = {pid for _n, _e, pid in cands}  # people who already have a known email
        for p in people:
            if p["person_id"] in have: continue
            k = fl(p["name"])
            if not k: continue
            out.append({"person_id": p["person_id"], "org_id": oid, "name": p["name"], "inferred_email": f"{PATTERNS[pat](*k)}@{edom}",
                        "pattern": pat, "evidence_count": n, "example": evid[0][1], "status": "inferred_unverified"})
        stats["orgs_inferred"] += 1
    if out:
        with open(a.out, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=list(out[0])); w.writeheader(); w.writerows(out)
        base = re.sub(r"\.csv$", "", a.out)
        DMX = re.compile(r"\b(chief|ceo|coo|cfo|cio|cmo|cto|president|vice president|vp|owner|partner|administrator|director|manager|head of|supervisor|officer|controller|coordinator|executive|operations|billing|revenue|practice|lead|radiologist)\b", re.I)
        title = {p["person_id"]: (p.get("title_final") or p.get("listed_title") or p.get("title") or "") for p in ppl}
        for suffix, rows in (("_to_verify_all.csv", out), ("_to_verify_decision_makers.csv", [r for r in out if DMX.search(title.get(r["person_id"], ""))])):
            em = sorted({r["inferred_email"] for r in rows})
            with open(base + suffix, "w", newline="", encoding="utf-8") as f:
                w = csv.writer(f); w.writerow(["email"]); w.writerows([[e] for e in em])
            print(f"upload list: {len(em)} unique emails -> {base + suffix}")
    print(dict(stats), f"-> {len(out)} inferred emails -> {a.out}")


if __name__ == "__main__":
    main()
