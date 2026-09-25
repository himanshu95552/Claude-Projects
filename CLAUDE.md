# Project instructions

## task-observer skill activation

Before the first tool call of any session — and before writing or
proposing a plan, not merely before executing one — invoke the
task-observer skill AND execute its Session Start Protocol (storage
check, frontmatter scan, review trigger). Loading the skill and running
the protocol are separate steps; a session that loads the file and stops
has activated nothing. Any turn that will involve a tool call counts; do
not classify the session as "too simple" from its opening message.

Select skills on the DECISION the request is about, not on the artefact it
arrived as. Name what the user is deciding, then match the installed skill
descriptions against that — a request handed over as a file to review
still needs the skill whose description names its subject.

After completing each task, check the observation records written this
session and report a one-line summary (ids and titles, or "none logged
and why"). This is the activation backstop: it forces a look at the log,
so a session that silently skipped the protocol is discovered at the
first task boundary instead of never.

Loading a skill is not complete until you have queried the observation
log for OPEN observations naming it and read their bodies:

    grep -l "skill:.*<skill-name>" \
      "$HOME/.claude/skill-observations/observation-log"/*.md

Apply their insights to the current work, even if the skill file hasn't
been updated yet. Run this at every skill load, however many skills load
in one session.

The task-observer workspace for this project is:

    $HOME/.claude/skill-observations

Every path the skill uses derives from that root and nothing else:

    $HOME/.claude/skill-observations/observation-log/            (the log)
    $HOME/.claude/skill-observations/cross-cutting-principles.md
    $HOME/.claude/skill-observations/skill-updates/              (staging root)
    $HOME/.claude/skill-observations/skill-updates/PENDING.md    (staging manifest)

Never resolve any of them from the current working directory. If you run
this project on a different machine, pin the workspace to one stable
absolute path there and keep it consistent across sessions — never derive
one per session, tool, or checkout.

## Gravity Social OS

`gravity-social/` is the AI social media team for Alpha Nodus's product
Gravity. Start any social-media work with the `gravity-social` skill (the
orchestrator), which routes to `gravity-research`, `gravity-content`,
`gravity-publish`, `gravity-community` and `gravity-report`. Two rules hold in
every session: never run `scripts/gate.py approve` without an explicit,
named approval from the person in this conversation, and never try to get
around the Metricool approval hook in `.claude/settings.json`.
