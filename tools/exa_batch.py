#!/usr/bin/env python3
"""Run Exa lookups (via mcporter) for chosen organizations and their people.

Saves raw results to OUT/<org_id>/ so they can be sent back for matching and scoring.
Resumable: existing result files are skipped. Use --dry-run to print queries only.

  python3 exa_batch.py --orgs ORG00891,ORG00892 --people people.csv --orgfile orgs.csv
"""
import argparse, csv, subprocess, time, re, json
from pathlib import Path


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60]


def exa(query, n):
    r = subprocess.run(
        ["mcporter", "call", "exa.web_search_exa", f"query={query}", f"numResults={n}"],
        capture_output=True, text=True, timeout=120)
    return r.stdout if r.returncode == 0 else f"ERROR rc={r.returncode}\n{r.stderr}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--orgs", required=True, help="comma-separated org_ids")
    ap.add_argument("--people", required=True)
    ap.add_argument("--orgfile", required=True)
    ap.add_argument("--out", default="exa_out")
    ap.add_argument("--num", type=int, default=5)
    ap.add_argument("--delay", type=float, default=3.0, help="seconds between calls")
    ap.add_argument("--max-people", type=int, default=50, help="per organization")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    orgs = {r["org_id"]: r for r in csv.DictReader(open(a.orgfile, newline="", encoding="utf-8"))}
    people = {}
    for r in csv.DictReader(open(a.people, newline="", encoding="utf-8")):
        people.setdefault(r["org_id"], []).append(r)

    for oid in a.orgs.split(","):
        o = orgs.get(oid)
        if not o:
            print(f"!! unknown org_id {oid}"); continue
        name, site = o["org_name"], o["website"]
        states = o["states"]
        jobs = [
            ("org-socials", f'{name} {site} {states} official LinkedIn Facebook Instagram page'),
            ("org-contact", f'{name} {site} contact phone email address'),
            ("org-staff", f'{name} {site} administrator OR manager OR director OR owner OR radiologist'),
        ]
        for p in people.get(oid, [])[: a.max_people]:
            hint = p["title"] or p["credentials"] or "radiology"
            jobs.append((f'person-{p["person_id"]}-{slug(p["name"])}',
                         f'"{p["name"]}" {hint} {name} {states}'))
        d = Path(a.out) / oid
        d.mkdir(parents=True, exist_ok=True)
        (d / "_org.json").write_text(json.dumps(
            {k: o[k] for k in ("org_id", "org_name", "website", "states", "cities")}, indent=1))
        for tag, q in jobs:
            f = d / f"{tag}.txt"
            if f.exists():
                continue
            print(f"[{oid}] {tag}: {q}")
            if a.dry_run:
                continue
            f.write_text(f"QUERY: {q}\n\n{exa(q, a.num)}")
            time.sleep(a.delay)


if __name__ == "__main__":
    main()
