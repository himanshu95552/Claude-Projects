# Claude Projects — tooling setup

This repo tracks a set of Claude Code memory / context tools that were set
up in a Claude Code on the web session. Because that session runs in an
ephemeral cloud container, anything meant to persist is committed here.

## What was installed

| Tool | Source | Type | Works in a cloud session? |
|------|--------|------|---------------------------|
| **claude-mem** | `thedotmack/claude-mem` | Claude Code plugin + worker | Partial — plugin enabled; memory worker needs a provider |
| **headroom** | `headroomlabs-ai/headroom` | Standalone compression proxy (PyPI) | No — proxy runs where the client runs (local only) |
| **task-observer** | `rebelytics/one-skill-to-rule-them-all` | Claude Code skill | Yes — installed here at `.claude/skills/task-observer/` |

## task-observer

"One Skill to Rule Them All" — monitors work sessions for skill-improvement
opportunities and maintains an observation log.

- **Skill bundle:** `.claude/skills/task-observer/` (project-level, travels
  with the repo).
- **Activation:** `CLAUDE.md` carries the activation block, instructing every
  session to invoke the skill and run its Session Start Protocol before the
  first tool call. This is a probabilistic activation tier — for hard
  enforcement, add a `SessionStart` hook (see the skill's
  `references/environments.md`); creating that hook requires granting Claude
  Code permission, since a self-injecting hook is otherwise blocked.
- **Observation log:** `$HOME/.claude/skill-observations/` (user scope, one
  stable path). Not committed — it is per-machine working state.

## claude-mem

Installed via `npx claude-mem@latest install --ide claude-code`. Registered
and enabled in `~/.claude/settings.json`. `claude-mem doctor` passes all
required checks (Bun, uv, plugin, marketplace). The memory **worker** is not
running because no memory provider is configured: `host` mode needs a local
OpenAI-compatible observer, and the `claude`/`gemini`/`openrouter` providers
need API keys. Configure a provider, then `npx claude-mem start`.

## headroom

Installed via `uv tool install --python 3.13 "headroom-ai[all]"`; the
`headroom` CLI is available. Headroom compresses agent context by routing
LLM traffic through a **local proxy** (`ANTHROPIC_BASE_URL`). A cloud Claude
Code session's model calls do not traverse this container, so headroom
cannot intercept them here — it only takes effect where the Claude Code
client itself runs. Use it on a local install: `headroom init`, then
`headroom proxy` / `headroom wrap claude`.
