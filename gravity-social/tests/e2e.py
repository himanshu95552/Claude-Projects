#!/usr/bin/env python3
"""End-to-end test of the Gravity Social OS, run in a throwaway copy so the real queue is untouched.

  python3 tests/e2e.py            # everything except rendering
  python3 tests/e2e.py --render   # also re-render carousels (needs Node + Playwright)

Walks one week through every stage: lint -> approve (roles) -> the Metricool hook for each
platform -> scheduled/published -> metrics -> Calendly outcomes -> inbox -> leads -> decisions
made on the web page -> morning brief -> dashboard (both builds). Fixture data is synthetic.
"""
from __future__ import annotations

import csv
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent
PASS, FAIL = [], []


def check(name, cond, detail=""):
    (PASS if cond else FAIL).append(name)
    print(f"  {'PASS' if cond else 'FAIL'}  {name}" + (f"  -- {detail}" if detail and not cond else ""))


def run(root, *args, stdin=None):
    r = subprocess.run([sys.executable, *args], cwd=root, input=stdin, capture_output=True, text=True)
    return r.returncode, r.stdout + r.stderr


def hook_payload(post, network, **over):
    info = {"providers": [{"network": network}], "autoPublish": False, "text": post.main_text()}
    parts = post.thread_parts()
    if parts:
        info["descendants"] = [{"text": t} for t in parts[1:]]
    if post.section("First comment"):
        info["firstCommentText"] = post.section("First comment")
    if network == "youtube":
        info["youtubeData"] = {"title": post.section("Title"), "type": "short", "madeForKids": False}
    info.update(over)
    return json.dumps({"tool_name": "mcp__Metricool_Social_Media_Management__createScheduledPost",
                       "tool_input": {"blogId": "6979710", "date": "2026-10-06T08:30:00-05:00", "info": json.dumps(info)}})


