/**
 * Messaging & sales playbook facts — knowledge brief §5. The sourced
 * stats behind the "three-leak argument," useful as source material for
 * Industry POV / Revenue Cycle lane content, and the ICP definition for
 * target-roster building.
 */

export const ICP = {
  core: "Independent, non-hospital-owned outpatient diagnostic imaging/radiology centers in the US, 2-25 sites, with an owner/administrator who can sign without a committee, where the centre owns its own front office.",
  secondary: "Orthopedics/cardiology practices with in-house imaging (same referral/authorization pattern).",
  tertiary: "Labs, pathology, pharmacy (same underlying shape).",
  disqualifiers: [
    "A single site under ~10,000 annual exams",
    "A center whose scheduling/auth already lives inside a hospital's Epic build",
  ],
} as const;

/** §5: the core case, sourced. Each stat carries its citation -- never drop the source when quoting one. */
export const THREE_LEAK_ARGUMENT = {
  authorization: {
    headline: "Physicians and staff spend 13 hours/week on prior auth; 40% of practices employ someone who does nothing else.",
    source: "AMA 2025 survey",
    supportingStats: [
      "Completes 40 requests/week",
      "82% say auth volume is rising, 74% say denials are rising, 94% say it contributes to burnout (AMA 2025)",
      "90% report auth burden increased in the past 12 months, 92% have hired/redistributed staff to absorb it (MGMA 2026)",
      "A manual prior auth costs $12.88 and 24 minutes of provider time vs. $5.38 electronic; manual eligibility verification $8.57 vs. $2.00 electronic (CAQH 2024 Index)",
    ],
  },
  missedCalls: {
    headline: "23.8% of scheduled advanced-imaging appointments never happen (21.9% cancelled, 1.9% no-show); more than 70% of cancellations are patient-initiated.",
    source: "Academic Radiology, May 2024, ~81,000 exams",
    framing: "A contact problem, not a patient-reliability problem.",
  },
  denials: {
    headline: "41% of claims/billing leaders say at least 1-in-10 claims is denied; 50% point to missing/inaccurate data, 35% to authorizations, 32% specifically to incomplete/inaccurate patient registration.",
    source: "Experian 2025 State of Claims survey",
    supportingStats: [
      "Over $48 billion in 2025 revenue leakage from final denials and bad debt, up 25% YoY (Kodiak Solutions)",
      "Reworking one denied claim costs $57.23; 10.4% of denied claims had already been prior-authorized (Premier Inc.)",
    ],
  },
  consolidationPressure: {
    headline: "Radiologist-affiliated practices fell 14.7% (2014-2023) while radiologist headcount grew 17.3%; PE deals in diagnostic imaging went from 4 (2024) to 13 (2025).",
    source: "ACR/Neiman HPI",
    argument: "More scans are coming (~27% imaging utilization growth projected over 30 years), reimbursement is flat, administrative load per scan is rising, the people who do that work are hardest to hire, and centres that can't absorb it are selling.",
  },
} as const;

/** §5: tested objection responses. */
export const OBJECTION_RESPONSES: Record<string, string> = {
  "We already have a RIS that does scheduling.": "We don't replace it -- we sit on top and do the work your staff currently do inside it. Ask what RIS they run; we probably already integrate.",
  "AI will make mistakes with our patients.": "Nobody starts in autonomous mode. Sidekick mode means Gravity does the work and staff approve before anything leaves.",
  "How long will this take my IT team?": "Iowa Radiology's CIO: up and running in days, not the months he expected -- his words, on our site.",
  "We can't afford it right now.": "We build the model on their per-site volumes and hand over the line-level assumptions before any pricing conversation.",
  "Who else like us is using it?": "Name the closest analogue from the proof-matching table (lead with a linkable one).",
  "Is our data safe?": "Point to the published security page: encryption in transit/at rest, TLS, AWS KMS with HSMs, independent pen testing, continuous vulnerability scanning, bug bounty with safe harbor. Never raise certifications proactively or put them in writing -- route direct security questions to Shamit.",
  "Send me some information.": "Send the demo sandbox (alphanodus.com/demo), not a PDF -- upload a real order, get a callback from Sandra.",
} as const;

/** §5: current offer and event, time-bound -- verify these are still current before using. */
export const CURRENT_OFFER = {
  offer: "$5,000 in full platform access for a limited number of new clients, running through end of year, against the prospect's own volumes.",
  event: "RSNA 2026: 29 Nov - 3 Dec 2026, McCormick Place, Chicago.",
} as const;
