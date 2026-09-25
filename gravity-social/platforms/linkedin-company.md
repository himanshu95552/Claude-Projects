# LinkedIn: Alpha Nodus company page

**Role in the system:** the primary channel. The buyers are here: imaging center owners and CEOs, COOs and administrators, CFOs and revenue cycle leads, physician liaison and marketing leads, IT directors, and the RBMA/AHRA community. Every other platform is secondary to this one until RSNA.

**Who's reading, and what they need to see in two lines:** a problem they recognize from their own building, in their own words. They scroll past vendor announcements; they stop for "that's my fax tray."

## What wins here

1. **Document carousels** (PDF, 1080 x 1350, 6 to 10 frames). The strongest format for a teaching argument: the three leaks, your exam itemized, the five AOS tests, one order start to finish. Frame 1 is the hook and must work alone. Frame 2 delivers on it at once.
2. **Text posts with a sharp first line**, 900 to 1,500 characters, short paragraphs, white space. Used for proof, industry signals and point of view.
3. **Polls** that ask what they can't answer: "How many systems does one order touch before you get paid?" (options: 3 to 4 / 5 to 6 / 7+ / Never counted). Always follow up with a post on the results.
4. **Native video** (30 to 90 seconds, captions burned in): the demo moments. A handwritten fax becomes an order; the voice agent handles a reschedule; the report lands at the referring office.
5. **Order-timeline images**: one order's steps, exit ramps marked.

## Structure of a company-page text post

```
[Hook: 1 line, under ~140 chars so it survives mobile truncation]
[Line 2: the turn. Why it matters, or the uncomfortable number]

[3 to 6 short paragraphs: the specific scene, what it costs, what changes]

[One approved line, verbatim]

[CTA: one ask. Link goes in the FIRST COMMENT, not the body]

[Hashtags: 3 max, from brand/search-vocabulary.md]
```

## Hook patterns that fit Gravity (adapt with the research brief's winning hooks)

| Pattern | Gravity version |
|---|---|
| The question they can't answer | "How many referrals went to another center last month? Most imaging centers can't say." |
| The contrarian reframe | "Imaging centers don't lose money in the scanner. They lose it between the referral and the payment." |
| The itemized number | "One exam collects $154. $39 of it goes to moving paper. The radiologist's read costs $19." (P11, P16; say modeled) |
| The scene | "It's 3:15 on a Tuesday. The MRI is ready, the tech is ready, the table is empty." |
| The comparison | "Airlines fill about 85% of their seats. Imaging centers fill about 65% of their slots." (P10) |
| The definition | "RIS records the work. AOS does the work." |
| The honest limit | "We don't read the scan. We make sure it gets back." |

## CTA rules

- One CTA per post, from the ladder in `brand/messaging.md`.
- Link in the first comment with UTM (`scripts/utm.py`), and "Link in the first comment" as the body's last line if needed.
- The first comment can also carry the source for any benchmark or proof figure.

## Engagement rules

- Reply to every substantive comment within the business day (community module drafts, a person approves).
- Never argue with a competitor's employee in comments. Thank, clarify once, move on.
- If a commenter shares patient details, don't repeat them; offer a private channel.

## Frequency and timing

- 4 posts a week (Tue/Wed/Thu strongest for B2B healthcare, plus one Monday or Friday post). Don't post two within 18 hours.
- Default slots, US Central: 7:30 to 9:00 a.m. and 12:00 p.m. Replace with Metricool's `getBestTimeToPostByNetwork` once there's 4 weeks of data.

## Company page vs founder

The company page speaks as Gravity ("Gravity gets the order"). It never tells the founder's story in the first person; it can share Shamit's post with a one-line comment.

## Don'ts specific to LinkedIn

- No "We're excited to announce." Say what changed for the buyer.
- No engagement bait ("Comment YES"). Polls and real questions only.
- No tagging 15 people. Tag only people who took part.
- No more than 3 hashtags.
- No external link in the body.
