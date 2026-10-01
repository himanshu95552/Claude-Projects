---
title: AN27 — Unit Economics Closer
type: deliverable
scope: AN27
status: final
version: "1.1"
created: 2026-09-22
updated: 2026-09-23
tags:
  - an27
  - deck
  - sales
  - economics
  - roi
---

# AN27 — Unit Economics Closer

**v1.1 (final) · 23 September 2026 · Owner: Shamit Patel · Approved: slide 21 and the two-case rule · RIS cost moved to "complete the exam" per Shamit · Closes brand platform Q25 (the consolidated ROI model)**

> The closer for the first-meeting deck: one exam, itemized. What a center collects per exam, what it spends to get the order, complete the scan, generate the report and get paid, what is left, and what changes with Gravity at each layer. Built on a **representative independent multimodality center**: a modeled center whose cost structure, role mix and modality mix are shaped on a real two-year P&L and payroll roster (§2), normalized so it reads as a typical center rather than a struggling one, plus Alpha Nodus's own measured costs from past ROI work (§4) and public benchmarks (§8).
>
> **v1.1 (Shamit, 23 Sep 2026): the RIS belongs to completing the exam, not to the report.** RIS data and cloud storage ($2.51 an exam) moved from stage C (generate the report) to stage B1 (complete the exam: order and schedule). The paper line becomes $39 an exam ($26 with Gravity) and the read line becomes $21; nothing else in the model moves. Reasoning: the RIS is the system the schedulers and front desk live in to get the order to the table; the radiologist reads in the PACS and dictation system, not the RIS.
>
> **The unit is one exam (v1.0, Shamit, 23 Sep 2026).** Most buyers run more than one center, so every customer-facing number is per exam: one exam's revenue, one exam's cost by stage, one exam's margin. The center-level figures in §2 and the annual table in §5 exist only to build and sanity-check the per-exam numbers; they never appear on a slide or in a talk track. The buyer multiplies by their own exam count.
>
> **What this is and is not (v0.2 change).** The source financials were supplied as an example of where money goes in an imaging center, not as figures to showcase. **No number in this model is presented anywhere, internally or externally, as a real center's actuals.** The source center's expense lines were reduced 15 percent across the board to normalize them (it was a poorly run center; see §2), and its revenue, volume, modality mix and role mix were kept. The source is named in this note for traceability only. In customer material there is no center at all: only one blended outpatient exam (see the unit rule above). The payroll roster was used only in aggregate by role; no names or individual rates are recorded here or anywhere in the knowledge base.

---

## 1. Why this slide exists

Every CFO in the room is holding one question through the whole demo: *what is an exam worth, what does it cost me, and what does this change?* The deck answers it today only with the leakage math on the last slide, three lines with the buyer's numbers plugged in. That is the right instinct and the wrong altitude. A CFO thinks in a P&L, so the closer should be a P&L, reduced to the one unit every person in the room understands: **one exam.**

The slide does three jobs:

1. **Makes the three leaks a line item.** The cost of getting the order, getting the patient in the door and getting paid sits on the same page as the scan and the read, in dollars per exam. Leakage stops being a metaphor and becomes a number.
2. **Shows the fixed-cost lever, in both directions.** About 80 percent of an imaging center's cost does not move when one more patient is scanned, or one fewer. The representative center lost 8 percent of revenue in a year and its margin was cut nearly in half. Every filled slot is almost pure margin; every empty one is almost pure loss. The utilization argument from slide 8 becomes arithmetic.
3. **Frames Gravity's price against the right denominator.** Gravity costs a few dollars per exam. The paper between the referral and the payment costs thirty-nine. Nobody in the room has ever seen those two numbers side by side.

It also fixes the biggest hole in the AN27 proof inventory. The brand platform (Q25) says a consolidated three-budget ROI model does not exist. It does now, and it is built from the cost structure of a real P&L and a real roster rather than from a template.

---

## 2. The representative center (internal backup; never on a slide)

**Source material (internal use only), provided by Shamit on 22 September 2026:** `HDC Financials.pdf` (Hollywood Diagnostics Center: 2025 P&L, cash basis; balance sheet; 2025 exam, charges and collections summaries by modality and payer); `HDC EXPENSE CATCH UP 1.xlsx` (P&L 2024 against 2025, plus rent, equipment and Hologic detail); `payroll 2026.xlsx` (41-person roster with position, full or part time, and pay rate). Shamit's instruction, 22 September 2026: these are an example of where expense goes in an imaging center, not figures to show anywhere; the center was badly run, so cut about 15 percent of all expense to produce normalized numbers.

**How the representative center was built**

| Element | Treatment |
|---|---|
| Revenue, exam volume, modality mix, payer mix, gross collection rate | Kept from the source. These describe the market, not the management. |
| Every expense line (labor, reads, rent, equipment, supplies, vendors, G&A) | Multiplied by 0.85. Uniform, so the *shape* of spend is the source's and only the level moves. |
| Role mix (who does what, how many) | Kept from the roster, in aggregate. The 41 heads stay; their loaded cost is 15 percent lower. |
| Result | A center that makes a 7 percent margin instead of losing 9 percent. That matches what Shamit hears from independents (5 to 7 percent), which is the test the normalization had to pass. |

