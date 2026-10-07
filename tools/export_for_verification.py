#!/usr/bin/env python3
"""List the probable-but-unconfirmed work emails so a verifier (Emailable, ZeroBounce, Reacher ...) can check them. FREE.

  python3 export_for_verification.py --people final/people_with_emails.csv --out final/verify_these.csv [--chunk-size 1000] [--limit 0] [--skip 'final/verify_these*.csv']

Picks people whose email came from a list match (medium), a pattern guess, or a Hunter email on another domain.
Imaging / radiology organizations come first, then decision-makers. One row per unique email.
Columns: email, person_id, name, organization, title, how, priority.
After the verifier returns its file, run build_work_emails.py with  --verification "<file>:<email column>:<status column>"
(add it once per file; for Reacher use --verification-valid-only so a wrong 'invalid' never deletes an address).
"""
import argparse, csv, os, re

IMG = re.compile(r"radiolog|imaging|\bmri\b|\bct\b|diagnostic|ultrasound|nuclear|pet\b|scan|rad\b|rads\b|radnet|rayus|akumin", re.I)
DM = re.compile(r"\b(chief|ceo|coo|cfo|president|vice president|vp|owner|partner|founder|administrator|director|manager|head of|officer|executive|medical director)\b", re.I)


def needs_check(p):
    how, conf = p.get("work_email_how", ""), p.get("work_email_confidence", "")
    return conf in ("medium", "unproven") and (how.startswith("listed_") or how in ("pattern_unverified", "finder_other_domain"))


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--people", default="final/people_with_emails.csv"); ap.add_argument("--out", default="final/verify_these.csv")
    ap.add_argument("--chunk-size", type=int, default=0); ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--skip", action="append", default=[], help="an earlier verify_these*.csv (or a verifier result with an email column): those emails are left out. Repeatable; wildcards are fine")
    a = ap.parse_args()
    import glob
    seen, rows = set(), []
    for pat in a.skip:
        for path in glob.glob(os.path.expanduser(pat)):
            for r in csv.DictReader(open(path, newline="", encoding="utf-8-sig")):
                em = (r.get("email") or r.get("Email") or r.get("Email Address") or "").strip().lower()
                if em: seen.add(em)
    for p in csv.DictReader(open(a.people, newline="", encoding="utf-8")):
        e = (p.get("work_email_final") or "").strip().lower()
        if not e or e in seen or not needs_check(p): continue
        seen.add(e)
        org = p.get("org_name", ""); t = p.get("title_final") or p.get("listed_title") or ""
        rows.append({"email": e, "person_id": p["person_id"], "name": p.get("name", ""), "organization": org, "title": t, "how": p["work_email_how"],
                     "priority": (0 if IMG.search(org + " " + p.get("website", "")) else 1, 0 if DM.search(t) else 1)})
    rows.sort(key=lambda r: r["priority"])
    if a.limit: rows = rows[:a.limit]
    for r in rows: r["priority"] = f"{r['priority'][0]}{r['priority'][1]}"
    fields = ["email", "person_id", "name", "organization", "title", "how", "priority"]
    parts = [rows[i:i + a.chunk_size] for i in range(0, len(rows), a.chunk_size)] if a.chunk_size > 0 else [rows]
    base, ext = os.path.splitext(a.out)
    for n, part in enumerate(parts, 1):
        path = a.out if len(parts) == 1 else f"{base}_{n:03d}{ext}"
        with open(path, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=fields); w.writeheader(); w.writerows(part)
        print(f"  {len(part):>5} emails -> {path}")
    img = sum(1 for r in rows if r["priority"][0] == "0")
    print(f"{len(rows)} emails to verify ({img} at imaging/radiology organizations first)")


if __name__ == "__main__":
    main()
