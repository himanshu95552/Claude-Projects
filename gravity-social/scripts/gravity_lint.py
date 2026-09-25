#!/usr/bin/env python3
"""Gravity Social linter: brand guardrails, proof ledger and platform limits.

Usage:
  python3 scripts/gravity_lint.py content/queue/pending/*.md
  python3 scripts/gravity_lint.py --state pending [--write] [--json]
  python3 scripts/gravity_lint.py --text "a reply to check" --platform linkedin-company

Exit code 1 if any file has an ERROR. `--write` records the result in each
post's `lint:` frontmatter field. A post with errors cannot be approved
(scripts/gate.py re-runs this linter before approving).
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gs_common import ROOT, Post, all_posts, config, load_yaml  # noqa: E402

VALID_PILLARS = {"three-leaks", "referral-loop", "order-to-exam", "get-paid", "exam-itemized",
                 "aos-category", "proof", "founder-and-team", "industry-signal"}
VALID_CTAS = {"aos-page", "exam-itemized", "demo", "rsna-booth", "none"}
REQUIRED_META = ["id", "platform", "format", "pillar", "claims", "cta", "scheduled_for", "status"]

URL_RE = re.compile(r"https?://\S+")
HASHTAG_RE = re.compile(r"(?<![\w&])#([A-Za-z][\w]*)")
EMOJI_RE = re.compile("[\U0001F300-\U0001FAFF\U00002600-\U000027BF\U0001F000-\U0001F2FF]")
MONEY_RE = re.compile(r"\$\s?\d[\d,]*(?:\.\d+)?(?:\s?(?:million|billion|[kKmMbB])\b)?")
PCT_RE = re.compile(r"\b\d+(?:\.\d+)?\s?(?:%|percent\b)")
MULT_RE = re.compile(r"\b\d+(?:\.\d+)?x\b")
BIG_RE = re.compile(r"\b\d{1,3}(?:,\d{3})+\b|\b\d{4,}\b")
PLAIN_RE = re.compile(r"(?<![\d$.,:/])\b\d{2,3}\b(?![\d,.:/%x])")
NAMED_RADIOLOGY = re.compile(r"Tower Radiology|Academic Radiology|Radiology Business|Radiology:\s*A(rtificial )?I(ntelligence)?|Radiological Society|Journal of[^.]*Radiology|in Radiology Using", re.I)


def norm_fig(s: str) -> str:
    s = s.lower().replace(" ", "").replace("percent", "%")
    s = s.replace("million", "m").replace("billion", "b")
    return s


class Ledger:
    def __init__(self):
        d = load_yaml(ROOT / "brand" / "proof-ledger.yaml")
        self.entries = {e["id"]: e for e in d.get("gravity", []) + d.get("benchmarks", [])}
        self.fig_owner: dict[str, set[str]] = {}
        for e in self.entries.values():
            for f in e.get("figures", []) or []:
                self.fig_owner.setdefault(norm_fig(str(f)), set()).add(e["id"])

    def figures_of(self, ids) -> set[str]:
        out = set()
        for i in ids:
            for f in self.entries.get(i, {}).get("figures", []) or []:
                out.add(norm_fig(str(f)))
        return out


class Result:
    def __init__(self, label: str):
        self.label = label
        self.items: list[tuple[str, str, str]] = []  # (severity, rule, message)

    def add(self, sev, rule, msg):
        self.items.append((sev, rule, msg))

    @property
    def errors(self):
        return [i for i in self.items if i[0] == "ERROR"]

    @property
    def warns(self):
        return [i for i in self.items if i[0] == "WARN"]

    def verdict(self) -> str:
        if self.errors:
            return f"fail({len(self.errors)})"
        if self.warns:
            return f"warn({len(self.warns)})"
        return "pass"


def x_weighted_len(text: str) -> int:
    return len(URL_RE.sub("x" * 23, text))


def strip_for_words(text: str) -> str:
    """Remove URLs and hashtags so word rules don't fire on them."""
    return HASHTAG_RE.sub(" ", URL_RE.sub(" ", text))


