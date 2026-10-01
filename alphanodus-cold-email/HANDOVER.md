# Handover: Gravity coffee-cup cold email (Alpha Nodus)

Written 2026-10-01 for a new Claude session connected to the **alphanodus Gmail account**.
Repo: `himanshu95552/Claude-Projects`, branch `claude/keen-planck-yiru1c`, folder `alphanodus-cold-email/`.

## 1. The job
Send a playful cold email (modeled on the "your name is on my coffee cup" email the user pasted) to imaging-center contacts, promoting **Gravity**, from **Tushant, Marketing Manager, Team Alpha Nodus**. Goal: reply, then a booked demo. Offer: a free leakage audit ("your exam, itemized"). Unsubscribe line and postal address footer: user says they already have these, so append them as usual. Nothing has been sent.

## 2. Final email copy (v2, short, agreed with the user)
Decision: keep it ~110 words, one ask (reply "yes"). Do NOT put the booking link in the first email. When someone replies yes, send the three numbers to share (exams by modality, collections, payroll by role) plus the booking link in the reply.

Subject: `{first_name}, you're on my coffee cup`

```
Hi {first_name},

Your name is going on my coffee cup until I hear back from you. Cup attached. I'm committed.

Quick question: how many referrals did {org} lose last month? Most imaging centers can't say, because the answer is split across the CRM, the RIS and the RCM.

I'm Tushant at Alpha Nodus. Our system, Gravity, closes those leaks: it gets the order, completes the exam and gets it paid. Tower Radiology saw 7% more exams a week and $2.3M in added revenue (presented at RSNA).

I'd like to run a free leakage audit for you: it shows what one of your exams earns and where it leaks. Want me to run it?

Tushant
Team Alpha Nodus
```

Copy rules from the user's own docs (see `resources/`): "system", never "platform"; Gravity is the subject; spell out "Agentic Operations System (AOS)" on first use if AOS is mentioned; no persona names (Sasha, Sandra, Susan); never "guarantee" or "zero"; no SOC 2 or HIPAA certification claims; say "imaging", not "radiology", in body copy (Tower Radiology is a proper name); no denial, A/R or referral-lift claims (not measured at a live customer). Tower figures are locked, but the deck says to send Dr. Kedar a courtesy note before RSNA 2026. Ask the user whether that was done.

## 3. Recipients: first batch (Group A, imaging centers), 15 people
| First name | Email | Org to use in the email |
|---|---|---|
| Trisha | tolivero@14streetmedical.com | 14 Street Medical |
| Isaac | isaac@3tradiology.com | 3T Radiology |
| Vanessa | vanessa@3tradiology.com | 3T Radiology |
| Barb | barbn@611mri.com | 611 Open MRI |
| Aric | aricb@611mri.com | 611 Open MRI |
| Brian | brianp@611mri.com | 611 Open MRI |
| Shelley | shelleyr@611mri.com | 611 Open MRI |
| Lynn | lhight@611mri.com | 611 Open MRI |
| Adam | adamt@611mri.com | 611 Open MRI |
| Shannon | shampson@arcrad.org | Abercrombie Radiological Consultants |
| Amy | aadams@arcrad.org | Abercrombie Radiological Consultants |
| Becky | bwarwick@arcrad.org | Abercrombie Radiological Consultants |
| Jorja | jclark@arcrad.org | Abercrombie Radiological Consultants |
| Sid | sidprakash@amds-nyc.com | Accurate Medical Diagnostic Services |
| Emelin | emelin@openmri17.com | Advanced Diagnostic Imaging of New Jersey |

Notes: "3T Radiology" is my reading of the domain 3tradiology.com. Confirm the display name. The referral-loss question reads oddly for billing staff (Shelley, Lynn) and radiologists/medical directors (Aric, Brian, Adam); the user may want a variant or to skip them.

