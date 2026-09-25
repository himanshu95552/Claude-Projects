# Inbox

One YAML file per batch of comments and DMs, named `YYYY-MM-DD-<platform>.yaml`.
Paste or export messages here (Metricool's inbox, LinkedIn notifications, X mentions),
then run the `gravity-community` skill to classify them and draft replies.

```yaml
platform: linkedin-company
collected_at: 2026-10-06T09:00:00-05:00
items:
  - id: li-c-0001
    kind: comment            # comment | dm | mention | reply
    on_post: 2026-W41-li-co-01
    author: "Jane Doe"
    author_title: "Director of Operations, Example Imaging"
    url: ""
    text: "We lose auths every week. How does this work with eRAD?"
    # filled in by the community skill:
    intent: lead-hot
    confidence: 0.9
    fit: 2
    intent_score: 2
    route: draft-reply          # draft-reply | reply-bank | person | ignore
    draft_reply: "..."
    reply_status: pending       # pending | approved | sent | not-sending
```
