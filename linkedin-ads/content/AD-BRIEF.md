# Ad brief: what we built, who it targets, why it should work

These are reasons, not results. Nothing has run yet, so every "why" is a hypothesis to test.

## The goal and the single offer

Goal: clicks that turn into booked calls. Every ad sends people to one landing page (Order Trace) or to the product page that matches the ad. The main offer is a free 30-minute order trace: bring one order, no patient names, keep the notes. Softer offers are the 15-question checklist and the 30-minute demo.

## Who the ads speak to

| Audience | Their pain | Role tag on the image |
|---|---|---|
| Owners and administrators | Profit flat while volume grows, hiring, denials, lost referrers | Imaging center owners |
| Operations and practice managers | Faxes, call-backs, empty slots, check-in lines | Imaging center managers |
| Billing and revenue cycle leads | Late denials, eligibility, estimates, prior auth | Imaging billing leads |
| Radiologist-owners | Referrers, reports, "what does the software touch?" | Radiologist owners |

Targeting: job titles and seniority at US imaging companies, plus a company list. Retargeting by stage (see `content/scripts/04-retargeting-plan.csv`).

## The formats

| Format | Count | Funnel stage | What it does | Why it should work |
|---|---|---|---|---|
| Simple question ads (single image) | 30 | Awareness | One plain question the role answers "yes" to, one answer, one matching page | A specific question reads as meant for them. The role tag confirms it in one glance. One pain per ad keeps the message clear |
| Module ads (single image) | 14 | Middle | One Gravity module per ad, grouped as get the order, complete the exam, get paid | For people who already know the pain and want to see what fixes it. Each ad links to its own product page |
| Scene ads (3D illustration) | 12 | Awareness | A picture of the pain: a full fax tray, an empty slot, a hiring sign | The picture explains the problem without reading. It stands out in a feed of faces and stock photos |
| Photo ads | 14 | Awareness | A real front-desk or scanner-room photo with the question on top | Familiar rooms feel like their own center, not an ad |
| Research set (modeled numbers) | 2 | Middle | Examples labeled "modeled", never presented as customer results | Numbers get attention. The label keeps it honest |
| Carousels | 5 | Middle | 4 to 6 swipeable cards that walk through one idea | Swiping takes more effort than a glance and signals interest, which helps retargeting. Good for multi-step ideas like where an order gets lost |
| Videos, 14 seconds, silent, captioned | 5 | Awareness and retargeting pool | One short story: the empty slot, the fax queue, the status call | Most people watch muted. Short enough to finish. People who watch half become a warm audience |
| Document ads (decks) | 3 + 2 | Middle | A five-slide deck per stage, as a PDF in the feed | Swipeable, no click needed to get value, and easy to share inside a center |
| Quote cards | 6 | Proof | One customer sentence on a clean card | A peer's words carry more weight than ours. Needs customer sign-off |
| Thought-leader posts, event ads | planned | Awareness and event | Posts from a real person; RSNA booth invite | People trust people. RSNA gives a dated, concrete reason to book |

## Why the whole set should work together

1. **Specific, not clever.** Each ad names a pain a real person has in their week, in their words.
2. **Plain proof, honestly labeled.** Customer numbers come from published pages. Modeled numbers say "modeled".
3. **One next step.** Every ad has one button and one page. The offer is free and low risk, with no patient data.
4. **Layered by stage.** Cold ads use questions and pictures. Warm audiences see modules, carousels and proof. People who visited the demo page see the demo video.
5. **Same look everywhere.** Dark ink, lavender accent, the same type and logo, so a person who sees three ads remembers one company.

## What to test first

- Layout A against layout B on the same ads.
- With and without the customer proof line.
- Photo against 3D illustration for the same question.
- The role tag against no tag.
- Compare click-through and cost per booked call, not clicks alone. Set your own benchmark after the first two weeks of data.

## Before launch

- Get customer approval for the Iowa Radiology, Downtown Radiology and MRI Associates lines.
- Confirm the order trace terms and add your own booking link.
- Check each button text against LinkedIn's allowed list in Campaign Manager.
