/**
 * Gravity product facts — knowledge brief §3. Kept separate from company.ts
 * because product facts (what it does, what it explicitly doesn't) are
 * the highest-stakes accuracy surface: getting scope wrong in content is
 * how "replaces your RIS" ends up in a draft.
 */

export const POSITIONING = {
  oneLine: "Gravity is the autonomous AI front office for diagnostic imaging centers.",
  expanded:
    "Picture a virtual front office in the cloud that scales without limit. Every desk has a phone, a fax line, texting and a computer. You can spin up a thousand desks in a moment and take them to zero when you don't need them. The desks are staffed by AI workers that work the way a person does, at a fraction of a penny per transaction.",
  category: "AOS -- Agentic Operations System (Alpha Nodus's own coined term; spell it out on first external use)",
  categoryQuote: "A RIS is a system of orders. An RCM is a system of claims. An AOS is a system of work.",
} as const;

export type Center = {
  name: string;
  agentName?: string;
  handles: string;
  publicPage?: string;
  headlineResult: string;
};

/** §3: the four centers. Use the single highest current published figure per claim -- never stack two versions of the same metric. */
export const CENTERS: Center[] = [
  { name: "Document Center", agentName: "Sasha", handles: "Faxes, referrals, handwritten orders -- vision models read, classify and attach them to the right patient record", publicPage: "Gravity Docs", headlineResult: "Up to 90% of document processing automated" },
  { name: "Booking Center", agentName: "Sandra", handles: "Inbound scheduling by voice/text/web, 24/7; backfills late cancellations; matches patients to open inventory across sites", publicPage: "Gravity Booking", headlineResult: "About 30% more appointments scheduled" },
  { name: "Revenue Center", agentName: "Susan", handles: "Real-time eligibility, automated prior authorization inside payer portals, patient cost estimates, denial prevention", publicPage: "Gravity Auth, Gravity Estimate", headlineResult: "About 50% fewer denials" },
  { name: "Flow Center", handles: "Recall campaigns, referrer engagement, patient follow-up across voice/text/email/fax", headlineResult: "About 35% more repeat visits" },
];

/** §3: supporting published figures, sourced from alphanodus.com. */
export const PUBLISHED_METRICS = {
  documents: { processed: "83M", classificationAccuracy: "99.8%", avgProcessingTime: "90 seconds" },
  authorization: { automated: "80%", fewerReschedules: "30%", denialRateUnder: "2%" },
  booking: { callVolumeHandled: "35%", handleTimeReduction: "50%" },
  estimates: { upfrontCollectionMultiplier: "3x", fewerBillingDiscrepancies: "50%", collectionTimeReduction: "20%", staffTimeReturned: "15%" },
  cancellationsDownOverall: "40%",
} as const;

/** §3: named agents -- use only where they make a story land (demo, narrative). Never as a formal spec-sheet taxonomy -- pulled back from most customer-facing surfaces. */
export const AGENTS = {
  Sasha: "Documents/vision -- computer vision + OCR + LLM structured extraction, learns from corrections.",
  Sandra: "Voice -- real-time speech-to-text + LLM + configurable text-to-speech; switches languages mid-call (Spanish today). Still named on the public demo page.",
  Susan: "Browser automation for prior auth -- opens a browser, logs in, types, clicks, reads the screen like a person, tolerates UI drift via semantic element ID.",
} as const;

/** §3: the three modes, in order -- always present them in order, it defuses fear about autonomy. */
export const OPERATING_MODES = [
  { name: "Sidekick / assistive mode", description: "Gravity does the work, a human reviews and approves before anything leaves. A scheduler doing 10 orders/hour with Gravity does 50/hour." },
  { name: "Selective autonomy", description: "Routine, in-pattern cases run themselves; the team reviews what falls outside the pattern." },
  { name: "Full autonomy", description: "Intake, booking and authorization run end to end; humans handle exceptions and conversations that genuinely need a person." },
] as const;

/** §3: hard scope boundaries. Violating any of these in generated content is a governance-level error, not a style note. */
export const SCOPE_BOUNDARIES = [
  "Does not store or read medical images -- PACS and radiologists are untouched.",
  "Does not replace the RIS or the EMR.",
  "Does not submit post-service claims and does not chase collections -- we integrate with RCM, we don't compete.",
];

/** The single most important banned phrase in the entire knowledge base. */
export const NEVER_SAY_REPLACES_RIS = "replaces your RIS";

/** §3: the honest answer to "who are your competitors" -- use verbatim shape, don't invent a shorter version that overclaims. */
export const COMPETITIVE_POSITIONING = {
  honestAnswer:
    "Zero companies are attacking this problem from the patient-journey angle. RISs, RCMs and PACSs each own one slice but none see the full front-office workflow. Pure AI voice or document startups don't understand imaging operations. We're the only vendor built on the premise that the front office is one unified workflow worth automating end to end.",
  neverSay: [
    "we have no competitors", // sounds naive
    "we compete with RamSoft", // we partner with them, never adversarial
    "we'll take over the whole stack", // overstates scope, scares buyers
  ],
};

export const INTEGRATIONS_COUNT = 13;
export const PUBLISHED_INTEGRATIONS = [
  "e-Rad", "Athena", "Cerner", "Medinformatix", "Epic", "Exa", "ADS (Advanced Data Systems)",
  "RamSoft", "Abbadox", "Merge", "Synapse", "Twilio", "Updox",
];
