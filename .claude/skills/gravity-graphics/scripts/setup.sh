#!/usr/bin/env bash
# One-time setup per session: fonts (npm), Pillow + bundled ffmpeg (pip), node_modules link into each template folder.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
[ -d node_modules/@fontsource/urbanist ] || npm i --no-save --silent @fontsource/urbanist @fontsource/geist-mono >/dev/null
pip install -q pillow imageio-ffmpeg 2>/dev/null || true
for d in templates/*/; do ln -sfn "$ROOT/node_modules" "$d/node_modules"; done
echo "ready: $(python3 -c 'import imageio_ffmpeg as f;print(f.get_ffmpeg_exe())')"