The 15 percent is a judgment, not a benchmark. It is applied uniformly so nobody can accuse the model of trimming the lines that flatter Gravity. If a buyer thinks their center is leaner, the leakage review on slide 25 takes their numbers.

**Shape of the business (model year)**

| Item | Model | Per exam |
|---|---|---|
| Exams | 26,669 (about 2,220 a month; about 107 a working day) | |
| Gross charges billed | $20.0M | $751 |
| Gross collection rate | about 20% of charges | |
| Revenue | $4,110,669 | **$154.14** |
| Total expense | $3,805,788 | **$142.70** |
| Net income | **$304,881** | **$11.43** |
| Margin | **7.4%** | |
| People | 41: 11 technologists, 25 in non-clinical operations, 4 administration, 1 housekeeping and other | |
| Modalities | Fixed MRI, open MRI, PET/CT, CT, ultrasound, 3D mammography, X-ray, bone density | |
| Payer mix (exams) | HMO about half · PPO about a third · PIP (auto injury), Medicare, LOP, Medicaid, workers comp the rest | |

**What one bad year does to it (prior year to model year, normalized)**

| | Prior year | Model year | Change |
|---|---|---|---|
| Revenue | $4,450,602 | $4,110,669 | **-7.6%** |
| Total expense | $3,860,570 | $3,805,788 | -1.4% |
| Net income | **$590,032** | **$304,881** | **-48%** |
| Margin | 13.3% | 7.4% | cut nearly in half |
| Contract radiologist reads | tracked volume down | | the only large line that moved with revenue |
| Rent and equipment service contracts | stepped up | | paid whether the tables are full or not |
| Marketing spend | cut by more than half | | outreach cut in the year volume fell |

