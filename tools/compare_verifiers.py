#!/usr/bin/env python3
"""Compare two email verifiers on the addresses both checked. Shows how often Reacher (free) agrees with a paid verifier.

  python3 compare_verifiers.py --a "final/reacher_results.csv:email:status" --b "~/Downloads/emailable_part1-*.csv:email:emailable state"

Each side is path:email_col:status_col (a glob like * is fine). Statuses are normalised to valid / catch_all / invalid / unknown.
Prints a table (rows = A's answer, columns = B's answer) and lists the disagreements that matter:
  A says valid but B says invalid, or the reverse.
"""
import argparse, csv, glob, os, collections, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from merge_email_verification import norm


def load(spec):
    path, ecol, scol = spec.rsplit(":", 2)
    files = sorted(glob.glob(os.path.expanduser(path))) or sys.exit(f"no file matches {path}")
    out = {}
    for f in files:
        for r in csv.DictReader(open(f, newline="", encoding="utf-8-sig")):
            out[(r.get(ecol) or "").strip().lower()] = norm(r.get(scol, ""))
    return out


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--a", required=True); ap.add_argument("--b", required=True); a = ap.parse_args()
    A, B = load(a.a), load(a.b)
    both = sorted(set(A) & set(B)); print(f"{len(both)} addresses checked by both")
    cats = ["valid", "catch_all", "invalid", "unknown"]; m = collections.Counter((A[e], B[e]) for e in both)
    print("\nrows = A, columns = B"); print(f"{'':12}" + "".join(f"{c:>11}" for c in cats))
    for x in cats: print(f"{x:12}" + "".join(f"{m[(x, y)]:>11}" for y in cats))
    bad = [(e, A[e], B[e]) for e in both if {A[e], B[e]} == {"valid", "invalid"}]
    print(f"\nhard disagreements (one says valid, the other invalid): {len(bad)}")
    for e, x, y in bad[:15]: print(f"  {e}: A={x} B={y}")
    agree = sum(m[(c, c)] for c in cats); print(f"\nexact agreement: {agree}/{len(both)}")


if __name__ == "__main__":
    main()
