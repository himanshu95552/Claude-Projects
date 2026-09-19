"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";

type Sliders = {
  formality: number; sentenceLength: number; hedging: number;
  humor: number; directness: number; technicalDepth: number;
};

const SLIDER_LABELS: Array<{ key: keyof Sliders; label: string; lowLabel: string; highLabel: string }> = [
  { key: "formality", label: "Formality", lowLabel: "Casual", highLabel: "Formal" },
  { key: "sentenceLength", label: "Sentence length", lowLabel: "Short", highLabel: "Long" },
  { key: "hedging", label: "Hedging", lowLabel: "Direct claims", highLabel: "Qualified claims" },
  { key: "humor", label: "Humor", lowLabel: "Serious", highLabel: "Playful" },
  { key: "directness", label: "Directness", lowLabel: "Diplomatic", highLabel: "Blunt" },
  { key: "technicalDepth", label: "Technical depth", lowLabel: "Plain language", highLabel: "Jargon OK" },
];

const DEFAULT_SLIDERS: Sliders = {
  formality: 50, sentenceLength: 50, hedging: 30, humor: 30, directness: 60, technicalDepth: 50,
};

type VoiceProfile = {
  sliders: Sliders;
  freetextRules: string[];
  bannedPhrases: string[];
  emojiSetting: "never" | "rare" | "normal";
  version: number;
} | null;

type StoryEntry = { id: string; kind: string; content: string };
type Lane = { name: string; targetsPersona: string; pillars: string[]; doRules: string[]; dontRules: string[] } | null;

const TABS = ["voice", "story-bank", "lane"] as const;

