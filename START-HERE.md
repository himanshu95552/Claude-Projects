# Start here: run Gravity Social OS on your Mac

This folder is the complete system. Nothing else is needed: no GitHub, no other files, no context. The private files (the AN27 documents and the conversation history) are in `private/`, which ships in the zip you were given and is never committed.

## 1. Open it in Claude

1. Unzip `gravity-social-code.zip`. You get a folder called `Claude-Projects`. Put it wherever you keep work, for example `Documents`.
2. Open the **Claude desktop app** and switch to **Code** (Claude Code).
3. Choose the `Claude-Projects` folder as the project.

Use Code mode, not a regular chat. Code mode is what loads the project's instructions (`CLAUDE.md`), the six Gravity skills, and the approval hook that stops unapproved posts from being scheduled.

## 2. Paste this as your first message

> I'm Tushant, Marketing Manager at Alpha Nodus. This folder is the Gravity Social OS, moved here from another Claude account. I'm on a Mac with the Claude desktop app; there's no GitHub step.
> 1. Follow CLAUDE.md: run the task-observer session-start protocol first.
> 2. Run `bash setup.sh private` in this folder and show me the result. If Python or PyYAML is missing, install it and run it again.
> 3. Read START-HERE.md and gravity-social/HANDOFF.md fully, then load the gravity-social skill. Use its "Running on a computer" section: review through content/dashboard.html, approvals in chat, local commits.
> 4. Check which connectors I have (Metricool brand 6979710, Crustdata, TinyFish) and tell me what's missing.
> 5. Offer to set up the weekday 7:25 a.m. US Central morning brief as a scheduled task if this app supports it.
> 6. Open the dashboard for me and tell me what needs me today.
>
> Don't approve anything unless I name the post and say I approve it.

Claude does the rest: it installs what's needed, restores the private files, runs the tests and opens the dashboard.

## 3. One-time things only you can do

- **Connectors**, in the Claude app: Settings → Connectors.
  - **Metricool** (scheduling and analytics). Sign in with the same Metricool login, so brand `6979710` appears.
  - **Crustdata** and **TinyFish** (research). Optional: research falls back to web search without them.
- **The Mac asks to install "command line developer tools"**: click Install. That provides Python and git, and it happens only once.
- **The old account:** delete the "Gravity morning brief" routine there (claude.ai → Routines), so the brief doesn't also run in the old account.

## What you should see

After setup, every line says `ok` and the tests show **59 passed, 0 failed**, or 60 if Node and Playwright are installed for rendering images. The queue shows **15 pending posts, 0 approved**. The dashboard opens in your browser with five tabs: Research, Content, Posting and community, Growth, Brief.

## What changes on a Mac compared with the cloud

| In the cloud | On your Mac |
|---|---|
| Phone review page with Approve and Reject buttons | `content/dashboard.html` opens in your browser. Approve in chat: "approve 2026-W40-x-01" |
| Routine every weekday at 7:25 a.m. | A scheduled task in the app if it offers one. Otherwise say "morning brief" |
| Changes pushed to GitHub | Changes saved (committed) on your Mac |
| New carousel images hosted on GitHub | Week 40's images are already hosted. For new carousels, upload the images to Google Drive linked in Metricool; Claude tells you which ones |

Everything else is the same: research, writing, brand checks, the approval gate, scheduling through Metricool, community replies and reports.
