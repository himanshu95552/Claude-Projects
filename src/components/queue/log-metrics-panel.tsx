"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Platform } from "@/lib/creative/types";

const FIELDS: Array<{ key: "impressions" | "reactions" | "comments" | "shares" | "saves" | "clicks"; label: string }> = [
  { key: "impressions", label: "Impressions" },
  { key: "reactions", label: "Reactions" },
  { key: "comments", label: "Comments" },
  { key: "shares", label: "Shares" },
  { key: "saves", label: "Saves" },
  { key: "clicks", label: "Clicks" },
];

export function LogMetricsPanel({ queueItemId, platform }: { queueItemId: string; platform: Platform }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setBusy(true);
    setError(null);
    try {
      const body: Record<string, unknown> = { queueItemId, platform };
      for (const f of FIELDS) {
        const raw = values[f.key];
        if (raw !== undefined && raw !== "") body[f.key] = Number(raw);
      }
      const res = await fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error ?? "Failed to log metrics");
      setDone(true);
      setValues({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log metrics");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 border-t border-border pt-3">
      <button onClick={() => setOpen((v) => !v)} className="text-xs text-accent font-medium hover:underline">
        {open ? "Hide metrics" : done ? "Log more metrics" : "Log metrics"}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          <p className="text-xs text-muted">
            Copy these from {platform === "x" ? "X" : platform === "linkedin" ? "LinkedIn" : platform}&apos;s own
            analytics view — the dashboard turns raw counts into save/share rate and a weighted score, which is
            what actually predicts whether a post is working.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {FIELDS.map((f) => (
              <label key={f.key} className="text-xs">
                <span className="block text-muted mb-1">{f.label}</span>
                <input
                  type="number"
                  min={0}
                  value={values[f.key] ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  className="w-full rounded border border-border bg-surface px-2 py-1 text-sm"
                />
              </label>
            ))}
          </div>
          <Button size="sm" onClick={handleSubmit} disabled={busy}>
            {busy ? "Saving…" : "Save metrics"}
          </Button>
          {done && <p className="text-xs text-success">Saved — see the Analytics tab for updated insights.</p>}
          {error && <p className="text-xs text-danger">{error}</p>}
        </div>
      )}
    </div>
  );
}