# ---------------------------------------------------------------------------
def check_text(res: Result, chunks: list[tuple[str, str]], platform: str, meta: dict, ledger: Ledger, guard: dict):
    full = "\n\n".join(t for _, t in chunks)
    words = strip_for_words(full)

    # 1. Guardrail patterns
    for rule in guard["rules"]:
        rx = re.compile(rule["pattern"], re.I)
        for label, text in chunks:
            body = strip_for_words(text)
            m = rx.search(body)
            if m:
                sev = "ERROR" if rule["severity"] == "error" else "WARN"
                fix = f" Fix: {rule['fix']}." if rule.get("fix") else ""
                res.add(sev, rule["id"], f"[{label}] \"{m.group(0)}\": {rule['why']}{fix}")
                break

    # 2. AOS spelled out before first bare use
    m_aos = re.search(r"\bAOS\b", words)
    if m_aos:
        spelled = re.search(r"Agentic Operations System", words)
        if not spelled or spelled.start() > m_aos.start():
            res.add("ERROR", "aos-first-use", 'Spell out "Agentic Operations System (AOS)" before the first bare "AOS".')

    # 3. Numbers must come from the proof ledger, via the post's claims
    claims = meta.get("claims") or []
    unknown = [c for c in claims if c not in ledger.entries]
    for c in unknown:
        res.add("ERROR", "claims", f"Claim id {c} is not in brand/proof-ledger.yaml.")
    allowed = ledger.figures_of(claims)
    found: list[tuple[str, str]] = []
    spans: list[tuple[int, int]] = []
    for rx, kind in ((MONEY_RE, "money"), (PCT_RE, "percent"), (MULT_RE, "multiplier"), (BIG_RE, "number")):
        for m in rx.finditer(words):
            tok = m.group(0)
            spans.append(m.span())
            if kind == "number" and re.fullmatch(r"(19[5-9]\d|20[0-4]\d)", tok):
                continue  # a year
            found.append((kind, tok))
    seen = set()
    for kind, tok in found:
        n = norm_fig(tok)
        if n in seen:
            continue
        seen.add(n)
        if n in allowed:
            continue
        owners = ledger.fig_owner.get(n)
        if owners:
            res.add("ERROR", "numbers-in-ledger", f'"{tok}" belongs to {sorted(owners)}; add the right id to `claims:` (and follow its must_say).')
        else:
            res.add("ERROR", "numbers-in-ledger", f'"{tok}" is not in the proof ledger. Remove it, or get it approved and added.')
    for m in PLAIN_RE.finditer(words):
        n = m.group(0)
        if any(a <= m.start() < b for a, b in spans):
            continue  # already checked as part of a $, % or large number
        if n in allowed or n in seen or re.fullmatch(r"\d", n):
            continue
        ctx = words[max(0, m.start() - 12): m.end() + 12]
        if re.search(rf"{n}\s*/\s*\d|\d\s*/\s*{n}|{n}:\d\d|\d:{n}", ctx):
            continue  # thread numbering or a clock time
        seen.add(n)
        res.add("WARN", "numbers-in-ledger", f'"{n}" is not a ledger figure. If it is illustrative (the demo story, a slot time), say so in Reviewer notes.')

    # 4. Claim-level rules
    low = words.lower()
    for cid in claims:
        e = ledger.entries.get(cid)
        if not e:
            continue
        if e.get("status") == "modeled" and "model" not in low:
            res.add("ERROR", "modeled-label", f'{cid} is a modeled figure: say "modeled" (e.g. "one blended outpatient exam, modeled").')
        figs_present = [f for f in e.get("figures", []) or [] if norm_fig(str(f)) in seen]
        for req in e.get("requires", []) or []:
            if figs_present and norm_fig(req) not in seen:
                res.add("ERROR", "requires", f'{cid} is used, so the conservative case "{req}" must appear too.')
        if e.get("attribute") and e.get("cite_as"):
            if not any(c.lower() in full.lower() for c in e["cite_as"]):
                res.add("WARN", "benchmark-attribution", f'{cid} must name its source: one of {e["cite_as"]} (the first comment is fine on LinkedIn).')
        if e.get("status") == "beta" and "beta" not in low:
            res.add("ERROR", "beta-label", f"{cid} is beta; say so.")

    # 5. Beta capabilities
    if re.search(r"charges? (are )?(created )?(straight )?(off|from) the (signed )?report|claim simulator|remittance|\b835\b|text[- ]to[- ]pay", low) and "beta" not in low:
        res.add("ERROR", "beta-label", 'Charges from the report, the claim simulator and remittance posting are beta. Say "beta".')

    # 6. Report delivery disclaimer
    if re.search(r"(deliver|return|send)s?\w*\s+(the\s+)?(signed\s+)?(report|images)|every report returned|report and (the )?images", low):
        if not re.search(r"(don't|doesn't|do not|does not|never) read|not (read|store)", low):
            res.add("WARN", "report-disclaimer", 'Report/image delivery is claimed: add "We don\'t read the scan. We make sure it gets back."')

    # 7. Tone
    if full.count("!") > 1:
        res.add("WARN", "exclamations", f"{full.count('!')} exclamation marks; the voice is calm (1 max).")
    if not meta.get("radiology_ok"):
        rad = re.search(r"\bradiology\b", NAMED_RADIOLOGY.sub(" ", words), re.I)
        if rad:
            res.add("WARN", "radiology-in-body", '"Imaging" in copy; "radiology" in hashtags. Set radiology_ok: true if this is a deliberate X/RSNA/trade-press exception.')


