---
name: gravity-community
description: Module 3b of the Gravity Social OS, community and leads for Alpha Nodus / Gravity. Classifies every comment, DM and mention by B2B imaging intent (hot/warm lead, question, praise, partner, press, customer, complaint, patient, security, competitor, spam), scores leads, drafts replies in the Gravity voice, logs leads, and routes anything sensitive (patients/PHI, complaints, customers, security, partners, press) to a person, never auto-replied. Use when the person pastes comments or DMs, asks to check the inbox, or asks who the leads are.
---

# Gravity community: comments, DMs and leads

Inputs are `gravity-social/community/inbox/<date>-<platform>.yaml` batches (format in `community/inbox/README.md`). The person pastes messages, forwards notifications, or exports them from Metricool's inbox. If they paste raw text, create the batch file first.

Read `community/intent-taxonomy.md`, `community/reply-playbook.md`, `brand/voice.md`, `brand/messaging.md` (objection answers) and `brand/proof-ledger.yaml`.

## For every item

1. **Classify.** Set `intent` (exactly one), `confidence` (0 to 1), `fit` (0 to 2), `intent_score` (0 to 2). Use the author's title and organization: an "Operations Director, [Imaging group]" asking about RIS compatibility is `lead-hot`, while the same question from a student is a `question`.
2. **Route.**
   - `person`: patient, customer, complaint, partner, press, security, competitor, anything with PHI, any pricing beyond "happy to walk you through it," anything legal, and anything with confidence under 0.7.
   - `reply-bank`: praise, candidate, the standard product questions, where a pre-approved line fits as written.
   - `draft-reply`: everything else worth answering.
   - `ignore`: spam (hide it if it's link spam or harmful).
3. **Draft** (routes `draft-reply` and, for hot leads, a DM follow-up): answer first, one specific detail, one next step moved to a private channel. Under 60 words on LinkedIn, 280 characters on X. Then lint it:
   `python3 scripts/gravity_lint.py --text "<reply>" --platform <platform> --claims <ids if any>`. Fix every ERROR.
4. **Leads:** for `lead-hot` and `lead-warm`, append a row to `community/leads.csv` (date, platform, handle, name, title, organization, source_post, message_url, intent, fit, intent_score, lead_score, summary, next_step, owner, status=new). Only use details the person made public: their name, title and organization. Nothing else about them.
5. Set `reply_status: pending` on every draft. It changes to `approved` only when the person says so, and to `sent` once they (or you, on an explicit instruction and where a tool exists) post it.

## Patients and PHI (always first)

If a message contains any health or identifying detail about a patient: route it to `person`, don't quote the details anywhere (not even in the batch file's `draft_reply` or a summary; write "patient details redacted"), suggest hiding the comment, and use only the approved patient-redirect line. Alpha Nodus is not the imaging center and can't see anyone's records.

## Report back

End with a short summary: counts by intent; hot leads (name, organization, what they asked, the proposed next step); the list of **messages that need you personally**, each with a one-line reason; and drafted replies waiting for a yes. Then run `python3 scripts/build_dashboard.py` (Posting & community tab).

## Sending

LinkedIn and X comment replies are posted by a person. The Metricool tools here don't send replies. For a hot lead who shared an email address publicly, you may create a **Gmail draft** of the approved follow-up if the person asks. Never send email yourself, and never DM someone the person hasn't approved.

## Never

- Auto-reply to anything routed `person`.
- Argue with a competitor, a critic or a payer in public.
- Quote a price, a customer name (other than Tower Radiology's published results), or an unlisted figure.
- Store anything about a commenter beyond what they posted publicly.
