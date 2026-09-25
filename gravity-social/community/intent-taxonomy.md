# Intent taxonomy: comments, DMs and mentions

The reference system tags every message Lead, Question, Praise, Complaint or Spam, and turns "how much?" into a lead. Gravity sells to imaging groups, not shoppers, so the buying signals look different and there are more categories that a person must handle. Each inbox item gets exactly one `intent`, a `confidence` (0 to 1), and a `route`.

| intent | Signals (examples) | Route | Reply? |
|---|---|---|---|
| **lead-hot** | Asks for pricing, a demo, a quote, "how does this work at our center," "can you do this for our 6 sites," "does it work with [our RIS]," "we're evaluating vendors / RFP," asks to meet at RSNA, "send me the exam itemized" | Log to `community/leads.csv` the same day; draft a reply that moves to a private channel (DM or email) and offers the next step (demo or exam itemized). Notify the approver. | Draft, approve, send |
| **lead-warm** | An operator describes the pain in their own words ("our fax tray is a nightmare," "we lose auths every week," "our referrers went quiet"), works at an imaging center / radiology group in an ops, RCM, marketing or leadership role, saves or reposts | Log to leads.csv as warm. Reply with value (a specific answer or a relevant post), no pitch. | Draft, approve, send |
| **question** | Product or category questions: "is this RPA?", "what's an AOS?", "do you read the images?", "HL7 or FHIR?" | Answer from `brand/messaging.md` objection answers. | Draft, approve, send |
| **praise** | Thanks, agreement, congratulations | A short, specific thank-you. May use the pre-approved reply bank (below). | Reply bank only |
| **peer** | Other vendors, consultants, investors, analysts adding a point | Engage genuinely; no pitch. | Draft, approve, send |
| **partner** | RIS/PACS vendors (RamSoft, Infinitt and the channel), resellers, integration asks | **Person.** Channel-sensitive until the RamSoft brief (decision 1). | Never auto |
| **press** | Journalists, trade press, podcast or speaking invitations, analysts (KLAS) | **Person** (Shamit or marketing). | Never auto |
| **candidate** | Job seekers, "are you hiring" | Point to careers/contact; no promises. | Reply bank |
| **customer** | An existing customer or their staff (support issue, feature ask, a compliment) | **Person** (customer success, Jay Patel). Never discuss account details in public. | Never auto |
| **complaint** | Criticism of Gravity, an outage claim, a bad experience | **Person.** Acknowledge publicly within hours only after a person approves the wording; move to private. | Never auto |
| **patient** | A patient (or family member) about their own scan, bill, appointment or results, especially with any identifying or health detail | **Person, urgently.** Never repeat details in public. Reply only with the approved patient-redirect line; Gravity is not the imaging center. Consider hiding the comment if it contains PHI. | Approved redirect line only |
| **security** | Security questionnaires, "are you SOC 2?", "HIPAA?", data-residency questions | **Person.** Answers use the approved security wording only; never claim SOC 2 or "HIPAA certified." | Never auto |
| **competitor** | A competitor's employee challenging a claim | **Person.** One factual clarification at most, never an argument. | Never auto |
| **spam** | Bots, link spam, crypto, "grow your followers" | Hide or ignore. Don't reply. | No |

## Scoring a lead (the reference's "ready to buy 2.0 / 2")

`fit` (0 to 2): 2 = imaging center / radiology group / health-system imaging, in a buying role (owner, CEO, COO, CFO, director of ops, RCM, marketing, IT); 1 = adjacent (billing company, consultant, health system non-imaging); 0 = none.
`intent` (0 to 2): 2 = asks for price, demo, meeting, evaluation; 1 = describes the pain; 0 = general interest.
`lead_score = fit + intent` (0 to 4). 4 = hot; 2 to 3 = warm; below 2 = not a lead.

## Never auto-replied (the exit ramps)

patient · customer · complaint · partner · press · security · competitor · anything with PHI · anything about pricing beyond "happy to walk you through it" · anything legal · anything the classifier is under 0.7 confident about.
