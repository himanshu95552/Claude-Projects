# YouTube Shorts (disabled until a channel exists)

**Role:** searchable demo moments. Unlike reels, Shorts are found by search ("AI voice agent for radiology," "automated fax intake radiology," "prior authorization automation"), so the title and description carry search words (decision 27) while the on-screen copy keeps the house words.

## Format

- 15 to 60 seconds, 9:16, burned-in captions, hook on screen in the first 1.5 seconds.
- Reuse the Instagram reel script; rewrite the title and description for search.
- Title (under 100 chars): search phrase first, house line second. Example: "AI voice agent for imaging centers: watch it handle a reschedule | Gravity"
- Description: 2 to 3 sentences, the approved 25-word boilerplate, and a UTM'd link.
- `madeForKids: false`. Set `isAiGeneratedContent: true` only if the video contains synthetic realistic media (a real recorded demo of the voice agent is not synthetic video, but the voice is AI; declare when in doubt).

## Enable

Set `platforms.youtube-shorts.enabled: true` and a handle in `config.yaml`, then connect the channel in Metricool.
