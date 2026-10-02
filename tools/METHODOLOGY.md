# How the imaging-leads data was collected

A record of what was done, with which sources, and what it can and cannot tell you.
Written so a later research round can skip steps already done.

## Sources actually used (only these two)

1. **The organizations' own websites**, fetched directly over HTTP by `exa_run.py` (no Google, no API).
2. **Exa web search** (`mcporter call exa.web_search_exa`). Exa is a search engine with its own web index. It is not Google.

Not used for this dataset: Google, any social-network API (LinkedIn, Facebook, Instagram, X, YouTube),
keyword searches inside social platforms, data brokers or people-search sites, Crustdata, TinyFish, Nimble.
No page was logged into. No private contact data was collected.

## Step by step

| # | Step | Tool | Cost | Output |
|---|------|------|------|--------|
| 1 | Clean the people list (decode HTML, split credentials, drop website labels and organization-like strings, merge duplicates) | `clean_people.py` | free | `people_cleaned.csv` (23,248 kept, 321 removed) |
| 2 | Crawl each organization's website: homepage plus ranked team/staff/about/contact pages and one level into bio pages, up to 12 pages. One fetch per domain, shared by sibling organizations. | `exa_run.py --stage crawl` (plain HTTP, 8 parallel) | free | `full_run/ORG*/site_text.txt`, `summary.json` (emails, phones, social links found on the site) |
| 3 | Match every listed person against the site text. "First name then last name within 16 characters" or "Last, First" = confirmed. Both names somewhere on a long page = possible. | same | free | `people_status.csv` per organization |
| 4 | For people not found on the site, run one Exa search each: `"{name}" {title or credentials or radiology} {organization} {states}`. Three results per search, about $0.007. | `exa_run.py --stage search` | paid | `person-*.txt` |
| 5 | Organization searches: one combined query for socials and contact details when the site lacked LinkedIn, email or phone; one staff query when an organization had fewer than 3 people or over half unresolved. | same | paid | `org-info.txt`, `org-staff.txt` |
| 6 | Score the evidence, assign confidence, extract LinkedIn URLs, business emails and phones, find new-people candidates. | `build_dataset.py` | free | `final/*.csv` |
| 7 | Join facilities to their organization on `org_id`; bundle into one workbook. | `make_workbook.py` | free | `imaging-leads.xlsx` and `.zip` |

Searches were done in priority order: decision-makers first (title regex), then everyone else, untitled people first.

## Evidence ranking (`build_dataset.py`)

org_site (6) > linkedin_employer (5) > other_with_org (4) > linkedin_name_only (3) > name_only (2) > broker_only (1) > none (0).
Confidence: high, high, medium, low, low, none, none. Flags mark anything contradicting or thin.
Rules: a phone shared by 2+ people at an organization is moved to the organization; a personal-looking email must
contain the person's last name or first initial plus last name; a LinkedIn URL is "employer-verified" only if the
snippet names the organization.

## Is the data live or old?

- **Website crawl: a snapshot, live as of the day it ran.** Pages were fetched from the real sites at that time.
  The crawl date is the modified date of the files in `full_run/ORG*/site_text.txt`. Sites change; a page can also be stale itself.
- **Exa results: from Exa's own index, not the live platform.** Pages are crawled by Exa earlier, so a LinkedIn
  snippet or a staff page can be days to months old. We never opened LinkedIn or any social platform, and LinkedIn
  content only appears when Exa had already indexed the public profile page. A LinkedIn headline can therefore
  be out of date, and a person may have moved since.
- **"High" confidence means the name appeared with the organization on a page at the time, not that employment was
  checked today.** Treat it as "very likely still there", then spot-check before outreach.

## Known limits

- The crawler does not run JavaScript. Sites that load staff lists with scripts can look empty, so those people
  fall through to Exa search.
- Some sites return 403 or 429 and were not retried further; `lvradiology.com` is skipped on purpose.
- People beyond the first pages of large sites may not appear in the crawl.
- Organization socials and emails come from links and text on the organization's own site and from Exa results about it.
- Business contacts only. Personal emails and mobiles were not collected and cannot be from these sources.

## Do not redo

- The crawl for all 2,511 organizations is cached in `full_run/`. Re-crawl only to refresh a stale site (delete that organization's folder).
- Every Exa search is stored as `person-<id>-<name>.txt`. A run skips finished files, so re-running costs nothing for done people.
- Failed searches are never saved, so they retry automatically.
- When a prioritized run is needed, use `--only-people` with the full people file; a partial `--people` file rewrites
  status files and drops people from the summary.

## Spend (approximate)

About $0.007 per 3-result search. Total across all runs: roughly $90 on Exa. Keys used in the chat must be deleted
in the Exa dashboard.
