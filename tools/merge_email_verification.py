#!/usr/bin/env python3
"""Merge an email-verification service's results back onto the inferred emails.

  python3 merge_email_verification.py --inferred final/inferred_emails.csv --results ~/Downloads/<service-output>.csv \
      --email-col "Email Address" --status-col "ZB Status" --out final/inferred_emails_verified.csv

Works with the bulk-upload output of ZeroBounce, NeverBounce, Kickbox, Hunter and similar: give the names of the email
column and the status column in the file the service returns. Statuses are normalised to:
  valid      the mailbox accepts mail (deliverable / valid / ok / safe)  -> usable
  catch_all  the domain accepts everything (accept_all / catch-all / risky): the guess is NOT proven -> use with care
  invalid    the address does not exist (invalid / undeliverable / bad / do_not_mail / spamtrap / abuse)  -> drop
  unknown    the service could not tell (unknown / unverified / timeout / blocked)                          -> do not send
"""
import argparse, csv, collections, re

def norm(s):
    s = (s or "").strip().lower().replace("-", "_").replace(" ", "_")
    if re.search(r"catch_?all|accept_?all|risky", s): return "catch_all"
    if re.search(r"^(valid|deliverable|ok|safe|good|verified)$", s): return "valid"
    if re.search(r"invalid|undeliverable|bad|do_?not_?mail|spam|abuse|disposable|syntax|no_?mx|rejected|failed", s): return "invalid"
    return "unknown"

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--inferred", required=True); ap.add_argument("--results", required=True)
    ap.add_argument("--email-col", required=True); ap.add_argument("--status-col", required=True); ap.add_argument("--out", required=True)
    ap.add_argument("--also", action="append", default=[], help="another results file as path:email_col:status_col (repeatable), e.g. ~/Downloads/zb/zb_test5_all_results.csv:email:'ZB Status'")
    a = ap.parse_args()
    res = {}
    for r in csv.DictReader(open(a.results, newline="", encoding="utf-8-sig")):
        res[(r.get(a.email_col) or "").strip().lower()] = r.get(a.status_col, "")
    import os
    for spec in a.also:
        path, ecol, scol = spec.rsplit(":", 2)
        for r in csv.DictReader(open(os.path.expanduser(path), newline="", encoding="utf-8-sig")):
            res.setdefault((r.get(ecol.strip("'\"")) or "").strip().lower(), r.get(scol.strip("'\""), ""))
    rows = list(csv.DictReader(open(a.inferred, newline="", encoding="utf-8")))
    cnt = collections.Counter()
    with open(a.out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]) + ["verification", "service_status"]); w.writeheader()
        for r in rows:
            raw = res.get(r["inferred_email"].lower())
            v = "not_checked" if raw is None else norm(raw)
            r.update(verification=v, service_status=raw or ""); cnt[v] += 1; w.writerow(r)
    print(dict(cnt), "->", a.out)

if __name__ == "__main__":
    main()
