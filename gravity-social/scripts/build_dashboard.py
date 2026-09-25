#!/usr/bin/env python3
"""Build content/dashboard.html: the Gravity Social OS in one page, five tabs.

  Research               this week's brief: signals, competitor posts, audience questions, hook lab
  Content                next week as a Mon-Sun grid + the approval queue with per-post checks and previews
  Posting & community    the schedule by platform, the inbox by intent, leads, what needs a person
  Growth                 post -> click -> request -> pipeline, and which posts moved it
  Brief                  today's one-page morning brief

  python3 scripts/build_dashboard.py

It's a static page built from the repo's files, so it never goes stale silently: rebuild after
each module runs. Approving still happens through scripts/gate.py. The page shows
the exact command for each post.
"""

from __future__ import annotations

import datetime as dt
import html
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gs_common import ROOT, all_posts, config, load_yaml  # noqa: E402
import gravity_lint  # noqa: E402
import morning_brief  # noqa: E402

PLATFORM_LABEL = {"linkedin-company": "LinkedIn · Alpha Nodus", "linkedin-founder": "LinkedIn · Shamit",
                  "x": "X", "instagram": "Instagram", "youtube-shorts": "YouTube Shorts"}
SHORT = {"linkedin-company": "LI", "linkedin-founder": "LI·SP", "x": "X", "instagram": "IG", "youtube-shorts": "YT"}


def e(s):
    return html.escape(str("" if s is None else s))


def para(text):
    t = e(text)
    t = re.sub(r"(https?://\S+)", r'<span class="link">\1</span>', t)
    t = re.sub(r"(?<![\w&])(#[A-Za-z]\w*)", r'<span class="link">\1</span>', t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return t.replace("\n", "<br>")


def clip(text, n):
    text = str(text or "")
    return text if len(text) <= n else text[:n].rsplit(" ", 1)[0].rstrip(",:;") + "…"


def md_to_html(md: str) -> str:
    out, table, in_list = [], [], False

    def flush_table():
        nonlocal table
        if table:
            rows = [r for r in table if not re.fullmatch(r"\|?\s*[-:| ]+\|?", r)]
            cells = [[c.strip() for c in r.strip().strip("|").split("|")] for r in rows]
            h = "".join(f"<th>{inline(c)}</th>" for c in cells[0])
            b = "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>" for r in cells[1:])
            out.append(f'<div class="tw"><table><thead><tr>{h}</tr></thead><tbody>{b}</tbody></table></div>')
            table = []

    def inline(s):
        s = e(s)
        s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
        s = re.sub(r"`(.+?)`", r"<code>\1</code>", s)
        s = re.sub(r"_(.+?)_", r"<i>\1</i>", s)
        return s

    for line in md.split("\n"):
        if line.startswith("|"):
            table.append(line)
            continue
        flush_table()
        if line.startswith("- "):
            if not in_list:
                out.append("<ul>"); in_list = True
            out.append(f"<li>{inline(line[2:])}</li>"); continue
        if in_list:
            out.append("</ul>"); in_list = False
        if line.startswith("# "):
            out.append(f"<h2>{inline(line[2:])}</h2>")
        elif line.startswith("## "):
            out.append(f"<h3>{inline(line[3:])}</h3>")
        elif line.startswith("> "):
            out.append(f'<p class="callout">{inline(line[2:])}</p>')
        elif line.strip():
            out.append(f"<p>{inline(line)}</p>")
    flush_table()
    if in_list:
        out.append("</ul>")
    return "\n".join(out)


# ------------------------------------------------------------------ previews
def preview(p):
    plat = p.platform
    frames = sorted((ROOT / "content" / "assets" / p.id).glob("frame-*.png"))
    strip = ""
    if frames:
        strip = '<div class="strip">' + "".join(
            f'<img loading="lazy" src="assets/{e(p.id)}/{f.name}" alt="{e(p.id)} frame {i + 1}">' for i, f in enumerate(frames)) + "</div>"
    poll = p.poll()
    poll_html = ""
    if poll:
        poll_html = '<div class="poll"><b>' + e(poll.get("question")) + "</b>" + "".join(
            f'<div class="opt">{e(o)}</div>' for o in poll.get("options", [])) + "</div>"
    if plat == "x":
        parts = p.thread_parts() or [p.section("Post")]
        body = "".join(f'<div class="tweet"><div class="who">Alpha Nodus <span>@alphanodus</span></div><div>{para(t)}</div>'
                       f'<div class="count">{gravity_lint.x_weighted_len(t)}/280</div></div>' for t in parts)
        return f'<div class="pv">{body}{strip}{poll_html}</div>'
    if plat.startswith("linkedin"):
        who = "Shamit Patel · Founder and CEO, Alpha Nodus" if plat == "linkedin-founder" else "Alpha Nodus"
        text = p.section("Post")
        head, tail = (text[:210], text[210:]) if len(text) > 210 else (text, "")
        more = f"<details><summary>…see more</summary>{para(tail)}</details>" if tail else ""
        fc = p.section("First comment")
        fc_html = f'<div class="comment"><b>First comment</b><br>{para(fc)}</div>' if fc else ""
        return f'<div class="pv"><div class="who">{e(who)}</div><div>{para(head)}{more}</div>{strip}{poll_html}{fc_html}</div>'
    if plat == "instagram":
        return f'<div class="pv">{strip or "<div class=muted>Reel: see the video script</div>"}<div><b>alphanodus</b> {para(p.section("Post"))}</div></div>'
    return f'<div class="pv"><b>{para(p.section("Title"))}</b><br>{para(p.section("Description"))}</div>'