**Held back (user has not decided):**
- Advanced Heart Vascular Center of Carlsbad (6 people, all @currentclinic.com): not an imaging center.
- Abq Orthopedics (Darlenis) and Advanced Orthopedic and Spine Care (Patrick, IT): not imaging centers.
- advancedradiology.com (Karen, Tina): their emails are @radnet.com. RadNet owns DeepHealth, the named competitor. Probably skip.
- Group B (catch-all domains, addresses unverifiable) and Group C (Amanda Spencer and Amanda Ryan share one address): not drafted. Full detail in `resources/gravity_leads_email_accuracy_test.csv`.

## 4. The cup image
- `make_cup.py` writes a cup photo with a name on it: `python3 make_cup.py "Trisha"` (needs `pip install pillow`). Base photo: `cup_base.jpg`. Output goes to `out/cup_<name>.jpg`.
- Small versions (240x340, ~7 KB) of all 15 first names are in `out/small/<firstname>.jpg`. Full-size ones are in `out/cup_<firstname>.jpg`.
- The cup is a staged mockup. The old draft had a P.S. saying so. The short version dropped it; ask the user whether to keep it.

## 5. Gmail draft status and a hard-won warning
The Gmail connector used so far was attached to **suneja.tushant@gmail.com**, not an alphanodus address. Drafts that exist there:
- Trisha: draft id `r-7495914310051658773`, short v2 text, cup attached (verified in the raw MIME).
- Isaac: draft id `r-7866855572452219705`, short v2 text, cup attached (not verified).
- Everyone else: not created.

The user wants the drafts in the **alphanodus Gmail account**, so delete or ignore those two and recreate there.

**Do not embed image attachments by pasting base64 by hand.** The `create_draft` tool needs the attachment as base64 text in the call. I pasted ~9.5 KB per image by hand; one attempt (Vanessa) failed with "Base64 decoding failed", which means hand-copied data can be silently corrupted, and the two drafts that "worked" were never verified byte for byte. Better options for the next session:
1. Create text-only drafts and attach each `out/small/<firstname>.jpg` by hand in Gmail (15 attachments), or
2. Upload the 15 images somewhere and link them (the email says "Cup attached", so change that line), or
3. Use a tool that can read a local file directly as an attachment, if the new session has one.

Also note: Gmail rewrote a plain "alphanodus.com" in the signature into a long google.com redirect link. Leave the domain out or check how it renders.

## 6. Open questions for the user
1. Which mailbox sends these (alphanodus address)? Is `[BOOKING LINK]` needed at all in v2 (no, per the decision above)?
2. Attach cups by hand, link them, or skip? (Section 5.)
3. Did the courtesy note to Dr. Kedar go out (Tower figures)?
4. Variant for non-operator roles (billing, radiologists, IT)?
5. Keep the "cup is a mockup" P.S.?
6. Groups B and C: send at all? Hunter could not verify them.

## 7. Resources (in `resources/`)
- `AN27_-_Customer_Pitch_Deck_Outline_v2.1.md`: the full pitch, proof points, house rules.
- `AN27_-_Messaging_Package_v1.0.md`: approved copy blocks, including the locked email opener, and objection handling.
- `AN27_-_Positioning_and_Messaging_v1.7.md`: positioning, retired language, competitor (DeepHealth/RadNet).
- `AN27_-_Unit_Economics_Closer_v1.1.md`: the "your exam, itemized" model behind the free audit and its three inputs.
- `AN27_-_SEO_and_Keyword_Map_v0.1.md`: search vocabulary (low relevance for email).
- `gravity_leads_email_accuracy_test.csv`: the 38 leads with Hunter verification status. **Contains personal email addresses**; keep the repo private.
- `../email.md`: v1 (long) email and notes. Superseded by section 2 above.

## 8. Project housekeeping
`CLAUDE.md` in the repo root requires the task-observer skill and its Session Start Protocol before the first tool call, and a one-line observation-log summary after each task. The workspace is `$HOME/.claude/skill-observations`. In this session it was created fresh (empty log, nothing logged).
