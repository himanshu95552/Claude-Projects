"use client";

import { useState } from "react";
import type { QueueItem } from "@/lib/db/schema";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

async function patchItem(id: string, body: unknown) {
  const res = await fetch(`/api/queue/items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error ?? "Request failed");
}

export function ItemCard({
  item,
  onUpdate,
  linkedInConnected,
}: {
  item: QueueItem;
  onUpdate: (patch: Partial<QueueItem>) => void;
  linkedInConnected: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.editedContent ?? item.content);
  const [showExplain, setShowExplain] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [skipReason, setSkipReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const canPublishDirectly =
    linkedInConnected && item.fulfillment === "api_publish" && ["publish", "first_hour_comment", "general_comment", "reply"].includes(item.type);

  const displayContent = item.editedContent ?? item.content;
  const isDone = item.status === "done";
  const isSkipped = item.status === "skipped";
  const isResolved = isDone || isSkipped;

  const hasExplain = Object.values(item.explain ?? {}).some(Boolean);
  const isDemo = displayContent.includes("[DEMO");

  async function handleSaveEdit() {
    setBusy(true);
    try {
      await patchItem(item.id, { action: "edit", editedContent: draft });
      onUpdate({ editedContent: draft });
      setEditing(false);
    } finally {
      setBusy(false);
    }
  }

  async function handleMarkDone() {
    setBusy(true);
    try {
      await patchItem(item.id, { action: "done" });
      onUpdate({ status: "done", actedAt: new Date() });
    } finally {
      setBusy(false);
    }
  }

  async function handlePublish() {
    setBusy(true);
    setPublishError(null);
    try {
      const res = await fetch("/api/linkedin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Publish failed");
      onUpdate({ status: "done", actedAt: new Date(), platformPostId: data.platformPostId });
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleSkip() {
    if (!skipReason.trim()) return;
    setBusy(true);
    try {
      await patchItem(item.id, { action: "skip", reason: skipReason });
      onUpdate({ status: "skipped", skipReason });
      setShowSkip(false);
    } finally {
      setBusy(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(displayContent);
  }

  return (
    <Card className={cn(isResolved && "opacity-60")}>
      <CardBody>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {item.metadata.pillar && <Badge tone="accent">{item.metadata.pillar}</Badge>}
            {item.metadata.isFirstHour && <Badge tone="warning">First hour</Badge>}
            {item.fulfillment === "manual_link" && <Badge tone="neutral">Manual</Badge>}
            {item.needsReview === "pending" && <Badge tone="danger">Needs review</Badge>}
            {isDemo && <Badge tone="neutral">Demo content</Badge>}
          </div>
          {isDone && <Badge tone="success">Done</Badge>}
          {isSkipped && <Badge tone="neutral">Skipped: {item.skipReason}</Badge>}
        </div>

        {editing ? (
          <div className="space-y-2">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={Math.min(12, Math.max(4, Math.ceil(draft.length / 60)))}
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveEdit} disabled={busy}>Save</Button>
              <Button size="sm" variant="secondary" onClick={() => { setDraft(displayContent); setEditing(false); }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{displayContent}</p>
        )}

        {hasExplain && (
          <div className="mt-3">
            <button
              onClick={() => setShowExplain((v) => !v)}
              className="text-xs text-accent font-medium hover:underline"
            >
              {showExplain ? "Hide" : "Why this?"}
            </button>
            {showExplain && (
              <div className="mt-2 text-xs text-muted space-y-1 border-l-2 border-accent-muted pl-3">
                {item.explain.whyThisTopic && <p><strong>Topic:</strong> {item.explain.whyThisTopic}</p>}
                {item.explain.whyThisHook && <p><strong>Hook:</strong> {item.explain.whyThisHook}</p>}
                {item.explain.whyThisPerson && <p><strong>Person:</strong> {item.explain.whyThisPerson}</p>}
                {item.explain.whyNow && <p><strong>Now:</strong> {item.explain.whyNow}</p>}
                {item.explain.whatYouAdd && <p><strong>What this adds:</strong> {item.explain.whatYouAdd}</p>}
              </div>
            )}
          </div>
        )}

        {!isResolved && !editing && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={handleCopy} variant="secondary">Copy</Button>
            {item.sourcePostUrl && (
              <a href={item.sourcePostUrl} target="_blank" rel="noreferrer">
                <Button size="sm" variant="secondary" type="button">Open</Button>
              </a>
            )}
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>Edit</Button>
            <div className="flex-1" />
            <Button size="sm" variant="ghost" onClick={() => setShowSkip((v) => !v)}>Skip</Button>
            {canPublishDirectly ? (
              <Button size="sm" onClick={handlePublish} disabled={busy}>
                {busy ? "Posting…" : "Post to LinkedIn"}
              </Button>
            ) : (
              <Button size="sm" onClick={handleMarkDone} disabled={busy}>
                {item.fulfillment === "api_publish" ? "Mark posted" : "Mark done"}
              </Button>
            )}
          </div>
        )}

        {publishError && <p className="mt-2 text-xs text-danger">{publishError}</p>}

        {!isResolved && !editing && item.fulfillment === "api_publish" && !linkedInConnected && (
          <p className="mt-2 text-xs text-muted">
            Connect LinkedIn from the Persona tab to post directly — for now, copy the text and post manually.
          </p>
        )}

        {showSkip && !isResolved && (
          <div className="mt-3 flex gap-2">
            <Textarea
              placeholder="Why are you skipping this? (helps fix the drafting, not a judgment on you)"
              value={skipReason}
              onChange={(e) => setSkipReason(e.target.value)}
              rows={2}
              className="flex-1"
            />
            <Button size="sm" variant="danger" onClick={handleSkip} disabled={busy || !skipReason.trim()}>
              Confirm skip
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