def main():
    render = "--render" in sys.argv
    tmp = Path(tempfile.mkdtemp(prefix="gs-e2e-"))
    root = tmp / "gravity-social"
    shutil.copytree(SRC, root, ignore=shutil.ignore_patterns("__pycache__", "tests"))
    for f in ["community/leads.csv", "reports/outcomes.csv", "content/approvals.log", "content/approver-ids.json"]:
        (root / f).unlink(missing_ok=True)
    for f in (root / "community" / "inbox").glob("*.yaml"):
        f.unlink()
    for f in (root / "reports" / "metrics").glob("*.json"):
        f.unlink()
    sys.path.insert(0, str(root / "scripts"))
    import gs_common as g  # noqa: E402  (the copy)

    print(f"Working copy: {root}\n\n1. Drafts")
    code, out = run(root, "scripts/gravity_lint.py", "--state", "pending")
    check("every pending post lints with 0 errors", code == 0, out[-300:])
    pending = {p.id: p for p in g.all_posts(["pending"])}
    check("the week has posts for all five accounts",
          {p.platform for p in pending.values()} >= {"linkedin-company", "linkedin-founder", "x", "instagram", "youtube-shorts"})
    if render:
        code, out = run(root, "scripts/render_carousel.py", "--state", "pending")
        check("carousels render without overflow", code == 0 and "OVERFLOW" not in out, out[-300:])
    code, out = run(root, "scripts/fill_media_urls.py", "--state", "pending")
    ig = g.find_post("2026-W40-ig-01")
    check("media URLs filled for rendered carousels", code == 0 and len(ig.meta.get("media_urls") or []) == 6, out[-200:])
    check("filling media URLs doesn't change the approval hash",
          ig.content_hash() == pending["2026-W40-ig-01"].content_hash())

    print("\n2. Approval roles")
    ok = lambda i, by: run(root, "scripts/gate.py", "approve", i, "--by", by)[0] == 0
    check("Tushant approves a company post", ok("2026-W40-li-co-02", "Tushant"))
    check("Tushant cannot approve Shamit's post", not ok("2026-W40-li-sp-01", "Tushant"))
    check("Shamit approves his own post", ok("2026-W40-li-sp-01", "Shamit Patel"))
    check("an unknown name cannot approve", not ok("2026-W40-x-01", "Someone"))
    for i in ["2026-W40-x-02", "2026-W40-ig-01", "2026-W40-yt-01", "2026-W40-x-03"]:
        check(f"Tushant approves {i}", ok(i, "Tushant"))
    code, _ = run(root, "scripts/gate.py", "reject", "2026-W40-x-05", "--by", "Tushant", "--reason", "test")
    check("reject moves a post to rejected", code == 0 and (root / "content/queue/rejected/2026-W40-x-05.md").exists())

    print("\n3. Metricool gate, per platform")
    hook = lambda payload: run(root, "scripts/metricool_gate_hook.py", stdin=payload)[0]
    P = lambda i: g.find_post(i)
    check("LinkedIn document post with first comment passes", hook(hook_payload(P("2026-W40-li-co-02"), "linkedin")) == 0)
    check("X thread with all 7 parts passes", hook(hook_payload(P("2026-W40-x-02"), "twitter")) == 0)
    check("Instagram carousel passes", hook(hook_payload(P("2026-W40-ig-01"), "instagram")) == 0)
    check("YouTube Short passes (description + title)", hook(hook_payload(P("2026-W40-yt-01"), "youtube")) == 0)
    check("Shamit's post is blocked on the company page", hook(hook_payload(P("2026-W40-li-sp-01"), "linkedin")) == 2)
    check("a pending (unapproved) post is blocked", hook(hook_payload(P("2026-W40-li-co-03"), "linkedin")) == 2)
    check("X thread missing a part is blocked",
          hook(hook_payload(P("2026-W40-x-02"), "twitter", descendants=[{"text": t} for t in P("2026-W40-x-02").thread_parts()[1:-1]])) == 2)
    check("a changed YouTube title is blocked", hook(hook_payload(P("2026-W40-yt-01"), "youtube", youtubeData={"title": "Other"})) == 2)
    check("a changed first comment is blocked", hook(hook_payload(P("2026-W40-li-co-02"), "linkedin", firstCommentText="x")) == 2)
    check("cross-posting is blocked", hook(hook_payload(P("2026-W40-x-03"), "twitter", providers=[{"network": "twitter"}, {"network": "linkedin"}])) == 2)
    check("autoPublish true is blocked", hook(hook_payload(P("2026-W40-x-03"), "twitter", autoPublish=True)) == 2)
    check("garbage payload is blocked", hook("not json") == 2)
    p = P("2026-W40-x-03")
    p.path.write_text(p.path.read_text().replace("It's a leakage problem.", "It's a leakage problem, clearly."))
    check("editing an approved post blocks it", hook(hook_payload(P("2026-W40-x-03"), "twitter")) == 2)
    code, _ = run(root, "scripts/gate.py", "verify")
    check("gate verify reports the edited post", code == 1)
    run(root, "scripts/gate.py", "reopen", "2026-W40-x-03")

    print("\n4. Scheduled -> published")
    for i, mid in [("2026-W40-li-co-02", "m1"), ("2026-W40-x-02", "m2"), ("2026-W40-ig-01", "m3")]:
        check(f"mark-scheduled {i}", run(root, "scripts/gate.py", "mark-scheduled", i, "--metricool-id", mid)[0] == 0)
    check("mark-published", run(root, "scripts/gate.py", "mark-published", "2026-W40-li-co-02", "--url", "https://linkedin.com/x")[0] == 0)

    print("\n5. Metrics")
    rows = {"period": {"from": "2026-09-28", "to": "2026-10-04"},
            "accounts": [{"platform": "linkedin-company", "followers": 900, "followers_delta": 14}],
            "posts": [{"metricool_post_id": "m1", "network": "linkedin", "impressions": 4200, "engagements": 180, "clicks": 31},
                      {"network": "twitter", "text": P("2026-W40-x-02").main_text(), "impressions": 2600, "engagements": 95, "clicks": 0},
                      {"network": "instagram", "text": "not one of ours", "impressions": 10}]}
    (tmp / "rows.json").write_text(json.dumps(rows))
    code, out = run(root, "scripts/record_metrics.py", str(tmp / "rows.json"), "--date", "2026-10-04")
    check("metrics matched by Metricool id and by text; stranger left unmatched", code == 0 and "2 post(s) matched, 1 unmatched" in out, out)

    print("\n6. Calendly outcomes")
    cal = tmp / "cal.csv"
    cal.write_text("Invitee Email,Event Type Name,Start Date & Time,Event Created Date & Time,Canceled,UTM Content\n"
                   "a@exampleimaging.com,Gravity Demo,2026-10-08 10:00,2026-10-02 09:00,false,2026-W40-li-co-02\n"
                   "b@gmail.com,Your exam itemized,2026-10-09 10:00,2026-10-03 09:00,false,2026-W40-li-co-02\n")
    code, out = run(root, "scripts/import_calendly.py", str(cal))
    check("Calendly bookings attributed to the post", code == 0 and "2 new outcome(s)" in out, out)
    body = (root / "reports/outcomes.csv").read_text()
    check("no invitee email written", "a@exampleimaging.com" not in body and "b@gmail.com" not in body)

    print("\n7. Inbox and leads")
    (root / "community/inbox/2026-10-03-linkedin-company.yaml").write_text(
        "platform: linkedin-company\ncollected_at: 2026-10-03T09:00:00-05:00\nitems:\n"
        "  - {id: li-c-1, kind: comment, on_post: 2026-W40-li-co-02, author: Test Person, author_title: COO, organization: Example Imaging,"
        " text: 'Does this work with our RIS?', intent: lead-hot, confidence: 0.9, fit: 2, intent_score: 2, route: draft-reply,"
        " draft_reply: 'Yes. Gravity runs on top of your RIS.', reply_status: pending}\n"
        "  - {id: li-c-2, kind: comment, on_post: 2026-W40-li-co-02, author: Patient, text: '[redacted]', intent: patient,"
        " confidence: 0.95, route: person, reply_status: pending}\n")
    code, out = run(root, "scripts/sync_leads.py")
    check("lead copied to leads.csv", code == 0 and "1 new lead(s)" in out, out)
    code, out = run(root, "scripts/sync_leads.py")
    check("re-running doesn't duplicate leads", "0 new lead(s)" in out, out)
    code, out = run(root, "scripts/gravity_lint.py", "--text", "Yes. Gravity runs on top of your RIS.", "--platform", "linkedin-company")
    check("the drafted reply lints clean", code == 0, out)
    code, out = run(root, "scripts/gravity_lint.py", "--text", "Our AI-powered platform guarantees zero denials", "--platform", "linkedin-company")
    check("a bad reply is caught", code == 1)

    print("\n8. Decisions made on the web page")
    h = lambda i: g.find_post(i).content_hash()
    dec = [
        {"id": "2026-W40-li-co-03", "data": {"post_id": "2026-W40-li-co-03", "decision": "approve", "approver": "Tushant", "by": "u_t", "content_hash": h("2026-W40-li-co-03"), "status": "new"}},
        {"id": "2026-W40-li-co-04", "data": {"post_id": "2026-W40-li-co-04", "decision": "approve", "approver": "Tushant", "by": "u_t", "content_hash": "stale", "status": "new"}},
        {"id": "2026-W40-li-sp-02", "data": {"post_id": "2026-W40-li-sp-02", "decision": "approve", "approver": "Tushant", "by": "u_t", "content_hash": h("2026-W40-li-sp-02"), "status": "new"}},
        {"id": "2026-W40-ig-03", "data": {"post_id": "2026-W40-ig-03", "decision": "approve", "approver": "Shamit Patel", "by": "u_t", "content_hash": h("2026-W40-ig-03"), "status": "new"}},
        {"id": "2026-W40-ig-02", "data": {"post_id": "2026-W40-ig-02", "decision": "reject", "approver": "Tushant", "by": "u_t", "content_hash": h("2026-W40-ig-02"), "reason": "Need footage first", "status": "new"}},
    ]
    (tmp / "dec.json").write_text(json.dumps(dec))
    code, out = run(root, "scripts/sync_decisions.py", str(tmp / "dec.json"))
    res = json.loads(out[out.index("{"):]) if "{" in out else {}
    check("page approval recorded through the gate", res.get("2026-W40-li-co-03", {}).get("status") == "recorded", out[-400:])
    check("stale page approval refused", res.get("2026-W40-li-co-04", {}).get("status") == "stale")
    check("founder rule holds for page approvals", res.get("2026-W40-li-sp-02", {}).get("status") == "refused")
    check("one account can't approve under two names", res.get("2026-W40-ig-03", {}).get("status") == "refused")
    check("page rejection recorded with reason", res.get("2026-W40-ig-02", {}).get("status") == "recorded"
          and (root / "content/queue/rejected/2026-W40-ig-02.md").exists())
    pins = (root / "content/approver-ids.json").read_text()
    check("viewer ids are stored only as hashes", "u_t" not in pins)

    print("\n9. Morning brief and dashboard")
    code, out = run(root, "scripts/morning_brief.py", "--date", "2026-10-04")
    check("brief builds", code == 0, out[-300:])
    check("brief names the best post", "Best post:** `2026-W40-li-co-02`" in out, out[:800])
    check("brief flags the engaged post with no clicks", "Engaged but went nowhere:** `2026-W40-x-02`" in out)
    check("brief counts demo and itemized requests", "| 1 | 1 |" in out)
    check("brief counts messages needing a person", "1 message(s) never auto-replied (patient)" in out)
    for flag, name in [([], "dashboard.html"), (["--artifact"], "dashboard-artifact.html")]:
        code, out = run(root, "scripts/build_dashboard.py", "--date", "2026-10-04", *flag)
        html = (root / "content" / name).read_text()
        check(f"{name} builds with all five tabs", code == 0 and all(f'id="{t}"' in html for t in ["research", "content", "posting", "growth", "brief"]))
    check("web page carries Approve/Reject", html.count('class="decide"') == len(g.all_posts(["pending"])))
    check("web page has no document wrapper", not html.lstrip().lower().startswith("<!doctype"))
    check("dashboard shows leads and the inbox", "Example Imaging" in (root / "content/dashboard.html").read_text())

    print("\n9. Helper scripts run as commands")
    rc, out = run(root, "scripts/utm.py", "--cta", "demo", "--platform", "x", "--post", "2026-W40-x-01")
    check("utm.py builds a tagged link", rc == 0 and "utm_content=2026-W40-x-01" in out, out[-300:])
    for script in ("render_carousel", "record_metrics", "import_calendly", "fill_media_urls"):
        rc, out = run(root, f"scripts/{script}.py", "--help")
        check(f"{script}.py starts", rc == 0 and "usage" in out, out[-300:])

    print(f"\n{len(PASS)} passed, {len(FAIL)} failed")
    if FAIL:
        print("FAILED: " + "; ".join(FAIL))
    shutil.rmtree(tmp, ignore_errors=True)
    sys.exit(1 if FAIL else 0)


if __name__ == "__main__":
    main()