Revenue fell $340,000. Reads fell with it. Almost nothing else did, so profit fell $285,000. That is what 80 percent fixed cost means when the leaks run the wrong way. Note the marketing line: outreach was cut by more than half in the year volume fell. Whether that is cause or effect, it is the referral leak in a single row. Two features of the source carry into the model: the scanners are not the problem (leases and service contracts are paid whether or not the tables are full), and reimbursement per exam is the pressure (the founder's line from past calls: "$150 an exam is now $110").

**Revenue per exam by modality (kept from source)**

| Modality | Exams | Share of volume | Collected | Per exam | Share of collections |
|---|---|---|---|---|---|
| PET | 439 | 1.6% | $653,640 | $1,489 | 16.0% |
| Open MRI | 511 | 1.9% | $260,389 | $510 | 6.4% |
| Fixed MRI | 3,919 | 14.7% | $988,090 | $252 | 24.1% |
| CT | 2,797 | 10.5% | $441,725 | $158 | 10.8% |
| Mammography | 6,473 | 24.3% | $897,805 | $139 | 21.9% |
| Ultrasound | 8,839 | 33.1% | $701,074 | $79 | 17.1% |
| X-ray | 1,477 | 5.5% | $67,870 | $46 | 1.7% |
| Bone density | 2,214 | 8.3% | $59,955 | $27 | 1.5% |
| **All** | **26,669** | | **$4,070,608** | **$153** | |

Two thirds of the volume (ultrasound, mammography, X-ray, DEXA) collects under $140 an exam. Advanced imaging (MRI, CT, PET) is 29 percent of exams and 57 percent of the money. Every leaked MRI or PET order costs this center five to ten ultrasounds' worth of revenue. Auto-injury (PIP) cases show the same skew: a few percent of exams, a fifth or more of collections in the months sampled.

**The people, by what they do (roster, aggregated, normalized)**

| Group | People | Annualized labor | Per exam |
|---|---|---|---|
| Scheduling and confirmations (6 schedulers, 1 PIP scheduler, 2 scheduler/front desk, 1 confirmations) | 10 | $248,385 | $9.31 |
| Front desk | 3 | $63,378 | $2.38 |
| Verification, estimates and authorization | 3 | $117,901 | $4.42 |
| PIP / legal (auto-injury and attorney cases) | 1 | $35,417 | $1.33 |
| Billing and collections | 3 | $98,329 | $3.69 |
| Order intake and records (clerical support, logger) | 3 | $88,076 | $3.30 |
| Marketing and referrer outreach | 2 | $124,031 | $4.65 |
| **Non-clinical operations** | **25** | **$775,517** | **$29.08** |
| Technologists (MRI, CT, PET/CT, ultrasound, mammography, X-ray) | 11 | $566,672 | $21.25 |
| Administration (operations, HR/AP, IT) | 4 | $201,711 | $7.56 |
| Housekeeping and other | 2 | $37,281 | $1.40 |
| **All** | **41** | **$1,581,181** | **$59.29** |

Roster base wages (part-timers modeled at 20 hours a week) were scaled by 0.896 to the normalized labor pool (salaries, payroll expenses, contract labor, benefits), so the role mix is real and the totals tie. The number to remember: **twenty-five people, not counting a single technologist, to carry about a hundred orders a day through three systems.** Non-clinical operations labor is $29 an exam here. Shamit has quoted $27 an exam from other centers ($2.40 order processing, $11 insurance, $10 scheduling, $3 front desk). Same shape.

**Caveats, stated once.** The source is cash basis, so no depreciation and no lease principal: the true cost of the scanners is higher than the scan line below shows. The source's benefits line looked understated in the model year. Both caveats make the baseline kinder to the center than reality, and both are swamped by the 15 percent normalization, which is why the normalization is uniform rather than line by line.

---

## 3. The exam, itemized

The center's expense lines, mapped to Shamit's four stages plus the two costs that belong to no stage (the scan itself, and the building). Labor comes from the roster by role; shared costs (phone, postage, office expense, software) are split across stages by a stated share.

| Stage | What is in it | Annual | Per exam | % of revenue |
|---|---|---|---|---|
| **A. Get the order** | Marketing and referrer outreach labor, 2 people ($4.65) · order intake and records labor, 3 people ($3.30) · marketing spend including referrer lunches ($2.00) · fax and phone share ($0.30) · postage share ($0.29) | $281,299 | **$10.55** | 6.8% |
| **B1. Complete the exam: order and schedule** | Scheduling and confirmations labor, 10 people ($9.31) · RIS data and cloud storage ($2.51) · front desk labor, 3 people ($2.38) · phone share ($0.75) · office expense share ($0.72) | $417,926 | **$15.67** | 10.2% |
| **B2. Complete the exam: the scan** | Technologist labor, 11 people ($21.25) · equipment maintenance and service contracts ($13.21) · medical supplies and helium ($5.74) · equipment leases and rentals ($1.86) · equipment and software purchases, half ($1.15) · equipment and line-of-credit interest ($1.11) | $1,181,921 | **$44.32** | 28.8% |
| **C. Generate the report** | Contract radiologist reads ($19.22) · software, half ($1.14) · report delivery postage share ($0.39) · transcription ($0.07) | $555,223 | **$20.82** | 13.5% |
| **D. Get paid** | Verification, estimates and authorization labor, 3 people ($4.42) · billing and collections labor, 3 people ($3.69) · claims processing and merchant and bank charges ($2.10) · PIP and legal case labor, 1 person ($1.33) · office expense share ($0.54) · phone share ($0.45) · statements postage share ($0.29) | $341,949 | **$12.82** | 8.3% |
| **E. The building and G&A** | Rent, CAM and security ($18.69) · administration, 4 people ($7.56) · utilities ($2.56) · insurance ($2.54) · professional and legal fees ($1.95) · office supplies, repairs, maintenance ($1.65) · housekeeping and other ($1.40) · licenses, permits, taxes ($1.39) · transportation, meals, misc ($0.79) | $1,027,472 | **$38.53** | 25.0% |
| **Total cost** | | **$3,805,788** | **$142.70** | 92.6% |
| **Revenue** | | **$4,110,669** | **$154.14** | 100% |
| **Net** | | **$304,881** | **$11.43** | **7.4%** |

Ties to the normalized base to the dollar. Model and allocation rules are in §10.

**The four lines the slide is built to deliver**

1. **"Between the referral and the payment costs you $39 an exam."** A + B1 + D = $39.04, or 25.3 percent of revenue. That is the operational work Gravity does: getting the order, getting the patient in the door, getting paid.
2. **"You pay twice as much to move the paper as to read the scan."** $39 to run the order versus $19 for the radiologist to read it, and nearly twice the eleven technologists who perform it ($21). This is the model-breaker for the CFO, the way the 85 percent number was for the CEO.
3. **"Every empty slot you fill is worth $127."** Revenue per exam $154, less the costs that actually scale with one more exam (the read $19.22, supplies $5.74, merchant charges $2.10) leaves $127 of contribution, 82 percent. Eighty percent of this center's cost is fixed at today's volume. The utilization argument from slide 8 is now arithmetic, and the prior-year column shows it running in reverse.
4. **"This center keeps $11 of every $154, and $39 of the rest is paper."** A seven percent margin is normal for an independent. It is also fragile: one soft year cut it in half. The paper is the largest cost the center controls, and the only large one that does not touch a patient.

---

## 4. What Gravity changes, layer by layer

Each lever names the leak it closes, the evidence behind the assumption, and two settings: **expected** (what the evidence supports at a center that adopts fully) and **conservative** (roughly half). Nothing here is a guarantee, per the language rules; in body copy the word is "closes" or "stops," with the number. The levers are unchanged from v0.1; only the base they act on moved.

| Layer | Lever | Expected | Conservative | Evidence |
|---|---|---|---|---|
| **A. Get the order** | Order intake and records labor: fax and portal orders classified, linked and digitized without re-keying | -75% | -50% | Measured: one person handles about 350 orders a day with Gravity (Valley MRI, Sep 2026); auto order creation removes typing when patient, provider and exam match. Fax case study: $2.25 to $0.30 an exam. |
| | Referral leakage recovered: referrers going quiet noticed in days, outreach built in | +2% exams | +1% exams | About half of referrals complete; fax-based workflows about 54% (BD Emerson 2026, citing PMC). The source cut marketing by more than half in the year volume fell 7.6%. Modeled only: there is no measured referral lift at a live customer, so no customer claim is made. |
| | Marketing spend and outreach staff | unchanged | unchanged | The two people stay; they get a live list of who stopped referring and a phone that dials itself. |
| **B1. Access** | Scheduling and confirmations labor: two-way text, self-scheduling, voice agent, automated confirmations and reminders | -60% | -40% | Voice agent at $15 an hour of talk time does "about three hours of that same work done by a human" (DFW 2025). Shamit's front-end stack: $27 to $6 an exam (Headlight 2025). Ten people schedule and confirm about 107 exams a day here. |
| | Front desk labor: pre-check-in, digital forms, estimates sent ahead | -30% | -15% | Shipped check-in (identity, forms, consent, estimate and payment, ABN) plus the iPad kiosk, which takes pre-check-in to 90 percent or more of patients (Shamit, 23 Sep 2026). Portal-only pre-check-in measured 14 percent at ProScan (Sep 2026), which is why the kiosk carries the lever. |
| | Order leakage recovered: no-shows and cancellations refilled, unscheduled orders worked | +5% exams | +2% exams | Tower Radiology 2020 to 2021: +7% exams a week in MRI, CT and mammography; $2.32M added revenue; $1.62M gross profit; 71% shorter wait for nudged patients (RSNA 2021 Quality Improvement Award report; 2022 abstract). No-shows are the top access priority for practice leaders (MGMA 2026). The representative center runs no texting vendor today. |
| | Phone system | -50% of telephone spend | -30% | Phone, fax and text built into Gravity on embedded carriers; the in-app dialer is the contact-center option. |
| **B2. The scan** | Technologists, machines, supplies | supplies scale with volume; techs and equipment fixed, so cost per exam falls as slots fill | same | Fixed-cost leverage. Eleven techs are step-fixed; +7% volume is absorbed by the same roster. |
| **B1. RIS** | RIS data and cloud storage | unchanged | unchanged | Counted in "complete the exam." A stage-3 upside when Gravity replaces the RIS ($2.51 an exam); not counted here. |
| **C. Report** | Reads, software | **unchanged** | unchanged | Gravity does not read the scan or write the report; it delivers both to the referrer. Say so on the slide. |
| **D. Get paid** | Verification, estimates and authorization labor | -65% | -45% | Wake Radiology calculator 2024: eligibility labor $1.89 to $0.45 per estimate; authorization labor $8.31 to $2.39 per auth. Physicians and staff spend about 13 hours a week on prior authorization; 40% of practices have staff who do nothing else (AMA, May 2026). Half this center's volume is HMO. |
| | PIP and legal case labor | -30% | -15% | Attorney and auto-injury paperwork is document work Gravity reads and files; the negotiation stays human. |
| | Billing and collections labor: claims out clean, remittance posted, statements by text | -40% | -20% | Beta at Bright Light (835 remittance live as a parallel feed; claim simulator in beta; statements in build). Shown and labeled beta on slide 19; lever kept at full scope by Shamit's decision, 23 Sep 2026. |
| | Revenue leakage recovered: denials prevented at scheduling | +1.0% net revenue | +0.5% | Initial denial rates about 12% (2024); half of denials trace to missing or inaccurate data and 35% to authorizations (Experian, Sept 2025); 35 to 60% of denied claims are never resubmitted (AHIMA); rework costs about $57 a claim (Premier, 2023). Recovering a third of unrecovered write-offs is about 1% of net revenue. |
| | Postage (statements, records, reports) | -50% | -25% | Digital delivery. |
| **Gravity** | Subscription plus voice agent | $3.10 an exam | $3.10 an exam | Pricing Simulation sheet (4 May 2026): Quantum $2.67 an exam at 2,200 a month plus voice at $0.25 a minute ($15 an hour, about 60 hours a month) = $3.08 all in, rounded to $3.10. Implementation $10,000 for 1,001 to 5,000 exams a month, year one. List price; deals are often discounted. |

**What is deliberately not in the model:** replacing the RIS or the billing system (stage 3 of the on-ramp), outsourcing savings (this center outsources nothing but the reads), the equipment cost the cash P&L hides, and any revenue-per-exam improvement from payer mix or contracting. All of them make the case better. Leave them out and let the buyer find them.

---

## 5. The result

**Per exam, before and after (expected case, on 7 percent more exams)**

| | Before | After | Change |
|---|---|---|---|
| A. Get the order | $10.55 | $7.28 | -$3.27 |
| B1. Complete the exam: order and schedule | $15.67 | $8.34 | -$7.33 |
| B2. Complete the exam: the scan | $44.32 | $41.79 | -$2.53 (fixed costs over more exams) |
| C. Generate the report | $20.82 | $20.55 | -$0.27 (software over more exams; reads unchanged per exam) |
| D. Get paid | $12.82 | $7.32 | -$5.50 |
| E. Building and G&A | $38.53 | $36.01 | -$2.52 (fixed costs over more exams) |
| Gravity | $0.00 | $3.45 | +$3.45 |
| **Total cost** | **$142.70** | **$124.68** | **-$18.02** |
| **Revenue** | **$154.14** | **$155.68** | +$1.54 (denial prevention) |
| **Net per exam** | **$11.43** | **$31.00** | **+$19.57 (2.7x)** |
| Between the referral and the payment (A + B1 + D, plus Gravity after) | $39.04 | $26.38 | -$12.66 |

Stage values are rounded; totals come from the model.

**Per exam, by scenario (the only form that goes to a customer)**

| Scenario | Revenue | Cost | Net | Margin |
|---|---|---|---|---|
| Today | $154.14 | $142.70 | **$11.43** | 7.4% |
| Expected | $155.68 | $124.68 | **$31.00** | 19.9% |
| Conservative (half the effect on every lever) | $154.91 | $133.75 | **$21.16** | 13.7% |
| Cost only (no volume, no denial lift) | $154.14 | $131.24 | $22.90 | 14.9% |
| Volume only (+5%, no staffing change) | $154.14 | $140.70 | $13.44 | 8.7% |
| Downside today: lose 7.6% of volume, no Gravity | $154.14 | about $152 | about $2 | about 1% |

**Annual, at the modeled volume (internal sanity check only; never on a slide)**

| Scenario | Exams | Revenue | Cost | Net | Margin | Swing | Gravity spend | Return on Gravity spend |
|---|---|---|---|---|---|---|---|---|
| Today (model year) | 26,669 | $4.11M | $3.81M | **$305K** | 7.4% | | | |
| Expected | 28,536 (+7%) | $4.44M | $3.56M | **$885K** | 19.9% | **+$580K** | $98K | 5.9x; pays back in about 2 months |
| Conservative | 27,469 (+3%) | $4.26M | $3.67M | **$581K** | 13.7% | **+$276K** | $95K | 2.9x; about 4 months |
| Cost only (no volume, no denial lift) | 26,669 | $4.11M | $3.50M | $611K | 14.9% | +$306K | $93K | 3.3x |
| Volume only (+5%, no staffing change) | 28,002 | $4.32M | $3.94M | $376K | 8.7% | +$71K | $97K | 0.7x |

**How to read it, per exam.** The labor savings alone (about $13.50 an exam, roughly 46 percent of the $29 of non-clinical labor) double the exam's margin: $11 to $23. Volume alone barely covers the fee, because a filled slot is worth $127 only if the work to fill it does not still cost $39. The two together take the exam from **$11 to $31, a 7 percent margin to 20.** The conservative case, at half the effect on every lever, is $21 an exam. The downside row is the other half of the argument: eighty percent fixed cost means an 8 percent volume slip turns $11 into $2.

**Where the savings come from, for the CFO (the three budgets):**

| Budget | Expected annual saving | Note |
|---|---|---|
| Staffing (non-clinical operations) | $361,000 | About 46 percent of $776,000. Delivered as attrition, redeployment and higher pay for the people who stay, per the GTM primer; never as a promise of layoffs from us. Technologists and administration untouched. |
| Software and vendors | $38,000 now; $67,000 more at stage 3 | Phone, postage and office expense now; RIS data and cloud (inside "complete the exam") when Gravity replaces the RIS. |
| Outsourcing | $0 here | This center outsources only the reads, which Gravity does not touch. Centers that outsource authorizations at $8 to $10 each have a large fourth line. |
| Revenue recovered | $332,000 | Filled slots and retained referrers $288,000; denials prevented $44,000. |

**A note on the founder's claim.** In an August 2026 call Shamit described a Florida center of about 30,000 exams that "was losing $400,000 a year" and "now is making $350,000 in profit just with a software upgrade." That is a $750,000 swing at a center that was, by definition, badly run. This model run on the un-normalized source (v0.1) produced a $641,000 expected swing; on the normalized representative center it produces $276,000 to $580,000. The spoken figure describes the turnaround of a struggling center and is consistent with the model's mechanics; the deck uses the normalized, modeled range so that the story is about a typical center, not a rescue. Until there is a before-and-after P&L artifact, the spoken figure stays out of the deck.

---

## 6. The slide

**Title:** *Slide 21. Your exam, itemized.* `LOCKED` 23 Sep 2026

**Visual.** Typographic, two columns, no chart junk. The left column is an itemized statement for one exam today: revenue at the top, six cost blocks below it in the order the exam happens (get the order, get the patient in, the scan, the read, get paid, the building), and the net at the bottom: **$11**. The right column is the same statement with Gravity: five of the six blocks smaller, the read unchanged, one new line for Gravity at $3.45, and the net at the bottom in the brand's highlight treatment: **$31**. Between the columns, one bridge figure: **$11 an exam to $31. A 7% margin to 20%.** Under the columns, one strip: "Between the referral and the payment: $39 an exam today. $26 with Gravity, including what you pay us." Footnote in small type: "One blended outpatient exam across eight modalities, modeled on the cost structure of independent outpatient imaging; not any one center's figures. Expected case; conservative case $21 an exam (14% margin). Shared costs allocated by stated shares." No center size, headcount or annual dollars anywhere on the slide.

If the design team wants a chart, it is one pair of stacked horizontal bars (cost blocks) against a revenue line, before and after; the statement is better. No pipes, no funnels, no leaking anything. The leak is a line item now.

**On screen**
- Headline: **Your exam, itemized.**
- Left: *Today.* Revenue $154 · Get the order $11 · Get the patient in $16 · The scan $44 · The read $21 · Get paid $13 · The building $39 · **Net $11**
- Right: *With Gravity.* Revenue $156 · Get the order $7 · Get the patient in $8 · The scan $42 · The read $21 · Get paid $7 · The building $36 · Gravity $3.45 · **Net $31**
- Bridge: **$11 an exam to $31. A 7% margin to 20%. Same scanners. Same referrers.**
- Strip: Between the referral and the payment: **$39** an exam today, **$26** with Gravity.

Stage values round to the dollar; net figures come from the model, so the columns will not foot to the dollar on screen. Design carries the net from the model, not the sum of rounded rows.

**Talk track (two minutes)**

> Let me put the whole argument on one exam. Not a center, one exam, because that's the unit that's the same whether you run one site or twenty. A blended outpatient exam collects about $154. Here is where it goes.
>
> Forty-four dollars to do the scan: the technologist, the machine, the service contract. Twenty-one to read it. Thirty-nine for the building and running the business. And another thirty-nine dollars to get the order, get the patient in the door, and get paid: the people, the phones, the RIS. Twenty-nine of that thirty-nine is people who never touch a patient. You pay twice as much to move the paper as to read the scan.
>
> That leaves eleven dollars. Seven percent. Normal for an independent, and fragile: eighty percent of that cost is fixed, paid whether the table is full or not. Lose eight percent of your volume and that eleven dollars becomes two.
>
> The same exam with Gravity. The paper drops from thirty-nine dollars to about twenty-six, and that includes what you pay us. The empty slots fill, so the fixed cost spreads over more exams, and every extra exam is worth a hundred and twenty-seven dollars because the scanner is already paid for. Eleven dollars becomes thirty-one. Seven percent becomes twenty.
>
> If we only get half of that on every line, it is still twenty-one dollars an exam.
>
> Multiply by your exam count. I don't know your numbers. You do. That is the next step.

**Objections this slide will draw, and the answers**

| Objection | Answer |
|---|---|
| "Your savings assume I fire people." | "They assume you stop hiring for the paper. Most of it lands as attrition you don't backfill and people you move to exceptions and pay better. That conversation belongs with your leadership, and we'll give you the numbers to have it." |
| "Our reads are cheaper / in-house." | "Then your read line is smaller and your margin is better. Nothing in the Gravity column touches the read; Gravity only delivers it." |
| "We run better than seven percent." | "Good. The paper still costs you forty dollars an exam whether you're at seven or fifteen, and it is the largest cost you control that never touches a patient." |
| "We're losing money." | "Then the fixed-cost lever is working against you today, and it works just as hard the other way. The first thing that moves is the paper line." |
| "Seven percent more volume is a big assumption." | "Take it to zero and the labor line alone takes the exam from eleven dollars to twenty-three. The volume is the upside, not the case." |
| "My centers are different sizes." | "That's why it's per exam. The cost of moving one order doesn't care how many sites you have. Give us your exam count by site and we'll itemize each." |
| "Whose numbers are these?" | "Nobody's. They're built on the cost structure of independent centers like yours, which is why the next step is your numbers. The model is the same; the inputs are yours." |
| "How much of this is your fee?" | "Three dollars and forty-five cents an exam, all in, in that column. It is on the slide because you'd ask." |

---

## 7. Where it goes in the deck

Insert as **slide 21**, immediately after the demo's one-system slide (20) and before "How you get there." The demo has just shown the work; this slide says what the work is worth; the adoption path then says how to get it; proof and the ask follow. The close becomes five slides (21 to 25) and seven minutes; the time comes from Part 2 and the question period (see the deck's running order).

