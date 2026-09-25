#!/usr/bin/env python3
"""Record approvals and rejections made on the review web page, through the same gate.

  python3 scripts/sync_decisions.py decisions.json

decisions.json is the page's `decisions` collection as the ArtifactData tool lists it:
a list of {"id": <post id>, "data": {...}} (or of bare data objects with post_id).
Each decision doc, written by a tap on the page:
  {post_id, decision: approve|reject, approver: <name from config>, by: <viewer id>,
   content_hash: <hash of the version they saw>, reason, decided_at, status: "new"}

For each "new" decision this runs gate.approve / reject as that approver, but only if:
  * the approver is in config.yaml (and Shamit for his own posts, as always),
  * the viewer id has only ever been used by that same approver (content/approver-ids.json
    pins the first use; a different name from the same account is refused),
  * the post still has exactly the content the approver saw (content_hash matches).
It prints JSON results: {"<post id>": {"status": recorded|stale|refused|not_found|skipped, "message": ...}}.
Claude writes each result back to the page's decision doc so the approver sees it.
"""
import hashlib
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gs_common import ROOT, all_posts, config  # noqa: E402
import gate  # noqa: E402

PIN = ROOT / "content" / "approver-ids.json"


def load(path):
    raw = json.loads(Path(path).read_text(encoding="utf-8"))
    if isinstance(raw, dict):
        raw = raw.get("docs") or raw.get("documents") or list(raw.values())
    out = []
    for d in raw:
        data = d.get("data", d) if isinstance(d, dict) else {}
        pid = data.get("post_id") or d.get("id")
        out.append((pid, data))
    return out


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    cfg = config()
    pins = json.loads(PIN.read_text()) if PIN.exists() else {}
    results = {}
    for pid, d in load(sys.argv[1]):
        if d.get("status", "new") != "new":
            results[pid] = {"status": "skipped", "message": f"already {d.get('status')}"}
            continue
        approver, by, decision = d.get("approver", ""), str(d.get("by") or ""), d.get("decision")
        if not by:
            results[pid] = {"status": "refused", "message": "No viewer id on the decision; open the page signed in."}
            continue
        key = hashlib.sha256(by.encode()).hexdigest()[:16]  # the repo is public: store a hash, never the id
        if pins.get(key) and pins[key] != approver:
            results[pid] = {"status": "refused", "message": f"This account approved before as {pins[key]}; it can't approve as {approver}."}
            continue
        match = [p for p in all_posts(["pending", "rejected", "approved"]) if p.id == pid]
        if not match:
            results[pid] = {"status": "not_found", "message": "No such post in the queue (already scheduled or removed?)."}
            continue
        p = match[0]
        if d.get("content_hash") != p.content_hash():
            results[pid] = {"status": "stale", "message": "The post changed after you reviewed it. Reload the page and review it again."}
            continue
        try:
            if decision == "approve":
                if p.state == "approved":
                    results[pid] = {"status": "skipped", "message": f"already approved by {p.meta.get('approved_by')}"}
                    continue
                gate.approve(p, approver, "via review page", cfg)
            elif decision == "reject":
                reason = (d.get("reason") or "").strip() or "no reason given"
                ns = type("A", (), {"id": pid, "by": approver, "reason": f"{reason} (via review page)"})
                gate.cmd_reject(ns)
            else:
                results[pid] = {"status": "refused", "message": f"Unknown decision {decision!r}."}
                continue
        except SystemExit as e:
            results[pid] = {"status": "refused", "message": str(e)}
            continue
        pins.setdefault(key, approver)
        results[pid] = {"status": "recorded", "message": f"{'Approved' if decision == 'approve' else 'Rejected'} in the queue as {approver}."}
    PIN.write_text(json.dumps(pins, indent=2))
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
