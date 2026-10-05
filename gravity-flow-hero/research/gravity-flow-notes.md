# Gravity Flow: research notes and how I would explain it

Sources: the Flow product page, the Developer, Communication and AOS pages, "AOS vs information systems" and the Flow press and learn archive posts (site copy on branch `claude/peaceful-volta-7t5whx`), plus the two product screenshots you shared (Settings > Automations > Flows, and a workflow canvas). Archive posts say names and figures have changed since publication, so I used them for context only, not for claims.

## What Flow is, in one paragraph
Gravity Flow is the engine inside Gravity that does the routine work. Any event in Gravity (an order created, a report signed, an appointment booked, a visit missed) or a schedule can start a workflow. If there is nothing to decide, the workflow follows a rule and finishes on its own (automated). If there is something to decide, an agent reads, decides and acts (agentic). What it cannot finish lands on a worklist in Gravity Work with the history attached. Every run is on record. It is the part of the AOS that makes "an AOS does the work" true.

## The mechanism (what a diagram must be faithful to)
1. **Start:** event or schedule. Also: a message from another system (Gravity Developer: webhooks, HL7, FHIR, REST, GraphQL, MCP) and a new document filed in Gravity Doc.
2. **Guardrails before anything goes out:** contact caps per patient per day and per visit, do-not-contact checked, a patient who replies STOP is never texted again, a message over the limit is declined, not sent late. Business-hour check is a real node in the canvas you shared.
3. **Mode, per workflow:** automated (rule, same result every time) or agentic (reads, decides, acts). "Each workflow carries its own mode."
4. **Trust ramp (AOS vs information systems page):** "Supervised first. Agentic when you're ready." The agent does the work and a person approves it; as a workflow proves itself it moves to agentic and people handle only exceptions.
5. **Exceptions:** go to a worklist in Gravity Work with the history attached. "Your team reviews the work instead of re-keying it."
6. **Record:** every run and every message, fax or report sent is logged with who, when and whether it went through.
7. **Output channels:** Gravity Communication, on the center's own numbers (text, phone, fax, email).

## Three ways a workflow gets there (all on the same engine)
- **Flow Marketplace:** thousands of ready-made workflows, installed in one step, running the same day, each with run history, each customizable to the center. In the product: Settings > Automations > Flows shows Install, Update (version history) and a preview (eye) per flow, with "5 installed" and "5 updates available".
- **Automation rules:** set once. A trigger (any event, or a schedule), conditions on orders or documents, and an action: assign, tag, text, fax or estimate.
- **Custom flows:** the Alpha Nodus team builds and maintains a center's own workflows, automated or agentic.

## What the real canvas shows (your screenshot, worth using as "depth")
A node-based editor: Schedule trigger (can be deactivated), Configuration node with documented parameters (tenant, service category, buffer days, healthcare service tags to include or exclude, appointment status, text-outreach intent name), HTTP and GraphQL calls (tenant timezone, auth token revalidation, fetch the appointment feedback list), code steps (start and end datetime, format list), Filter (non-eligible), Business Hour Check, If, Send (deactivated in the demo), and a loop (Increment Page). Sticky notes document each step. Implication: workflows are inspectable, configurable and documented, not a black box. This is a strong trust signal for the audience.

## Workflows named on the page (17), mode in brackets
Get the order: Referrer outreach campaigns (A), Report back to the referring office (A), Breast tracking and recall (G).
Complete the exam: Order completeness check (A), Clinical clearance (G), Booking outreach (G), Confirmations and reminders (A), Earlier-slot nudges (A), No-show outreach (A), Pre-check-in and document requests (A), Results to the patient (A).
Get paid: Financial clearance (G), Eligibility checks (A), Prior auth status checks (A), Secondary insurance finder (A), Referring provider PECOS check (A), Patient estimates (A).
(A = automated, G = agentic.)

## Numbers allowed in a visual (all on the Flow page)
Thousands of ready-made workflows. About 200,000 workflow runs a month. Same day from install to running. More than 460 imaging centers across the US. Do not add any other number.

## Guardrails from the brand voice
Say "system", "agentic", "get the order", "leaks". Never "platform", "AI-powered", "friction", "cut staff", bots, RPA, "guarantee", "zero", exclamation marks or emoji. We do not read the scan: "We make sure it gets back." Do not name Gravity's agents.

## Questions a buyer is silently asking, and which banner answers them
1. "How do I get these workflows without a project?" -> Banner 1, one engine, three ways.
2. "What happens to my people, and can I trust it?" -> Banner 2, supervised first, agentic when ready.
3. "Where does this actually help me?" -> Banner 3, every pillar, referral to payment.

## What I am least sure about (please correct me)
- Whether "supervised mode" is a product setting today, or positioning from the AOS page. I show it as the trust ramp described on that page.
- Whether the Marketplace screen's "updates available" should be shown in public art (I think it is a good proof of maintenance).
- Whether the banner may carry a short headline and labels, given the placeholder says no text in the image.
- The exact meaning of "business hour check" and "contact caps" in product terms. I show them as guardrails exactly as the page words them.