def check_platform(res: Result, post: Post, limits: dict, cfg: dict):
    plat = post.platform
    lim = limits.get(plat)
    if not lim:
        res.add("ERROR", "platform", f"Unknown platform {plat!r}.")
        return
    pcfg = cfg.get("platforms", {}).get(plat, {})
    if not pcfg.get("enabled", False):
        res.add("WARN", "platform", f"{plat} is disabled in config.yaml.")
    fmt = str(post.meta.get("format", ""))
    if lim.get("formats") and fmt not in lim["formats"]:
        res.add("ERROR", "format", f"format {fmt!r} not valid for {plat}; use one of {lim['formats']}.")

    main = post.section("Post")
    parts = post.thread_parts()
    bodies = parts or ([main] if main else [])
    rsna = "rsna" in str(post.meta.get("pillar", "")) or "rsna" in json.dumps(post.meta).lower()

    if plat == "x":
        for i, b in enumerate(bodies, 1):
            n = x_weighted_len(b)
            if n > lim["post_max_chars"]:
                res.add("ERROR", "length", f"X post {i} is {n} weighted chars (max {lim['post_max_chars']}).")
        if fmt == "thread":
            lo, hi = lim["thread_parts"]
            if not lo <= len(parts) <= hi:
                res.add("WARN", "thread", f"Thread has {len(parts)} parts (house range {lo} to {hi}).")
    elif main:
        if len(main) > lim.get("post_max_chars", 10**9):
            res.add("ERROR", "length", f"{len(main)} chars (max {lim['post_max_chars']}).")
        first_line = main.strip().split("\n")[0]
        if lim.get("hook_max_chars") and len(first_line) > lim["hook_max_chars"]:
            res.add("WARN", "hook", f"First line is {len(first_line)} chars; it truncates at ~{lim['hook_max_chars']}.")
    elif fmt not in ("short",) and plat != "x":
        res.add("ERROR", "empty", "No ## Post section.")

    if plat == "youtube-shorts":
        title = post.section("Title")
        if not title:
            res.add("ERROR", "title", "YouTube needs a ## Title (search phrase first, house line second).")
        elif len(title) > lim.get("title_max_chars", 100):
            res.add("ERROR", "title", f"Title is {len(title)} chars (max {lim['title_max_chars']}).")
        if len(post.section("Description")) > lim.get("description_max_chars", 5000):
            res.add("ERROR", "length", "Description too long.")
        bodies = [post.section("Description")] if post.section("Description") else []

    body_all = "\n".join(bodies)
    tags = HASHTAG_RE.findall(post.public_text() if plat == "instagram" else body_all)
    tag_max = lim.get("hashtags_max_rsna", lim.get("hashtags_max")) if rsna else lim.get("hashtags_max")
    if tag_max is not None and len(tags) > tag_max:
        res.add("ERROR", "hashtags", f"{len(tags)} hashtags (max {tag_max} on {plat}).")
    for t in tags:
        if re.search(r"platform|aipowered|aifirst", t, re.I):
            res.add("ERROR", "hashtags", f"#{t} uses retired language.")
    emo = len(EMOJI_RE.findall(body_all))
    if lim.get("emojis_max") is not None and emo > lim["emojis_max"]:
        res.add("WARN", "emoji", f"{emo} emojis (house max {lim['emojis_max']}).")
    if URL_RE.search(main or ""):
        pol = lim.get("links_in_body")
        if pol == "error":
            res.add("ERROR", "links", "Links don't click in Instagram captions; say \"Link in bio\".")
        elif pol == "warn":
            res.add("WARN", "links", "Link in the post body; move it to ## First comment.")

    if lim.get("alt_text_required") and (post.slides() or fmt in ("image", "carousel")) and not post.section("Alt text"):
        res.add("ERROR", "alt-text", "Alt text is required for every image or slide.")
    if lim.get("media_required") and not (post.slides() or post.section("Video script") or post.section("Media")):
        res.add("ERROR", "media", f"{plat} needs media: add ## Slides or ## Video script.")
    sl = post.slides()
    if sl and lim.get("carousel_frames"):
        n = len(sl.get("slides", []))
        lo, hi = lim["carousel_frames"]
        if not lo <= n <= hi:
            res.add("WARN", "carousel", f"{n} frames (house range {lo} to {hi}).")
    if fmt == "document-carousel" and not sl:
        res.add("ERROR", "carousel", "document-carousel needs a ## Slides yaml block.")
    poll = post.poll()
    if fmt == "poll":
        if not poll:
            res.add("ERROR", "poll", "format poll needs a ## Poll yaml block.")
        else:
            opts = poll.get("options", [])
            lo, hi = lim.get("poll_options", [2, 4])
            if not lo <= len(opts) <= hi:
                res.add("ERROR", "poll", f"{len(opts)} poll options (allowed {lo} to {hi}).")
            for o in opts:
                if lim.get("poll_option_max") and len(str(o)) > lim["poll_option_max"]:
                    res.add("ERROR", "poll", f'Option "{o}" is over {lim["poll_option_max"]} chars.')
            if lim.get("poll_question_max") and len(str(poll.get("question", ""))) > lim["poll_question_max"]:
                res.add("ERROR", "poll", "Poll question too long.")