def chips(summary: dict) -> str:
    return "".join(f'<span class="chip {v}">{e(k)}</span>' for k, v in summary.items())


# ------------------------------------------------------------------ tabs
def tab_research(res: dict, fname: str) -> str:
    if not res:
        return '<p class="muted">No research brief yet. Run the research module (say "run this week\'s research").</p>'
    trends = "".join(
        f'<tr><td>{e(t.get("topic"))}</td><td>{e(t.get("signal"))}</td>'
        f'<td><span class="chip {"pass" if t.get("fits") not in (None, "skip") else "muted"}">{e("Fits: " + str(t.get("fits")) if t.get("fits") not in (None, "skip") else "Skip")}</span></td>'
        f'<td class="muted">{e(t.get("note"))}</td></tr>' for t in res.get("trends", []))
    comp = "".join(
        f'<tr><td>{e(c.get("who"))}</td><td>{e(c.get("platform"))} · {e(c.get("format"))}</td><td>“{e(c.get("hook"))}”</td>'
        f'<td>{e(c.get("performance"))}</td><td class="muted">{e(c.get("why_it_worked"))}</td></tr>' for c in res.get("competitor_posts", []))
    qs = "".join(
        f'<div class="q"><div class="qc">{e(q.get("count", ""))}</div><div><b>{e(q.get("theme"))}</b><div class="muted">{e("; ".join(q.get("examples", [])[:2]))}</div></div></div>'
        for q in res.get("audience_questions", []))
    hooks = ""
    for h in res.get("hooks", []):
        cur, spe, rel = h.get("curiosity", 0), h.get("specific", 0), h.get("relatable", 0)
        copied = gravity_lint.copied_share(h.get("source_hook", ""), h.get("gravity_version", ""))
        hooks += f'''<div class="hook"><div class="muted small">{e(h.get("source"))} · {e(h.get("platform"))}</div>
          <div class="src">“{e(h.get("source_hook"))}”</div>
          <div class="small"><b>Why it worked:</b> {e(h.get("pattern"))}: {e(h.get("why"))}</div>
          <div class="bars"><span>Curiosity {cur}/3</span><span>Specific {spe}/2</span><span>Relatable {rel}/2</span></div>
          <div class="ours"><span class="muted small">Gravity's version</span><br>{e(h.get("gravity_version"))}</div>
          <div class="small muted">Copied words: {copied:.0%} (max 20%)</div></div>'''
    angles = "".join(f'<li><b>{e(a.get("angle"))}</b> <span class="muted">({e(a.get("pillar"))}, {e(a.get("leak"))})</span></li>'
                     for a in res.get("angles", []))
    return f'''
    <div class="banner"><div class="small">This week · {e(res.get("week"))} · {e(res.get("phase"))}</div><div class="big">{e(res.get("summary"))}</div>
      <div class="small">Signal to ride: <b>{e((res.get("trend_to_ride") or {}).get("topic"))}</b>. Source: research/briefs/{e(fname)}</div></div>
    <div class="cols2">
      <section class="panel"><h3>Signals this week</h3><div class="tw"><table><thead><tr><th>Topic</th><th>Signal</th><th>Fit</th><th>Note</th></tr></thead><tbody>{trends}</tbody></table></div></section>
      <section class="panel"><h3>What the audience asks</h3>{qs or '<p class="muted">None collected.</p>'}</section>
    </div>
    <section class="panel"><h3>Posts that outperformed in our space</h3><div class="tw"><table><thead><tr><th>Who</th><th>Where</th><th>Hook</th><th>Performance</th><th>Why</th></tr></thead><tbody>{comp}</tbody></table></div></section>
    <section class="panel"><h3>Hook lab: first lines side by side</h3><div class="hooks">{hooks}</div></section>
    <section class="panel"><h3>Angles sent to Content</h3><ul>{angles}</ul></section>'''


