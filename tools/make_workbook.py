#!/usr/bin/env python3
"""Bundle the final CSVs into one Excel workbook (and a zip of the CSVs as a fallback).

  python3 make_workbook.py --final final --out ~/Downloads/imaging-leads

Sheets: People, Organizations, New people, Needs review, Summary.
Needs: python3 -m pip install openpyxl   (without it only the zip is written)
"""
import argparse, csv, zipfile
from pathlib import Path

SHEETS = [("People", "people_final.csv"), ("Organizations", "orgs_final.csv"),
          ("New people", "new_people_candidates.csv"), ("Needs review", "review_needed.csv")]


def join_facilities(fac, orgs_csv, out_csv):
    """Facilities + the owning organization's enriched columns (matched on org_id)."""
    orgs = {r["org_id"]: r for r in csv.DictReader(open(orgs_csv, newline="", encoding="utf-8"))}
    rows = list(csv.DictReader(open(fac, newline="", encoding="utf-8")))
    ocols = [c for c in next(iter(orgs.values())) if c not in ("org_id",) and c not in rows[0]]
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f); w.writerow(list(rows[0]) + ["org_" + c for c in ocols])
        miss = 0
        for r in rows:
            o = orgs.get(r["org_id"]); miss += o is None
            w.writerow(list(r.values()) + [(o or {}).get(c, "") for c in ocols])
    print(f"  facilities joined to organizations: {len(rows) - miss}/{len(rows)}")


def join_linkedin(orgs_csv, merged_csv, out_csv):
    """Add the verified LinkedIn columns from merge_linkedin.py to the organizations table."""
    m = {r["org_id"]: r for r in csv.DictReader(open(merged_csv, newline="", encoding="utf-8"))}
    rows = list(csv.DictReader(open(orgs_csv, newline="", encoding="utf-8")))
    add = ["linkedin_final", "linkedin_confidence", "linkedin_how", "linkedin_other", "crustdata_name", "crustdata_employees"]
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f); w.writerow(list(rows[0]) + add)
        for r in rows:
            x = m.get(r["org_id"], {}); w.writerow(list(r.values()) + [x.get(c, "") for c in add])
    print(f"  organizations joined to verified LinkedIn: {sum(1 for r in rows if r['org_id'] in m)}/{len(rows)}")


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--final", default="final"); ap.add_argument("--out", default="imaging-leads")
    ap.add_argument("--facilities", help="facilities CSV (needs an org_id column); joined to the organization data")
    a = ap.parse_args(); src = Path(a.final); out = Path(a.out).expanduser()
    files = [(n, src / f) for n, f in SHEETS if (src / f).exists()]
    if (src / "linkedin_merged.csv").exists() and (src / "orgs_final.csv").exists():
        join_linkedin(src / "orgs_final.csv", src / "linkedin_merged.csv", src / "orgs_with_linkedin.csv")
        files = [(n, (src / "orgs_with_linkedin.csv") if n == "Organizations" else p) for n, p in files]
    if a.facilities:
        fj = src / "facilities_enriched.csv"
        join_facilities(Path(a.facilities).expanduser(), src / "orgs_final.csv", fj)
        files.insert(2, ("Facilities", fj))
    if (src / "summary.txt").exists(): files.append(("Summary", src / "summary.txt"))
    with zipfile.ZipFile(f"{out}.zip", "w", zipfile.ZIP_DEFLATED) as z:
        for _, p in files: z.write(p, p.name)
    print(f"wrote {out}.zip")
    try:
        from openpyxl import Workbook
    except ImportError:
        print("openpyxl missing: run  python3 -m pip install openpyxl  and re-run for the Excel file"); return
    wb = Workbook(write_only=True)
    for name, p in files:
        ws = wb.create_sheet(name)
        if p.suffix == ".txt":
            for line in p.read_text().splitlines(): ws.append([line])
            continue
        with open(p, newline="", encoding="utf-8") as f:
            for row in csv.reader(f):
                ws.append([c[:32000] for c in row])
        print(f"  {name}: {p.name}")
    wb.save(f"{out}.xlsx"); print(f"wrote {out}.xlsx")


if __name__ == "__main__":
    main()
