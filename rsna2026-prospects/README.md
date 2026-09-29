# RSNA 2026 prospect list: meetup outreach

**Event:** RSNA 2026 · McCormick Place, Chicago · Nov 29 – Dec 3, 2026 (technical exhibits Nov 29 – Dec 2)
**Compiled:** 2026-09-29, from public sources only.

## What's here

| Path | In git? | Contents |
|---|---|---|
| `private/RSNA2026_Prospect_List.xlsx` | **No** (gitignored) | The full workbook: people, enriched brands, all exhibitors, org and press contacts, playbook, templates |
| `private/people_prospects.csv` | **No** | 318 named people, tagged and prioritised |
| `private/brands_enriched.csv` | **No** | 80 priority exhibitors: website, socials, published emails, HQ, key people, RSNA meeting pages |
| `private/org_and_press_contacts.csv` | **No** | Official RSNA, society and trade-press inboxes |
| `data/rsna2026_exhibitors.csv` | Yes | All 716 official exhibitors (company level), segment, booth where published |
| `playbook/search_playbook.tsv` | Yes | The exact keyword, hashtag and filter strings per platform |
| `playbook/outreach_templates.tsv` | Yes | First-touch messages per tag |
| `scripts/` | Yes | `classify.py` (exhibitor segments), `build.py` (merge, dedupe, tag, prioritise), `write_xlsx.py` |

The people-level files stay out of git because this repository is **public**: pushing names, emails and
handles here would republish them. Make the repo private first if you want them versioned.

## How the list was built

1. **Official exhibitor list.** Every exhibitor was scraped from the RSNA 2026 Map Your Show directory
   (`rsna2026.mapyourshow.com`, letter by letter): 716 companies. Booth numbers were added where the
   directory, a company page or a public post shows them (121 so far).
2. **Segment tags per exhibitor** (`classify.py`): OEM / modality, AI, imaging IT / PACS, contrast / pharma,
   components, radiation safety, teleradiology / practices, health systems (recruiting), staffing,
   societies, media, services, education, RSNA-run spaces. These are auto-classified, so spot-check them.
3. **Brand enrichment** for 80 priority exhibitors (big OEMs, AI leaders, all Featured Exhibitors):
   web research agents read company sites, press releases and LinkedIn for website, socials, published
   sales and press emails, HQ, product line, decision-makers, and RSNA 2026 "book a meeting" pages.
4. **People discovery**, by keyword and hashtag across LinkedIn, X, Instagram, Facebook, YouTube and press:
   - `"RSNA 2026"`, `#RSNA26`, `#RSNA2026` combined with booth, presenting, "let's meet", "book a meeting"
   - RSNA Board of Directors, executive director, media-relations staff (rsna.org)
   - RSNA 2026 plenary speakers and moderators (Meeting Central)
   - Society leadership: ACR, ARRS, SIIM, AHRA, ESR, ASNR, SBI
   - Trade-press editors: AuntMinnie, Radiology Business, ITN, DOTmed, RSNA News
   - Influencers: #RadTwitter KOLs, Imaging Wire Top 40, radiology TikTok / Instagram creators, RSNA AI
     podcast hosts, RSNA AI faculty
5. **Merge, dedupe and verification.** Every row keeps its evidence URL. Fields the research agent could not back
   with a primary source are flagged in "Fields to double-check". RSNA media-staff emails were spot-checked
   against rsna.org/media/contact.

## Tags (column "Primary tag")

Authorized Official · Speaker · Influencer · Media / Press · Society Official · Brand Representative ·
Startup Founder · Health System Recruiter · Radiologist / Clinical Leader · Service Provider

**Priority A:** attendance confirmed (official role, program listing, or their own RSNA 2026 post) **and** reachable
(email or handle). **B:** confirmed *or* reachable. **C:** role-based prospect; confirm attendance in the first message.

## Emails: what is and isn't included

Only emails **published on an official or public page** are included (19 personal plus company, press and RSNA inboxes).
No email was guessed or pattern-built. For everyone else, the "Email status" column says to enrich from the
LinkedIn URL (144 people have one) with Apollo, Hunter, RocketReach or Crustdata `people_contact_enrich`.
The Crustdata account used here had about 2 credits left, so bulk enrichment was not possible in this pass.

## Limits

- There is no public RSNA attendee list (the meeting draws 21,000+ professionals). This is a prospect list of
  people with public signals, official roles or decision-maker roles at exhibitors, not every attendee.
- Most attendees post 2–8 weeks before the show, so re-run the playbook searches weekly through November.
  Side events and dinners are usually announced 2–4 weeks out.
- The 5,153-person RSNA 2026 speaker directory (cattendee.abstractsonline.com/meeting/21552 → Speakers)
  is the largest untapped confirmed-attendee source. Filter it by the topics relevant to you.
- The workbook's "Start Here" counts are live `COUNTIF` formulas. They compute when the file is opened in
  Excel or Google Sheets (LibreOffice recalculation was unavailable in the build environment).

## Compliance

Business outreach only. Follow CAN-SPAM (US), CASL (Canada) and GDPR / UK-GDPR (many attendees are
European): identify yourself, include an opt-out, keep personal emails out of bulk sequences, and honour
unsubscribes.

## Rebuild

```bash
python3 scripts/build.py                                     # merges private/raw/* -> private/merged.json
python3 scripts/write_xlsx.py private/RSNA2026_Prospect_List.xlsx
```