def decision_block(p, approvers) -> str:
    founder = p.platform == "linkedin-founder"
    return (f'<div class="decide" data-post="{e(p.id)}" data-hash="{e(p.content_hash())}" data-founder="{1 if founder else 0}">'
            f'<div class="dstate small" aria-live="polite">Loading decisions…</div>'
            f'<label class="small muted" for="why-{e(p.id)}">Reason (needed to reject)</label>'
            f'<textarea id="why-{e(p.id)}" class="why" rows="2"></textarea>'
            f'<div class="drow"><button type="button" class="btn approve">Approve</button>'
            f'<button type="button" class="btn reject">Reject</button></div></div>')


def tab_content(posts, results, approver, artifact=False, approvers=()) -> str:
    days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
    by_day = defaultdict(list)
    for p in posts:
        try:
            d = dt.datetime.fromisoformat(str(p.meta.get("scheduled_for")))
            by_day[d.weekday()].append((d, p))
        except ValueError:
            by_day[6].append((dt.datetime.max, p))
    grid = ""
    for i, name in enumerate(days):
        cards = "".join(
            f'<a class="mini {results[p.id].verdict().split("(")[0]}" href="#post-{e(p.id)}"><b>{e(SHORT.get(p.platform, p.platform))}</b> {e(d.strftime("%H:%M") if d != dt.datetime.max else "")}<br>'
            f'{e(p.meta.get("format"))}<br><span class="muted">{e(clip(p.meta.get("angle", ""), 64))}</span></a>'
            for d, p in sorted(by_day.get(i, []), key=lambda x: x[0]))
        grid += f'<div class="day"><div class="dh">{name}</div>{cards}</div>'
    queue = ""
    for p in posts:
        r = results[p.id]
        by = "Shamit Patel" if p.platform == "linkedin-founder" else approver
        issues = "".join(f'<li class="{s.lower()}"><b>{e(s)}</b> {e(ru)}: {e(m)}</li>' for s, ru, m in r.items)
        notes = p.section("Reviewer notes")
        script = p.section("Video script")
        queue += f'''<article class="card" id="post-{e(p.id)}" data-platform="{e(p.platform)}">
          <div class="row"><span class="badge">{e(PLATFORM_LABEL.get(p.platform, p.platform))}</span><span class="muted small">{e(p.meta.get("scheduled_for"))}</span></div>
          <h4>{e(p.id)} · {e(p.meta.get("format"))}</h4>
          <div class="muted small">pillar {e(p.meta.get("pillar"))} · leak {e(p.meta.get("leak"))} · CTA {e(p.meta.get("cta"))} · claims {e(", ".join(p.meta.get("claims") or []) or "none")}</div>
          <div class="chips">{chips(gravity_lint.check_summary(r))}</div>
          <div class="angle">{e(p.meta.get("angle"))}</div>
          {preview(p)}
          {f'<details><summary>Video script</summary><pre>{e(script)}</pre></details>' if script else ""}
          {f'<div class="notes"><b>Reviewer notes</b><br>{para(notes)}</div>' if notes else ""}
          {f'<ul class="issues">{issues}</ul>' if issues else ""}
          {decision_block(p, approvers) if artifact else f'<code class="cmd">python3 scripts/gate.py approve {e(p.id)} --by "{e(by)}"</code><code class="cmd">python3 scripts/gate.py reject {e(p.id)} --by "{e(by)}" --reason "..."</code>'}
        </article>'''
    plats = sorted({p.platform for p in posts})
    filt = '<button class="on" data-f="all">All</button>' + "".join(f'<button data-f="{e(x)}">{e(PLATFORM_LABEL.get(x, x))}</button>' for x in plats)
    n_fail = sum(1 for p in posts if results[p.id].errors)
    who = ""
    if artifact:
        opts = "".join(f'<option value="{e(a)}">{e(a)}</option>' for a in approvers)
        who = (f'<section class="panel whobar"><label for="who"><b>Approving as</b></label> <select id="who">{opts}</select>'
               f'<span class="small muted">Tap Approve or Reject on a post, then tap again to confirm. Decisions are recorded in the queue '
               f'by the weekday 7:25 a.m. CT run, or when you tell Claude "sync approvals". Only Shamit Patel can approve his own posts.</span>'
               f'<span id="dbstatus" class="small"></span></section>')
    return f'''{who}
    <div class="pills"><span class="pill">{len(posts)} waiting for approval</span><span class="pill">{n_fail} need fixes before they can be approved</span>
      <span class="pill">Voice: calm, specific, on the staff's side. No over-promise.</span><span class="pill">Claude writes, the linter checks, a person approves</span></div>
    <section class="panel"><h3>Next posts, by day</h3><div class="week">{grid}</div></section>
    <section class="panel"><h3>Approval queue</h3><div class="filters">{filt}</div><div class="grid">{queue or '<p class="muted">Nothing pending.</p>'}</div></section>'''


