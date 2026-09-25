# Attribution: from post to pipeline

"It tracks the money, not just the likes." For Gravity the money is pipeline: a demo request or an "exam itemized" request that becomes an opportunity and then a customer. Likes are nice but not the goal.

## The funnel

| Stage | Where the number comes from | Join key |
|---|---|---|
| Impressions | Metricool analytics (per post) | Metricool post id → `metricool_post_id` in the post file |
| Engagements (reactions, comments, reposts, saves) | Metricool analytics | same |
| Followers gained | Metricool account evolution (daily), attributed to the day's posts | date |
| Link clicks | Metricool clicks where available; website analytics by `utm_content` | `utm_content = post id` |
| Demo requests | Website form / CRM export, filtered on `utm_source=linkedin|x|instagram|youtube` | `utm_content` |
| "Exam itemized" requests | same | `utm_content` |
| Opportunities, customers, pipeline $ | CRM | `utm_content`, or first-touch post noted by sales |
| Leads from comments and DMs | `community/leads.csv` | `source_post` |

Founder posts: personal profiles are not in Metricool. Record Shamit's post stats by hand (impressions, reactions, comments) in `reports/outcomes.csv` with `post_id`, and use `utm_term=founder` for their clicks.

## Files

- `reports/metrics/<YYYY-MM-DD>.json`: written by the report skill from Metricool. Format:
  ```json
  {"period": {"from": "2026-10-05", "to": "2026-10-11"},
   "accounts": [{"platform": "linkedin-company", "followers": 1234, "followers_delta": 18}],
   "posts": [{"post_id": "2026-W41-li-co-01", "platform": "linkedin-company", "published": "2026-10-06",
              "impressions": 0, "engagements": 0, "comments": 0, "shares": 0, "clicks": 0}]}
  ```
- `reports/outcomes.csv`: one row per outcome, exported from the CRM or the website form (or typed in):
  `date,post_id,outcome,organization,value_usd,notes` where `outcome` is `demo_request | exam_itemized_request | opportunity | customer | founder_stats`.
- `community/leads.csv`: leads from comments and DMs.

## Rules

- Every public link is built with `scripts/utm.py`. A link without `utm_content` can't be attributed; the linter warns.
- A post "made pipeline" only if an outcome row names it. Don't infer it.
- Report counts, not rates, when the numbers are small (under ~30 clicks). Say "3 of 41 clicks," not "7.3%."
- The daily brief never publishes numbers externally. Internal only.
- Until the CRM export exists, the funnel stops at clicks and comment/DM leads, and the brief says so.
