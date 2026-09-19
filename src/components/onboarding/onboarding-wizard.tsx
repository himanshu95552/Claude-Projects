"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { CONSENT_TEXT } from "./consent-text";

type Lane = { id: string; name: string; targetsPersona: string; pillars: string[] };

const STEPS = ["identity", "consent", "lane", "voice", "cadence", "schedule", "tour"] as const;
type Step = (typeof STEPS)[number];

const SLIDER_LABELS: Array<{ key: keyof Sliders; label: string; lowLabel: string; highLabel: string }> = [
  { key: "formality", label: "Formality", lowLabel: "Casual", highLabel: "Formal" },
  { key: "sentenceLength", label: "Sentence length", lowLabel: "Short", highLabel: "Long" },
  { key: "hedging", label: "Hedging", lowLabel: "Direct claims", highLabel: "Qualified claims" },
  { key: "humor", label: "Humor", lowLabel: "Serious", highLabel: "Playful" },
  { key: "directness", label: "Directness", lowLabel: "Diplomatic", highLabel: "Blunt" },
  { key: "technicalDepth", label: "Technical depth", lowLabel: "Plain language", highLabel: "Jargon OK" },
];

type Sliders = {
  formality: number; sentenceLength: number; hedging: number;
  humor: number; directness: number; technicalDepth: number;
};