def tab_posting(cfg, d) -> str:
    sched = all_posts(["approved", "scheduled"])
    rows = defaultdict(lambda: defaultdict(list))
    for p in sched:
        try:
            t = dt.datetime.fromisoformat(str(p.meta.get("scheduled_for")))
            rows[p.platform][t.weekday()].append(f'{t.strftime("%H:%M")} {p.meta.get("format")} ({p.state})')
        except ValueError:
            pass
    days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
    enabled = [k for k, v in cfg.get("platforms", {}).items() if v.get("enabled")]
    grid = "<tr><th>Platform</th>" + "".join(f"<th>{x}</th>" for x in days) + "</tr>"
    for plat in enabled:
        grid += f"<tr><td>{e(PLATFORM_LABEL.get(plat, plat))}</td>" + "".join(
            f'<td>{"<br>".join(e(x) for x in rows[plat].get(i, [])) or "<span class=muted>·</span>"}</td>' for i in range(7)) + "</tr>"
    items = []
    for f in sorted((ROOT / "community" / "inbox").glob("*.yaml")):
        batch = load_yaml(f) or {}
        for it in batch.get("items", []) or []:
            it["_platform"] = batch.get("platform", "")
            items.append(it)
    counts = Counter(str(it.get("intent", "unclassified")) for it in items)
    count_html = "".join(f'<span class="pill">{e(k)} {v}</span>' for k, v in counts.most_common())
    inbox = "".join(
        f'<div class="msg"><div class="row"><b>{e(it.get("author"))}</b><span class="chip {"fail" if it.get("route") == "person" else "pass"}">{e(it.get("intent"))}</span></div>'
        f'<div class="muted small">{e(", ".join(x for x in [str(it.get("author_title") or ""), str(it.get("organization") or "")] if x))} · {e(it.get("_platform"))} {e(it.get("kind"))}</div><div>{e(it.get("text"))}</div>'
        + (f'<div class="reply"><span class="muted small">Draft reply ({e(it.get("reply_status", "pending"))})</span><br>{e(it.get("draft_reply"))}</div>' if it.get("draft_reply") else "")
        + (f'<div class="small callout">Needs a person: never auto-replied</div>' if it.get("route") == "person" else "")
        + "</div>" for it in items)
    leads = "".join(f'<tr><td>{e(r.get("date"))}</td><td>{e(r.get("name"))}</td><td>{e(r.get("organization"))}</td><td>{e(r.get("lead_score"))}</td><td>{e(r.get("summary"))}</td><td>{e(r.get("next_step"))}</td></tr>' for r in d["leads"])
    person = sum(1 for it in items if it.get("route") == "person" and it.get("reply_status", "pending") == "pending")
    return f'''
    <section class="panel"><h3>Schedule: approved and scheduled posts</h3><p class="muted small">Scheduling goes through Metricool behind the approval hook. Metricool brand {e(cfg.get("metricool", {}).get("brand_id"))}; auto-publish {e(cfg.get("metricool", {}).get("auto_publish"))}.</p>
      <div class="tw"><table class="sched">{grid}</table></div></section>
    <div class="cols2">
      <section class="panel"><h3>Inbox: every comment and DM</h3><div class="pills">{count_html or '<span class="muted">No messages collected yet.</span>'}</div>{inbox}</section>
      <section class="panel"><h3>Leads</h3><p class="muted small">{person} message(s) need you personally.</p>
        <div class="tw"><table><thead><tr><th>Date</th><th>Name</th><th>Org</th><th>Score</th><th>Summary</th><th>Next</th></tr></thead><tbody>{leads or '<tr><td colspan=6 class=muted>No leads this week.</td></tr>'}</tbody></table></div></section>
    </div>'''