| Slide | Title |
|---|---|
| 20 | One system, one set of data |
| **21** | **Your exam, itemized** |
| 22 | How you get there |
| 23 | Who trusts us |
| 24 | Why Alpha Nodus |
| 25 | Next step: pick one leak, and put your numbers in this model |

Slide 25's leakage math becomes the promise to fill this exact statement with the buyer's numbers: **the buyer's exam, itemized**, free for the first workflow.

---

## 8. Public benchmarks used

| Figure | Source |
|---|---|
| Initial claim denial rates rose to about 11.8% in 2024; Medicare Advantage about 15.7%, commercial about 13.9% | Becker's Payer, AHA, via Aptarro 2026 roundup |
| Administrative cost per denied claim $57.23 (2023, up from $43.84 in 2022) | Premier Inc. |
| 35 to 60 percent of denied or returned claims are never resubmitted; rework $25 to $181 per claim | AHIMA Journal |
| Top denial causes: missing or inaccurate data 50%, authorizations 35%, registration data 32%; 41% of providers see denial rates of 10% or more | Experian Health, State of Claims 2025 |
| About 13 hours a week of physician and staff time on prior authorization; 40% of practices employ staff exclusively for it | AMA prior authorization survey, published May 2026 |
| About half of referrals complete; fax-based workflows about 54% scheduled; 21-day average referral-to-appointment lag | BD Emerson 2026, citing PMC |
| No-shows the top patient-access priority for 27% of practice leaders | MGMA Stat 2026 |
| No-shows cost a 200,000-exam academic department about $1 million a year (about $5 an exam) | Mieloszyk et al., Academic Radiology 2018 |
| Technologist vacancies: CT 19.4%, MRI 17.4% | ASRT 2025 |
| MRI technologist median wage $95,480 (May 2025); radiologic technologists in outpatient care centers mean $89,490 (May 2023) | BLS OES |
| RadNet 2025: $1.99 billion revenue, adjusted EBITDA margin 14.3%, 418 centers, same-center volume +4.5% | RadNet Q4 2025 release, 2 March 2026 |
| 2025 CAQH Index: $258 billion in administrative cost avoided in 2024; $21 billion remaining opportunity | CAQH, 19 February 2026 |

