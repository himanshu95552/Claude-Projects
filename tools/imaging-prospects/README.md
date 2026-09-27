# Imaging-center prospect finder

Finds and ranks LinkedIn profiles for three buyer roles at US outpatient / independent
radiology & imaging centers:

- Revenue Cycle Manager
- Referral Acquisition & Growth Lead (physician liaison, provider/physician relations, outreach, order intake)
- Practice Growth Manager (business development, growth, marketing)

Each role gets 20 people: 10 **Voices** (visibly active on LinkedIn) and 10 **Operators**
(top by track record).

## Pipeline

1. **Pull** people from the Crustdata people DB (`crustdata_people_search_db`, full profiles,
   sorted by connections), one pull per role. Save each response as
   `<work>/raw/{rcm,referral,growth}.json`.
   Filters: `location_country = United States`; employer industry in
   *Hospitals and Health Care* / *Medical Practices*; employer name contains
   imaging / radiology / MRI / diagnostic; role title keywords; hospital, university and
   health-system employers excluded.
2. **Shortlist**: `python3 shortlist.py <work>` drops non-imaging-center employers (equipment
   makers, AI/teleradiology/billing vendors, labs, academic departments...), off-function titles,
   caps 3 people per company per role, and computes a work score. Writes `<work>/shortlist.json`.
3. **Activity check**: web-search each shortlisted person on linkedin.com (name + company) and
   record in `<work>/activity.tsv` (`name, vanity_url, activity_level, evidence`):
   A = authors own posts/articles/podcast, B = occasional posts or frequent public comments,
   C = profile only.
4. **Overrides** in `<work>/overrides.json`: `drop` (left role), `dedupe` (role, name),
   `bonus` (evidence strength, e.g. podcast host or speaker), `flag` (verify notes).
5. **Build**: `python3 build.py <work> <out>` writes `top_profiles_radiology_imaging.xlsx`
   and one Markdown dossier per person under `<out>/profiles/`.

Keep `<work>` and `<out>` outside version control: they contain personal profile data.