def tab_growth(d) -> str:
    t = d["totals"]
    tiles = [("Pipeline from social", f"${t.get('value_usd', 0):,.0f}"), ("Demo requests", t.get("demo_request", 0)),
             ("Exam itemized requests", t.get("exam_itemized_request", 0)), ("Leads (comments/DMs)", len(d["leads"])),
             ("Link clicks", t.get("clicks", 0)), ("New followers", t.get("followers_delta", 0))]
    tiles_html = "".join(f'<div class="tile"><div class="muted small">{e(k)}</div><div class="num">{e(v)}</div></div>' for k, v in tiles)
    tiles_html += '<div class="tile dim"><div class="muted small">Likes</div><div class="small">Nice, but not the goal.</div></div>'
    funnel = [("Impressions", t.get("impressions", 0)), ("Engagements", t.get("engagements", 0)), ("Link clicks", t.get("clicks", 0)),
              ("Requests (demo + itemized)", t.get("demo_request", 0) + t.get("exam_itemized_request", 0)),
              ("Opportunities", t.get("opportunity", 0)), ("Customers", t.get("customer", 0))]
    top = max([v for _, v in funnel] + [1])
    fun = ""
    prev = None
    for k, v in funnel:
        rate = f"{v / prev:.1%}" if prev else ""
        fun += f'<div class="fr"><div class="fl">{e(k)}</div><div class="fb"><div style="width:{max(2, 100 * v / top):.1f}%"></div></div><div class="fv">{v:,} <span class="muted small">{rate}</span></div></div>'
        prev = v or None
    rows = "".join(f'<tr><td>{e(r["post_id"])}</td><td>{e(r.get("platform"))}</td><td>{r.get("impressions", 0)}</td><td>{r.get("engagements", 0)}</td>'
                   f'<td>{r.get("clicks", 0)}</td><td>{r.get("leads", 0)}</td><td>{r.get("demo_request", 0)}</td><td>{r.get("exam_itemized_request", 0)}</td>'
                   f'<td>${r.get("value_usd", 0):,.0f}</td></tr>' for r in d["posts"])
    note = "" if d["metrics_available"] else '<p class="callout">Metricool has no connected networks yet, so reach and clicks are empty. Connect LinkedIn, X and Instagram in Metricool.</p>'
    return f'''{note}<div class="tiles">{tiles_html}</div>
    <div class="cols2"><section class="panel"><h3>From post to pipeline · last {d["days"]} days</h3>{fun}
      <p class="muted small">Every link carries its post id as utm_content, so a request can be traced to the post that earned it.</p></section>
      <section class="panel"><h3>Which posts moved pipeline</h3><div class="tw"><table><thead><tr><th>Post</th><th>Platform</th><th>Impr.</th><th>Eng.</th><th>Clicks</th><th>Leads</th><th>Demo</th><th>Itemized</th><th>Pipeline</th></tr></thead>
      <tbody>{rows or '<tr><td colspan=9 class=muted>No published posts with data yet.</td></tr>'}</tbody></table></div></section></div>'''


def tab_brief(today) -> str:
    briefs = sorted((ROOT / "reports" / "daily").glob("*.md"))
    if not briefs:
        return '<p class="muted">No brief yet. Run: python3 scripts/morning_brief.py</p>'
    return f'<section class="panel brief">{md_to_html(briefs[-1].read_text(encoding="utf-8"))}</section>'


