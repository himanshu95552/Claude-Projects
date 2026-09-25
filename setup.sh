#!/usr/bin/env bash
# Gravity Social OS: set up a fresh machine or Claude session in one step.
#
#   bash setup.sh                     # check tools, run the tests
#   bash setup.sh <private-bundle>    # also restore the private files (folder or .zip)
#
# The private bundle is the `private/` folder that ships in gravity-social-code.zip
# (the AN27 originals, the task-observer workspace, local-only files, the conversation
# history). It is never committed: this repo is public.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GS="$ROOT/gravity-social"
OBS="$HOME/.claude/skill-observations"
ok()   { printf '  \033[32mok\033[0m    %s\n' "$*"; }
warn() { printf '  \033[33mwarn\033[0m  %s\n' "$*"; }
fail() { printf '  \033[31mFAIL\033[0m  %s\n' "$*"; exit 1; }

echo "1. Tools"
command -v python3 >/dev/null || fail "python3 not found (3.9+ needed)"
python3 -c 'import sys; sys.exit(0 if sys.version_info >= (3,9) else 1)' || fail "python3 is older than 3.9"
ok "$(python3 --version)"
if ! python3 -c 'import yaml' 2>/dev/null; then
  python3 -m pip install -q -r "$GS/requirements.txt" 2>/dev/null \
    || python3 -m pip install -q --user -r "$GS/requirements.txt" 2>/dev/null \
    || python3 -m pip install -q --break-system-packages -r "$GS/requirements.txt" \
    || fail "could not install PyYAML"
fi
ok "PyYAML"
RENDER=0
if command -v node >/dev/null; then
  if node -e 'try{require("playwright")}catch(e){require(require("child_process").execSync("npm root -g").toString().trim()+"/playwright")}' 2>/dev/null; then
    ok "node $(node --version) + Playwright (carousel rendering available)"; RENDER=1
  else
    warn "Playwright not found: carousels won't re-render. Install with: npm i -g playwright && npx playwright install chromium"
  fi
else
  warn "node not found: carousels won't re-render (everything else works)"
fi

echo "2. Private bundle"
if [ $# -ge 1 ]; then
  SRC="$1"
  if [ -f "$SRC" ] && [[ "$SRC" == *.zip ]]; then
    TMP="$(mktemp -d)"; unzip -q "$SRC" -d "$TMP"
    SRC="$(find "$TMP" -type d -name private -path '*/private' | head -1)"
    [ -n "$SRC" ] || fail "no private/ folder inside the zip"
  fi
  [ -d "$SRC" ] || fail "bundle not found: $1"
  if [ -d "$SRC/an27-source-docs" ]; then
    mkdir -p "$GS/source-docs" && cp -f "$SRC/an27-source-docs/"* "$GS/source-docs/"
    ok "AN27 originals -> gravity-social/source-docs/ ($(ls "$GS/source-docs" | wc -l) files, git-ignored)"
  fi
  if [ -d "$SRC/skill-observations" ]; then
    mkdir -p "$OBS" && cp -rn "$SRC/skill-observations/." "$OBS/" 2>/dev/null || true
    ok "task-observer workspace -> $OBS (existing files kept)"
  fi
  if [ -d "$SRC/local-only" ]; then
    [ -d "$SRC/local-only/daily" ] && mkdir -p "$GS/reports/daily" && cp -n "$SRC/local-only/daily/"* "$GS/reports/daily/" 2>/dev/null || true
    for f in community/leads.csv reports/outcomes.csv content/approver-ids.json; do
      if [ -f "$SRC/local-only/$f" ] && [ ! -f "$GS/$f" ]; then
        mkdir -p "$(dirname "$GS/$f")"; cp "$SRC/local-only/$f" "$GS/$f"
      fi
    done
    [ -d "$SRC/local-only/inbox" ] && cp -n "$SRC/local-only/inbox/"*.yaml "$GS/community/inbox/" 2>/dev/null || true
    [ -d "$SRC/local-only/metrics" ] && cp -n "$SRC/local-only/metrics/"*.json "$GS/reports/metrics/" 2>/dev/null || true
    ok "local-only files (briefs, leads, outcomes, metrics, inbox) restored where missing"
  fi
  if [ -d "$SRC/history" ]; then
    mkdir -p "$GS/source-docs/history" && cp -f "$SRC/history/"* "$GS/source-docs/history/"
    ok "conversation history -> gravity-social/source-docs/history/"
  fi
else
  [ -d "$GS/source-docs" ] && ok "source-docs/ already present" || warn "no bundle given: AN27 originals not restored (the distilled brand/ files are enough to run)"
fi
mkdir -p "$OBS/observation-log/archive" "$OBS/skill-updates"
ok "task-observer workspace exists at $OBS"

echo "3. Checks"
cd "$GS"
python3 scripts/gravity_lint.py --state pending >/dev/null && ok "lint: pending posts pass" || fail "lint errors: run python3 scripts/gravity_lint.py --state pending"
python3 scripts/gate.py verify >/dev/null && ok "gate: no approved post changed after approval" || warn "gate verify reported a problem: python3 scripts/gate.py verify"
if [ "$RENDER" = 1 ]; then E2E="$(python3 tests/e2e.py --render 2>&1 | tail -1)"; else E2E="$(python3 tests/e2e.py 2>&1 | tail -1)"; fi
case "$E2E" in *" 0 failed"*) ok "end-to-end: $E2E";; *) fail "end-to-end: $E2E";; esac
python3 scripts/gate.py status

echo
echo "Ready. Next: read gravity-social/HANDOFF.md, section 'Accounts and connectors', for the"
echo "account-level pieces (Metricool, Crustdata, TinyFish, the review page, the daily Routine)."
