---
name: gravity-publish
description: Module 3a of the Gravity Social OS, the approval queue and scheduler for Alpha Nodus / Gravity social posts. Records a named person's approval or rejection (scripts/gate.py), then schedules approved posts per platform through Metricool at the best time, behind a hook that blocks anything unapproved or edited after approval. Founder posts are handed to Shamit to post himself. Use when the person says approve, reject, schedule, post it, or asks what is approved or scheduled.
---

# Gravity publish: approval queue and scheduler

Two steps, always in this order. The hook in `.claude/settings.json` (`gravity-social/scripts/metricool_gate_hook.py`) enforces step 1 before any Metricool call in step 2 is allowed through.

## Step 1: Approval (a person decides; you record)

- Show what's waiting: `python3 scripts/gate.py status`, the dashboard's Content tab, or `python3 scripts/gate.py show <id>` pasted in chat.
- **Approve only on an explicit instruction naming the posts**, for example "approve 2026-W41-li-co-01 and the X thread" or "approve all the X posts." Record it with the approver's name exactly as in `config.yaml` (Tushant, the marketing manager, approves day to day; Shamit Patel can approve anything, and only he approves his own posts):
  ```bash
  python3 scripts/gate.py approve <id> --by "Tushant" [--note "..."]
  python3 scripts/gate.py approve-all --by "Tushant" --platform x
  ```
  Use the name of the person who is actually speaking. If you can't tell who is approving, ask.
  `approve` re-lints the post and refuses on any error. It records who and when, and seals the public text with a hash.
- "Looks good," "nice," or silence is not an approval. If it's ambiguous, ask: "Approve <ids>?"
- Founder posts (`linkedin-founder`) need Shamit's own approval.
- Rejections: `python3 scripts/gate.py reject <id> --by "<name>" --reason "<their words>"`. Then offer a rewrite in pending, which will need a fresh approval.
- If the person asks for edits to an approved post: `gate.py reopen <id>`, edit, lint, and ask for approval again. Editing an approved file without reopening makes the hook block it anyway.

- **Taps on the review page** are approvals too: sync them with `scripts/sync_decisions.py` (see the gravity-social skill, "Sync approvals"). Never mark a page decision as recorded yourself.

## Step 2: Scheduling (Metricool)

Preconditions: the network is connected in Metricool brand `config.yaml: metricool.brand_id`, and the post is in `approved/` with an intact hash (`gate.py verify`).

1. `mcp__Metricool_Social_Media_Management__getBrandSettings` for the timezone and connected networks. If a network isn't connected, stop and tell the person (connect at app.metricool.com/brands/connections).
2. Pick the time: `getBestTimeToPostByNetwork` for that network and the week (once there's history); otherwise the post's `scheduled_for`. If you move a post by more than a day, tell the person.
3. **Media:** Instagram needs an image, carousel or video; LinkedIn documents need the frames. Metricool takes **public URLs**. The repo is public, so commit and push the frames (on a computer without GitHub push, have the person upload them to Google Drive linked in Metricool and paste the links into `media_urls`), then run `python3 scripts/fill_media_urls.py --state approved --check`: it fills `media_urls` with GitHub raw URLs (`config.yaml media.base_url`) and confirms each is live. Video (reels, Shorts) must be recorded and uploaded by a person first. Never schedule an Instagram or YouTube post without media.
4. Build `info` from the approved file. Copy the text exactly (the hook compares it character for character after whitespace normalization):
   - `text`: the `## Post` section, or thread part 1
   - `descendants`: X thread parts 2..n, as `[{"text": "..."}]`, in order
   - `firstCommentText`: the `## First comment` section (LinkedIn)
   - `providers`: exactly one network (`linkedin`, `twitter`, `instagram`, `youtube`)
   - `autoPublish`: the value of `config.yaml metricool.auto_publish` (default **false**: Metricool sends a phone notification and a person taps publish)
   - `publicationDate`: `{"dateTime": "YYYY-MM-DDTHH:mm:ss", "timezone": "<brand tz>"}`
   - network data: `linkedinData` (`type: "poll"` with the poll block; or `documentTitle` + `publishImagesAsPDF: true` for document carousels), `twitterData: {"tags": []}`, `instagramData` (`type: POST` or `REEL`, `isAiGenerated: false` for our rendered typography), `youtubeData` (title, `type: short`, `madeForKids: false`)
   - `media` and `mediaAltText` from the post's `media_urls` and `## Alt text`
5. Call `createScheduledPost`, or `createScheduledPostForReview` when `approval.metricool_second_gate` is true and `approval.metricool_reviewers` is set (Metricool's own approval step: a second, human gate inside Metricool).
6. If the hook blocks the call, **don't work around it**. Read the reason, fix the cause (reopen and re-approve, or split a cross-post into per-platform drafts), and tell the person.
7. On success: `python3 scripts/gate.py mark-scheduled <id> --metricool-id <id from the response>`.
8. After it goes live, record the URL: `python3 scripts/gate.py mark-published <id> --url <post url>` (the report module can also do this from Metricool).

## Founder posts (Shamit's personal LinkedIn)

Personal profiles aren't scheduled through Metricool. When approved, give Shamit the final text (and the first comment) ready to paste. If he wants it by email, create a Gmail **draft** to him (never send). After he posts, `gate.py mark-published <id> --url <url>`.

## Never

- Approve on your own judgement, or treat a general compliment as an approval.
- Send one post to several networks.
- Turn on autoPublish when config says false.
- Edit the text between approval and scheduling.
- Delete or overwrite a scheduled Metricool post without the person's go-ahead (`updateScheduledPost` goes through the same hook).
