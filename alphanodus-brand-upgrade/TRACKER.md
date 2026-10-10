# alphanodus.com Brand Upgrade: Master Tracker

**How to use:** Work top to bottom. Phase 0 blocks everything else. For each row, fill **Current** (paste the live text or link, or "none"), decide **Action** (`Keep` / `Update` / `Create` / `Retire`), then move **Status** through `Todo → Drafted → Approved → Live → Verified`. A row is only done when it is `Verified` (checked on the live page, not just saved).

**Audit note:** alphanodus.com was not reachable from the Claude session (DNS failure), and no brand files exist in this repo. So every **Current** cell below is blank and must be captured by someone with access. The "what to change" column is a checklist of what normally needs changing on that platform.

---

## Phase 0: Define the new brand (blocks everything)

| # | Deliverable | Current | Action | Owner | Status |
|---|---|---|---|---|---|
| 0.1 | One-sentence definition: what AlphaNodus is, for whom, and why it matters | | | | Todo |
| 0.2 | Positioning statement + what we are no longer saying (retired claims) | | | | Todo |
| 0.3 | Tagline / headline (1 primary, 2 alternates) | | | | Todo |
| 0.4 | Boilerplate bios: 25 words, 50 words, 100 words, 250 words | | | | Todo |
| 0.5 | Founder / team bio template (ties to company definition) | | | | Todo |
| 0.6 | Core messages / pillars (3 to 5) + proof points | | | | Todo |
| 0.7 | Audience / ICP descriptions | | | | Todo |
| 0.8 | Voice and tone guide (do / don't, example phrases) | | | | Todo |
| 0.9 | Naming rules: "AlphaNodus" vs "Alpha Nodus" vs "alphanodus", legal entity name | | | | Todo |
| 0.10 | Visual identity: logo (+ variants), colors, fonts, favicon, icon sizes | | | | Todo |
| 0.11 | Asset kit: avatar (square), banner/cover sizes per platform, OG image 1200x630, email signature | | | | Todo |
| 0.12 | Keyword set + primary SEO terms for the new positioning | | | | Todo |
| 0.13 | Sign-off by decision maker; freeze the source-of-truth doc | | | | Todo |

---

## Phase 1: Inventory (find every place the brand appears)

| # | Task | Status |
|---|---|---|
| 1.1 | List every social/profile account and who owns the login | Todo |
| 1.2 | List every directory / listing / marketplace profile (see Section E) | Todo |
| 1.3 | Search Google for `"AlphaNodus"`, `"Alpha Nodus"`, `alphanodus.com` and old taglines; record every hit | Todo |
| 1.4 | Search the site for the old tagline and old product/service names (site search + `grep` of the repo/CMS export) | Todo |
| 1.5 | Check Wayback / cached copies and any old press, PDFs, decks still in circulation | Todo |
| 1.6 | Confirm credentials/2FA/admin access for each account (blockers listed in the log below) | Todo |

---

## Phase 2: Per-platform update list

### A. Website (alphanodus.com)

| # | Item | Current | What to change | Status |
|---|---|---|---|---|
| A1 | Homepage hero headline + subhead + CTA | | New tagline and definition | Todo |
| A2 | About page (story, mission, bio, team) | | Rewrite with 0.1, 0.4, 0.5 | Todo |
| A3 | Services / products / solutions pages | | Align names, descriptions, benefits to new positioning | Todo |
| A4 | Navigation labels and footer text | | Update; footer boilerplate (0.4, 25 words) | Todo |
| A5 | Pricing / plans / FAQ | | Replace old claims and terminology | Todo |
| A6 | Case studies, testimonials, logos | | Reframe to fit new message | Todo |
| A7 | Blog: top-traffic posts, author bios, "about" blurbs at end of posts | | Update bios; add editor's note or refresh as needed | Todo |
| A8 | Contact page + legal pages (Terms, Privacy, company description) | | Entity name and description | Todo |
| A9 | Logo, favicon, apple-touch-icon, web manifest | | New assets | Todo |
| A10 | Colors, fonts, buttons, UI components (theme/CSS) | | New design tokens | Todo |
| A11 | Page `<title>` and meta description, every key page | | New keyword-aligned copy | Todo |
| A12 | Open Graph / Twitter card tags + share image | | New 1200x630 image, new copy | Todo |
| A13 | Structured data (Organization / WebSite JSON-LD: name, description, logo, sameAs links) | | Update description, logo, sameAs list | Todo |
| A14 | Image alt text, hero images, video thumbnails | | Replace old-brand visuals | Todo |
| A15 | Redirects (renamed or removed URLs), sitemap.xml, robots, canonicals | | 301 any changed URL; resubmit sitemap | Todo |
| A16 | Transactional emails, form confirmation text, 404 page, cookie banner copy | | Voice + naming | Todo |
| A17 | Downloadable assets: PDFs, one-pagers, decks, lead magnets | | Rebrand or retire | Todo |
| A18 | Analytics / tag manager event names tied to old names (check before renaming) | | Keep IDs stable; update labels only | Todo |

### B. Social profiles

For each: **name/handle, bio/description, link, profile image, banner, pinned post, featured/highlights, category, contact button.** Handles: only change if you need to; changing breaks mentions and links.

| # | Platform | Fields to review | Current bio | New bio (length limit) | Status |
|---|---|---|---|---|---|
| B1 | LinkedIn Company Page | Name, tagline (120 chars), About (2,000), industry, specialties, website, logo, cover, CTA button, Featured, pinned post | | | Todo |
| B2 | LinkedIn: founder + team personal profiles | Headline, About, Experience entry for AlphaNodus, Featured, banner, Contact info | | | Todo |
| B3 | X / Twitter | Name, bio (160), link, location, header, avatar, pinned post | | | Todo |
| B4 | Instagram | Name (30), bio (150), link, category, highlight covers, pinned posts | | | Todo |
| B5 | Facebook Page | Name, intro, About, category, CTA, cover, "Story", pinned post | | | Todo |
| B6 | YouTube | Channel description, links, banner, avatar, watermark, trailer, playlists, video description template | | | Todo |
| B7 | TikTok | Bio (80), link, avatar | | | Todo |
| B8 | Threads / Bluesky / Mastodon | Bio, link, avatar | | | Todo |
| B9 | Pinterest | Business name, about, claimed website, board covers | | | Todo |
| B10 | Reddit / Quora / Medium / Substack | Profile or publication description, author bios | | | Todo |
| B11 | Discord / Slack community / Telegram / WhatsApp Business | Server/channel description, rules, welcome message, invite splash | | | Todo |

### C. Developer / product presence (if applicable)

| # | Platform | Fields to review | Status |
|---|---|---|---|
| C1 | GitHub org + repo READMEs | Org description, profile README, repo descriptions/topics, social preview image, package metadata | Todo |
| C2 | npm / PyPI / app stores / browser extension stores | Name, description, screenshots, icon, support URL | Todo |
| C3 | Product Hunt / G2 / Capterra / Crunchbase | Tagline, description, logo, screenshots, categories | Todo |
| C4 | Docs / help center / changelog / status page | Header, footer, intro copy, logo, domain text | Todo |

### D. Email, messaging, and sales collateral

| # | Item | What to change | Status |
|---|---|---|---|
| D1 | Email signatures (everyone) | Tagline, links, logo | Todo |
| D2 | Newsletter template + sender name, preheader, footer | New brand, footer boilerplate | Todo |
| D3 | Welcome / onboarding email sequences, drip campaigns | Rewrite for new voice | Todo |
| D4 | Cold outreach templates, sales sequences, CRM snippets | New pitch | Todo |
| D5 | Pitch deck, one-pager, proposals, contracts template, invoice template | New brand, boilerplate | Todo |
| D6 | Zoom/Meet backgrounds, virtual meeting names, Calendly/booking page text | Update | Todo |
| D7 | Business cards, merch, event banners, packaging (if any) | Reprint schedule | Todo |

### E. Search, directories, and third-party listings

| # | Platform | What to change | Status |
|---|---|---|---|
| E1 | Google Business Profile (if local) | Name, description, categories, photos | Todo |
| E2 | Google Search Console + Bing Webmaster | Resubmit sitemap; verify no coverage drops; URL changes via Change of Address only if the domain changes | Todo |
| E3 | Wikipedia / Wikidata / Crunchbase / PitchBook / ZoomInfo / Apollo / Clearbit | Description, logo, website, founders | Todo |
| E4 | Industry directories, partner pages, integration marketplaces, reseller listings | Request update from partners | Todo |
| E5 | Press kit / media page + past press releases boilerplate | New boilerplate for future releases | Todo |
| E6 | Speaker bios (conferences, podcasts, webinars), guest-post author bios | Send new bio to hosts | Todo |
| E7 | Review sites (Trustpilot, Glassdoor, G2) | Description, logo | Todo |
| E8 | Domain WHOIS org name, SSL cert org name, DNS-linked services (email sender name, DMARC reports) | Check for old name | Todo |

### F. Paid, analytics, and ops

| # | Item | What to change | Status |
|---|---|---|---|
| F1 | Google Ads / Meta Ads / LinkedIn Ads accounts: business name, ad copy, landing pages, brand assets | Pause old creatives; launch new | Todo |
| F2 | Metricool / scheduler: queued posts using old messaging | Audit queue, edit or delete | Todo |
| F3 | Content calendar + evergreen post library | Retire old posts that contradict the new definition | Todo |
| F4 | Analytics (GA4 property names, Search Console, dashboards) | Labels only | Todo |
| F5 | Billing / legal: Stripe/Paypal public business name, invoices, tax docs, trademark filings, domain registrar | Check what has to match the legal name | Todo |
| F6 | Internal: onboarding docs, Notion/Slack channel descriptions, job posts, careers page | Update | Todo |

---

## Phase 3: Launch and verification

| # | Task | Status |
|---|---|---|
| 3.1 | Decide launch approach: one-day switch vs staged rollout (website first, then profiles within 48h so nothing contradicts the site) | Todo |
| 3.2 | Announcement plan: blog post, LinkedIn/X posts, email to list/customers, partner note | Todo |
| 3.3 | Update everything in one window; keep a timestamped change log | Todo |
| 3.4 | Crawl the site (Screaming Frog or similar) for old name, tagline, broken links, missing redirects | Todo |
| 3.5 | Re-run the Phase 1 searches; any stragglers go back into the tracker | Todo |
| 3.6 | Verify share previews (LinkedIn Post Inspector, Facebook Sharing Debugger, X card preview) | Todo |
| 3.7 | Verify Search Console: no spike in 404s/coverage errors; sitemap accepted | Todo |
| 3.8 | 30-day follow-up: rankings, traffic, branded search, remaining third-party listings | Todo |

---

## Decisions and blockers log

| Date | Item | Decision / blocker | Owner |
|---|---|---|---|
| | | | |

## Open questions to answer before starting

1. What is changing: the **definition and messaging only**, or also the **name, logo, colors, domain**? (Domain or name change adds redirects, legal, and handle work.)
2. Which platforms actually exist today? (The lists above are comprehensive; strike out what doesn't apply.)
3. Who owns each login, and is 2FA recoverable?
4. Hard launch date, if any?