The RadNet margin is a useful foil for a CEO ("a well-run network runs at 14 percent; a typical independent runs at seven; the scanners are the same") but it names the competitor's parent, so use it only on request. The representative center's technologist rates sit below the BLS medians, which is one more reason the argument should never land on the clinical staff.

---

## 9. What we still need, and what to collect from a buyer

**Internal, before this slide is shown**

| # | Item | Status |
|---|---|---|
| 1 | The normalized model as the "today" column, per exam only (§6) | Closed: §10, items 2 and 7 |
| 2 | If a *named* before-and-after is wanted later for the proof slide, that is a separate proof decision: it needs the center's permission and, if the CEO holds a stake, an ownership disclosure reconciled with brand platform B4.5 and AOS page question 8. Not required for this slide. Parked. | Deferred |
| 3 | If Gravity is live or going live at the source center, instrument 2026 monthly (exams by modality, collections, headcount by role, no-show and unscheduled-order counts, referrer counts, denial rate and reasons, days in A/R, phone volumes). Optional; feeds item 2 only. | Optional action |
| 4 | Part-time hours (20 a week) | Closed: a stated model assumption, since the center is a model |
| 5 | Gravity price line | Closed: $3.08 all in on the May 2026 pricing sheet; model keeps $3.10 |
| 6 | Proof for each lever | Closed 23 Sep 2026: order intake (about 350 orders a day per person, Valley MRI); pre-check-in (kiosk, 90%+); Tower figures verified from the RSNA 2021 report; courtesy note to Dr. Kedar before RSNA |
| 7 | Post-service billing | Closed: shown as the Bright Light beta, labeled beta; lever kept at -40% / -20% by Shamit |
| 8 | The founder's spoken "$400K loss to $350K profit" stays out of the deck until a before-and-after artifact exists (§5) | Standing |
| 9 | Sanity-check the per-exam statement ($154 in, $39 of paper, $11 left) with two or three friendly operators | Action before RSNA |

