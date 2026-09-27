#!/usr/bin/env python3
"""voice_stats.py — style fingerprint from a corpus of posts (from the voice-clone skill).
Usage: python3 voice_stats.py corpus.json > stats.json"""
import json, re, sys
import statistics as st
from collections import Counter

FUNC = ("the of and a to in is you that it he was for on are as with his they i "
        "at be this have from or one had by but not what all were we when your can "
        "said there use an each which she do how their if will up other about out "
        "so some would into has more her him my than been who its now no my me our "
        "just like really very actually").split()
EMOJI = re.compile("[\U0001F300-\U0001FAFF\U0001F900-\U0001F9FF\U00002600-\U000027BF\U0001F1E6-\U0001F1FF⬀-⯿←-⇿]")
SENT = re.compile(r"[.!?]+(?:\s|$)")
WORD = re.compile(r"[A-Za-z']+")
CONTR = re.compile(r"\b\w+'(?:s|t|re|ve|ll|d|m)\b", re.I)

def pct(n, d): return round(100.0 * n / d, 1) if d else 0.0
def med(xs): return round(st.median(xs), 1) if xs else 0

def analyse(posts, label):
    n = len(posts)
    if not n: return {}
    texts = [p["text"].replace("’", "'") for p in posts]
    chars, wcounts, sent_lens, breaks, all_words = [], [], [], [], []
    starts_lower = caps_word = has_bullet = has_hash = has_link = 0
    punct, emojis = Counter(), Counter()
    emoji_per_post, terminal_emoji = [], 0
    openers1, openers2, closers = Counter(), Counter(), Counter()
    nl_posts = [p for p in posts if p.get("newlines_reliable", True)]
    for t in texts:
        s = t.strip(); ws = WORD.findall(s)
        chars.append(len(s)); wcounts.append(len(ws)); all_words += [w.lower() for w in ws]
        if s and s[0].islower(): starts_lower += 1
        if any(len(w) > 1 and w.isupper() and w not in ("AI", "MRI", "CT", "RCM", "CEO", "PET", "DR", "RSNA", "MBA", "HBMA", "RBMA", "LLC", "TGH", "SDMI", "OIS", "US", "CPC", "FANA", "EMS") for w in ws): caps_word += 1
        if re.search(r"^\s*[-•*▪·]\s", s, re.M) or " • " in s or " · " in s: has_bullet += 1
        if "#" in s: has_hash += 1
        if re.search(r"https?://|lnkd\.in|www\.", s): has_link += 1
        for name, pat in [("em_dash", "—"), ("en_dash", "–"), ("ellipsis", "..."), ("semicolon", ";"), ("colon", ":"),
                          ("exclaim", "!"), ("double_exclaim", "!!"), ("question", "?"), ("paren", "("), ("quote", '"'), ("curly_quote", "“")]:
            if pat in s: punct[name] += 1
        es = EMOJI.findall(s); emoji_per_post.append(len(es)); emojis.update(es)
        if es and EMOJI.search(s.rstrip()[-3:] or ""): terminal_emoji += 1
        for part in SENT.split(re.sub(r"#\w+", "", s)):
            pw = WORD.findall(part)
            if pw: sent_lens.append(len(pw))
        if ws:
            openers1[ws[0].lower()] += 1
            if len(ws) > 1: openers2[" ".join(w.lower() for w in ws[:2])] += 1
            closers[" ".join(w.lower() for w in ws[-3:])] += 1
    for p in nl_posts: breaks.append(p["text"].strip().count("\n"))
    total_w = len(all_words) or 1; freq = Counter(all_words)
    return {
        "label": label, "n": n, "date_range": [min(p["date"] for p in posts), max(p["date"] for p in posts)],
        "length": {"median_chars": med(chars), "mean_chars": round(st.mean(chars), 1),
                   "p10_chars": sorted(chars)[int(0.1 * n)], "p90_chars": sorted(chars)[min(int(0.9 * n), n - 1)],
                   "median_words": med(wcounts)},
        "rhythm": {"median_sentence_words": med(sent_lens), "mean_sentence_words": round(st.mean(sent_lens), 1) if sent_lens else 0,
                   "burstiness_stdev": round(st.pstdev(sent_lens), 1) if len(sent_lens) > 1 else 0,
                   "shortest_sentence": min(sent_lens) if sent_lens else 0, "longest_sentence": max(sent_lens) if sent_lens else 0,
                   "median_line_breaks(reliable only)": med(breaks), "pct_single_block": pct(sum(1 for b in breaks if b == 0), len(breaks)),
                   "n_linebreak_reliable": len(breaks)},
        "case_and_marks": {"pct_starts_lowercase": pct(starts_lower, n), "pct_with_allcaps_word": pct(caps_word, n),
                           "pct_with_bullets": pct(has_bullet, n), "pct_with_hashtag": pct(has_hash, n), "pct_with_link": pct(has_link, n),
                           "median_hashtags": med([len(re.findall(r'#\w+', t)) for t in texts])},
        "punctuation_pct_of_posts": {k: pct(v, n) for k, v in punct.items()},
        "emoji": {"mean_per_post": round(st.mean(emoji_per_post), 2), "pct_with_none": pct(sum(1 for e in emoji_per_post if e == 0), n),
                  "pct_terminal_position": pct(terminal_emoji, n), "top": emojis.most_common(12)},
        "vocabulary": {"type_token_ratio": round(len(freq) / total_w, 3),
                       "contractions_per_100w": round(100 * sum(len(CONTR.findall(t)) for t in texts) / total_w, 2)},
        "function_words_per_1000w": {w: round(1000 * freq.get(w, 0) / total_w, 1) for w in FUNC if freq.get(w, 0)},
        "openers_first_word": openers1.most_common(12), "openers_first_two": openers2.most_common(12),
        "closers_last_three": closers.most_common(8),
        "top_content_words": [(w, c) for w, c in freq.most_common(80) if w not in FUNC][:30],
    }

if __name__ == "__main__":
    posts = json.load(open(sys.argv[1]))
    groups = {"ALL": posts}
    for key in ("channel", "type", "role"):
        for v in sorted({p.get(key) for p in posts if p.get(key)}):
            groups[f"{key}={v}"] = [p for p in posts if p.get(key) == v]
    print(json.dumps({k: analyse(v, k) for k, v in groups.items() if len(v) >= 5}, indent=2, ensure_ascii=False))
