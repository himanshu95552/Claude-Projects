#!/usr/bin/env python3
"""Clean the people CSV: drop web-menu / organization-name rows and duplicates, decode HTML
leftovers, move credentials and stray emails out of the name field.

  python3 clean_people.py ~/Downloads/target-organization-people.csv

Writes people_cleaned.csv and people_removed.csv (with a reason per row) next to the input.
Review people_removed.csv before relying on the cleaned file.
"""
import csv, collections, html, re, sys
from pathlib import Path

WEB = re.compile(r"\b(menu|login|log in|sign in|home|contact us|about us|careers|faq'?s?|privacy|policy|directory|appointments?|request|click here|expo|editorial|staff|team|board of directors|department|billing|search|newsletter|news|blog)\b", re.I)
ORGW = re.compile(r"\b(health|healthcare|hospital|clinic|clinics|center|centre|centres|imaging|radiology|llc|inc|ltd|l\.l\.c|associates|group|institute|medical|surgical|physicians|partners|services|systems|pllc|pc|corp|company|foundation|authority|laboratory|diagnostic|diagnostics|wellness)\b", re.I)
STRONG = re.compile(r"^(M\.?D\.?|D\.?O\.?|D\.?C\.?|D\.?D\.?S\.?|D\.?M\.?D\.?|Ph\.?D\.?|FNP(-C)?|AGNP|PNP|CNM|N\.?P\.?|P\.?A\.?(-C)?|R\.?N\.?|DPM|DNP|CRNA|APRN|PT|DPT)\b", re.I)
EMAIL = re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+")
PERSON = re.compile(r"^([A-Z][A-Za-z.'’\-]+(?: [A-Z][A-Za-z.'’\-]*\.?){1,3}),\s*(.+)$")
LAST_STOP = set("""transparency inquiries inquiry estimates estimate information relations navigation account contacts contact counsel
office opportunities listings story stories menu resources forms portal policy policies updates events news careers hours directions locations
location services specialties procedures results insurance payment payments financial assistance coverage rights notice practices
compliance feedback support help faq faqs testimonials reviews videos gallery education research residency fellowship program programs
newsroom press media blog donate giving volunteer guide guides tools tour visitors patients referrals appointments statements
arrow arrows icon icons toggle tabs
questions phone fax email e-mail number admin content campus dept description requirements seeker seekers application form tool list checker estimator""".split())
FIRST_STOP = set("chevron skip back next previous close expand toggle general main media price job share my online quick request schedule book view learn meet our about home contact patient find".split())
SPAM = {"Ferdi, Bali", "Gigi, Solo", "Yudi, Bandung", "Ambre, Radhey"}
FILL = ("title", "email", "phone", "linkedin", "facebook", "instagram", "x_twitter")


def unesc(s):
    for _ in range(2):
        s = html.unescape(s)
    return re.sub(r"\s+", " ", s).strip()


def main(src):
    rows = list(csv.DictReader(open(src, newline="", encoding="utf-8")))
    fields = list(rows[0].keys())
    kept, removed, stat = [], [], collections.Counter()

    def drop(r, n, why):
        o = dict(r); o["name"] = n; o["removed_reason"] = why; removed.append(o)

    for r in rows:
        n0 = r["name"]; n = unesc(n0); note = []
        if n != n0: note.append("html_fixed")
        if n in SPAM:
            drop(r, n, "place-name/spam row"); continue
        orglike = bool(WEB.search(n) or ORGW.search(n) or " & " in n)
        m = PERSON.match(n)
        if m:
            before, after = m.group(1), m.group(2).lstrip(" -")
            strong = bool(STRONG.match(after) or EMAIL.search(after.split(",")[0]))
            before_orgish = bool(WEB.search(before) or ORGW.search(before))
            toks = [t.strip() for t in after.split(",") if t.strip()]
            credlike = len(toks) <= 8 and all(len(t) <= 14 and len(t.split()) <= 2 for t in toks)
            if (strong and (not before_orgish or STRONG.match(after))) or (not orglike and credlike):
                em = EMAIL.search(after)
                if em and not r["email"]:
                    r["email"] = em.group(0); note.append("email_from_name")
                cred = "" if em else re.sub(r"\s*-\s*.*$", "", after).split("medical director")[0].strip(" ,")
                if cred and len(cred) <= 40 and not EMAIL.search(cred):
                    r["credentials"] = r["credentials"] or cred
                if len(after) > 40 and not em and not r["title"]:
                    r["title"] = after[:120]; note.append("title_from_name")
                n = before; note.append("creds_split"); orglike = False
        w0 = n.split()
        has_initial = any(re.fullmatch(r"[A-Z]\.?", t) for t in w0)  # "My T. Nguyen" is a person, not a label
        if w0 and not has_initial and ((w0[-1].lower().strip(".,") in LAST_STOP and len(w0) <= 3) or (w0[0].lower() in FIRST_STOP and len(w0) <= 2)):
            drop(r, n, "website label"); continue
        if orglike or re.search(r"\d", n):
            drop(r, n, "web/org-like name"); continue
        words = n.split()
        if len(words) > 5 or len(n) > 45:
            drop(r, n, "long non-person string"); continue
        if len(words) < 2: note.append("REVIEW_single_word")
        r["name"] = n; r["clean_note"] = ";".join(note)
        kept.append(r)

    groups = collections.defaultdict(list)
    for r in kept:
        groups[(re.sub(r"[^a-z]", "", r["name"].lower()), r["org_id"])].append(r)
    score = lambda r: sum(bool(r[c]) for c in FILL)
    keep_ids = set()
    for v in groups.values():
        v.sort(key=lambda r: -score(r)); best = v[0]; keep_ids.add(best["person_id"])
        for o in v[1:]:
            for c in FILL:
                if not best[c] and o[c]: best[c] = o[c]
            drop(o, o["name"], "duplicate of " + best["person_id"])
    final = [r for r in kept if r["person_id"] in keep_ids]

    out = Path(src).parent
    with open(out / "people_cleaned.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields + ["clean_note"]); w.writeheader(); w.writerows(final)
    with open(out / "people_removed.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields + ["removed_reason"], extrasaction="ignore"); w.writeheader(); w.writerows(removed)
    print(f"input {len(rows)}  kept {len(final)}  removed {len(removed)}")
    print(dict(collections.Counter(r["removed_reason"].split(" of ")[0] for r in removed)))
    print(f"wrote {out/'people_cleaned.csv'} and {out/'people_removed.csv'}")


if __name__ == "__main__":
    if len(sys.argv) != 2: sys.exit(__doc__)
    main(sys.argv[1])
