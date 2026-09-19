/**
 * UTM link building — the realistic version of "click tracking" for this
 * app. Real click-through attribution needs a redirect/analytics service
 * this build doesn't have (see docs/ARCHITECTURE.md's known-gaps table);
 * what's tractable and genuinely useful without one is generating a
 * correctly-tagged link so whatever analytics platform the destination
 * site already runs (GA4, etc.) can attribute the traffic back to the
 * specific post/pillar/format that drove it.
 */
export type UtmParams = {
  source: string; // platform: "linkedin" | "x" | "instagram" | "facebook"
  medium?: string; // defaults to "social"
  campaign: string; // the content pillar — what this post was about
  content?: string; // creative format/variant, e.g. "carousel", "static"
};

export function buildUtmLink(baseUrl: string, params: UtmParams): string {
  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    throw new Error("Base URL must be a valid, absolute URL (include https://)");
  }
  url.searchParams.set("utm_source", params.source);
  url.searchParams.set("utm_medium", params.medium ?? "social");
  url.searchParams.set("utm_campaign", slugify(params.campaign));
  if (params.content) url.searchParams.set("utm_content", slugify(params.content));
  return url.toString();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
