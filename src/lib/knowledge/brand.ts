/**
 * AN27 brand system — knowledge brief §6. Full detail lives in Alpha
 * Nodus's own `alpha-nodus:brand-guidelines` skill; this is the
 * essentials summary needed to generate on-brand creative briefs and to
 * validate that a generated banner/graphic follows the system.
 *
 * Deliberately scoped to Alpha Nodus's own marketing surfaces per
 * START-HERE.md's original distinction ("not the Gravity product UI,
 * which has its own system") -- this module drives banner/creative
 * generation for the advocacy program's content, never the app's own UI.
 */

export const AN27_COLORS = {
  surface: "#FFFFFF",
  canvas: "#F5F7FA",
  headingText: "#0F172A", // weight 600
  bodyText: "#334155",
  proofBandNavy: "#0C0B1F", // appears exactly once per page, as a single "proof band"
  wordmarkAlpha: "#0F172A", // "Alpha" in the wordmark (white on a dark surface)
  wordmarkNodus: "#E8521F", // "Nodus" in the wordmark
  arc: {
    orange: "#FF6B34",
    magenta: "#F900C8",
    blue: "#0E59FF",
  },
  retiredDoNotUse: ["#FE4BD1 -> #222AFB gradient (old dark-mode-first palette)"],
} as const;

/**
 * The arc is the brand signature -- one OKLCH sweep orange -> magenta ->
 * blue. Which token to use depends on what the surface does. Always
 * copy actual values from the brand-guidelines skill's arc-tokens.css
 * `:root` block in production -- these names are the contract, not a
 * source of truth for raw hex.
 */
export const ARC_VARIANTS = {
  noTextOverIt: "--an-arc",
  textInLeftHalf: "--an-arc-hero",
  centeredText: "--an-arc-hero-deep",
  button: "--an-arc-action",
} as const;

export const COMPOSITION_RULES = {
  neutralTintVividRatio: "Roughly 80% neutral / 15% tint / 5% vivid arc per page, with about six arc 'moments,' each a different geometry.",
  hardRules: [
    "Never blur or fade the arc.",
    "Never re-derive its colors in sRGB.",
    "Never put orange text/icons in a white-text button.",
    "Never put a gradient button on a gradient panel.",
  ],
  logo: "Placed, never redrawn -- use the provided PNG assets. Wordmark goes all-white whenever it sits on an arc surface.",
  lightModeFirst: "White surfaces on a light-grey canvas. Depth comes from borders and 4% tints, never stacked dark cards.",
} as const;

export const VOICE_RULES = [
  "Sentence case everywhere -- headlines, buttons, subject lines.",
  '"We" and "you," never "organizations" and "providers."',
  "Every claim carries a number, and every number that isn't ours carries its source.",
  "No emoji. Never \"revolutionary.\" Never \"replaces your RIS.\"",
  "Spell out any acronym a practice administrator would have to look up (AOS, etc.) on first use.",
  "Short sentences. A message earns a reply/read by being easy to finish.",
] as const;

export type FontRole = "wordmark" | "heading" | "body";
export const TYPOGRAPHY: Record<FontRole, string> = {
  wordmark: "Inter 300",
  heading: "Inter 600",
  body: "Inter 400",
};
