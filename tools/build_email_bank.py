#!/usr/bin/env python3
"""Keep every business email we have collected, even when we do not know the person yet. FREE.

  python3 build_email_bank.py --final final --lists data

Reads every .txt / .csv email list in --lists (one email per line, or a CSV with an `email` column and optional name, company,
apollo_status), plus final/matched_emails.csv, and writes final/email_bank.csv. The bank only grows: running it again adds
new emails and keeps what you or later steps already filled in (name_confirmed, title, linkedin, notes).

Columns: email, domain, org_id, org_name, kind (personal / generic), guessed_first, guessed_last, guess_confidence,
source, status (matched = already one of our people / unmatched = person not in our list yet), person_id,
name_confirmed, title, linkedin, notes, added

guessed_first / guessed_last come only from clear first.last / first_last addresses (marked high). Everything else is left
blank: a guess like "ldavis" is not turned into a name. Use the bank later to find the person (company LinkedIn page,
a reverse-email lookup, a name search at that organization) and fill name_confirmed + title.
"""
import argparse, csv, glob, os, re, datetime

dom = lambda u: re.sub(r"^https?://(www\.)?", "", (u or "").strip().lower()).split("/")[0]
GENERIC = {"info", "contact", "support", "admin", "sales", "hello", "careers", "billing", "office", "help", "hr", "marketing", "noreply",
           "media", "appointments", "referrals", "scheduling", "ms"}
FIELDS = ["email", "domain", "org_id", "org_name", "kind", "guessed_first", "guessed_last", "guess_confidence", "source", "status",
          "person_id", "name_confirmed", "title", "linkedin", "notes", "added"]


def read(path):
    out = []
    if path.lower().endswith(".csv"):
        for r in csv.DictReader(open(path, newline="", encoding="utf-8-sig")):
            if (r.get("email") or r.get("work_email") or "").strip():
                out.append({"email": (r.get("email") or r.get("work_email")).strip().lower(), "name": r.get("name", ""), "company": r.get("company", "")})
    else:
        for line in open(path, encoding="utf-8-sig"):
            m = re.search(r"[\w.+'-]+@[\w.-]+\.\w+", line)
            if m: out.append({"email": m.group(0).lower(), "name": "", "company": ""})
    return out


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--final", default="final"); ap.add_argument("--lists", default="data")
    ap.add_argument("--orgs", default=""); a = ap.parse_args()
    F = lambda n: os.path.join(a.final, n)
    orgs_path = a.orgs or (F("orgs_with_linkedin.csv") if os.path.exists(F("orgs_with_linkedin.csv")) else F("orgs_final.csv"))
    by_dom = {}
    for o in csv.DictReader(open(orgs_path, newline="", encoding="utf-8")):
        if dom(o.get("website")): by_dom.setdefault(dom(o["website"]), o)
    bank = {r["email"]: r for r in csv.DictReader(open(F("email_bank.csv"), newline="", encoding="utf-8"))} if os.path.exists(F("email_bank.csv")) else {}
    matched = {r["work_email"].lower(): r for r in csv.DictReader(open(F("matched_emails.csv"), newline="", encoding="utf-8"))} if os.path.exists(F("matched_emails.csv")) else {}
    today = datetime.date.today().isoformat(); new = 0
    for path in sorted(glob.glob(os.path.join(a.lists, "*.txt")) + glob.glob(os.path.join(a.lists, "*.csv"))):
        for r in read(path):
            e = r["email"]; local, _, d = e.partition("@"); d = dom(d)
            if e in bank: continue
            o = by_dom.get(d, {}); base = re.sub(r"\d+$", "", local)
            m = re.fullmatch(r"([a-z]{2,})[._]([a-z]{2,})", base)
            kind = "generic" if base in GENERIC else "personal"
            row = {k: "" for k in FIELDS}
            row.update(email=e, domain=d, org_id=o.get("org_id", ""), org_name=o.get("org_name", r["company"]), kind=kind, source=os.path.basename(path), added=today,
                       status="unmatched")
            if m and kind == "personal": row.update(guessed_first=m.group(1).title(), guessed_last=m.group(2).title(), guess_confidence="high")
            if r["name"]: row["name_confirmed"] = r["name"]
            bank[e] = row; new += 1
    for e, row in bank.items():
        if e in matched:
            row.update(status="matched", person_id=matched[e]["person_id"], name_confirmed=row.get("name_confirmed") or matched[e]["name"])
    rows = sorted(bank.values(), key=lambda r: (r["domain"], r["email"]))
    with open(F("email_bank.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS); w.writeheader(); w.writerows(rows)
    st = {}
    for r in rows: st[r["status"]] = st.get(r["status"], 0) + 1
    print(f"email bank: {len(rows)} emails ({new} new), {st}; "
          f"{sum(1 for r in rows if r['guess_confidence'])} with a clear name guess, {sum(1 for r in rows if r['kind']=='generic')} generic -> {F('email_bank.csv')}")


if __name__ == "__main__":
    main()
