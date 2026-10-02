#!/usr/bin/env python3
"""Turn the crawl + Exa search output into the final lead files.

  python3 build_dataset.py --run-dir full_run --out final

Reads  RUN_DIR/results.csv, RUN_DIR/orgs.csv and the raw files in RUN_DIR/ORG*/ .
Writes OUT/people_final.csv        one row per person: status, confidence, evidence, LinkedIn, published contacts
       OUT/orgs_final.csv          one row per organization: socials, phones, emails (site + search results)
       OUT/new_people_candidates.csv  people found for an organization who are not on your list
       OUT/review_needed.csv       weak or risky matches to check by hand
       OUT/summary.txt             counts

Rules: a LinkedIn profile is reported only if its employer matches the organization. Contacts are reported only
if published on the organization's own pages (or the organization's own domain). Data-broker and people-search
sites are never used as a source.
"""
import argparse, collections, csv, html, json, os, re
from pathlib import Path

BROKER = re.compile(r"zoominfo|rocketreach|apollo\.io|contactout|aeroleads|whitepages|spokeo|datanyze|adapt\.io|leadiq|seamless\.ai|salesgear|signalhire|lusha|peopledatalabs|radaris|truepeoplesearch|fastpeoplesearch|beenverified|mylife|intelius|clustrr|unifers|cience\.com|d7leadfinder|anymailfinder|hunter\.io|skrapp|kaspr|wiza|numlooker|411\.com|peoplefinder|nuwber|usphonebook|cocofinder|theorg\.com", re.I)
CRED = re.compile(r"\b(m\.?d\.?|d\.?o\.?|ph\.?d\.?|dr\.?|rn|rt|np|pa-c|fnp-c|dpm|dc)\b", re.I)
WEBWORD = re.compile(r"\b(menu|login|contact|about|services|privacy|policy|transparency|inquiries|information|news|careers|appointments?|billing|patient|health|hospital|clinic|imaging|radiology|center|group|medical|home|search|locations?|physicians?|staff|team|leadership|directory)\b", re.I)
GENERIC = {"radiology", "imaging", "medical", "health", "center", "centre", "group", "associates", "clinic", "hospital", "services",
           "partners", "diagnostic", "physicians", "institute", "healthcare", "care", "systems", "system", "network", "specialists"}
EMAIL = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE = re.compile(r"\(?\b\d{3}\)?[ .-]\d{3}[ .-]\d{4}\b")
JUNK_MAIL = re.compile(r"(sentry\.io|wixpress|example\.com|\.(png|jpe?g|gif|svg|webp)$)|^[0-9a-f]{20,}@", re.I)
RANK = {"org_site": 6, "linkedin_employer": 5, "other_with_org": 4, "linkedin_name_only": 3, "name_only": 2, "broker_only": 1, "none": 0}
CONF = {"org_site": "high", "linkedin_employer": "high", "other_with_org": "medium", "linkedin_name_only": "low", "name_only": "low", "broker_only": "none", "none": "none"}


def dom(u): return re.sub(r"^https?://(www\.)?", "", (u or "").lower()).split("/")[0].split(":")[0]
def name_tokens(name):
    n = CRED.sub(" ", re.sub(r"\(.*?\)", " ", name))
    p = [x.strip(".,") for x in re.split(r"[\s,]+", n) if x.strip(".,")]
    return (p[0], p[-1]) if len(p) >= 2 else None
def org_words(org_name, website):
    w = [x for x in re.findall(r"[a-z]{4,}", org_name.lower()) if x not in GENERIC][:3]
    base = dom(website).split(".")[0]
    if len(base) >= 5: w.append(base)
    return w
def blocks(txt): return txt.split("\nTitle: ")[1:]
def block_url(b):
    m = re.search(r"URL: (\S+)", b); return m.group(1) if m else ""
def headline(b):
    t = b.split("\n", 1)[0].strip()
    t = re.sub(r"\s*[-|]\s*LinkedIn.*$", "", t)
    return t.split(" - ", 1)[1].strip() if " - " in t else ""
def linkedin_url(u):
    m = re.match(r"(https?://[a-z]*\.?linkedin\.com/in/[A-Za-z0-9_%\-]+)", u or "", re.I)
    return "https://www.linkedin.com/in/" + m.group(1).rsplit("/", 1)[1] if m else ""


