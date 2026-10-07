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
import argparse, concurrent.futures, csv, json, os, re, sys, threading, time, urllib.error, urllib.request

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
    ap.add_argument("--url", default="http://localhost:8080"); ap.add_argument("--delay", type=float, default=3.0, help="pause between two checks on the SAME mail domain")
    ap.add_argument("--limit", type=int, default=0); ap.add_argument("--secret", default=os.environ.get("REACHER_SECRET", ""))
    ap.add_argument("--workers", type=int, default=4, help="domains checked in parallel (never two at once on the same domain)")
    ap.add_argument("--timeout", type=int, default=40, help="seconds to wait for one address before calling it unknown")
    ap.add_argument("--give-up", type=int, default=3, help="after this many identical catch_all/unknown answers from one domain, stop probing it and record the rest the same way")
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
    lock = threading.Lock(); counts = {}; n = [0]
    by_domain = {}
    for e in todo: by_domain.setdefault(e.lower().split("@")[-1], []).append(e)

    def write(e, row, st):
        with lock:
            n[0] += 1; counts[st] = counts.get(st, 0) + 1
            w.writerow({"email": e, **row}); f.flush(); print(f"{n[0]}/{len(todo)} {e}: {st}", flush=True)

    def work(domain, addrs):
        streak, last = 0, None
        for e in addrs:
            if streak >= a.give_up:      # this domain answers the same non-answer every time: do not keep knocking
                write(e, {"status": last, "reachable": "", "note": "domain gave the same answer repeatedly; not probed"}, last); continue
            try:
                req = urllib.request.Request(a.url.rstrip("/") + "/v0/check_email", data=json.dumps({"to_email": e}).encode(), method="POST",
                    headers={"Content-Type": "application/json", **({"x-reacher-secret": a.secret} if a.secret else {})})
                res = json.loads(urllib.request.urlopen(req, timeout=a.timeout).read())
            except urllib.error.HTTPError as ex:
                write(e, {"status": "unknown", "reachable": "", "note": f"http {ex.code}"}, "unknown"); streak, last = streak + 1, "unknown"; continue
            except (TimeoutError, OSError) as ex:
                if isinstance(ex, urllib.error.URLError) and "refused" in str(ex).lower():
                    print(f"cannot reach Reacher at {a.url} ({ex}). Finished rows are saved."); os._exit(1)
                write(e, {"status": "unknown", "reachable": "", "note": "timeout"}, "unknown"); streak, last = streak + 1, "unknown"; continue
            smtp = res.get("smtp") or {}; st = status_of(res)
            streak = streak + 1 if (st in ("catch_all", "unknown") and last in (None, st)) else (1 if st in ("catch_all", "unknown") else 0); last = st
            mxr = " ".join((res.get("mx") or {}).get("records") or [])
            write(e, {"status": st, "reachable": res.get("is_reachable", ""), "mx_host": mxr[:80], "catch_all": smtp.get("is_catch_all", ""),
                      "can_connect_smtp": smtp.get("can_connect_smtp", ""), "deliverable": smtp.get("is_deliverable", ""),
                      "note": (res.get("error") or "")[:120] if isinstance(res.get("error"), str) else ""}, st)
            time.sleep(a.delay)

    with concurrent.futures.ThreadPoolExecutor(max_workers=a.workers) as ex:
        list(ex.map(lambda kv: work(*kv), by_domain.items()))
    print(counts, "->", a.out)


if __name__ == "__main__":
    main()