**From a buyer, for their exam itemized (the leakage review intake)**

| Category | Data |
|---|---|
| Volume and revenue | Exams by modality, last 12 months; charges and collections by modality and payer; gross and net collection rate |
| Labor | Headcount and loaded cost by role: front desk, scheduling, records and order intake, verification and estimates, authorization, billing and collections, marketing and liaisons, technologists, management; contract and offshore labor; overtime |
| Vendors | RIS, PACS, billing system or billing service (percent of collections), clearinghouse, phone system, fax, texting and reminder vendor, IVR, interface engine, eligibility vendor, authorization vendor or outsourcer, postage and statements, merchant fees, marketing spend |
| The scan and the read | Radiologist reads (per exam or percent), equipment leases, service contracts, supplies |
| The building | Rent, utilities, insurance, G&A |
| Leak indicators | Referring providers active, new and lost by quarter; orders received versus exams completed; unscheduled orders on hand; no-show and same-day cancellation rates; slot utilization by modality; calls per day, hold time, abandonment; authorizations required and turnaround; denial rate and top reasons; days in A/R; write-offs |

Three inputs (exams, collections, payroll by role) are enough for a first version in the meeting. The rest makes it defensible. The source center supplied exactly those three, plus a two-year P&L, and that was enough for everything in this note.