def nice_headline(b):
    h = headline(b)
    if h: return h
    m = re.search(r"Highlights:\s*\n+#+ [^\n]+\n+([^\n#]{5,140})", b)
    return m.group(1).strip() if m else ""


def score_person(txt, row, o):
    t = name_tokens(row["name"])
    if not t: return {"cls": "none"}
    first, last = t[0].lower(), t[1].lower()
    d = dom(o.get("website", "")); ow = org_words(row["org_name"], o.get("website", ""))
    best = {"cls": "none"}; li_emp = None; li_name = None
    for b in blocks(txt):
        u = block_url(b); ul = u.lower(); bl = b.lower()
        if not (re.search(rf"\b{re.escape(first)}\b", bl) and re.search(rf"\b{re.escape(last)}\b", bl)): continue
        orghit = (d and d in ul) or any(w in bl[:900] for w in ow)
        if BROKER.search(ul): c = "broker_only"
        elif d and d in ul: c = "org_site"
        elif "linkedin.com/in/" in ul: c = "linkedin_employer" if orghit else "linkedin_name_only"
        elif orghit: c = "other_with_org"
        else: c = "name_only"
        if c == "linkedin_employer" and not li_emp: li_emp = (u, nice_headline(b))
        if c == "linkedin_name_only" and not li_name: li_name = (u, nice_headline(b))
        if RANK[c] > RANK[best["cls"]]: best = {"cls": c, "url": u, "block": b}
    out = {"cls": best["cls"]}
    if li_emp: out["linkedin_url"], out["headline"] = linkedin_url(li_emp[0]), li_emp[1]
    elif li_name: out["linkedin_unverified"], out["unverified_headline"] = linkedin_url(li_name[0]), li_name[1]
    if best["cls"] == "none": return out
    b = best["block"]; bl = b.lower(); out["evidence_url"] = best["url"]
    out["retired_flag"] = bool(re.search(r"\bretired\b|\bformer\b|no longer (works|with)", bl[:1200]))
    # a person's own contact: only on the organization's own page, and only a named address that matches their name
    if d and d in best["url"].lower():
        i = bl.find(last)
        win = b[max(0, i - 250): i + 400] if i >= 0 else ""
        base = d.split(":")[0]
        for e in EMAIL.findall(win):
            loc, host = e.lower().split("@")
            if JUNK_MAIL.search(e) or not (host == base or host.endswith("." + base) or base.endswith("." + host) or host.split(".")[-2:] == base.split(".")[-2:]): continue
            if last[:5] in loc or (first[:1] + last[:4]) in loc or first[:4] + "." + last[:3] in loc:
                out["email"] = e.lower(); break
        ph = PHONE.findall(win)
        if ph: out["phone_candidate"] = ph[0]
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run-dir", default="full_run"); ap.add_argument("--out", default="final")
    a = ap.parse_args()
    run, out = Path(a.run_dir), Path(a.out); out.mkdir(exist_ok=True)
    orgs = {r["org_id"]: r for r in csv.DictReader(open(run / "orgs.csv", newline="", encoding="utf-8"))}
    rows = list(csv.DictReader(open(run / "results.csv", newline="", encoding="utf-8")))
    by_org = collections.defaultdict(list)
    for r in rows: by_org[r["org_id"]].append(r)

    people_out, review, stat = [], [], collections.Counter()
    for oid, plist in by_org.items():
        o = orgs.get(oid, {}); d = run / oid
        files = [f for f in os.listdir(d) if f.startswith("person-")] if d.exists() else []
        for r in plist:
            rec = {"org_id": oid, "org_name": r["org_name"], "website": o.get("website", ""), "person_id": r["person_id"], "name": r["name"],
                   "listed_title": r["input_title"], "source_status": r["status"], "confidence": "", "evidence_type": "", "evidence_url": "",
                   "linkedin_url": "", "linkedin_headline": "", "linkedin_unverified": "", "linkedin_match": "", "published_email": "", "published_phone": "", "flag": "", "site_context": ""}
            if r["status"] in ("confirmed_on_site", "possible_on_site"):
                rec.update(confidence="high" if r["status"] == "confirmed_on_site" else "medium", evidence_type="org_site_crawl",
                           evidence_url=o.get("website", ""), site_context=r["site_context"][:240])
            elif r["status"] == "not_searched" and not any(x.startswith(f"person-{r['person_id']}-") for x in files):
                rec.update(confidence="not_searched", evidence_type="not_searched")  # filtered out and never searched
            else:
                f = next((x for x in files if x.startswith(f"person-{r['person_id']}-")), None)
                if not f: rec.update(confidence="not_searched", evidence_type="search_pending")
                else:
                    raw = open(d / f, errors="ignore").read()
                    if "Title:" not in raw and re.search(r"rate limit|api key|exa", raw, re.I):  # Exa refused the search
                        rec.update(confidence="not_searched", evidence_type="search_refused_redo"); stat[rec["confidence"]] += 1; people_out.append(rec); continue
                    sc = score_person(raw, r, o)
                    rec.update(confidence=CONF[sc["cls"]], evidence_type=sc["cls"], evidence_url=sc.get("evidence_url", ""),
                               linkedin_url=sc.get("linkedin_url", ""), linkedin_headline=sc.get("headline", ""),
                               linkedin_unverified=sc.get("linkedin_unverified", ""),
                               published_email=sc.get("email", ""), published_phone=sc.get("phone_candidate", ""),
                               flag="possibly retired/left" if sc.get("retired_flag") else "")
                    if rec["linkedin_url"]:
                        ow_ = org_words(r["org_name"], o.get("website", ""))
                        rec["linkedin_match"] = "employer in headline" if any(w in rec["linkedin_headline"].lower() for w in ow_) else "employer in profile text only"
                    if sc.get("linkedin_unverified"): rec["flag"] = (rec["flag"] + "; LinkedIn employer not verified").strip("; ")
                    if rec["linkedin_url"] and rec["confidence"] in ("low", "none"): rec["confidence"] = "medium"
            stat[rec["confidence"]] += 1; people_out.append(rec)
            if rec["confidence"] in ("low", "none") or rec["flag"]: review.append(rec)

    # a phone that shows up for several people at one organization is the office number, not theirs
    cnt = collections.Counter((r["org_id"], r["published_phone"]) for r in people_out if r["published_phone"])
    org_extra = collections.defaultdict(set)
    for r in people_out:
        if r["published_phone"] and cnt[(r["org_id"], r["published_phone"])] > 1:
            org_extra[r["org_id"]].add(r["published_phone"]); r["published_phone"] = ""
    fields = list(people_out[0].keys())
    for name, data in (("people_final.csv", people_out), ("review_needed.csv", review)):
        with open(out / name, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=fields); w.writeheader(); w.writerows(data)

    # organization-level: site data (already cleaned in orgs.csv) + what the searches found
    org_rows, cand = [], []
    known = collections.defaultdict(set)
    for r in rows: known[r["org_id"]].add(re.sub(r"[^a-z]", "", r["name"].lower()))
    for oid, o in orgs.items():
        d = run / oid
        rec = {k: o.get(k, "") for k in ("org_id", "org_name", "website", "site_pages", "linkedin", "facebook", "instagram", "x", "youtube", "emails_named", "emails_role", "phones")}
        if org_extra.get(oid):
            have_ph = {x.strip() for x in rec["phones"].split(";") if x.strip()}
            rec["phones"] = "; ".join(sorted(have_ph | org_extra[oid])[:6])
        rec["source"] = "website" if o.get("site_pages", "0") not in ("", "0") else "search"
        txt = ""
        for fn in ("org-info.txt", "org-socials.txt", "org-contact.txt", "org-staff.txt"):
            p = d / fn
            if p.exists(): txt += "\n" + p.read_text(errors="ignore")
        if txt:
            ow = org_words(o.get("org_name", ""), o.get("website", "")); dm = dom(o.get("website", ""))
            for b in blocks(txt):
                u = block_url(b); ul = u.lower()
                if BROKER.search(ul): continue
                m = re.match(r"https?://(?:www\.)?linkedin\.com/company/([A-Za-z0-9_\-]+)", u, re.I)
                if m and not rec["linkedin"] and any(w in m.group(1).lower() for w in ow + [dm.split(".")[0]]): rec["linkedin"] = "https://www.linkedin.com/company/" + m.group(1)
                m = re.match(r"https?://(?:www\.)?facebook\.com/([A-Za-z0-9.\-]{3,})/?$", u, re.I)
                if m and not rec["facebook"] and any(w in m.group(1).lower() for w in ow): rec["facebook"] = "https://www.facebook.com/" + m.group(1)
                m = re.match(r"https?://(?:www\.)?instagram\.com/([A-Za-z0-9._]{2,30})/?$", u, re.I)
                if m and not rec["instagram"] and any(w in m.group(1).lower() for w in ow): rec["instagram"] = "https://www.instagram.com/" + m.group(1)
                if dm and dm in ul:
                    if not rec["phones"]:
                        ph = PHONE.findall(b)
                        if ph: rec["phones"] = "; ".join(sorted(set(ph))[:3])
                    em = sorted({e.lower() for e in EMAIL.findall(b) if dom(e.split("@")[1]).endswith(dm.split(":")[0]) and not JUNK_MAIL.search(e)})
                    if em and not rec["emails_named"] and not rec["emails_role"]: rec["emails_role"] = "; ".join(em[:3])
                # people found for this organization who are not on your list
                add = []
                nm_re = r"[A-Z][A-Za-z.'’\-]+(?: [A-Z][A-Za-z.'’\-]*\.?){1,3}"
                t0 = b.split("\n", 1)[0].strip()
                orghit_b = (dm and dm in ul) or any(w in b.lower()[:900] for w in ow)
                if "linkedin.com/in/" in ul and orghit_b:
                    add.append((t0.split(" - ")[0].strip(), nice_headline(b), linkedin_url(u), "linkedin"))
                elif orghit_b and not BROKER.search(ul):
                    m = re.match(rf"^({nm_re}),? (MD|M\.D\.|DO|D\.O\.|PhD|NP|PA-C|RN|DPM)\b", t0)
                    if m: add.append((m.group(1), m.group(2), "", "org_page_title"))
                    if dm and dm in ul:
                        for m in re.finditer(rf"({nm_re})(?:, | - |\n+)((?:Chief|Director|Manager|President|CEO|COO|CFO|CIO|Administrator|Owner|Supervisor|Vice President|VP|Head|Medical Director|Practice Administrator|Office Manager)[^\n,.;|]{{0,60}})", b):
                            add.append((m.group(1), m.group(2).strip(), "", "org_page_text"))
                for nm, ttl, li, how in add:
                    key = re.sub(r"[^a-z]", "", re.sub(CRED, " ", nm.lower()))
                    first_tok = nm.split()[0].strip(".,").lower() if nm.split() else ""
                    if len(nm.split()) < 2 or len(nm) > 45 or WEBWORD.search(nm) or not key or key in known[oid] \
                       or first_tok in ("md", "do", "rn", "np", "pa", "phd", "dr", "mr", "mrs", "ms", "chief", "vice", "senior", "director") or nm.split()[-1].strip(".,").lower() in ("md", "do", "rn", "president", "officer"): continue
                    cand.append({"org_id": oid, "org_name": o.get("org_name", ""), "name": nm, "title_or_credential": ttl, "linkedin_url": li,
                                 "found_via": how, "evidence_url": u})
                    known[oid].add(key)
        org_rows.append(rec)
    with open(out / "orgs_final.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(org_rows[0].keys())); w.writeheader(); w.writerows(org_rows)
    with open(out / "new_people_candidates.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["org_id", "org_name", "name", "title_or_credential", "linkedin_url", "found_via", "evidence_url"]); w.writeheader(); w.writerows(cand)

    n = len(people_out)
    have = lambda k: sum(1 for r in org_rows if r[k])
    lines = [f"people: {n}", *(f"  {k or 'blank'}: {v} ({v / n:.0%})" for k, v in stat.most_common()),
             f"with LinkedIn (employer-verified): {sum(1 for r in people_out if r['linkedin_url'])}",
             f"with published business email: {sum(1 for r in people_out if r['published_email'])}  phone: {sum(1 for r in people_out if r['published_phone'])}",
             f"flagged for review: {len(review)}", f"organizations: {len(org_rows)}",
             *(f"  org {k}: {have(k)}" for k in ("linkedin", "facebook", "instagram", "x", "youtube", "emails_named", "emails_role", "phones")),
             f"new-people candidates: {len(cand)}"]
    (out / "summary.txt").write_text("\n".join(lines)); print("\n".join(lines)); print(f"\nwrote files to {out}/")


if __name__ == "__main__":
    main()
