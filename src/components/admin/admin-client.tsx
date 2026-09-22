"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";
import type { ResolvedSettings } from "@/lib/config/schema";

type ParticipantRow = {
  id: string; email: string; fullName: string; status: string; appRoles: string[]; streakDays: number;
  linkedIn: { status: string; handle: string | null } | null;
};

const LINKEDIN_STATUS_TONE: Record<string, "success" | "warning" | "danger"> = {
  connected: "success",
  expiring_soon: "warning",
  expired: "danger",
  revoked: "danger",
};
type ReviewItem = {
  id: string; participantName: string; type: string; content: string; reviewFlags: string[]; reviewSlaDueAt: string | null;
};
type ConfigHistoryRow = { version: number; changeNote: string | null; changedAt: string };

const TABS = ["overview", "review", "participants", "config"] as const;

export function AdminClient({
  participants: initialParticipants,
  reviewItems: initialReviewItems,
  kpis,
  globalSettings,
  configHistory,
}: {
  participants: ParticipantRow[];
  reviewItems: ReviewItem[];
  kpis: { activeCount: number; totalCount: number; spendUsd: number; spendCapUsd: number };
  globalSettings: ResolvedSettings;
  configHistory: ConfigHistoryRow[];
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("overview");
  const [reviewItems, setReviewItems] = useState(initialReviewItems);
  const [newParticipant, setNewParticipant] = useState({ email: "", fullName: "", jobTitle: "" });
  const [addStatus, setAddStatus] = useState<string | null>(null);
  const [configPatch, setConfigPatch] = useState(
    JSON.stringify({ cadence: { commentsPerDay: globalSettings.cadence.commentsPerDay } }, null, 2),
  );
  const [configStatus, setConfigStatus] = useState<string | null>(null);

  async function handleReviewDecision(itemId: string, decision: "approved" | "rejected") {
    await fetch(`/api/admin/review/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    });
    setReviewItems((prev) => prev.filter((i) => i.id !== itemId));
  }

  async function handleAddParticipant() {
    setAddStatus(null);
    const res = await fetch("/api/admin/participants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newParticipant, jobTitle: newParticipant.jobTitle || "Team member" }),
    });
    const data = await res.json();
    if (!res.ok) {
      setAddStatus(data.error ?? "Failed to add participant");
      return;
    }
    setAddStatus(`Added ${newParticipant.fullName}. They'll onboard on first sign-in.`);
    setNewParticipant({ email: "", fullName: "", jobTitle: "" });
  }

  async function handleSaveConfig() {
    setConfigStatus(null);
    try {
      const settings = JSON.parse(configPatch);
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope: "global", scopeRef: null, settings, changeNote: "Edited from admin config editor" }),
      });
      const data = await res.json();
      setConfigStatus(res.ok ? "Saved as a new version." : data.error);
    } catch {
      setConfigStatus("Invalid JSON.");
    }
  }

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">Admin</h1>
      <div className="flex gap-1 mb-4 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px capitalize ${tab === t ? "border-accent text-accent" : "border-transparent text-muted"}`}
          >
            {t === "review" && reviewItems.length > 0 ? `Review (${reviewItems.length})` : t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-3 gap-3">
          <Card><CardBody><div className="text-2xl font-semibold">{kpis.activeCount}/{kpis.totalCount}</div><div className="text-xs text-muted">Active participants</div></CardBody></Card>
          <Card><CardBody><div className="text-2xl font-semibold">{reviewItems.length}</div><div className="text-xs text-muted">Pending review</div></CardBody></Card>
          <Card>
            <CardBody>
              <div className="text-2xl font-semibold">${kpis.spendUsd.toFixed(2)}</div>
              <div className="text-xs text-muted">Spend (30d) of ${kpis.spendCapUsd} cap</div>
            </CardBody>
          </Card>
        </div>
      )}

      {tab === "review" && (
        <div className="space-y-3">
          {reviewItems.length === 0 && <p className="text-sm text-muted">Nothing waiting on review.</p>}
          {reviewItems.map((item) => (
            <Card key={item.id}>
              <CardBody>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge tone="accent">{item.participantName}</Badge>
                  <Badge tone="neutral">{item.type}</Badge>
                  {item.reviewFlags.map((f) => <Badge key={f} tone="danger">{f}</Badge>)}
                  {item.reviewSlaDueAt && (
                    <span className="text-xs text-muted ml-auto">Due {new Date(item.reviewSlaDueAt).toLocaleString()}</span>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap mb-3">{item.content}</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleReviewDecision(item.id, "approved")}>Approve</Button>
                  <Button size="sm" variant="danger" onClick={() => handleReviewDecision(item.id, "rejected")}>Reject</Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {tab === "participants" && (
        <div className="space-y-4">
          <div className="space-y-2">
            {initialParticipants.map((p) => (
              <Card key={p.id}>
                <CardBody className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{p.fullName}</div>
                    <div className="text-xs text-muted">{p.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.streakDays > 0 && <span className="text-xs text-muted">🔥 {p.streakDays}</span>}
                    <Badge tone={p.status === "active" ? "success" : "neutral"}>{p.status}</Badge>
                    {p.appRoles.includes("admin") && <Badge tone="accent">admin</Badge>}
                    {p.linkedIn ? (
                      <Badge tone={LINKEDIN_STATUS_TONE[p.linkedIn.status] ?? "neutral"}>
                        LinkedIn: {p.linkedIn.status.replace("_", " ")}
                        {p.linkedIn.handle ? ` (${p.linkedIn.handle})` : ""}
                      </Badge>
                    ) : (
                      <Badge tone="neutral">LinkedIn: not connected</Badge>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader><span className="text-sm font-medium">Add a participant</span></CardHeader>
            <CardBody className="space-y-2">
              <Input placeholder="Email" value={newParticipant.email} onChange={(e) => setNewParticipant((p) => ({ ...p, email: e.target.value }))} />
              <Input placeholder="Full name" value={newParticipant.fullName} onChange={(e) => setNewParticipant((p) => ({ ...p, fullName: e.target.value }))} />
              <Input placeholder="Job title" value={newParticipant.jobTitle} onChange={(e) => setNewParticipant((p) => ({ ...p, jobTitle: e.target.value }))} />
              <Button size="sm" onClick={handleAddParticipant} disabled={!newParticipant.email || !newParticipant.fullName}>
                Add
              </Button>
              {addStatus && <p className="text-sm text-muted">{addStatus}</p>}
            </CardBody>
          </Card>
        </div>
      )}

      {tab === "config" && (
        <div className="space-y-4">
          <Card>
            <CardHeader><span className="text-sm font-medium">Current global settings</span></CardHeader>
            <CardBody>
              <pre className="text-xs bg-background rounded-lg p-3 overflow-x-auto">{JSON.stringify(globalSettings, null, 2)}</pre>
            </CardBody>
          </Card>
          <Card>
            <CardHeader><span className="text-sm font-medium">Edit global settings (JSON patch, merged on top of current)</span></CardHeader>
            <CardBody className="space-y-2">
              <Textarea rows={8} value={configPatch} onChange={(e) => setConfigPatch(e.target.value)} className="font-mono text-xs" />
              <Button size="sm" onClick={handleSaveConfig}>Save as new version</Button>
              {configStatus && <p className="text-sm text-muted">{configStatus}</p>}
            </CardBody>
          </Card>
          <Card>
            <CardHeader><span className="text-sm font-medium">Change log</span></CardHeader>
            <CardBody className="space-y-2">
              {configHistory.map((c) => (
                <div key={c.version} className="text-sm flex justify-between">
                  <span>v{c.version} — {c.changeNote ?? "no note"}</span>
                  <span className="text-muted text-xs">{new Date(c.changedAt).toLocaleString()}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
