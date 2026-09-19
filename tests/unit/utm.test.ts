import { describe, expect, it } from "vitest";
import { buildUtmLink } from "@/domain/utm";

describe("buildUtmLink", () => {
  it("appends utm_source, utm_medium, and utm_campaign", () => {
    const link = buildUtmLink("https://alphanodus.com/demo", { source: "linkedin", campaign: "ROI" });
    const url = new URL(link);
    expect(url.searchParams.get("utm_source")).toBe("linkedin");
    expect(url.searchParams.get("utm_medium")).toBe("social");
    expect(url.searchParams.get("utm_campaign")).toBe("roi");
  });

  it("slugifies a multi-word campaign and content value", () => {
    const link = buildUtmLink("https://alphanodus.com/demo", {
      source: "x",
      campaign: "Three Leak Argument",
      content: "carousel",
    });
    const url = new URL(link);
    expect(url.searchParams.get("utm_campaign")).toBe("three-leak-argument");
    expect(url.searchParams.get("utm_content")).toBe("carousel");
  });

  it("preserves existing query parameters on the base URL", () => {
    const link = buildUtmLink("https://alphanodus.com/demo?ref=email", { source: "facebook", campaign: "Trust" });
    const url = new URL(link);
    expect(url.searchParams.get("ref")).toBe("email");
    expect(url.searchParams.get("utm_source")).toBe("facebook");
  });

  it("throws a clear error for an invalid base URL", () => {
    expect(() => buildUtmLink("not-a-url", { source: "linkedin", campaign: "ROI" })).toThrow(/valid, absolute URL/);
  });

  it("omits utm_content when no content value is given", () => {
    const link = buildUtmLink("https://alphanodus.com/demo", { source: "instagram", campaign: "ROI" });
    expect(new URL(link).searchParams.has("utm_content")).toBe(false);
  });
});
