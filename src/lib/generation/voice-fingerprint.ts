/**
 * Voice fingerprint extraction — linkedin-humanizer/references/
 * voice-fingerprint.md. Built from 3-6 real writing samples at onboarding
 * (prompt-contracts.md §7), refreshed monthly incorporating edited_content
 * diffs. This is descriptive statistics only — it informs the voice
 * profile sliders but never replaces the person confirming them.
 */
export type VoiceFingerprint = {
  sentenceLengths: number[];
  vocabFreq: Record<string, number>;
  startsLowercasePct: number;
  usesDoubleDot: boolean;
  usesTripleDot: boolean;
  punctuationFreq: Record<string, number>;
  fragmentPct: number;
};

function countWords(words: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const w of words) counts[w] = (counts[w] ?? 0) + 1;
  return counts;
}

function countChars(text: string, chars: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const c of chars) counts[c] = (text.match(new RegExp(`\\${c}`, "g")) ?? []).length;
  return counts;
}

export function buildVoiceFingerprint(samples: string[]): VoiceFingerprint {
  const text = samples.join("\n");
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
  const wordCounts = (s: string) => s.split(/\s+/).filter(Boolean).length;

  return {
    sentenceLengths: sentences.map(wordCounts),
    vocabFreq: countWords(text.toLowerCase().match(/\b[a-z][a-z']{2,}\b/g) ?? []),
    startsLowercasePct:
      sentences.filter((s) => s[0] && s[0] === s[0].toLowerCase()).length / Math.max(sentences.length, 1),
    usesDoubleDot: text.includes(".."),
    usesTripleDot: text.includes("..."),
    punctuationFreq: countChars(text, ".!?,;:"),
    fragmentPct: sentences.filter((s) => wordCounts(s) <= 4).length / Math.max(sentences.length, 1),
  };
}

/**
 * Rough slider suggestions derived from the fingerprint — a starting point
 * for onboarding's voice capture step, always shown to the participant for
 * confirmation/adjustment before saving (prompt-contracts.md: nobody
 * commits a voice change blind).
 */
export function suggestSlidersFromFingerprint(fp: VoiceFingerprint): {
  sentenceLength: number;
  hedging: number;
} {
  const avgLen =
    fp.sentenceLengths.reduce((a, b) => a + b, 0) / Math.max(fp.sentenceLengths.length, 1);
  // Map ~5 words -> 0, ~30 words -> 100, clamped.
  const sentenceLength = Math.max(0, Math.min(100, Math.round(((avgLen - 5) / 25) * 100)));

  const hedgeWords = ["maybe", "perhaps", "i think", "sort of", "kind of", "probably"];
  const text = Object.keys(fp.vocabFreq).join(" ");
  const hedgeHits = hedgeWords.filter((w) => text.includes(w)).length;
  const hedging = Math.max(0, Math.min(100, hedgeHits * 20));

  return { sentenceLength, hedging };
}
