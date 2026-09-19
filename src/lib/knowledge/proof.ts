/**
 * Proof points — knowledge brief §4. This is the canonical source for
 * `cleared_customers` (seed data) and for any content that cites a
 * client story. `hasPublicQuote: true` clients may be quoted verbatim;
 * others (§4.2) may only be named, never quoted or given invented detail.
 */

export type ClientStory = {
  name: string;
  hasPublicQuote: boolean;
  location: string;
  profile: string;
  quotes?: Array<{ speaker: string; text: string }>;
  bestFor: string; // when to lead with this one
};

export const CLIENT_STORIES: ClientStory[] = [
  {
    name: "Atlantic Medical Imaging",
    hasPublicQuote: true,
    location: "New Jersey",
    profile: "12 locations (current), 70+ radiologists/vascular surgeons, ~900 staff. Founded 1964. Deployed for scheduling + prior auth.",
    quotes: [
      { speaker: "President Daniel Seiders", text: "Through close collaboration with the Alpha Nodus team, we were able to effectively communicate our processes and challenges, leading to the successful implementation of Gravity." },
      { speaker: "President Daniel Seiders", text: "Gravity's remarkable automation capabilities have improved our operations, significantly enhancing staff efficiency." },
    ],
    bestFor: "Larger regional groups, 10+ sites, multi-county, health-system JV context",
  },
  {
    name: "Bright Light Medical Imaging",
    hasPublicQuote: true,
    location: "Chicago",
    profile: "Six sites, independent, physician-led by Drs. Ramit and Resham Mendi. Runs ADS MedicsRIS.",
    quotes: [
      { speaker: "Drs. Ramit & Resham Mendi", text: "Gravity Auth has completely changed the game for us. It used to take hours -- sometimes even days -- to navigate the prior authorization process. Now, it's handled seamlessly, often in just minutes." },
      { speaker: "IT Director Kevin Nowaczyk", text: "The process was so smooth, it honestly surprised me... we're seeing fewer errors, faster turnarounds, and less stress on our staff." },
    ],
    bestFor: "The core ICP -- independent, physician-owned, 4-8 sites. The default lead reference.",
  },
  {
    name: "Iowa Radiology",
    hasPublicQuote: true,
    location: "Des Moines",
    profile: "Four Des Moines-metro locations. Founded 2001, 31 radiologists, ACR-accredited, partnered with UnityPoint Health.",
    quotes: [
      { speaker: "CIO Michael Riesberg", text: "The implementation saved our practice significant time and money. What was truly remarkable was the speed; we were up and running in days rather than the months we would typically expect from a project of this scale." },
      { speaker: "Executive Director Mendy Christensen", text: "Gravity AI has provided the needed innovation here at Iowa Radiology. It has not only streamlined our prior authorization process but has increased the efficiency of the practice in its entirety." },
    ],
    bestFor: "Any prospect worried about time, disruption, or IT burden -- the best asset for an IT director.",
  },
  {
    name: "MRI Associates",
    hasPublicQuote: true,
    location: "US",
    profile: "Nearly 30% of appointments had Medicare entered as primary insurance when it was secondary -- resolved in hours once found.",
    quotes: [{ speaker: "CAO Amanda Maple", text: "I've worked with plenty of vendors, but none identified the root problem like Alpha Nodus did. This quick fix saved us from losing revenue and patient trust due to a simple error." }],
    bestFor: "A prospect who insists their denials are fine or doesn't believe they have a front-office problem.",
  },
];

/** §4.2: name freely, no quote, no invented detail. */
export const NAMEABLE_CLIENTS = [
  "Regional Medical Imaging", "Pueblo Medical Imaging", "ProScan Imaging", "Wake Radiology",
  "Intercity Radiology PC", "Advanced Medical Imaging and Breast Center", "Palm Harbor",
  "Inspira Health", "Radiology Partners", "CareFirst Imaging", "The Radiology Clinic", "Premier Radiology",
];

/** §4.3: third-party validation. Never claim a KLAS score/rating -- none is public. */
export const THIRD_PARTY_VALIDATION = {
  klas: 'Featured in a 2023 KLAS Spotlight Report, "Reducing Authorization Workload Through AI-Assisted Tools and Integrated Outreach Features" -- name it, link it, never claim a score.',
  cipherCollective: "Cipher Collective founding member (Sept 2025) -- ECG Management Consultants' AI partner network for health systems.",
  rsna: "RSNA exhibitor for 4 consecutive years (2023-2026).",
  press: "AuntMinnie coverage twice: June 2023 product update, March 2025 RamSoft integration.",
} as const;

/** §3/§4: channel partnerships -- the strongest third-party proof point the company owns. */
export const CHANNEL_PARTNERSHIPS = {
  ramSoft: "RIS vendor, PowerServer runs at 750+ sites worldwide. Integrated Gravity directly to automate prior authorization for their customer base. Announced March 2025 at RBMA Paradigm. Compliance checks cut denial rates by 25%.",
  ads: "Advanced Data Systems integrated Gravity Auth with MedicsRIS, live at Bright Light Medical Imaging.",
} as const;

/** §4.4: attribute as "our own figures," not audited. */
export const PLATFORM_SCALE = {
  patientVisits: "20M+",
  priorAuthorizations: "4M",
  callsHandled: "15M",
  documentsProcessed: "83M",
} as const;

/** §4.5: never attach to a named client. Always include the second sentence -- it's the honest part. */
export const UNNAMED_CASE_STUDY = {
  results: { patientVolume: "+10%", cancellations: "-40%", laborCosts: "-30%", slotUtilization: "+7%", priorAuthWorkload: "-50%", denialRate: "-25%", annualRevenue: "$2.4 million" },
  framing:
    "One centre running Gravity reported a 10% increase in patient volume, 40% fewer cancellations and half the prior authorisation workload, which they valued at $2.4 million a year. What that figure is at your volume is what we would work out with you, using your numbers.",
};

/** §4.6: match a prospect profile to the strongest proof point. */
export const PROOF_MATCHING_TABLE: Array<{ prospectProfile: string; leadWith: string }> = [
  { prospectProfile: "4-8 sites, physician-owned", leadWith: "Bright Light Medical Imaging" },
  { prospectProfile: "10+ sites, multi-county", leadWith: "Atlantic Medical Imaging" },
  { prospectProfile: "IT-led, worried about disruption", leadWith: "Iowa Radiology" },
  { prospectProfile: "Convinced their front office is fine", leadWith: "MRI Associates" },
  { prospectProfile: "Running RamSoft PowerServer", leadWith: "The RamSoft integration" },
  { prospectProfile: "Running ADS MedicsRIS", leadWith: "Bright Light Medical Imaging" },
  { prospectProfile: "Health-system JV/affiliate", leadWith: "Atlantic Medical Imaging" },
  { prospectProfile: "Large/multi-state/PE-backed", leadWith: "Radiology Partners, ProScan Imaging" },
];
