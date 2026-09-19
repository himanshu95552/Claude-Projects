"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { QueueItemRevision } from "@/lib/db/schema";

/**
 * Splits content into clickable segments for marking: paragraphs when the
 * draft has them (a multi-paragraph LinkedIn post), otherwise sentences —
 * a one-paragraph X post or comment still needs finer-grained marking than
 * "the whole thing."
 */
function splitIntoMarkableSegments(content: string): string[] {
  const paragraphs = content.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length > 1) return paragraphs;
  const sentences = content.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean);
  return sentences && sentences.length > 1 ? sentences : [content];
}

async function fetchRevisions(itemId: string): Promise<{ revisions: QueueItemRevision[] }> {
  const res = await fetch(`/api/queue/items/${itemId}`);
  if (!res.ok) throw new Error("Failed to load revision history");
  return res.json();
}

async function regenerate(itemId: string, markedExcerpts: string[], reason: string) {
  const res = await fetch(`/api/queue/items/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "regenerate", markedExcerpts, reason }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Regeneration failed");
  return data as { text: string; isDemoContent: boolean; governanceFlags: string[]; needsReview: boolean };
}

export function RegeneratePanel({
  itemId,
  content,
  onRegenerated,
}: {
  itemId: string;
  content: string;
  onRegenerated: (text: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revisions, setRevisions] = useState<QueueItemRevision[] | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const segments = splitIntoMarkableSegments(content);

  function toggleMark(i: number) {
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  async function handleRegenerate() {
    setBusy(true);
    setError(null);
    try {
      const markedExcerpts = [...marked].map((i) => segments[i]);
      const result = await regenerate(itemId, markedExcerpts, reason);
      onRegenerated(result.text);
      setMarked(new Set());
      setReason("");
      setRevisions(null); // stale — reload next time History is opened
    } catch (err) {
      setError(err instanceof Error ? err.message : "Regeneration failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleHistory() {
    const willOpen = !showHistory;
    setShowHistory(willOpen);
    if (willOpen && !revisions) {
      try {
        const { revisions } = await fetchRevisions(itemId);
        setRevisions(revisions);
      } catch {
        setError("Couldn't load revision history.");
      }
    }
  }

  return (
    <div className="mt-3 border-t border-border pt-3">
      <button onClick={() => setOpen((v) => !v)} className="text-xs text-accent font-medium hover:underline">
        {open ? "Hide regenerate" : "Mark & regenerate"}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          <p className="text-xs text-muted">Click any line that isn&apos;t working, then regenerate. Unmarked lines are left as-is if the rewrite doesn&apos;t need to touch them.</p>

          <div className="space-y-1.5">
            {segments.map((seg, i) => (
              <button
                key={i}
                onClick={() => toggleMark(i)}
                className={cn(
                  "block w-full text-left text-sm rounded border px-2.5 py-1.5 transition-colors",
                  marked.has(i)
                    ? "border-danger bg-danger/10 text-danger"
                    : "border-border hover:border-accent-muted",
                )}
              >
                {seg}
              </button>
            ))}
          </div>

          <Textarea
            placeholder="What's wrong, or what should change? (optional, but helps a lot)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
          />

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleRegenerate} disabled={busy}>
              {busy ? "Regenerating…" : "Regenerate"}
            </Button>
            <button onClick={handleToggleHistory} className="text-xs text-accent font-medium hover:underline">
              {showHistory ? "Hide history" : "History"}
            </button>
          </div>
          {error && <p className="text-xs text-danger">{error}</p>}

          {showHistory && revisions && (
            <div className="space-y-2">
              {revisions.length === 0 && <p className="text-xs text-muted">No prior revisions yet.</p>}
              {revisions.map((rev) => (
                <div key={rev.id} className="rounded border border-border bg-canvas p-2 text-xs">
                  <div className="flex items-center justify-between text-muted mb-1">
                    <span className="font-medium capitalize">{rev.source}</span>
                    <span>{new Date(rev.createdAt).toLocaleString()}</span>
                  </div>
                  {rev.reason && <p className="text-muted italic mb-1">&quot;{rev.reason}&quot;</p>}
                  <p className="whitespace-pre-wrap">{rev.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
