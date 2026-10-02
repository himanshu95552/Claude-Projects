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


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--final", default="final"); ap.add_argument("--out", default="imaging-leads")
    ap.add_argument("--facilities", help="facilities CSV to add as its own sheet (not enriched)")
    a = ap.parse_args(); src = Path(a.final); out = Path(a.out).expanduser()
    files = [(n, src / f) for n, f in SHEETS if (src / f).exists()]
    if a.facilities: files.insert(2, ("Facilities (original)", Path(a.facilities).expanduser()))
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
