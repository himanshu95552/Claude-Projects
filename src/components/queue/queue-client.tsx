"use client";

import { useMemo, useState } from "react";
import type { Queue, QueueItem } from "@/lib/db/schema";
import { groupBySection, queueProgress, SECTION_LABELS, type QueueSection } from "@/domain/queue-order";
import { ItemCard } from "./item-card";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QueueClient({
  participantName,
  streakDays,
  queue,
  initialItems,
  linkedInConnected,
  xConnected,
  canGenerate,
}: {
  participantName: string;
  streakDays: number;
  queue: Queue | null;
  initialItems: QueueItem[];
  linkedInConnected: boolean;
  xConnected: boolean;
  canGenerate: boolean;
}) {
  const [items, setItems] = useState(initialItems);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

  const progress = useMemo(() => queueProgress(items), [items]);
  const groups = useMemo(() => groupBySection(items), [items]);

  function updateItem(id: string, patch: Partial<QueueItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  async function handleGenerate() {
    setGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch("/api/queue", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      window.location.reload();
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Generation failed");
      setGenerating(false);
    }
  }

  if (!queue || items.length === 0) {
    return (
      <div>
        <h1 className="text-lg font-semibold mb-1">Hi {participantName.split(" ")[0]}</h1>
        <Card className="mt-4">
          <CardBody className="text-center py-10">
            <p className="text-muted mb-4">
              No queue for today yet. Queues are generated overnight — check back tomorrow morning,
              {canGenerate ? " or generate today's now:" : " or ask your operator to run a manual generation."}
            </p>
            {canGenerate && (
              <>
                <Button onClick={handleGenerate} disabled={generating}>
                  {generating ? "Generating…" : "Generate today's queue"}
                </Button>
                {generateError && <p className="mt-2 text-xs text-danger">{generateError}</p>}
              </>
            )}
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <h1 className="text-lg font-semibold">Hi {participantName.split(" ")[0]}</h1>
        <div className="text-sm text-muted flex items-center gap-3">
          {streakDays > 0 && <span>🔥 {streakDays} day streak</span>}
          <span>~{queue.estimatedMinutes} min</span>
          {canGenerate && (
            <button
              onClick={() => setShowRegenerateConfirm((v) => !v)}
              className="text-accent font-medium hover:underline"
            >
              Regenerate today&apos;s queue
            </button>
          )}
        </div>
      </div>

      {showRegenerateConfirm && (
        <Card className="mb-4 border-danger">
          <CardBody className="flex items-center justify-between gap-3 py-3">
            <p className="text-sm text-muted">
              This replaces every item in today&apos;s queue — including anything already done, skipped, or
              edited. Can&apos;t be undone.
            </p>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="secondary" onClick={() => setShowRegenerateConfirm(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="danger" onClick={handleGenerate} disabled={generating}>
                {generating ? "Regenerating…" : "Yes, regenerate"}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
      {generateError && <p className="mb-4 text-xs text-danger">{generateError}</p>}

      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted mb-1">
          <span>{progress.completed} of {progress.total} done</span>
          <span>{progress.pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-border overflow-hidden">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
      </div>

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.section}>
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
              {SECTION_LABELS[group.section as QueueSection]}
            </h2>
            <div className="space-y-4">
              {group.items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onUpdate={(patch) => updateItem(item.id, patch)}
                  linkedInConnected={linkedInConnected}
                  xConnected={xConnected}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