export function OnboardingWizard({
  participant,
  lanes,
}: {
  participant: { fullName: string; jobTitle: string };
  lanes: Lane[];
}) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [fullName, setFullName] = useState(participant.fullName);
  const [jobTitle, setJobTitle] = useState(participant.jobTitle);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [laneId, setLaneId] = useState(lanes[0]?.id ?? "");
  const [writingSamples, setWritingSamples] = useState("");
  const [sliders, setSliders] = useState<Sliders>({
    formality: 50, sentenceLength: 50, hedging: 30, humor: 30, directness: 60, technicalDepth: 50,
  });
  const [voiceRules, setVoiceRules] = useState("");
  const [postsPerWeek, setPostsPerWeek] = useState(2);
  const [commentsPerDay, setCommentsPerDay] = useState(5);
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC");
  const [reminderTime, setReminderTime] = useState("09:00");
  const [windowStart, setWindowStart] = useState("09:00");
  const [windowEnd, setWindowEnd] = useState("18:00");

  function next() {
    setError(null);
    if (step === "consent" && !consentAgreed) {
      setError("Consent is required before you can continue — it's not skippable.");
      return;
    }
    if (step === "lane" && !laneId) {
      setError("Pick a lane to continue.");
      return;
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }
  function back() {
    setError(null);
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function finish() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          jobTitle,
          consentAgreed: true,
          laneId,
          writingSamples: writingSamples.trim() ? writingSamples.split("\n\n").filter(Boolean) : [],
          voiceRules: voiceRules.trim() ? voiceRules.split("\n").filter(Boolean) : [],
          bannedPhrases: [],
          sliders,
          storyBank: [],
          postsPerWeek,
          commentsPerDay,
          timezone,
          reminderTime,
          availableWindowStart: windowStart,
          availableWindowEnd: windowEnd,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong");
      }
      router.push("/queue");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted mb-1">
          <span>Step {stepIndex + 1} of {STEPS.length}</span>
        </div>
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <div className="h-full bg-accent transition-all" style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      <Card>
        <CardBody className="space-y-4">
          {step === "identity" && (
            <div className="space-y-3">
              <h1 className="text-lg font-semibold">Who you are</h1>
              <p className="text-sm text-muted">Confirm this is your real identity — the program only works if it's really you.</p>
              <label className="block text-sm font-medium">Full name<Input className="mt-1" value={fullName} onChange={(e) => setFullName(e.target.value)} /></label>
              <label className="block text-sm font-medium">Role at Alpha Nodus<Input className="mt-1" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} /></label>
            </div>
          )}

          {step === "consent" && (
            <div className="space-y-3">
              <h1 className="text-lg font-semibold">Before we start</h1>
              <div className="max-h-72 overflow-y-auto text-sm text-muted border border-border rounded-lg p-4 whitespace-pre-wrap">
                {CONSENT_TEXT}
              </div>
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" checked={consentAgreed} onChange={(e) => setConsentAgreed(e.target.checked)} />
                <span>I've read this and agree to participate on these terms. I understand I can edit or reject any draft, and leave at any time.</span>
              </label>
            </div>
          )}

          {step === "lane" && (
            <div className="space-y-3">
              <h1 className="text-lg font-semibold">Your lane</h1>
              <p className="text-sm text-muted">What you'll own and why nobody else covers it. One lane per person.</p>
              <div className="space-y-2">
                {lanes.map((lane) => (
                  <label key={lane.id} className={`block border rounded-lg p-3 cursor-pointer ${laneId === lane.id ? "border-accent bg-accent-muted" : "border-border"}`}>
                    <input type="radio" name="lane" className="sr-only" checked={laneId === lane.id} onChange={() => setLaneId(lane.id)} />
                    <div className="font-medium text-sm">{lane.name}</div>
                    <div className="text-xs text-muted">Targets: {lane.targetsPersona}</div>
                  </label>
                ))}
                {lanes.length === 0 && <p className="text-sm text-muted">No lanes available — ask an admin to open one.</p>}
              </div>
            </div>
          )}

          {step === "voice" && (
            <div className="space-y-4">
              <h1 className="text-lg font-semibold">Your voice</h1>
              <p className="text-sm text-muted">
                Paste a few things you've actually written (LinkedIn posts, emails, Slack messages), separated by
                blank lines. Optional, but this is what stops drafts sounding generic.
              </p>
              <Textarea rows={5} placeholder="Paste writing samples here..." value={writingSamples} onChange={(e) => setWritingSamples(e.target.value)} />

              <div className="space-y-3 pt-2">
                {SLIDER_LABELS.map(({ key, label, lowLabel, highLabel }) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs text-muted mb-1"><span>{label}</span></div>
                    <input
                      type="range" min={0} max={100} value={sliders[key]}
                      onChange={(e) => setSliders((s) => ({ ...s, [key]: Number(e.target.value) }))}
                      className="w-full accent-[var(--accent)]"
                    />
                    <div className="flex justify-between text-[11px] text-muted"><span>{lowLabel}</span><span>{highLabel}</span></div>
                  </div>
                ))}
              </div>

              <label className="block text-sm font-medium">
                Rules in your own words (one per line) — e.g. "I never use exclamation marks"
                <Textarea className="mt-1" rows={3} value={voiceRules} onChange={(e) => setVoiceRules(e.target.value)} />
              </label>
            </div>
          )}

          {step === "cadence" && (
            <div className="space-y-3">
              <h1 className="text-lg font-semibold">Your cadence</h1>
              <p className="text-sm text-muted">How many posts a week can you genuinely sustain? Your number, not an assigned one — a sustained 1/week beats an assigned 3/week abandoned in week three.</p>
              <label className="block text-sm font-medium">Posts per week<Input type="number" min={0} max={7} className="mt-1" value={postsPerWeek} onChange={(e) => setPostsPerWeek(Number(e.target.value))} /></label>
              <label className="block text-sm font-medium">Comments per day<Input type="number" min={0} max={20} className="mt-1" value={commentsPerDay} onChange={(e) => setCommentsPerDay(Number(e.target.value))} /></label>
            </div>
          )}

          {step === "schedule" && (
            <div className="space-y-3">
              <h1 className="text-lg font-semibold">When you want to work</h1>
              <label className="block text-sm font-medium">Timezone<Input className="mt-1" value={timezone} onChange={(e) => setTimezone(e.target.value)} /></label>
              <label className="block text-sm font-medium">Queue reminder time<Input type="time" className="mt-1" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-medium">Available from<Input type="time" className="mt-1" value={windowStart} onChange={(e) => setWindowStart(e.target.value)} /></label>
                <label className="block text-sm font-medium">Available until<Input type="time" className="mt-1" value={windowEnd} onChange={(e) => setWindowEnd(e.target.value)} /></label>
              </div>
            </div>
          )}

          {step === "tour" && (
            <div className="space-y-3">
              <h1 className="text-lg font-semibold">You're set up</h1>
              <ul className="text-sm space-y-2 text-muted list-disc list-inside">
                <li>Your daily queue shows up each morning — publish, comments, replies, follow, connect, in order.</li>
                <li>Every card is editable, and skipping is fine — just say why. Skips are the most valuable feedback in the system.</li>
                <li>Every item explains itself — tap &quot;Why this?&quot; on any card.</li>
                <li>Nothing publishes without you clicking. Ever.</li>
                <li>Adjust your voice anytime from the Persona tab, with a test bench to preview changes before saving.</li>
              </ul>
              <p className="text-xs text-muted">
                LinkedIn connection can be finished from the Persona tab once you&apos;re in — you don&apos;t need it
                to start reviewing queues.
              </p>
            </div>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex justify-between pt-2">
            <Button variant="secondary" onClick={back} disabled={stepIndex === 0}>Back</Button>
            {step === "tour" ? (
              <Button onClick={finish} disabled={submitting}>{submitting ? "Finishing…" : "Start using the app"}</Button>
            ) : (
              <Button onClick={next}>Continue</Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