CSS = """
:root{--bg:#F6F4FA;--surface:#FFFFFF;--text:#0C0B1F;--muted:#5D5B6E;--rule:#E3DEEE;--accent:#002EED;--hi:#C0189A;--ok:#0A7A3E;--warn:#9A6300;--err:#B3261E;--chip:#EEE9F7;--ink:#0C0B1F}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){color-scheme:dark;--bg:#0C0B1F;--surface:#15143A;--text:#F4F3FA;--muted:#B5B3C8;--rule:#2E2D5C;--accent:#8EA0FF;--hi:#FE4BD1;--ok:#5BD08F;--warn:#F2B84B;--err:#FF8A80;--chip:#202052;--ink:#05041A}}
:root[data-theme="dark"]{color-scheme:dark;--bg:#0C0B1F;--surface:#15143A;--text:#F4F3FA;--muted:#B5B3C8;--rule:#2E2D5C;--accent:#8EA0FF;--hi:#FE4BD1;--ok:#5BD08F;--warn:#F2B84B;--err:#FF8A80;--chip:#202052;--ink:#05041A}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:14.5px/1.5 Inter,system-ui,sans-serif}
.top{background:var(--ink);color:#fff;padding:14px 16px}.top .in{max-width:1320px;margin:0 auto;display:flex;flex-wrap:wrap;gap:10px 24px;align-items:baseline}
.top h1{font:700 20px 'Space Grotesk',Inter,sans-serif;margin:0}.top .s{color:#CBCDD3;font-size:13px}
nav{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--surface);border-bottom:1px solid var(--rule)}nav .in{max-width:1320px;margin:0 auto;display:flex;overflow-x:auto;padding:0 8px}
nav button{border:0;background:none;color:var(--muted);font:600 14px Inter,sans-serif;padding:12px 14px;cursor:pointer;white-space:nowrap;border-bottom:3px solid transparent}
nav button.on{color:var(--text);border-bottom-color:var(--accent)}
main{max-width:1320px;margin:0 auto;padding:18px 16px 80px}.tab{display:none}.tab.on{display:block}
.panel{background:var(--surface);border:1px solid var(--rule);border-radius:12px;padding:16px;margin:0 0 16px;min-width:0}
h3{font:700 15px 'Space Grotesk',Inter,sans-serif;margin:0 0 10px}h4{margin:8px 0 2px;font-size:14px}
.banner{background:var(--ink);color:#fff;border-radius:12px;padding:18px;margin:0 0 16px}.banner .big{font:600 19px/1.4 'Space Grotesk',Inter,sans-serif;margin:6px 0}
.cols2{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr));gap:16px}
.tw{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:13px}th,td{text-align:left;padding:7px 8px;border-bottom:1px solid var(--rule);vertical-align:top}th{color:var(--muted);font-weight:600}
.muted{color:var(--muted)}.small{font-size:12.5px}.link{color:var(--accent)}
.chip{display:inline-block;font-size:11.5px;font-weight:600;padding:2px 8px;border-radius:999px;background:var(--chip);margin:2px 4px 2px 0}
.chip.pass{color:var(--ok)}.chip.warn{color:var(--warn)}.chip.fail{color:var(--err)}
.pills{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px}.pill{background:var(--surface);border:1px solid var(--rule);border-radius:999px;padding:5px 12px;font-size:12.5px}
.q{display:flex;gap:12px;padding:8px 0;border-bottom:1px solid var(--rule)}.qc{font:700 20px 'Space Grotesk',sans-serif;min-width:44px;color:var(--accent)}
.hooks{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:12px}
.hook{border:1px solid var(--rule);border-radius:10px;padding:12px}.hook .src{font-weight:600;margin:6px 0}.hook .ours{background:var(--chip);border-radius:8px;padding:8px;margin:8px 0}
.bars{display:flex;gap:8px;flex-wrap:wrap;font-size:12px;margin:6px 0}.bars span{background:var(--chip);padding:2px 8px;border-radius:6px}
.week{display:grid;grid-template-columns:repeat(7,minmax(130px,1fr));gap:8px;overflow-x:auto}.day{min-width:130px}.dh{font-weight:700;font-size:12px;color:var(--muted);margin-bottom:6px}
.mini{display:block;border:1px solid var(--rule);border-left:4px solid var(--ok);border-radius:8px;padding:6px 8px;margin-bottom:6px;font-size:12px;color:var(--text);text-decoration:none}
.mini.warn{border-left-color:var(--warn)}.mini.fail{border-left-color:var(--err)}
.filters{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}.filters button{border:1px solid var(--rule);background:var(--surface);color:var(--text);padding:5px 12px;border-radius:999px;cursor:pointer;font:inherit;font-size:13px}.filters button.on{background:var(--accent);border-color:var(--accent);color:#fff}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,400px),1fr));gap:14px}
.card{border:1px solid var(--rule);border-radius:12px;padding:14px;min-width:0;background:var(--surface)}.row{display:flex;justify-content:space-between;gap:8px;align-items:center}
.badge{font-size:12px;font-weight:600;padding:3px 8px;border-radius:6px;background:var(--chip)}.angle{font-style:italic;color:var(--muted);font-size:13px;margin:6px 0}
.pv{border:1px solid var(--rule);border-radius:10px;padding:12px;margin:8px 0;overflow-wrap:anywhere}.pv .who{font-weight:600;font-size:13px;margin-bottom:6px}.pv .who span{color:var(--muted);font-weight:400}
.tweet{border-bottom:1px solid var(--rule);padding:8px 0}.tweet:last-child{border-bottom:0}.count{font-size:11px;color:var(--muted);text-align:right}
.strip{display:flex;gap:6px;overflow-x:auto;margin-top:10px}.strip img{height:230px;border-radius:6px;border:1px solid var(--rule)}
.poll{margin-top:8px}.opt{border:1px solid var(--accent);border-radius:999px;padding:4px 10px;margin-top:6px;font-size:13px}
.comment,.notes,.reply{margin-top:8px;padding:8px;background:var(--chip);border-radius:8px;font-size:13px}
.issues{font-size:12.5px;padding-left:18px}.issues .error{color:var(--err)}.issues .warn{color:var(--warn)}
code.cmd{display:block;font-size:11.5px;background:var(--chip);padding:6px 8px;border-radius:6px;margin-top:6px;overflow-x:auto;white-space:nowrap}
pre{white-space:pre-wrap;font-size:12px}details summary{cursor:pointer;color:var(--muted)}
.msg{border-bottom:1px solid var(--rule);padding:10px 0}.callout{border-left:3px solid var(--hi);padding:6px 10px;background:var(--chip);border-radius:6px}
.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,170px),1fr));gap:12px;margin-bottom:16px}.tile{background:var(--surface);border:1px solid var(--rule);border-radius:12px;padding:14px}.tile .num{font:700 26px 'Space Grotesk',sans-serif}.tile.dim{opacity:.7}
.fr{display:grid;grid-template-columns:minmax(120px,190px) 1fr 110px;gap:10px;align-items:center;margin:8px 0;font-size:13px}.fb{background:var(--chip);border-radius:6px;height:16px;overflow:hidden}.fb div{height:100%;background:var(--accent)}.fv{text-align:right}
.brief h2{font:700 20px 'Space Grotesk',sans-serif}.brief code{background:var(--chip);padding:1px 5px;border-radius:4px}
.sched td{min-width:90px;font-size:12px}
.whobar{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center}
.whobar select{font:inherit;padding:6px 10px;border-radius:8px;border:1px solid var(--rule);background:var(--surface);color:var(--text)}
.decide{margin-top:10px;padding-top:10px;border-top:1px solid var(--rule);display:grid;gap:6px}
.decide textarea{font:inherit;width:100%;border:1px solid var(--rule);border-radius:8px;padding:8px;background:var(--surface);color:var(--text);resize:vertical}
.drow{display:flex;gap:8px;flex-wrap:wrap}
.btn{font:600 14px Inter,system-ui,sans-serif;padding:9px 16px;border-radius:8px;border:1px solid var(--rule);background:var(--surface);color:var(--text);cursor:pointer}
.btn.approve{background:var(--ok);border-color:var(--ok);color:#fff}.btn.reject{color:var(--err);border-color:var(--err)}
.btn.armed{outline:3px solid var(--hi);outline-offset:2px}.btn:disabled{opacity:.45;cursor:not-allowed}
.btn:focus-visible,nav button:focus-visible,.filters button:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.dstate.ok{color:var(--ok)}.dstate.warn{color:var(--warn)}.dstate.err{color:var(--err)}
"""