---

## 10. Decisions

| # | Decision | Status |
|---|---|---|
| 1 | Adopt the per-exam P&L as the closer, inserted as slide 21, with the close renumbered 21 to 25 | **Approved, 23 Sep 2026** |
| 2 | The "today" column is a **normalized representative center** (source cost structure less 15 percent on every expense line; revenue, volume, mix and roles kept). No real center's figures are presented as actuals anywhere. | **Decided by Shamit, 22 Sep 2026** (supersedes v0.1 decision 2) |
| 3 | Ownership disclosure for a named proof center | **Withdrawn for this slide**; parked under §9 item 2 for the proof slide only |
| 4 | Present expected and conservative cases side by side, never the expected case alone | **Approved, 23 Sep 2026** |
| 5 | Build the buyer-facing calculator | **Held** by Shamit, 23 Sep 2026 |
| 6 | Instrument the source center's 2026 monthly data | Optional; only if a named proof is wanted later |
| 7 | Customer-facing unit is one exam; no center size, headcount or annual dollars on the slide or in the talk track | **Decided by Shamit, 23 Sep 2026** |
| 8 | The leakage review on slide 25 ("your exam, itemized") is free for the first workflow | **Decided by Shamit, 23 Sep 2026** |
| 9 | RIS data and cloud storage is a cost of completing the exam (B1), not of generating the report (C) | **Decided by Shamit, 23 Sep 2026** |

