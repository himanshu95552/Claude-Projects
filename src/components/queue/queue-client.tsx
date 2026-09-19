"use client";

import { useMemo, useState } from "react";
import type { Queue, QueueItem } from "@/lib/db/schema";
import { groupBySection, queueProgress, SECTION_LABELS, type QueueSection } from "@/domain/queue-order";
import { ItemCard } from "./item-card";
import { Card, CardBody } from "@/components/ui/card";

export function QueueClient({
  participantName,
  streakDays,
  queue,
  initialItems,
}: {
  participantName: string;
  streakDays: number;
  queue: Queue | null;
  initialItems: QueueItem[];
}) {
  const [items, setItems] = useState(initialItems);

  const progress = useMemo(() => queueProgress(items), [items]);
  const groups = useMemo(() => groupBySection(items), [items]);

  function updateItem(id: string, patch: Partial<QueueItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  if (!queue || items.length === 0) {
    return (
      <div>
        <h1 className="text-lg font-semibold mb-1">Hi {participantName.split(" ")[0]}</h1>
        <Card className="mt-4">
          <CardBody className="text-center py-10">
            <p className="text-muted">
              No queue for today yet. Queues are generated overnight — check back tomorrow morning,
              or ask your operator to run a manual generation.
            </p>
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
        </div>
      </div>

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
                <ItemCard key={item.id} item={item} onUpdate={(patch) => updateItem(item.id, patch)} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
