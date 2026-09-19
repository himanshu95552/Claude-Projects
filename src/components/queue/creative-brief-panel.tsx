"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CreativeBrief } from "@/lib/db/schema";

type Format = "static" | "carousel" | "trending";

const FORMAT_LABELS: Record<Format, string> = {
  static: "Static",
  carousel: "Carousel",
  trending: "Trending",
};

async function fetchBriefs(queueItemId: string): Promise<{ briefs: CreativeBrief[] }> {
  const res = await fetch(`/api/creative?queueItemId=${queueItemId}`);
  if (!res.ok) throw new Error("Failed to load banners");
  return res.json();
}

async function generateBrief(queueItemId: string, format: Format) {
  const res = await fetch("/api/creative", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ queueItemId, format }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Generation failed");
  return data as { brief: CreativeBrief; isDemoContent: boolean; governanceFlags: string[] };
}

export function CreativeBriefPanel({ queueItemId }: { queueItemId: string }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [format, setFormat] = useState<Format>("static");
  const [briefs, setBriefs] = useState<CreativeBrief[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCompliance, setShowCompliance] = useState(false);

  async function handleToggle() {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen && !loaded) {
      try {
        const { briefs } = await fetchBriefs(queueItemId);
        setBriefs(briefs);
        setLoaded(true);
      } catch {
        setError("Couldn't load previous banners.");
      }
    }
  }

  async function handleGenerate() {
    setBusy(true);
    setError(null);
    try {
      const { brief } = await generateBrief(queueItemId, format);
      setBriefs((prev) => [brief, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setBusy(false);
    }
  }

  const latest = briefs.find((b) => b.format === format);

  return (
    <div className="mt-3 border-t border-border pt-3">
      <button onClick={handleToggle} className="text-xs text-accent font-medium hover:underline">
        {open ? "Hide banner" : "Generate banner"}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          <div className="flex gap-2">
            {(Object.keys(FORMAT_LABELS) as Format[]).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`text-xs px-2.5 py-1 rounded-full border ${
                  format === f ? "bg-accent text-white border-accent" : "border-border text-muted"
                }`}
              >
                {FORMAT_LABELS[f]}
              </button>
            ))}
          </div>

          <Button size="sm" onClick={handleGenerate} disabled={busy}>
            {busy ? "Generating…" : latest ? "Regenerate" : "Generate"}
          </Button>
          {error && <p className="text-xs text-danger">{error}</p>}

          {latest && (
            <div className="rounded-lg border border-border bg-canvas p-3 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge tone="neutral">
                  {latest.widthPx}×{latest.heightPx}px ({latest.aspectRatio})
                </Badge>
                <Badge tone="neutral">{FORMAT_LABELS[latest.format as Format]}</Badge>
                {latest.slides.length > 1 && <Badge tone="neutral">{latest.slides.length} slides</Badge>}
              </div>

              <div className="space-y-2">
                {latest.slides.map((slide, i) => (
                  <div key={i} className="rounded border border-border bg-surface p-2.5">
                    {latest.slides.length > 1 && (
                      <div className="text-[10px] text-muted font-medium mb-1">Slide {i + 1}</div>
                    )}
                    <p className="text-sm font-semibold">{slide.heading}</p>
                    {slide.subheading && <p className="text-xs text-muted mt-0.5">{slide.subheading}</p>}
                    {slide.bodyText && <p className="text-xs mt-1">{slide.bodyText}</p>}
                  </div>
                ))}
              </div>

              {latest.cta && (
                <p className="text-xs">
                  <strong>CTA:</strong> {latest.cta}
                </p>
              )}

              {latest.brandComplianceNotes.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowCompliance((v) => !v)}
                    className="text-xs text-accent font-medium hover:underline"
                  >
                    {showCompliance ? "Hide" : "Brand compliance"}
                  </button>
                  {showCompliance && (
                    <ul className="mt-1.5 text-xs text-muted space-y-1 list-disc pl-4">
                      {latest.brandComplianceNotes.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {loaded && briefs.length === 0 && !latest && (
            <p className="text-xs text-muted">No banner generated yet for this format.</p>
          )}
        </div>
      )}
    </div>
  );
}
