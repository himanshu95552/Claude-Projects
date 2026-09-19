/**
 * Alpha Nodus company facts — ported from the knowledge brief
 * (171b85ea-alphanodus-gravity-knowledge-brief.md §1-2), so every session
 * that drafts content has the same accurate source instead of drifting
 * per-conversation. Section numbers in comments trace back to that brief
 * for anyone auditing a claim.
 */

export const COMPANY_PROFILE = {
  name: "Alpha Nodus",
  founded: 2015,
  hq: "Sunrise, Florida",
  branchOffice: "Austin, Texas",
  phone: "1-888-625-7420",
  email: "info@alphanodus.com",
  address: "1341 Sawgrass Corporate Parkway, Suite 104, Sunrise FL 33323",
  marketingOwner: { name: "Tushant Suneja", title: "Marketing Manager", email: "tushant.suneja@alphanodus.com" },
  leadership: ["Shamit", "Arpit"], // §1: founders/leadership referenced in training material
} as const;

/** §1: the founding insight — the single best "why we exist" story available. */
export const ORIGIN_STORY = {
  summary:
    "Alpha Nodus started in 2018-2019 installing physical sensors in imaging centers to measure real equipment/room utilization, expecting semiconductor-fab-level rates (95-99%). Measured reality was 60-65% utilization -- at centers where patients waited 2-4 weeks for an appointment. The constraint was never the scanner. It was everything in front of it: intake, scheduling, authorization, outreach. That discovery pivoted the company from sensors to building an AI front office over 2019-present.",
  nameOrigin:
    "\"Gravity\" was conceived between Shamit and Arpit -- the force that pulls everything toward a single center, the aspiration being to pull everything in healthcare's front office toward the platform.",
} as const;

/** §1: how the company thinks about itself -- safe to reference in founder/culture content. */
export const CORE_VALUES = [
  "Customer success is a core company value, not a post-sale department -- we sell subscriptions, so the customer must be happy every month to renew.",
  "Every employee owns sales -- there is one continuous process (acquisition -> order-taking -> fulfillment -> happy customer -> repeat) and everyone sits somewhere in it.",
  "\"AI won't take your job -- people who use AI will.\" Every employee is expected to be fluent with AI tooling.",
  "Facts vs. opinions are explicitly separated -- mechanical facts (how RIS/PACS/RCM work) don't change; opinions (who wins the market) do, and get flagged as opinions.",
] as const;

/** §1: the standard explanatory device used in every pitch, first-year hire to Fortune 500 CIO. */
export const FAST_FOOD_ANALOGY =
  "A restaurant needs finance, real estate, inventory, labor -- and customers, the piece most people forget. Mapped onto imaging: the scanner is the grill, the tech is the cook, the scheduler is the waiter, the radiologist's report is the food, the RIS is the inventory system, the RCM is the POS.";

/** §1: GTM mental model -- useful context for Industry POV / founder-vision content, not for direct claims. */
export const GTM_MODEL = {
  pushVsPull:
    "Push (advertising, SEO, inbound) = low cost per prospect, low conversion, works once the market knows it has the need. Pull (outbound, direct sales, channel partners) = high cost per attempt, high conversion, works when the market doesn't know you exist. Alpha Nodus today is primarily pull-driven.",
  channelPartnerships:
    "Channel partnerships are the dominant GTM lever -- RIS/PACS/LIS vendors face build-vs-lose-vs-partner as AI arrives; one signed vendor partnership unlocks dozens-to-hundreds of imaging centers at far lower acquisition cost than direct sales.",
} as const;

/** §2: industry facts -- safe, stable, non-promotional context for Category Education content. */
export const INDUSTRY_FACTS = {
  threeSystemStack: [
    { system: "RIS", fullName: "Radiology Information System", does: "Scheduling, slot inventory, demographics, order routing", mentalModel: "A glorified Excel for slot management" },
    { system: "PACS", fullName: "Picture Archival and Communication System", does: "Stores/presents/archives imaging studies via DICOM", mentalModel: "Dropbox for medical images with specialized viewers" },
    { system: "RCM", fullName: "Revenue Cycle Management", does: "Billing, claims, collections, payment posting", mentalModel: "The healthcare POS system -- except the swipe comes back weeks later, partial, plus a balance to chase for months" },
  ],
  whyFaxStillRulesHealthcare: [
    "HIPAA (1996) explicitly designates fax as an authorized PHI transmission method; email requires encryption and BAAs.",
    "Fragmentation kills portals -- a PCP refers to 500+ downstream destinations; fax is the universal interoperability protocol precisely because nobody owns it.",
    "Economics discourage proactive faxing of full records -- fax runs ~5c/page against an average ~$110 imaging reimbursement, so doctors send minimal orders and the imaging center chases the rest.",
  ],
  insuranceMechanics: {
    threeChecksBeforeEveryExam: ["Eligibility verification", "Benefit check", "Prior authorization (for MRI/CT/PET/nuclear medicine)"],
    starkLawContext:
      "Stark laws (1989) forbid a physician being compensated for referrals to a facility they have a financial stake in. Because prior auth needs clinical history only the referring PCP has, and the PCP has no incentive to do that paperwork, imaging centers compete by taking the PA workload off the doctor's hands -- the single largest operational cost line item for most imaging centers.",
  },
  utilizationEconomics: {
    measuredUtilization: { imaging: "60-65%", hotels: "~85%", airlines: "~85%", semiconductorFabs: "95-99%" },
    headlineFraming: "Roughly 35%+ of clinical capacity walks out the door every day while patients wait weeks -- the constraint is the scheduling operation, not capacity.",
    fixedCostMath:
      "~70% of an imaging center's costs are fixed. A center at 65% utilization moving to 70% gets ~5% more revenue against only ~1.5% more cost -- incremental patients past break-even flow almost entirely to margin.",
  },
  marketScale: "~$5 trillion in annual US healthcare spend; roughly 25c of every dollar is human labor doing manual work.",
} as const;

/** §2: decision-maker map -- for targeting/persona context, not for direct claims. */
export const DECISION_MAKER_MAP = [
  { role: "Owner/CEO/practice administrator", is: "economic buyer", caresAbout: "utilization, margin, staffing cost, staying independent" },
  { role: "Director of Operations/COO", is: "user-champion", caresAbout: "whether the front desk is drowning, whether they can stop hiring into a role nobody wants" },
  { role: "IT Director/CIO", is: "gatekeeper", caresAbout: "integration, security, disruption, implementation timeline" },
  { role: "Billing Manager/RCM Director", is: "often the enterprise wedge", caresAbout: "denials, especially ones tracing to a front-desk data-entry error" },
] as const;