def check_meta(res: Result, post: Post):
    for k in REQUIRED_META:
        if k not in post.meta or post.meta.get(k) in (None,):
            res.add("ERROR", "frontmatter", f"Missing `{k}`.")
    if post.meta.get("pillar") not in VALID_PILLARS:
        res.add("ERROR", "frontmatter", f"pillar must be one of {sorted(VALID_PILLARS)}.")
    if post.meta.get("cta") not in VALID_CTAS:
        res.add("ERROR", "frontmatter", f"cta must be one of {sorted(VALID_CTAS)}.")
    if not isinstance(post.meta.get("claims"), list):
        res.add("ERROR", "frontmatter", "`claims` must be a list ([] if none).")
    if post.meta.get("cta") not in ("none", None):
        link = str(post.meta.get("link") or "")
        if not link:
            res.add("WARN", "cta", "CTA set but `link` is empty; build one with scripts/utm.py.")
        elif "utm_" not in link:
            res.add("WARN", "cta", "Link has no UTM parameters; use scripts/utm.py.")
        elif link not in post.public_text() and post.platform != "instagram":
            res.add("WARN", "cta", "The `link` is not in the post or first comment.")


def copied_share(source: str, text: str, n: int = 3) -> float:
    """Share of the source hook's word n-grams that reappear in the post (the reference's 'Copied words %')."""
    tok = lambda s: re.findall(r"[a-z0-9']+", s.lower())
    src, dst = tok(source), tok(text)
    grams = lambda t: {tuple(t[i:i + n]) for i in range(len(t) - n + 1)}
    g_src = grams(src)
    if not g_src:
        return 0.0
    return len(g_src & grams(dst)) / len(g_src)


