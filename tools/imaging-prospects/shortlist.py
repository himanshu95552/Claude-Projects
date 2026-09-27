"""Filter raw Crustdata pulls to outpatient/independent imaging-center people and score them."""
import json, math, re, sys
from pathlib import Path

SP = Path(sys.argv[1])  # work dir holding raw/{rcm,referral,growth}.json
RAW = SP / "raw"

# Employers that matched the name filter but are NOT outpatient/independent imaging centers
# (equipment makers/servicers, AI/teleradiology vendors, billing vendors, labs, academic/hospital systems, other clinics).
BAD_EMPLOYER = re.compile(r"johnson|paradigm|glendor|rad ai|diagnostic robotics|tri-imaging|laborator|labcorp|"
    r"central clinical|pathway diagnostic|kmg|telix|northwestern|washu|mallinckrodt|weill cornell|medstar|"
    r"uva outpatient|au health|shared imaging|mobile imaging solutions|emergency diagnostic|diagnostic pain|"
    r"pbs radiology|real radiology|captive radiology|rapid radiology|tadhealth|alara imaging|united imaging|"
    r"molecular imaging services|omega medical imaging|austin diagnostic clinic|avir|palm springs|threatlocker|"
    r"harvest insurance|society for i", re.I)
# Titles that matched a keyword but are not the target function
BAD_TITLE = re.compile(r"\bhr\b|human resources|engineer|technologist|payer relations|credentialing|analyst|"
    r"intern\b|realtor|real estate|photographer|client support|system analyst|data", re.I)

ROLE_TITLE = {
    "rcm": re.compile(r"revenue cycle|\brcm\b|billing|revenue integrity|business office", re.I),
    "referral": re.compile(r"referral|liaison|physician relations|provider relations|professional relations|outreach|"
                           r"orders management|intake|financial clearance", re.I),
    "growth": re.compile(r"business development|growth|practice development|market development|marketing|sales", re.I),
}
SENIORITY = {"CXO": 6, "Owner / Partner": 5, "Vice President": 5, "Director": 4, "Manager": 3, "Senior": 2, "Entry": 1}
CREDS = re.compile(r"\b(CRCR|CPC|CHFP|CSMC|MBA|MHA|MPH|SPHR|CPMSM|RN|BSN|LSSS|PMP|MAOL|M\.Ed|MSc)\b")
MAX_PER_COMPANY = 3


def pick_role_employer(p, role):
    """The current employer entry that is an imaging org AND carries the role title."""
    best = None
    for e in p.get("current_employers") or []:
        n, t = e.get("name") or "", e.get("title") or ""
        if not re.search(r"imaging|radiolog|mri|diagnostic", n, re.I):
            continue
        if not ROLE_TITLE[role].search(t):
            continue
        if best is None or SENIORITY.get(e.get("seniority_level"), 0) > SENIORITY.get(best.get("seniority_level"), 0):
            best = e
    return best


def work_score(p, e):
    s = SENIORITY.get(e.get("seniority_level"), 1) * 2.0
    t = e.get("title") or ""
    if re.search(r"chief|\bvp\b|vice president|svp|head of", t, re.I): s += 2
    elif re.search(r"director", t, re.I): s += 1.2
    elif re.search(r"manager|lead|supervisor", t, re.I): s += 0.6
    s += min(p.get("years_of_experience_raw") or 0, 30) / 6
    s += min(e.get("years_at_company_raw") or 0, 15) / 5
    s += 0.6 * len(set(CREDS.findall(p.get("name", "") + " " + (p.get("headline") or ""))))
    s += math.log10((p.get("num_of_connections") or 0) + 10) * 0.8
    return round(s, 2)


def main():
    out = {}
    for role in ("rcm", "referral", "growth"):
        data = json.loads((RAW / f"{role}.json").read_text())
        rows = []
        for p in data["profiles"]:
            e = pick_role_employer(p, role)
            if not e:
                continue
            others = [x.get("name") or "" for x in p.get("current_employers") or []]
            if BAD_EMPLOYER.search(e.get("name") or "") or BAD_TITLE.search(e.get("title") or ""):
                continue
            # primary job must be the imaging one: drop people whose other current jobs are in excluded orgs
            if any(BAD_EMPLOYER.search(o) for o in others):
                continue
            rows.append({
                "role": role, "person_id": p["person_id"], "name": p["name"], "headline": p.get("headline"),
                "title": e.get("title"), "company": e.get("name"), "company_domain": e.get("company_website_domain"),
                "company_headcount": e.get("company_headcount_latest"), "seniority": e.get("seniority_level"),
                "years_at_company": e.get("years_at_company_raw"), "region": p.get("region"),
                "connections": p.get("num_of_connections"), "followers": p.get("num_of_followers"),
                "years_experience": p.get("years_of_experience_raw"),
                "linkedin_url": p.get("linkedin_profile_url"), "work_score": work_score(p, e),
            })
        # cap people per company so one large group (e.g. Radiology Partners) cannot dominate
        rows.sort(key=lambda r: -r["work_score"])
        seen, capped = {}, []
        for r in rows:
            k = re.sub(r"[^a-z]", "", r["company"].lower())[:14]
            seen[k] = seen.get(k, 0) + 1
            if seen[k] <= MAX_PER_COMPANY:
                capped.append(r)
        out[role] = capped
        print(f"{role}: {len(data['profiles'])} raw -> {len(rows)} fit -> {len(capped)} after company cap", file=sys.stderr)
    (SP / "shortlist.json").write_text(json.dumps(out, indent=1))


if __name__ == "__main__":
    main()