DECIDE_JS = r"""
(function(){
  const $ = (q, el=document) => [...el.querySelectorAll(q)];
  const blocks = $('.decide');
  const who = document.getElementById('who');
  const status = document.getElementById('dbstatus');
  try { const w = localStorage.getItem('gs-who'); if (w && who) who.value = w; } catch (e) {}
  if (who) who.addEventListener('change', () => { try { localStorage.setItem('gs-who', who.value); } catch (e) {} paint(); });
  let db = null, me = null, canWrite = null, decisions = {};
  function setAll(msg, cls) { blocks.forEach(b => { const s = b.querySelector('.dstate'); s.textContent = msg; s.className = 'dstate small ' + (cls||''); }); }
  function paint() {
    blocks.forEach(b => {
      const id = b.dataset.post, d = decisions[id], s = b.querySelector('.dstate');
      const founderBlocked = b.dataset.founder === '1' && who && who.value !== 'Shamit Patel';
      let msg = '', cls = '', locked = !db || canWrite === false || !me || founderBlocked;
      if (d) {
        const verb = d.decision === 'approve' ? 'Approved' : 'Rejected';
        if (d.status === 'recorded') { msg = verb + ' by ' + d.approver + ' · recorded in the queue'; cls = 'ok'; locked = true; }
        else if (d.status === 'new') { msg = verb + ' by ' + d.approver + ' · waiting for the next sync'; cls = 'warn'; }
        else if (d.content_hash !== b.dataset.hash) { msg = 'This post changed after the last decision. Review it again.'; cls = 'warn'; }
        else { msg = (d.result || d.status) + ''; cls = 'err'; }
      } else if (founderBlocked) { msg = 'Only Shamit Patel can approve his own posts.'; }
      else if (!msg) { msg = 'Waiting for your decision.'; }
      s.textContent = msg; s.className = 'dstate small ' + cls;
      b.querySelectorAll('.btn').forEach(x => { x.disabled = locked; });
    });
  }
  async function decide(b, decision, btn) {
    if (!btn.classList.contains('armed')) {
      $('.btn.armed').forEach(x => { x.classList.remove('armed'); x.textContent = x.classList.contains('approve') ? 'Approve' : 'Reject'; });
      btn.classList.add('armed'); btn.textContent = 'Tap again to ' + decision; return;
    }
    btn.classList.remove('armed'); btn.textContent = decision === 'approve' ? 'Approve' : 'Reject';
    const reason = b.querySelector('.why').value.trim();
    const s = b.querySelector('.dstate');
    if (decision === 'reject' && !reason) { s.textContent = 'Add a reason so the rewrite can fix it.'; s.className = 'dstate small err'; return; }
    try {
      await db.doc('decisions/' + b.dataset.post).set({
        post_id: b.dataset.post, decision, approver: who ? who.value : '', by: me,
        content_hash: b.dataset.hash, reason, decided_at: new Date().toISOString(), status: 'new', result: ''
      });
    } catch (err) {
      if (err && err.code === 'invalid_argument') { canWrite = false; s.textContent = 'You can view this page but not record decisions. Ask the owner for Contributor access.'; }
      else { s.textContent = 'Could not save. Check your connection and try again.'; }
      s.className = 'dstate small err'; paint();
    }
  }
  blocks.forEach(b => {
    b.querySelector('.approve').addEventListener('click', e => decide(b, 'approve', e.currentTarget));
    b.querySelector('.reject').addEventListener('click', e => decide(b, 'reject', e.currentTarget));
  });
  setAll('Loading decisions…');
  const use = window.claude && window.claude.use ? window.claude.use.bind(window.claude) : null;
  if (!use) { setAll('Decisions can only be recorded when this page is opened in Claude. Tell Claude "approve <id>" instead.'); paint(); return; }
  Promise.all([use('db'), use('user')]).then(async ([d, u]) => {
    db = d;
    if (!db) { setAll('This view can't record decisions. Open the page signed in, or tell Claude "approve <id>".'); paint(); return; }
    if (u) { me = await u.id(); canWrite = await u.can('data.write'); }
    if (!me) { if (status) status.textContent = 'Sign in to record decisions.'; }
    else if (canWrite === false) { if (status) status.textContent = 'You have view access only. Ask the owner for Contributor access to approve here.'; }
    db.collection('decisions').onSnapshot(snap => {
      const next = {}; snap.docs.forEach(x => { if (x.exists) next[x.id] = x.data(); });
      decisions = next; paint();
    }, () => { setAll('Lost the connection to decisions. Reload the page.'); });
    paint();
  });
})();
"""

