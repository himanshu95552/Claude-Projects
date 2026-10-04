#!/usr/bin/env python3
"""Verify email addresses with YOUR local Reacher (check-if-email-exists) server. No emails are sent: Reacher opens an SMTP
connection and asks the recipient's mail server whether the mailbox exists, then hangs up.

  python3 verify_with_reacher.py --emails final/zb_test5.csv --out final/reacher_results.csv [--url http://localhost:8080] [--delay 3] [--limit 5]

Input: a CSV with an 'email' column (e.g. final/inferred_emails_to_verify_decision_makers.csv).
Output: email, status (valid / catch_all / invalid / unknown), reachable (Reacher's own word), plus the SMTP details.
Merge into the People data exactly like the ZeroBounce results:
  python3 merge_email_verification.py --inferred final/inferred_emails.csv --results final/reacher_results.csv --email-col email --status-col status --out final/inferred_emails_verified.csv

Be gentle: one address at a time with a delay, so mail servers do not rate-limit or blacklist your IP. Resumable: emails already in --out are skipped.
Honest limits (learned on a real test: Reacher called a Microsoft 365 mailbox that ZeroBounce marked valid 'invalid'): many home connections block outbound port 25; Microsoft 365 / Google Workspace and many hospital gateways answer
'catch-all' or 'unknown', which proves nothing about the mailbox. Treat only 'valid' as safe.
"""
import argparse, csv, json, os, re, sys, time, urllib.error, urllib.request

# Mail hosts that do not answer honestly to an SMTP probe from a home/laptop IP: a "no" from them proves nothing.
UNRELIABLE = re.compile(r"protection\.outlook\.com|outlook\.com|office365|google\.com|googlemail|mimecast|pphosted|proofpoint|barracuda|iphmx|sophos|ess\.|messagelabs|trendmicro|fireeye|mxlogic|secureserver|hydra", re.I)


def check(url, email, secret):
    req = urllib.request.Request(url.rstrip("/") + "/v0/check_email", data=json.dumps({"to_email": email}).encode(), method="POST",
        headers={"Content-Type": "application/json", **({"x-reacher-secret": secret} if secret else {})})
    with urllib.request.urlopen(req, timeout=120) as r: return json.loads(r.read())


def status_of(res):
    reach = (res.get("is_reachable") or "unknown").lower()
    smtp = res.get("smtp") or {}
    mx = " ".join((res.get("mx") or {}).get("records") or [])
    if reach == "safe": return "valid"
    if reach == "invalid": return "unknown" if UNRELIABLE.search(mx) else "invalid"   # do not trust a 'no' from O365/gateways
    if smtp.get("is_catch_all"): return "catch_all"
    return "unknown"          # includes 'risky' without catch-all and servers that blocked the check


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--emails", required=True); ap.add_argument("--out", required=True)
    ap.add_argument("--url", default="http://localhost:8080"); ap.add_argument("--delay", type=float, default=3.0)
    ap.add_argument("--limit", type=int, default=0); ap.add_argument("--secret", default=os.environ.get("REACHER_SECRET", ""))
    a = ap.parse_args()
    emails = [r["email"].strip() for r in csv.DictReader(open(a.emails, newline="", encoding="utf-8-sig")) if r.get("email", "").strip()]
    done = set()
    if os.path.exists(a.out): done = {r["email"] for r in csv.DictReader(open(a.out, newline="", encoding="utf-8"))}
    todo = [e for e in emails if e not in done]
    if a.limit: todo = todo[: a.limit]
    new = not os.path.exists(a.out)
    f = open(a.out, "a", newline="", encoding="utf-8")
    w = csv.DictWriter(f, fieldnames=["email", "status", "reachable", "mx_host", "catch_all", "can_connect_smtp", "deliverable", "note"])
    if new: w.writeheader()
    counts = {}
    for i, e in enumerate(todo, 1):
        try: res = check(a.url, e, a.secret)
        except urllib.error.URLError as ex:
            sys.exit(f"cannot reach Reacher at {a.url} ({ex}). Is the server running? Finished rows are saved.")
        if i == 1 and new: open(a.out + ".raw.json", "w").write(json.dumps(res, indent=1)[:20000])
        smtp = res.get("smtp") or {}
        st = status_of(res); counts[st] = counts.get(st, 0) + 1
        mxr = " ".join((res.get("mx") or {}).get("records") or [])
        w.writerow({"email": e, "status": st, "reachable": res.get("is_reachable", ""), "mx_host": mxr[:80], "catch_all": smtp.get("is_catch_all", ""),
                    "can_connect_smtp": smtp.get("can_connect_smtp", ""), "deliverable": smtp.get("is_deliverable", ""),
                    "note": (res.get("error") or "")[:120] if isinstance(res.get("error"), str) else ""})
        f.flush(); print(f"{i}/{len(todo)} {e}: {st}", flush=True); time.sleep(a.delay)
    print(counts, "->", a.out)


if __name__ == "__main__":
    main()
