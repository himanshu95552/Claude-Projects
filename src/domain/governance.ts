/**
 * Review scope, exactly as governance.md draws the line: marketing reviews
 * four things and four things only — never voice, tone, topic choice, or
 * formatting. "Reviewing style is how advocacy programs die."
 */

const CUSTOMER_MENTION_PATTERN = /\b(customer|client)\b.{0,40}\b(said|told|shared|reported)\b/i;
const PHI_RISK_KEYWORDS = [
  "patient name",
  "diagnosis",
  "medical record",
  "patient identif",
  "protected health",
];
const UNVERIFIED_CLAIM_MARKERS = [
  "guarantee",
  "guaranteed",
  "100%",
  "always approved",
  "never denied",
  "reimbursement outcome",
];

export type ReviewFlag =
  | "customer_name_mentioned"
  | "possible_phi"
  | "unverified_claim"
  | "confidential_info_risk";

/**
 * Flags content for the four things governance.md says marketing reviews.
 * `clearedCustomerNames` should be the live cleared_customers table so a
 * newly-cleared customer stops triggering a flag without a code change.
 */
export function evaluateGovernanceFlags(params: {
  text: string;
  clearedCustomerNames: string[];
  phiCheckRequired: boolean;
}): ReviewFlag[] {
  const flags: ReviewFlag[] = [];
  const lower = params.text.toLowerCase();

  const mentionsAnyCustomerName = params.clearedCustomerNames.some((name) =>
    lower.includes(name.toLowerCase()),
  );
  if (mentionsAnyCustomerName || CUSTOMER_MENTION_PATTERN.test(params.text)) {
    flags.push("customer_name_mentioned");
  }

  if (params.phiCheckRequired && PHI_RISK_KEYWORDS.some((kw) => lower.includes(kw))) {
    flags.push("possible_phi");
  }

  if (UNVERIFIED_CLAIM_MARKERS.some((kw) => lower.includes(kw))) {
    flags.push("unverified_claim");
  }

  return flags;
}

/**
 * governance.md: "Under 4 business hours. A post held longer is usually
 * dead." This computes the wall-clock SLA deadline; business-hours
 * refinement (skip nights/weekends) is a documented simplification for
 * v1 — see docs/ARCHITECTURE.md.
 */
export function computeReviewSlaDueAt(createdAt: Date, slaHours: number): Date {
  return new Date(createdAt.getTime() + slaHours * 60 * 60 * 1000);
}

/** self_approve tier skips review entirely — governance.md + build-spec.md §5. */
export function needsReview(params: {
  reviewTier: "self_approve" | "standard";
  flags: ReviewFlag[];
}): boolean {
  if (params.reviewTier === "self_approve") return false;
  return params.flags.length > 0;
}