**Model and allocation rules (for reproducibility).** Source expense lines multiplied by 0.85 (normalization). Labor pool $1,581,181 after normalization (salaries, payroll expenses, contract labor, other employee benefits), allocated by the roster's base wages by role (full time 2,080 hours, part time 1,040 hours assumed), scaled 0.896 to tie. RIS data and cloud storage in B1 (complete the exam). Telephone split 20/50/30 across acquire, access, get paid. Postage split 30/40/30 across acquire, report, get paid. Office expense split 40/30/30 across access, get paid, G&A. Equipment and software purchases split 50/50 scan and report. Housekeeping and administration sit in the building and G&A. Variable with volume: reads, medical supplies and helium, merchant and claims charges (as a share of revenue), postage. Everything else fixed within a 7 percent volume change; technologists treated as step-fixed. Scripts: `unit/model.py` (source P&L lines), `unit/model2b.py` (roster allocation and scenarios, RIS in B1), `unit/model4.py` (applies the 0.85 normalization and reruns) in the session workspace.

**Version history.** v1.1 (23 Sep 2026): RIS cost moved to B1; paper $39, read $21. v1.0 (23 Sep 2026): per exam only for customers; all open tags closed; slide 20 and the two-case rule approved; calculator held. v0.1 (22 Sep 2026): built on the source center's actuals, anonymized. v0.2 (23 Sep 2026): reframed as a normalized representative center per Shamit's instruction; all figures rebased; permission and disclosure items withdrawn for this slide; talk track and objections rewritten for a profitable base.

**Related:** [[AN27 — Winning Story and Pitch Narrative]] · [[AN27 — Customer Pitch Deck Outline]] · [[AN27 — Positioning and Messaging]] · [[AN27 — Messaging Package]] · [[AN27 — History and Research]] · [[Imaging Industry Primer]] · [[AN27 — Open Items Register]]

## Sources

Internal: `HDC Financials.pdf`, `HDC EXPENSE CATCH UP 1.xlsx`, `payroll 2026.xlsx` (Shamit, 22 Sep 2026; used as cost-structure source only); Drive: Cost Calculator (2020), Value Calculator (2020), RoI Calculator (2020), Flow ROI (2021), Gravity Flow deck (2021), RadRegional RoI (2022), RoI.xlsx (2022), Gravity RoI Calculator (2023), ROI Calculator Wake Radiology (2024), Pricing Simulation (2026); Fireflies: DFW MRI 2 Jul 2025, Midtown 7 May 2025, Headlight 4 Jun 2025, Northwest Radiology 4 Jun 2025, Excel Diagnostics 14 Sep 2026, Trinity Health 27 Aug 2026, Noble MRI 12 Jun 2026, Sacramento Ultrasound 21 Apr 2025 (details in [[AN27 — History and Research]] Entries 015 and 016).

External: https://www.aptarro.com/insights/us-healthcare-denial-rates-reimbursement-statistics · https://www.experianplc.com/newsroom/press-releases/2025/experian-health-s-3rd-annual-state-of-claims-survey-finds-denial · https://www.ama-assn.org/press-center/ama-press-releases/ama-survey-prior-authorization-reform-pledge-falls-short-physicians · https://www.bdemerson.com/article/referral-leakage-statistics · https://www.mgma.com/mgma-stat/patient-access-priorities-for-2026 · https://radiologybusiness.com/topics/healthcare-management/healthcare-economics/radiology-departments-lose-1m-year-due-no-shows · https://www.asrt.org/main/news-publications/news/article/2025/07/24/asrt-staffing-and-workplace-survey-shows-vacancy-rate-increases-near-record-highs-aligning-with-overall-health-care-profession-trends · https://teslamr.com/guides/mri-technologist-salary-guide/ · https://www.bls.gov/oes/2023/may/oes292034.htm · https://www.radnet.com/about-radnet/news/radnet-reports-fourth-quarter-2025-results-including-record-revenue-and-adjusted-ebitda-and-releases-2026-financial-guidance · https://www.globenewswire.com/news-release/2026/02/19/3241072/0/en/2025-caqh-index-shows-u-s-healthcare-avoided-258-billion-and-accelerated-automation-interoperability-and-ai-adoption.html