def check_original(res: Result, post: Post):
    src = str(post.meta.get("hook_source_text") or "")
    if not src:
        return
    share = copied_share(src, post.public_text())
    res.originality = share
    if share > 0.40:
        res.add("ERROR", "original", f"{share:.0%} of the source hook's phrasing is copied. Keep the pattern, write our own words.")
    elif share > 0.20:
        res.add("WARN", "original", f"{share:.0%} of the source hook's phrasing is copied (house max 20%).")


# The reference system's per-post checks, derived from the rules that fired.
CHECK_GROUPS = {
    "On brand": {"platform", "ai-powered", "personas", "seam", "front-back-office", "rpa", "workforce", "sidekick",
                 "old-leads", "gravity-platform", "rpa-mention", "get-the-referral", "agentic-os", "restaurant", "cartoon-patients",
                 "aos-first-use", "radiology-in-body", "hype", "ai-magic", "exclamations", "blame-staff", "competitors",
                 "partners", "replace-ris", "less-staff", "emoji", "hashtags"},
    "No over-promise": {"guarantee", "zero-generic", "numbers-in-ledger", "modeled-label", "requires", "beta-label",
                        "report-disclaimer", "reads-scans", "diagnostic-ai", "soc2", "hipaa-cert", "other-certs",
                        "more-secure", "encryption-in-transit", "customer-count", "klas", "founder-turnaround",
                        "spanish-inbound", "benchmark-attribution", "claims", "layoffs", "no-competitors", "pricing",
                        "confidential-names", "dicom-pacs", "phi"},
    "Original": {"original"},
}


def check_summary(res: Result) -> dict:
    out = {}
    for name, rules in CHECK_GROUPS.items():
        hits = [s for s, r, _ in res.items if r in rules]
        out[name] = "fail" if "ERROR" in hits else "warn" if hits else "pass"
    out["Platform fit"] = "fail" if any(s == "ERROR" for s, r, _ in res.items
                                        if not any(r in g for g in CHECK_GROUPS.values())) else "pass"
    return out


def lint_post(post: Post, ledger, guard, limits, cfg) -> Result:
    res = Result(str(post.path.relative_to(ROOT)))
    res.originality = None
    check_meta(res, post)
    check_text(res, post.public_chunks(), post.platform, post.meta, ledger, guard)
    check_platform(res, post, limits, cfg)
    check_original(res, post)
    return res


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("files", nargs="*")
    ap.add_argument("--state", help="lint every post in content/queue/<state>")
    ap.add_argument("--write", action="store_true", help="record the verdict in each post's lint: field")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--text", help="lint a loose piece of text (e.g. a community reply)")
    ap.add_argument("--platform", default="linkedin-company")
    ap.add_argument("--claims", default="", help="comma-separated claim ids for --text")
    args = ap.parse_args(argv)

    ledger = Ledger()
    guard = load_yaml(ROOT / "brand" / "guardrails.yaml")
    limits = load_yaml(ROOT / "platforms" / "limits.yaml")
    cfg = config()

    results: list[Result] = []
    if args.text is not None:
        res = Result("text")
        meta = {"claims": [c for c in args.claims.split(",") if c], "radiology_ok": False}
        check_text(res, [("text", args.text)], args.platform, meta, ledger, guard)
        results.append(res)
    else:
        posts = [Post(Path(f)) for f in args.files] if args.files else all_posts([args.state] if args.state else ["pending"])
        for p in posts:
            r = lint_post(p, ledger, guard, limits, cfg)
            results.append(r)
            if args.write:
                p.set_meta(lint=r.verdict())

    if args.json:
        print(json.dumps([{"file": r.label, "verdict": r.verdict(),
                           "items": [{"severity": s, "rule": ru, "message": m} for s, ru, m in r.items]}
                          for r in results], indent=2))
    else:
        for r in results:
            print(f"{r.verdict():10} {r.label}")
            for sev, rule, msg in r.items:
                print(f"    {sev:5} {rule:22} {msg}")
        n_err = sum(len(r.errors) for r in results)
        n_warn = sum(len(r.warns) for r in results)
        print(f"\n{len(results)} checked · {n_err} errors · {n_warn} warnings")
    return 1 if any(r.errors for r in results) else 0


if __name__ == "__main__":
    sys.exit(main())
