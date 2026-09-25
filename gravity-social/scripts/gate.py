#!/usr/bin/env python3
"""The human gate. Nothing leaves the queue without a named person's approval.

  python3 scripts/gate.py status                       # the queue, by state
  python3 scripts/gate.py show <id>                    # print a post's public text
  python3 scripts/gate.py approve <id> --by "Shamit Patel" [--note "..."]
  python3 scripts/gate.py approve-all --by "Shamit Patel" --platform x   # batch, still named and linted
  python3 scripts/gate.py reject <id> --by "Name" --reason "..."
  python3 scripts/gate.py reopen <id>                  # approved/rejected -> pending (after edits)
  python3 scripts/gate.py verify [<id>]                # approved text unchanged since approval?
  python3 scripts/gate.py mark-scheduled <id> --metricool-id 123
  python3 scripts/gate.py mark-published <id> [--url https://...]
  python3 scripts/gate.py match --platform x --text "..."   # used by the Metricool hook

Approval runs the linter first and refuses on any ERROR. It records who, when,
and a SHA-256 of the public text. Any later edit to the public text breaks the
hash, and the Metricool hook then refuses to schedule the post until it is
re-approved.

Claude never runs `approve` on its own initiative. It runs it only when the
approver has said, in the conversation, that they approve that specific post.
"""

from __future__ import annotations

import argparse
import datetime as dt
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gs_common import ROOT, STATES, all_posts, config, find_post, load_yaml, normalize  # noqa: E402
import gravity_lint  # noqa: E402

LOG = ROOT / "content" / "approvals.log"


def now_iso() -> str:
    return dt.datetime.now(dt.timezone.utc).astimezone().isoformat(timespec="seconds")


def log(line: str) -> None:
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(f"{now_iso()}\t{line}\n")


def approvers(cfg) -> list[str]:
    return [a["name"] for a in cfg.get("approval", {}).get("approvers", [])]


def lint_one(post):
    ledger = gravity_lint.Ledger()
    guard = load_yaml(ROOT / "brand" / "guardrails.yaml")
    limits = load_yaml(ROOT / "platforms" / "limits.yaml")
    return gravity_lint.lint_post(post, ledger, guard, limits, config())


def cmd_status(_args):
    for st in STATES:
        posts = all_posts([st])
        print(f"\n{st.upper()} ({len(posts)})")
        for p in posts:
            print(f"  {p.id:24} {p.platform:18} {str(p.meta.get('format','')):18} "
                  f"{str(p.meta.get('scheduled_for',''))[:16]:17} lint={p.meta.get('lint') or '-'}"
                  + (f"  by {p.meta.get('approved_by')}" if p.meta.get("approved_by") else ""))


def cmd_show(args):
    p = find_post(args.id)
    print(f"# {p.id} · {p.platform} · {p.meta.get('format')} · {p.state}\n")
    for label, text in p.public_chunks():
        print(f"--- {label} ---\n{text}\n")


def approve(p, by, note, cfg):
    if by not in approvers(cfg):
        sys.exit(f"{by!r} is not an approver in config.yaml (approval.approvers): {approvers(cfg)}")
    founder = cfg.get("approval", {}).get("founder_posts_require")
    if p.platform == "linkedin-founder" and founder and by != founder:
        sys.exit(f"Founder posts need {founder}'s own approval.")
    if p.state not in ("pending", "rejected"):
        sys.exit(f"{p.id} is {p.state}; only pending posts can be approved (use reopen after edits).")
    res = lint_one(p)
    if res.errors:
        for sev, rule, msg in res.items:
            print(f"    {sev:5} {rule:22} {msg}")
        sys.exit(f"Refused: {p.id} has {len(res.errors)} lint errors.")
    p.set_meta(status="approved", approved_by=by, approved_at=now_iso(),
               content_hash=p.content_hash(), lint=res.verdict())
    p.move_to("approved")
    log(f"APPROVE\t{p.id}\t{by}\t{note or ''}")
    print(f"Approved {p.id} ({res.verdict()}) by {by}.")
    for sev, rule, msg in res.warns:
        print(f"    note: {rule}: {msg}")


def cmd_approve(args):
    cfg = config()
    approve(find_post(args.id, ["pending", "rejected"]), args.by, args.note, cfg)


def cmd_approve_all(args):
    cfg = config()
    posts = [p for p in all_posts(["pending"]) if not args.platform or p.platform == args.platform]
    if not posts:
        print("Nothing pending.")
    for p in posts:
        try:
            approve(p, args.by, args.note, cfg)
        except SystemExit as e:
            print(f"  skipped {p.id}: {e}")


