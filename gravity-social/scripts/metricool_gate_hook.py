#!/usr/bin/env python3
"""Claude Code PreToolUse hook: the structural half of "nothing goes public without a yes".

Registered in .claude/settings.json for the Metricool tools that create or change
scheduled posts. It reads the tool call from stdin and BLOCKS (exit 2) unless:

  * the post goes to exactly one network (platform-specific content, never one text everywhere),
  * its text is identical to an approved post for that platform in content/queue/approved|scheduled,
  * that post's public text has not changed since approval (content hash intact),
  * every thread part and the first comment also match the approved post,
  * autoPublish matches config.yaml (metricool.auto_publish).

A block explains why on stderr, which Claude Code shows to the model.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

# Metricool's "linkedin" network is the company page. Shamit's personal posts are never scheduled here.
NETWORK_TO_PLATFORM = {"twitter": "x", "linkedin": "linkedin-company", "instagram": "instagram", "youtube": "youtube-shorts"}


def block(msg: str) -> None:
    print(f"Gravity approval gate: BLOCKED. {msg}", file=sys.stderr)
    sys.exit(2)


def main():
    try:
        event = json.load(sys.stdin)
    except Exception as e:  # malformed input must never let a post through
        block(f"Could not read the hook payload ({e}).")
    tool_input = event.get("tool_input") or {}
    raw_info = tool_input.get("info")
    if raw_info is None:
        block("No `info` in the Metricool call.")
    try:
        info = json.loads(raw_info) if isinstance(raw_info, str) else raw_info
    except Exception as e:
        block(f"`info` is not valid JSON ({e}).")

    try:
        from gs_common import config, normalize
        from gate import find_approved_match
    except Exception as e:
        block(f"Gate scripts failed to load ({e}).")

    providers = [p.get("network") for p in info.get("providers", []) if isinstance(p, dict)]
    if len(providers) != 1:
        block(f"Exactly one network per post (got {providers}). Each platform gets its own approved draft.")
    platform = NETWORK_TO_PLATFORM.get(providers[0])
    if not platform:
        block(f"Network {providers[0]!r} is not configured in Gravity Social.")

    text = info.get("text", "")
    post, intact = find_approved_match(platform, text)
    if not post:
        block("No approved post in content/queue/approved or scheduled has exactly this text. "
              "Draft it, lint it, and get it approved with scripts/gate.py first.")
    if not intact:
        block(f"{post.id} was edited after approval. Run `python3 scripts/gate.py reopen {post.id}` and get it re-approved.")

    parts = post.thread_parts()
    desc = info.get("descendants") or []
    if parts:
        sent = [normalize(d.get("text", "")) for d in desc if isinstance(d, dict)]
        if sent != [normalize(p) for p in parts[1:]]:
            block(f"Thread parts don't match approved post {post.id}.")
    elif desc:
        block(f"{post.id} is not a thread, but the call has descendants.")

    fc_sent = normalize(info.get("firstCommentText", "") or "")
    fc_ok = normalize(post.section("First comment"))
    if fc_sent and fc_sent != fc_ok:
        block(f"First comment differs from approved post {post.id}.")

    if platform == "youtube-shorts":
        yt_title = normalize(str((info.get("youtubeData") or {}).get("title", "")))
        if yt_title != normalize(post.section("Title")):
            block(f"YouTube title differs from approved post {post.id}.")

    cfg = config()
    want_auto = bool(cfg.get("metricool", {}).get("auto_publish", False))
    got_auto = info.get("autoPublish", True)
    if not info.get("draft") and bool(got_auto) != want_auto:
        block(f"autoPublish must be {str(want_auto).lower()} (config.yaml metricool.auto_publish).")

    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse",
                                             "additionalContext": f"Gravity gate: matched approved post {post.id} "
                                                                  f"(approved by {post.meta.get('approved_by')}). "
                                                                  f"After success run: python3 scripts/gate.py mark-scheduled {post.id} --metricool-id <id>"}}))
    sys.exit(0)


if __name__ == "__main__":
    main()
