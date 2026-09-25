# Instagram: @alphanodus

**Role in the system:** the visual and human channel. B2B buyers rarely decide here, but they check it, and so do candidates, customers' staff and conference contacts. It shows the team, the culture (Austin, Sunrise, Bangalore), RSNA, and the argument as beautifully typeset carousels.

## What wins here

1. **Typographic carousels** (1080 x 1350, 5 to 10 frames), in the house templates (`brand/visual.md`). Same ideas as LinkedIn but *shorter per frame*: 12 to 25 words, bigger type, more swipe tension ("Leak 1 of 3 →").
2. **Reels** (15 to 45 seconds, 9:16, burned-in captions, hook on screen within 1.5 seconds):
   - "The call": the voice agent handles a reschedule on speaker while someone tries to trip it up (the RSNA booth moment).
   - "Handwritten fax to digital order in 20 seconds" (screen capture from the demo tenant).
   - "A day at the front desk": the fax tray, the phones, four payer portals open. Shot with the team re-enacting, never real patients.
   - Team: "We do the job before we automate it": engineers sitting at a scheduling desk.
3. **Stories:** RSNA countdown, polls, behind the scenes. Stories aren't queued for posting automatically; they're drafted as scripts.

## Caption structure

```
[Line 1, under ~125 chars: the hook, since the caption truncates]
[2 to 5 short lines: the point]
[One approved line]
[CTA: "Link in bio" (captions don't link)]
[3 to 5 hashtags]
```

## Rules

- Every post needs media: image, carousel or video. Every image needs alt text (the linter checks).
- No URLs in captions: they don't click. Use "Link in bio" and update the bio link (a UTM'd link) to the current CTA.
- Declare AI-generated or significantly AI-altered imagery (Metricool `instagramData.isAiGenerated`). Typographic slides we render are not AI imagery; synthetic photos would be, so we don't use them.
- No stock patients, no robots. People in reels are the team, with their consent.
- Never film real patients, real schedules or real worklists. Demo tenant only.
- 3 to 5 hashtags from `brand/search-vocabulary.md`.

## Frequency and timing

- 3 posts a week: 2 carousels and 1 reel. Stories 2 to 3 times a week, more at RSNA.
- Default slots, US Central: 11:00 a.m. to 1:00 p.m. weekdays. Then Metricool best-time data.
