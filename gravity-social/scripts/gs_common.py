"""Shared helpers for the Gravity Social scripts: paths, config, post parsing, hashing.

A post is a Markdown file with YAML frontmatter and level-2 sections
(see templates/post.md). Public sections are what the audience sees; they are
what the linter checks and what the approval hash covers.
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:  # pragma: no cover
    sys.exit("PyYAML is required: pip install pyyaml")

ROOT = Path(__file__).resolve().parent.parent
QUEUE = ROOT / "content" / "queue"
STATES = ["pending", "approved", "rejected", "scheduled", "published"]

# Sections the public sees. Everything else (Visual brief, Sources, Reviewer notes) is internal.
PUBLIC_SECTIONS = [
    "Post", "Thread", "First comment", "Poll", "Slides", "Video script",
    "On-screen text", "Title", "Description", "Alt text",
]

FRONTMATTER_RE = re.compile(r"\A---[ \t]*\n(.*?)\n---[ \t]*\n?(.*)\Z", re.S)


def load_yaml(path: Path):
    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f)


def config() -> dict:
    return load_yaml(ROOT / "config.yaml")


class Post:
    def __init__(self, path: Path):
        self.path = Path(path).resolve()
        raw = self.path.read_text(encoding="utf-8")
        m = FRONTMATTER_RE.match(raw)
        if not m:
            raise ValueError(f"{self.path}: missing YAML frontmatter")
        self.fm_text, self.body = m.group(1), m.group(2)
        self.meta = yaml.safe_load(self.fm_text) or {}
        for k, v in list(self.meta.items()):  # keep timestamps as the ISO strings the author wrote
            if hasattr(v, "isoformat"):
                self.meta[k] = v.isoformat()
        self.sections = split_sections(self.body)

    # ---- identity ----
    @property
    def id(self) -> str:
        return str(self.meta.get("id", self.path.stem))

    @property
    def platform(self) -> str:
        return str(self.meta.get("platform", ""))

    @property
    def state(self) -> str:
        return self.path.parent.name

    # ---- content accessors ----
    def section(self, name: str) -> str:
        return self.sections.get(name, "").strip()

    def thread_parts(self) -> list[str]:
        t = self.section("Thread")
        if not t:
            return []
        parts = re.split(r"^###\s+\d+\s*$", t, flags=re.M)
        return [p.strip() for p in parts if p.strip()]

    def yaml_block(self, name: str):
        s = self.section(name)
        m = re.search(r"```ya?ml\s*\n(.*?)```", s, re.S)
        if not m:
            return None
        return yaml.safe_load(m.group(1))

    def slides(self) -> dict | None:
        return self.yaml_block("Slides")

    def poll(self) -> dict | None:
        return self.yaml_block("Poll")

    def main_text(self) -> str:
        """The text a network would receive as the post body."""
        parts = self.thread_parts()
        return parts[0] if parts else self.section("Post")

    def public_chunks(self) -> list[tuple[str, str]]:
        """(label, text) pairs for everything the audience will see."""
        out: list[tuple[str, str]] = []
        if self.section("Post"):
            out.append(("post", self.section("Post")))
        for i, p in enumerate(self.thread_parts(), 1):
            out.append((f"thread {i}", p))
        if self.section("First comment"):
            out.append(("first comment", self.section("First comment")))
        poll = self.poll()
        if poll:
            out.append(("poll", " ".join([str(poll.get("question", ""))] + [str(o) for o in poll.get("options", [])])))
        sl = self.slides()
        if sl:
            for i, s in enumerate(sl.get("slides", []), 1):
                out.append((f"slide {i}", " ".join(flatten_strings(s, skip_keys={"template"}))))
        for name in ["Video script", "On-screen text", "Title", "Description", "Alt text"]:
            if self.section(name):
                out.append((name.lower(), self.section(name)))
        return out

    def public_text(self) -> str:
        return "\n\n".join(t for _, t in self.public_chunks())

    def content_hash(self) -> str:
        blob = json.dumps([[k, normalize(v)] for k, v in self.public_chunks()], ensure_ascii=False)
        return hashlib.sha256(blob.encode("utf-8")).hexdigest()

    # ---- writing ----
    def set_meta(self, **updates) -> None:
        """Update frontmatter fields in place, preserving comments and order where possible."""
        lines = self.fm_text.split("\n")
        for key, value in updates.items():
            rendered = yaml_scalar(value)
            pat = re.compile(rf"^{re.escape(key)}:\s*(.*?)(\s+#.*)?$")
            for i, line in enumerate(lines):
                m = pat.match(line)
                if m:
                    comment = m.group(2) or ""
                    lines[i] = f"{key}: {rendered}{comment}"
                    break
            else:
                lines.append(f"{key}: {rendered}")
            self.meta[key] = value
        self.fm_text = "\n".join(lines)
        self.path.write_text(f"---\n{self.fm_text}\n---\n{self.body}", encoding="utf-8")

    def move_to(self, state: str) -> None:
        assert state in STATES
        dest = QUEUE / state / self.path.name
        if dest.exists() and dest != self.path:
            raise FileExistsError(dest)
        self.path.rename(dest)
        self.path = dest


def split_sections(body: str) -> dict[str, str]:
    sections: dict[str, str] = {}
    current = None
    buf: list[str] = []
    in_fence = False
    for line in body.split("\n"):
        if line.strip().startswith("```"):
            in_fence = not in_fence
        m = re.match(r"^##\s+(.+?)\s*$", line) if not in_fence else None
        if m:
            if current is not None:
                sections[current] = "\n".join(buf)
            current, buf = m.group(1).strip(), []
        elif current is not None:
            buf.append(line)
    if current is not None:
        sections[current] = "\n".join(buf)
    return sections


def flatten_strings(obj, skip_keys=frozenset()) -> list[str]:
    if isinstance(obj, str):
        return [obj]
    if isinstance(obj, dict):
        out = []
        for k, v in obj.items():
            if k in skip_keys:
                continue
            out += flatten_strings(v, skip_keys)
        return out
    if isinstance(obj, list):
        out = []
        for v in obj:
            out += flatten_strings(v, skip_keys)
        return out
    return []


def normalize(text: str) -> str:
    text = text.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    return re.sub(r"\s+", " ", text).strip()


def yaml_scalar(value) -> str:
    if value is None or value == "":
        return '""'
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, list):
        return "[" + ", ".join(yaml_scalar(v) for v in value) + "]"
    s = str(value)
    if re.fullmatch(r"[A-Za-z0-9_.:/+@-]+", s) and not s.lower() in {"yes", "no", "true", "false", "null"}:
        return s
    return json.dumps(s, ensure_ascii=False)


def all_posts(states=None) -> list[Post]:
    posts = []
    for st in states or STATES:
        for p in sorted((QUEUE / st).glob("*.md")):
            posts.append(Post(p))
    return posts


def find_post(post_id: str, states=None) -> Post:
    matches = [p for p in all_posts(states) if p.id == post_id or p.path.stem == post_id]
    if not matches:
        sys.exit(f"No post with id {post_id!r} in {states or STATES}")
    if len(matches) > 1:
        sys.exit(f"Ambiguous id {post_id!r}: {[str(m.path) for m in matches]}")
    return matches[0]