JS = """
const tabs=[...document.querySelectorAll('nav button')];
function show(id){tabs.forEach(b=>b.classList.toggle('on',b.dataset.t===id));document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on',t.id===id));
 try{localStorage.setItem('gs-tab',id)}catch(e){}}
tabs.forEach(b=>b.onclick=()=>show(b.dataset.t));
let saved=null;try{saved=localStorage.getItem('gs-tab')}catch(e){}
show(location.hash.startsWith('#post-')?'content':(saved||'content'));
const fb=[...document.querySelectorAll('.filters button')];
fb.forEach(b=>b.onclick=()=>{fb.forEach(x=>x.classList.remove('on'));b.classList.add('on');const f=b.dataset.f;
 document.querySelectorAll('.card[data-platform]').forEach(c=>c.style.display=(f==='all'||c.dataset.platform===f)?'':'none')});
"""


def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--artifact", action="store_true", help="build the published web page (no doc wrapper, with Approve/Reject)")
    ap.add_argument("--date", help="build as of this date (YYYY-MM-DD); default today")
    args = ap.parse_args()
    artifact = args.artifact
    cfg = config()
    today = dt.date.fromisoformat(args.date) if args.date else dt.date.today()
    d = morning_brief.collect(today)
    approver = (cfg.get("approval", {}).get("approvers") or [{"name": "Approver"}])[0]["name"]
    ledger = gravity_lint.Ledger()
    guard = load_yaml(ROOT / "brand" / "guardrails.yaml")
    limits = load_yaml(ROOT / "platforms" / "limits.yaml")
    posts = sorted(all_posts(["pending"]), key=lambda p: str(p.meta.get("scheduled_for", "")))
    results = {p.id: gravity_lint.lint_post(p, ledger, guard, limits, cfg) for p in posts}
    camp = next((c for c in cfg.get("campaigns", [])), {})
    t = today.isoformat()
    phases = [(str(ph["from"]), str(ph["to"]), ph["name"]) for ph in camp.get("phases", [])]
    phase = next((n for a, b, n in phases if a <= t <= b), "")
    if not phase:
        upcoming = [(a, n) for a, b, n in phases if a > t]
        phase = f"{upcoming[0][1]} starts {upcoming[0][0]}" if upcoming else "n/a"
    doc = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Gravity Social OS</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Space+Grotesk:wght@600;700&display=swap">
<style>{CSS}</style></head><body>
<div class="top"><div class="in"><h1>Gravity Social OS</h1><span class="s">Alpha Nodus · {e(camp.get("name", ""))} · phase: {e(phase or "n/a")} · built {dt.datetime.now().strftime("%Y-%m-%d %H:%M")}</span>
<span class="s">Nothing goes public without a named approval.</span></div></div>
<nav><div class="in"><button data-t="research">Research</button><button data-t="content">Content · {len(posts)} waiting</button>
<button data-t="posting">Posting &amp; community</button><button data-t="growth">Growth</button><button data-t="brief">Morning brief</button></div></nav>
<main>
<div class="tab" id="research">{tab_research(d.get("research") or {}, d.get("research_file", ""))}</div>
<div class="tab" id="content">{tab_content(posts, results, approver, artifact, [a["name"] for a in cfg.get("approval", {}).get("approvers", [])])}</div>
<div class="tab" id="posting">{tab_posting(cfg, d)}</div>
<div class="tab" id="growth">{tab_growth(d)}</div>
<div class="tab" id="brief">{tab_brief(today)}</div>
</main><script>{JS}</script>{f"<script>{DECIDE_JS}</script>" if artifact else ""}</body></html>"""
    if artifact:  # the Artifact publisher supplies doctype/html/head/body itself
        doc = re.sub(r"^<!doctype html><html[^>]*><head>", "", doc)
        doc = doc.replace("</head><body>", "", 1).replace("</body></html>", "")
        doc = re.sub(r'<meta charset="utf-8"><meta name="viewport"[^>]*>', "", doc)
    out = ROOT / "content" / ("dashboard-artifact.html" if artifact else "dashboard.html")
    out.write_text(doc, encoding="utf-8")
    print(f"Wrote {out.relative_to(ROOT)}: {len(posts)} pending, research={'yes' if d.get('research') else 'no'}")


if __name__ == "__main__":
    main()