export function PersonaClient({
  voiceProfile,
  storyBank: initialStoryBank,
  lane,
}: {
  voiceProfile: VoiceProfile;
  storyBank: StoryEntry[];
  lane: Lane;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("voice");
  const [sliders, setSliders] = useState<Sliders>(voiceProfile?.sliders ?? DEFAULT_SLIDERS);
  const [rulesText, setRulesText] = useState((voiceProfile?.freetextRules ?? []).join("\n"));
  const [bannedText, setBannedText] = useState((voiceProfile?.bannedPhrases ?? []).join(", "));
  const [savedVersion, setSavedVersion] = useState(voiceProfile?.version ?? 0);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [testSample, setTestSample] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const [storyBank, setStoryBank] = useState(initialStoryBank);
  const [newStory, setNewStory] = useState({ kind: "anecdote", content: "" });

  async function handleSave() {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/persona/voice", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sliders,
          freetextRules: rulesText.split("\n").map((s) => s.trim()).filter(Boolean),
          bannedPhrases: bannedText.split(",").map((s) => s.trim()).filter(Boolean),
          emojiSetting: voiceProfile?.emojiSetting ?? "never",
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error ?? "Save failed");
      setSavedVersion((v) => v + 1);
      setSaveMessage("Saved as a new version.");
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    setTesting(true);
    setTestSample(null);
    try {
      const res = await fetch("/api/persona/test-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sliders,
          freetextRules: rulesText.split("\n").map((s) => s.trim()).filter(Boolean),
          bannedPhrases: bannedText.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      setTestSample(data.output?.text ?? "Something went wrong generating the sample.");
    } finally {
      setTesting(false);
    }
  }

  async function handleAddStory() {
    if (!newStory.content.trim()) return;
    const res = await fetch("/api/persona/story-bank", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStory),
    });
    const data = await res.json();
    if (data.entry) {
      setStoryBank((prev) => [...prev, data.entry]);
      setNewStory({ kind: "anecdote", content: "" });
    }
  }

  async function handleDeleteStory(id: string) {
    await fetch(`/api/persona/story-bank?id=${id}`, { method: "DELETE" });
    setStoryBank((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">Persona</h1>

      <div className="flex gap-1 mb-4 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t ? "border-accent text-accent" : "border-transparent text-muted"}`}
          >
            {t === "voice" ? "Voice" : t === "story-bank" ? "Story bank" : "Lane"}
          </button>
        ))}
      </div>

      {tab === "voice" && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <span className="text-sm font-medium">Voice controls {savedVersion > 0 && <Badge tone="neutral" className="ml-2">v{savedVersion}</Badge>}</span>
            </CardHeader>
            <CardBody className="space-y-4">
              {SLIDER_LABELS.map(({ key, label, lowLabel, highLabel }) => (
                <div key={key}>
                  <div className="flex justify-between text-xs text-muted mb-1"><span>{label}</span><span>{sliders[key]}</span></div>
                  <input
                    type="range" min={0} max={100} value={sliders[key]}
                    onChange={(e) => setSliders((s) => ({ ...s, [key]: Number(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[11px] text-muted"><span>{lowLabel}</span><span>{highLabel}</span></div>
                </div>
              ))}
              <label className="block text-sm font-medium">
                Rules in your own words (one per line)
                <Textarea className="mt-1" rows={3} value={rulesText} onChange={(e) => setRulesText(e.target.value)} />
              </label>
              <label className="block text-sm font-medium">
                Banned phrases (comma-separated)
                <Input className="mt-1" value={bannedText} onChange={(e) => setBannedText(e.target.value)} />
              </label>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><span className="text-sm font-medium">Test bench</span></CardHeader>
            <CardBody className="space-y-3">
              <p className="text-xs text-muted">Generate a sample with these settings before saving. Nobody commits a voice change blind.</p>
              <Button size="sm" onClick={handleTest} disabled={testing}>{testing ? "Generating…" : "Generate sample"}</Button>
              {testSample && (
                <div className="text-sm whitespace-pre-wrap border border-border rounded-lg p-3 bg-background">
                  {testSample}
                </div>
              )}
            </CardBody>
          </Card>

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save as new version"}</Button>
            {saveMessage && <span className="text-sm text-muted">{saveMessage}</span>}
          </div>
        </div>
      )}

      {tab === "story-bank" && (
        <div className="space-y-4">
          <p className="text-sm text-muted">Your real numbers, scars, positions, turning points — the reservoir every draft pulls from.</p>
          <div className="space-y-2">
            {storyBank.map((entry) => (
              <Card key={entry.id}>
                <CardBody className="flex items-start justify-between gap-3">
                  <div>
                    <Badge tone="accent" className="mb-1">{entry.kind}</Badge>
                    <p className="text-sm">{entry.content}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteStory(entry.id)}>Remove</Button>
                </CardBody>
              </Card>
            ))}
            {storyBank.length === 0 && <p className="text-sm text-muted">No entries yet.</p>}
          </div>
          <Card>
            <CardBody className="space-y-2">
              <select
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                value={newStory.kind}
                onChange={(e) => setNewStory((s) => ({ ...s, kind: e.target.value }))}
              >
                <option value="number">Number</option>
                <option value="turning_point">Turning point</option>
                <option value="position">Position</option>
                <option value="anecdote">Anecdote</option>
              </select>
              <Textarea
                rows={2}
                placeholder="e.g. 'Roughly a dozen handoffs happen between order and payment.'"
                value={newStory.content}
                onChange={(e) => setNewStory((s) => ({ ...s, content: e.target.value }))}
              />
              <Button size="sm" onClick={handleAddStory}>Add entry</Button>
            </CardBody>
          </Card>
        </div>
      )}

      {tab === "lane" && lane && (
        <Card>
          <CardBody className="space-y-3">
            <h2 className="font-semibold">{lane.name}</h2>
            <p className="text-sm text-muted">Targets: {lane.targetsPersona}</p>
            <div>
              <h3 className="text-sm font-medium mb-1">Pillars</h3>
              <ul className="text-sm text-muted list-disc list-inside">
                {lane.pillars.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
            {lane.doRules.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-1">Do</h3>
                <ul className="text-sm text-muted list-disc list-inside">{lane.doRules.map((r) => <li key={r}>{r}</li>)}</ul>
              </div>
            )}
            {lane.dontRules.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-1">Don&apos;t</h3>
                <ul className="text-sm text-muted list-disc list-inside">{lane.dontRules.map((r) => <li key={r}>{r}</li>)}</ul>
              </div>
            )}
          </CardBody>
        </Card>
      )}
      {tab === "lane" && !lane && <p className="text-sm text-muted">No lane assigned yet.</p>}
    </div>
  );
}
