# User guide

For people actually using the app — participants posting under their own
name, and admins running the program. If you're setting up the software
itself, you want `docs/SETUP.md` instead.

## If you're a participant

### Getting in the first time

Someone (an admin) adds your email to the program. You'll get sent a
sign-in link — no password to remember, ever. Click it, and you land in
a short guided setup:

1. **Confirm your identity** — your real name and role. This has to be
   really you; the whole program depends on that.
2. **Consent** — read what the program actually does with your name and
   what your rights are (edit anything, reject anything, leave anytime).
   You can't continue past this screen without agreeing — it's not a
   formality, it's checked.
3. **Pick your lane** — the one topic area you'll own. One person per
   lane; if the one you want is taken, that's the point (see "why
   lanes" below).
4. **Your voice** — optionally paste a few things you've actually
   written. The app uses this to suggest a starting voice, which you
   can adjust with sliders — nothing is locked in, and you can change it
   anytime from **Persona**.
5. **Your cadence** — how many posts a week you can *actually* sustain.
   Be honest here. A committed 1/week beats an ambitious 3/week you
   abandon in three weeks — that's not a guess, it's the single most
   common way these programs die.
6. **Schedule** — when you want reminders and your usual working window.
7. **Done** — a 30-second tour, then you're in.

### Your daily routine

Each day (if the nightly job has run — ask your admin/operator if
you're not seeing anything), you'll have a queue at **Queue**. Sections
appear in order: publish, first-hour comments, general comments,
replies, follow, connect, then company-page amplification if you're on
that week's rotation.

For each card:
- **Read it.** Tap **"Why this?"** if you want to know the reasoning —
  why this topic, why this hook, why this person, why now.
- **Edit it if it doesn't sound like you.** This is expected and
  valuable — your edits are literally how the app learns your voice
  better over time.
- **Mark & regenerate if editing isn't enough.** Click any line that
  isn't working (it highlights), optionally say what's wrong in one
  line, and hit Regenerate — you get a genuinely different draft, not a
  reworded version of the one you rejected, and every version stays in
  **History** so nothing's ever lost.
- **Post it** (or **Copy** + **Open** if there's no direct-post button
  yet — that means LinkedIn/X isn't connected, or the action type is one
  the platform doesn't expose an API for at all, like connection
  invites). A publish item on LinkedIn always gets a companion X post
  once X is connected — generated separately, tuned for X's shorter
  format and its own engagement signals, not a copy-paste.
- **Generate a banner if the post needs a visual.** On any publish item,
  **Generate banner** produces on-brand headline copy sized correctly
  for the platform and format you pick (static, carousel, or trending) —
  a creative brief a designer or image tool can build from, plus a
  **Copy tracked link** button next to its CTA that tags a destination
  URL with UTM parameters so clicks can actually be attributed later.
- **Skip it if it's wrong**, and say why in one line. This is not a
  judgment on you — three people skipping the same draft means the
  *draft* was wrong. Skip reasons are the most useful feedback in the
  whole system.

Aim for about 20 minutes. If it's consistently taking longer, that's a
sign the drafting needs tuning, not that you need to work faster — flag
it.

### Your voice, anytime

**Persona** has three things:
- **Voice controls** — the sliders (formality, sentence length, etc.),
  your own rules in plain language ("I never use exclamation marks"),
  and a **test bench**: change a setting, generate a sample, read it
  before you commit. Nothing saves until you click Save.
- **Story bank** — your real numbers, scars, positions, and turning
  points. This is what stops drafts sounding generic — the more real
  detail here, the better every draft that follows.
- **Lane** — a reminder of what you own and why.
- **Accounts** — connect LinkedIn and X (and Instagram/Facebook if your
  program uses them) so the Post button actually posts, plus push
  notifications so you know when your queue is ready without checking.

### Calendar

**Calendar** lays out every scheduled or shipped post on a month grid —
a faster way to see your own posting rhythm than scrolling the daily
queue day by day. Admins and operators get a **Team calendar** toggle
that shows everyone's posts on the same grid, with names, so gaps
(nobody posting this week) and overlap (three people covering the same
day) are visible at a glance.

### Analytics

**Analytics** turns whatever metrics you log against a posted item
(impressions, reactions, comments, shares, saves, clicks — copy them
from the platform's own analytics view, there's a **Log metrics** button
on any posted card) into insights that actually mean something: a
weighted engagement score per platform that counts a save or share for
several times a like — because that's what 2026 research on each
platform's own algorithm says predicts real reach, not raw counts — plus
which pillar and hook formula are actually working for you, a weekly
trend, and a flag if your highest-reach posts aren't converting to
saves. Nothing fires as an "insight" until there's enough logged data to
compare fairly; a lone post never gets treated as a trend. Admins and
operators additionally see a program-wide rollup.

### Why lanes exist

Five accounts all posting about the same thing split one account's reach
five ways and get penalized for the overlap. Five accounts each covering
a different angle of the same buying process reach five different
audiences that all converge on the same company. Your lane isn't a
restriction for its own sake — it's the actual strategy.

## If you're an admin

### Adding someone to the program

**Admin → Participants → Add a participant.** Fill in their email, name,
and role — they'll appear as "invited." The first time they sign in
with that email, they go straight into the onboarding wizard above.

You don't send them a link manually — they use the same sign-in flow as
everyone else at `/login`; the system recognizes their email once you've
added it.

### The review queue

Anything a participant's content is flagged for (mentioning a customer
name, a claim that reads unverified, a possible PHI risk — see
governance rules) lands in **Admin → Review** with an SLA countdown.
Approve to release it back into that person's queue, or reject with a
note. People on **self-approve** review tier (usually the founder and
whoever runs review) skip this entirely — the whole point of that tier
is that a founder shouldn't wait four hours for sign-off on their own
opinion.

**What review is not for:** tone, style, topic choice, formatting,
emoji, hashtags. If you find yourself editing someone's *voice*, that's
the thing that's supposed to stay theirs — sanding it down loses real
engagement and the reader can tell.

### Tuning the program

**Admin → Config** shows every current setting (cadence defaults,
targeting thresholds, the engagement ladder's timing, content length
bounds, governance rules, which models draft vs. research) and lets you
patch any of it. Every change creates a new version — nothing is ever
silently overwritten, and the change log right below shows exactly what
changed and when. When quality shifts, that log is the first place to
look.

Settings resolve in layers: a global default, optionally overridden per
lane, optionally overridden per participant. The config editor here only
writes global-scope changes; per-participant overrides happen through
that participant's own settings (cadence gets set during their
onboarding, for now — a dedicated per-participant admin editor is a
natural next addition).

### Keeping an eye on things

**Admin → Overview**: active participant count, how many items are
waiting on review, and 30-day API spend against your configured cap —
this is a dashboard, not an automatic cutoff, so check it rather than
assuming it enforces itself.

**Weekly** (available to every participant for their own numbers): posts
shipped, completion rate, and a gentle nudge if someone's completion
drops below half for the week — worth a real conversation about whether
their committed cadence is sustainable, not pressure to push through.

### The single most important thing to watch

**Participation, not content quality, is what kills these programs** —
and it fails around week 3–6, quietly, one skipped queue at a time. If
someone's numbers dip, that's the moment to ask what's actually going
on, not to wait and see. A program at "two people, consistently" beats a
program at "five people, fading."