def cmd_reject(args):
    p = find_post(args.id, ["pending", "approved"])
    p.set_meta(status="rejected", approved_by="", approved_at="", content_hash="")
    p.move_to("rejected")
    with open(p.path, "a", encoding="utf-8") as f:
        f.write(f"\n## Rejection\n\n{now_iso()} by {args.by}: {args.reason}\n")
    log(f"REJECT\t{p.id}\t{args.by}\t{args.reason}")
    print(f"Rejected {p.id}.")


def cmd_reopen(args):
    p = find_post(args.id, ["approved", "rejected", "scheduled"])
    p.set_meta(status="pending", approved_by="", approved_at="", content_hash="")
    p.move_to("pending")
    log(f"REOPEN\t{p.id}")
    print(f"{p.id} is pending again and needs a fresh approval.")


def cmd_verify(args):
    posts = [find_post(args.id)] if args.id else all_posts(["approved", "scheduled"])
    bad = 0
    for p in posts:
        ok = p.meta.get("content_hash") and p.meta.get("content_hash") == p.content_hash()
        bad += not ok
        print(f"{'OK      ' if ok else 'CHANGED '} {p.id}  ({p.state})")
    if bad:
        print(f"\n{bad} post(s) changed after approval. Run `gate.py reopen <id>` and re-approve.")
    return 1 if bad else 0


def cmd_mark_scheduled(args):
    p = find_post(args.id, ["approved"])
    if p.meta.get("content_hash") != p.content_hash():
        sys.exit(f"{p.id} changed after approval; reopen and re-approve.")
    p.set_meta(status="scheduled", metricool_post_id=args.metricool_id or "")
    p.move_to("scheduled")
    log(f"SCHEDULED\t{p.id}\t{args.metricool_id or ''}")
    print(f"{p.id} marked scheduled.")


def cmd_mark_published(args):
    p = find_post(args.id, ["approved", "scheduled"])
    p.set_meta(status="published", published_url=args.url or "")
    p.move_to("published")
    log(f"PUBLISHED\t{p.id}\t{args.url or ''}")
    print(f"{p.id} marked published.")


def find_approved_match(platform: str | None, text: str):
    """Return the approved/scheduled post whose main text equals `text` and whose hash is intact."""
    want = normalize(text)
    for p in all_posts(["approved", "scheduled"]):
        if platform and p.platform != platform and not (platform == "linkedin" and p.platform.startswith("linkedin")):
            continue
        if normalize(p.main_text()) == want:
            intact = p.meta.get("content_hash") == p.content_hash()
            return p, intact
    return None, False


def cmd_match(args):
    p, intact = find_approved_match(args.platform, args.text)
    if not p:
        print("NO MATCH")
        return 1
    print(f"{p.id} {'intact' if intact else 'CHANGED-AFTER-APPROVAL'}")
    return 0 if intact else 1


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("status").set_defaults(fn=cmd_status)
    s = sub.add_parser("show"); s.add_argument("id"); s.set_defaults(fn=cmd_show)
    s = sub.add_parser("approve"); s.add_argument("id"); s.add_argument("--by", required=True); s.add_argument("--note"); s.set_defaults(fn=cmd_approve)
    s = sub.add_parser("approve-all"); s.add_argument("--by", required=True); s.add_argument("--platform"); s.add_argument("--note"); s.set_defaults(fn=cmd_approve_all)
    s = sub.add_parser("reject"); s.add_argument("id"); s.add_argument("--by", required=True); s.add_argument("--reason", required=True); s.set_defaults(fn=cmd_reject)
    s = sub.add_parser("reopen"); s.add_argument("id"); s.set_defaults(fn=cmd_reopen)
    s = sub.add_parser("verify"); s.add_argument("id", nargs="?"); s.set_defaults(fn=cmd_verify)
    s = sub.add_parser("mark-scheduled"); s.add_argument("id"); s.add_argument("--metricool-id"); s.set_defaults(fn=cmd_mark_scheduled)
    s = sub.add_parser("mark-published"); s.add_argument("id"); s.add_argument("--url"); s.set_defaults(fn=cmd_mark_published)
    s = sub.add_parser("match"); s.add_argument("--platform"); s.add_argument("--text", required=True); s.set_defaults(fn=cmd_match)
    args = ap.parse_args()
    rc = args.fn(args)
    sys.exit(rc or 0)


if __name__ == "__main__":
    main()
