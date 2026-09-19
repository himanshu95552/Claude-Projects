/**
 * Review scope, exactly as governance.md draws the line: marketing reviews
 * four things and four things only — never voice, tone, topic choice, or
 * formatting. "Reviewing style is how advocacy programs die."
 */

import { NEVER_IN_WRITING, UNUSABLE_STATISTICS } from "@/lib/knowledge/claims";

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

/** Matches ROUTE_TO_SHAMIT (claims.ts): security certifications and KLAS scores/ratings. */
const SECURITY_CERT_PATTERN = /\b(soc\s?2|hitrust|iso\s?27001|hipaa[- ]certified)\b/i;
const KLAS_SCORE_PATTERN = /\bklas\b.{0,30}\b(score|rating|rank|award|#\d|top\s?\d)/i;

export type ReviewFlag =
  | "customer_name_mentioned"
  | "possible_phi"
  | "unverified_claim"
  | "confidential_info_risk"
  | "banned_claim"
  | "unsourced_statistic"
  | "needs_shamit_routing";

/**
 * Flags content for the four things governance.md says marketing reviews,
 * plus the knowledge brief's claims-control matrix (§5 of the brief,
 * ported to src/lib/knowledge/claims.ts) -- these are Alpha Nodus/Gravity-
 * specific accuracy rules, additive to the generic four.
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

  if (NEVER_IN_WRITING.some((phrase) => lower.includes(phrase.toLowerCase()))) {
    flags.push("banned_claim");
  }

  if (UNUSABLE_STATISTICS.some((stat) => lower.includes(stat.toLowerCase()))) {
    flags.push("unsourced_statistic");
  }

  // Matches claims.ts's ROUTE_TO_SHAMIT rule: security certifications and
  // KLAS scores/ratings are never stated proactively; route to Shamit.
  if (SECURITY_CERT_PATTERN.test(params.text) || KLAS_SCORE_PATTERN.test(params.text)) {
    flags.push("needs_shamit_routing");
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
