---
title: AN27 — Positioning and Messaging
type: canonical
scope: AN27
status: current
doc_role: current-state
version: "1.7"
created: 2026-08-09
updated: 2026-09-23
tags:
  - an27
  - positioning
  - messaging
  - canonical
---

# AN27 — Positioning and Messaging

> [!important] This note is the **current state**, not a log.
> It is **replaced in place** every time positioning changes. It should always read as though it were written today, with no history, no "we used to think," and no alternatives under consideration. Everything that explains *why* this is what it is lives in [[AN27 — History and Research]], which is append-only.
>
> Ready-to-use copy lives in [[AN27 — Messaging Package]]. If you are looking for a decision's reasoning, you are in the wrong note.

**Version 1.7 · 23 September 2026 · Owner: Shamit Patel · Target: RSNA 2026**

---

## 1. The category

**AOS: the Agentic Operations System.**

Gravity is the Agentic Operations System (AOS) for your CRM, RIS and RCM. It gets the order, completes the exam and gets it paid, so no referral, no order and no revenue leaks away.

> A CRM is a system of relationships. A RIS is a system of orders. An RCM is a system of claims. An **AOS is a system of work.**
> A relationship records who sends. An order records what should happen. A claim records what did. An **AOS makes it happen.**

The full definitional treatment lives at [[AOS — Definitional Page (publish-ready)]] and publishes to `alphanodus.com/aos`.

## 2. The core argument

**Every order has three chances to be lost: before it arrives, before it is scanned, and before it is paid.**

| Leak | What it looks like | Closed by |
|---|---|---|
| **Referral leakage** | The referrer sends the order to another center, or the fax is never worked. | Get the order |
| **Order leakage** | The order sits unscheduled, the patient never books, the slot goes empty. | Complete the exam |
| **Revenue leakage** | A missing authorization, the wrong insurance, a denial weeks after the exam. | Get paid |

Today each leak belongs to a different system, a different team and a different blind spot. The CRM, if there is one, sees referrals. The RIS sees schedules. The RCM sees claims. Nobody sees an order from the referral to the payment, so nobody sees where it was lost. Staff spend their days patching the gaps by hand.

**Gravity closes all three leaks because it is one system.** A problem found at one point is fixed at another, before it becomes a loss.

**An order is a loop, not a line.** It starts with a referral and it is finished when the signed report and the images are back with the referring provider, because that is the moment the referrer decides where the next order goes. Gravity does not read the scan, write the report or store the images. It delivers them, the minute they are signed, to the office that sent the order. Repeat business is the referral leak closing from the other end.

**The same is true of the IT stack.** Underneath the three systems sit a phone system, a fax server, a texting vendor, an interface engine, on-premise servers and a fleet of Windows workstations. **Every system you add is another place for work to leak**, and another vendor to manage and door to secure.

**The promise:** no referral leaks, no order leaks, no revenue leaks. It is the standard Gravity is built to, used as a headline. In body copy and anything with a number, say what Gravity stops or closes, and how much. Never "guarantee," never "zero."

Leakage is the enemy. It is a condition, never a company, and never the buyer's staff, who are the people holding the leaks shut today.

This is the load-bearing idea. Every asset should be traceable to it.

## 3. The spine: three acts, one system, one set of data

### The three acts

**Three systems, one system.** Gravity does the work of the CRM, the RIS and the RCM an imaging center would otherwise buy separately.

| Act | Verb | Closes | Functionally replaces | Accountable for | Internal persona |
|---|---|---|---|---|---|
| Demand | **Get the order.** | Referral leakage | CRM | The referring community's experience of the center, end to end. Every referral captured, none sitting behind a fax. The office's call always answered. The order's progress reported to the office in real time as it moves. The report and the images delivered back the moment the read is signed, viewable in the portal. Gravity's agents act as the center's liaison to every referring office, doing the clerical half of the physician liaison's job so the marketer's time goes to the relationship. The promise: capture every referral by giving the referring community better service than anyone else does. Surfaces: the Gravity CRM, the referring physician portal, outreach by fax, phone and text, report and image delivery. | Sasha |
| Throughput | **Complete the exam.** | Order leakage | RIS | Every order received is consumed and digitized, nothing dropped. Every order becomes a completed exam: scheduled, confirmed, the patient checked in without paper (identity, history for the technologist, consents), performed, and the signed report acquired into Gravity. Every exam is completed in a way that gets paid. | Sandra |
| Money | **Get paid.** | Revenue leakage | RCM | Eligibility, benefits, estimates, prior authorization approved before arrival, payment collected at check-in, charges created from the signed report, claim submission, remittance, statements, closing, bookkeeping. Money collected on every completed order. | Susan |

**Naming rule. The personas are internal.** Sasha, Sandra and Susan are shorthand inside the company for the three accountabilities: product, engineering, customer success planning, internal training. They never appear in customer-facing material, including the website, deck, demo narration, booth, press, partner material and support macros. Publicly, Gravity is the subject of every sentence and the work is described by its three verbs. When agents need naming, say "Gravity's agents." If an existing customer uses the persona names, don't correct them; just don't introduce them to anyone new. The one exception is the voice agent's spoken name in the product, "Sandra" (§9, decision 20).

**Leakage is prevented at the source.** Completing every exam in a way that gets paid means coverage and authorization problems are fixed before the exam, not discovered after the claim. Use this in the demo to show the acts working as one system.

**Where the report belongs.** Throughput owns the exam until the signed report lands in Gravity. Demand owns getting it back to the referring provider, because the referrer's experience of the center is the demand act's accountability and the report is the finished product they judge it by. In the demo this is one moment: the report lands, and it is already at the referring office.

### What the three acts run on

The three acts are what Gravity does. Two foundations make that possible, and they are what an IT leader, a security reviewer and a COO each need to hear.

**Foundation 1: One system.**
- **Communications built in.** Two-way phone, fax and text messaging are part of Gravity, not integrations to it. Gravity uses them directly with referrers, patients and payers, on embedded carriers. Two-way text replies and the in-app dialer come with the contact-center option.
- **Cloud, nothing to install.** No servers on site, no interface engine to maintain, no workstation images to manage.
- **Any device.** Runs in the browser on any computer; patient check-in runs on an iPad kiosk. The device decision becomes a cost decision, not a compatibility one.
- **Fewer things to manage, and fewer to secure.** Fewer vendors, fewer interfaces, fewer places patient data sits, one access model, one audit trail. Public security statements, and only these: hosted on AWS in US regions only; a HIPAA Business Associate Agreement with every customer; independently penetration-tested, most recently September 2026; AES-256 encryption at rest with per-tenant keys; MFA on all production access, SSO and admin-enforced MFA on Enterprise; continuous control monitoring with a public Trust Center. Never "more secure," "SOC 2 certified," "SOC 2 in progress," "HIPAA certified," ISO or HITRUST.

**Foundation 2: One set of data.**
- Three systems each see a third of the journey. Gravity sees all of it, from referral to payment, in one data model. That is what makes leakage visible.
- Insights that cross the acts: which referrers' orders get denied, which order types wait longest to schedule, revenue per referrer net of denials, where open capacity sits against unscheduled demand.
- Intelligence is judged by the leakage it stops, not by the dashboards it produces. `OPEN` whether insights trigger agent action or report to staff (§9, decision 16).

**Rules for the foundations.**
- They are never a fourth act. The spine stays three.
- They lead only for an IT or security audience. For the CEO, COO and CFO they follow the three acts.
- On their own they are not a differentiator (see §7).

## 4. Approved language

### Category line
**Gravity: the Agentic Operations System (AOS) for imaging.**

### Payoff lines by slot

| Slot | Line |
|---|---|
| Booth, three verbs | "Get the order. Complete the exam. Get paid." |
| Narrative / deck opener | "Imaging centers don't lose money in the scanner. They lose it between the referral and the payment." |
| Demand line | "We don't just run your orders. We go get them." |
| Provocation / keynote / paid | "Your staff will never log into your RIS again." |
| Competitive (on request) | "Their platform helps your staff work faster. An AOS means you need less staff." |
| Category, five seconds | "RIS records the work. AOS does the work." |
| The loop | "Every referral captured. Every report returned." |
| The disclaimer, whenever the loop is mentioned | "We don't read the scan. We make sure it gets back." |
| The finished order | "That's the order finished. That's how the next order arrives." |

The master message, promise line, descriptor and hero in [[AN27 — Messaging Package]] are approved (§9, decision 18). The booth wall is still open (§9, decision 10).

### Word-level standards

- **"Leakage" is the enemy word.** Always one of the three named leaks. "Leaks" as a verb, "leakage" as a noun. Use "dropped orders" as the plain description of order leakage in conversation. Orders leak; staff never do.
- **"Stops" and "closes" in body copy; "no leaks" in headlines.** Never "guarantee," never "zero."
- **Gravity is the subject.** No persona names in customer-facing copy.
- **"System," never "platform."** "System" occupies the same grammatical slot as the RIS and the RCM.
- **"Imaging," not "radiology,"** in all buyer-facing copy. *Exception:* RSNA floor and trade press. Decide per asset.
- **"Agentic Operations System (AOS)"** spelled out on first use in every asset, for at least the next year. "Agentic OS" is acceptable in speech, not in buyer copy.
- **"For your CRM, RIS and RCM"** is deliberately channel-safe. The replacement claim lives in the on-ramp, not the descriptor.
- **"Agentic," not "AI-powered."** For analytics, say "intelligence" or "insights."
- **"Built in," not "integrated,"** for phone, fax and text.
- **"Order" is the object; "referral" is the act and the relationship.** The referring provider *refers*; what arrives is an *order*. So: referring provider, referring community, referral leakage, "from the referral to the payment" (the origin event). And: get the order, order leakage, "every order can be lost three times," "one order followed through" (the thing the center schedules, performs, delivers and bills). Never "get the referral": the center's job is not to be referred to but to receive an order it can act on. The first leak is called *referral* leakage, not order leakage, because the loss happens in the referrer's decision before an order exists, and because "referral leakage" is the term the industry already uses and searches for. Decided 23 September 2026 (decision 25).
- **The report is part of the order.** Say "we deliver the report and the images to the referring provider." Never say or imply that Gravity reads, dictates, produces or stores them. The disclaimer travels with the claim.
- **Search words live in the metadata; brand words live in the headline.** Title tags, meta descriptions, one H2 and the FAQ on each page carry the words buyers search: "radiology," "software," "AI agents," "analytics" and "KPIs," "referral management," "patient scheduling," "prior authorization automation." Headlines, hero copy and body keep the house words: imaging, system, agentic, insights, leaks. "Platform" and "AI-powered" appear nowhere, including metadata. The title-tag use of "radiology" is the RSNA exception extended to search. See [[AN27 — SEO and Keyword Map]]. Decided 23 September 2026 (decision 27).

## 5. Retired language: do not use

| Retired | Why |
|---|---|
| Sasha, Sandra, Susan in customer-facing material | Three unfamiliar names are hard to introduce and teach a stranger nothing. Internal only. |
| "The seam," "the seams," "there was never supposed to be a seam" | A metaphor that needs explaining, built on a two-system picture. Replaced by leakage. |
| "They lose it in the seams" | Replaced by "They lose it between the referral and the payment." |
| "Your RIS books it. Your RCM bills it. Gravity runs everything in between." | Two-system picture with no demand act. |
| "The front office of healthcare" | Inherently a partial claim. |
| "Front office / back office" as a framing | Ambiguous inside the company. Retire, don't redefine. |
| "We will not replace the RIS or RCM; we integrate" | Deliberately reversed. See §6. |
| "Operations platform" / "imaging operations platform" | A competitor published this phrasing first. |
| "Autonomous AI front office" | Superseded by the AOS category line. |
| "Everything between the order and the payment" | Understates the span. Gravity starts before the order. |
| Task-level agent descriptions ("document processing," "call center AI") | Cap the product. Describe accountabilities. |
| "We have no competitors" | Was already prohibited; still is. |
| "AI Workforce" / "Document Center with AI Workforce" | Rejected in August: a workforce cannot replace a system. |
| "Sidekicks to human counterparts" | Describes assisted software. Gravity does the work; people handle exceptions. |
| "Launch RPA bots" | The AOS page states an AOS is not RPA. Say agents work the portal. |
| "Gravity Platform" | "System," never "platform." |
| "Discover Gravity" / "Automate • Accelerate • Amplify" as the lead | Says nothing about what Gravity does. The three verbs do. |
| "Minimize your Total Cost of Operations" as a headline | Cost is one outcome; leakage is the argument. |
| "Think of us as a staffing company" / "synthetic workforce" (live pitch line) | Workforce framing. A workforce cannot replace a system; Gravity is a system. Retired from live pitches 22 September 2026. |
| "A virtual office with unlimited desks," "you need a body in the chair" (live pitch line) | Workforce framing, and the on-ramp to introducing the personas by name. Retired 22 September 2026. |
| The fast-food / restaurant analogy in customer-facing pitches | Internal training only, decided 22 September 2026. Never used in a recorded customer pitch; teaches the retired front-office/back-office split. The customer pitch carries two spoken images: the empty seat at takeoff and the automation highway with exit ramps. |
| "Automate, accelerate and amplify your cash flow" as a pitch opener | The three verbs say what Gravity does; the mission carries automate and accelerate. |

## 6. Position on replacement

**One claim, one on-ramp; never two paths.**

> "Gravity can replace your RIS and your RCM. Until you're ready, it runs on top of them."

Coexistence is a **stage**, not an alternative.

### The channel-safe formulation (preferred in all public assets)

**Displace the interface, not the infrastructure.** Staff stop logging into the RIS. It becomes a store of record that Gravity writes to.

> "Your staff will never log into your RIS again."

The blunt "replace your RIS" wording is reserved for direct conversations with no channel-partner involvement.

> [!warning] Unresolved
> RamSoft must be briefed **before** RSNA. The brief covers the full three-system claim (CRM, RIS and RCM combined). See §9.

## 7. Competitive position

**Primary named competitor: DeepHealth (RadNet), "Operations Suite™."**

DeepHealth describes Operations Suite as "an imaging operations platform that unifies scheduling, registration, billing, analytics and patient communication into a seamless, AI-powered platform." It bundles eRAD RIS.

**Our differentiation, in order of strength:**

1. **Agentic vs AI-powered.** They consolidate modules so staff navigate fewer screens. We complete transactions so fewer staff are needed.
2. **Demand.** They address order and revenue leakage. Gravity also closes referral leakage, before the order exists. Their scope as stated in RadNet's own release (20 November 2025); state it as scope, never weakness.
3. **Ownership.** Raise as a governance question, never an attack, via AOS page question 8.
4. **Category.** They are a suite inside the existing category. We are proposing a new one, with published tests.

**Where we do not differentiate on our own:** unification, analytics and patient communication. DeepHealth claims all three. The foundations differentiate only through span (data from the referral, not from scheduling) and through action (insight the agents act on).

**Not competitors:** RamSoft, Infinitt, and the RIS/PACS channel.

**Search competitors (who buyers find when they search for what we do):** AbbaDox ("AI workflows purpose-built for outpatient radiology," automated fax intake, referring physician marketing), Infinx (radiology prior authorization and RCM), Luma and Notable (operational AI and AI agents at health systems), Assort Health and Vocca (radiology voice agents), Phreesia and Clearwave (check-in), Intelerad and PocketHealth (referring physician portals and image sharing). None spans the loop. See [[AN27 — SEO and Keyword Map]].

## 8. Category seeding plan

1. **Publish `alphanodus.com/aos` before RSNA.** Neutral analyst register, ungated.
2. **Booth wall pattern.** See §9, decision 10.
3. **Acronym discipline.** Words and acronym together, every asset, one year.
4. **Get someone who isn't us to say it.** Brief RamSoft and the trade press explicitly.
5. **Expect competitors to adopt it.** That is the win condition.

**Second layer: RadOps.** AOS names the system you buy; RadOps names the discipline you practise.

## 9. Open decisions

| # | Decision | Status |
|---|---|---|
| 1 | Brief RamSoft before RSNA, including the CRM + RIS + RCM claim | **Open; highest priority** |
| 2 | Trademark clearance on AOS and RadOps before signage and domains | Open |
| 3 | Is the RadNet-ownership wedge explicit in sales enablement, or left to the checklist? | Open |
| 4 | Does the booth say "imaging" or "radiology"? | Open; split permitted, must be written down |
| 5 | Name the villain | **Closed: leakage.** See §2. |
| 6 | Re-train sales, CS and support on the replacement reversal, the leakage argument and the internal-only personas | Not started |
| 7 | Do the new logo and palette express "system" rather than "platform"? | Not started |
| 8 | Span wording: "From the referral to the payment," or another formulation | Open; direction approved, words not locked |
| 9 | Does the AOS category definition widen to include demand? | **Closed 23 September 2026: yes.** An AOS begins before the order exists, in the referring office; its agents act as the imaging center's liaison to the referring community. [[AOS — Definitional Page (publish-ready)]] v1.1 carries it. |
| 10 | Booth wall. Recommended in the Messaging Package: "CRM. RIS. RCM. AOS." | Open; recommendation pending approval |
| 11 | What Gravity completes end to end without a human in the get-the-order act | **Closed:** Gravity reads the fax, classifies it, finds or creates the patient and creates the order; a person sees it only when patient, provider or exam does not match. |
| 12 | Which act is accountable for pre-service eligibility and prior authorization | **Closed: get paid.** The revenue cycle covers pre-service and post-service. Complete the exam ensures those checks are done before the exam; get paid performs them. |
| 13 | Approve foundation lines, starting with "Every system you add is another place for work to leak." | **Closed: approved.** |
| 14 | Security proof: which certifications, controls and audit evidence we can state publicly | **Closed:** the statements in Foundation 1, and only those. No SOC 2 audit exists; "more secure" is not claimed. |
| 15 | Confirm shipped scope of built-in phone, fax and two-way text, and the supported-device list | **Closed:** as written in Foundation 1. |
| 16 | Do insights trigger agent action, or report to staff? | Open |
| 17 | Add IT director / security reviewer to the buyer audience as the named blocker | Open; drafted in the Messaging Package |
| 18 | Approve the master message, promise line and website hero in the Messaging Package | **Closed: approved.** "No referral leaks. No order leaks. No revenue leaks." and the AOS descriptor are locked. |
| 19 | Do the three acts need public product names, and how do they relate to the existing Document, Booking, Revenue and Flow Centers? | Open |
| 20 | Persona names in the product UI and customer-facing surfaces, including the voice agent that introduces itself as "Sandra" | **Closed:** "Sandra" stays as the voice agent's spoken name in the product. Slides, presenters, marketing and the website never introduce personas by name. |
| 21 | Mission wording | **Closed: "Automate and accelerate every patient journey."** "Empower teams to accelerate every patient journey" (2025 deck) retired. |
| 22 | Confirm values: Hunger, Innovation, Customer Success (2025 deck) | **Closed:** confirmed, with meanings. Hunger: we do the job before we automate it, and we are never done. Innovation: we build what the work needs, not what the market already sells. Customer Success: every employee owns the customer's outcome. |
| 23 | The fast-food analogy in customer pitches | **Closed 22 September 2026: internal training only.** Not used in customer-facing pitches. |
| 24 | First-meeting pitch story: three jobs, three leaks, one system, explanation ladder, founder cold open, buyer plays the demo patient | **Closed 22 September 2026: approved.** See [[AN27 — Winning Story and Pitch Narrative]] v1.1 and [[AN27 — Customer Pitch Deck Outline]] v2.1. |
| 25 | "Get the order" or "get the referral" as the first verb | **Closed 23 September 2026: "get the order."** Reasoning in §4, word-level standards. |
| 26 | Where report and image delivery to the referring provider belongs, and whether slide 4 says it | **Closed 23 September 2026:** it belongs to the demand act ("get the order") as the close of the loop; throughput owns the exam until the signed report lands. Slide 4 carries one sentence with the disclaimer; the demo (slide 17) carries the rest. The spine stays three verbs. |
| 27 | Search vocabulary versus house language | **Closed 23 September 2026:** brand words in headlines and body, search words in title tags, metas, one H2 and FAQs; "platform" and "AI-powered" nowhere. See §4 and [[AN27 — SEO and Keyword Map]]. |

## 10. Downstream assets to update

- Every customer-facing asset carrying Sasha, Sandra or Susan: demo script, sales deck, website, support macros, partner material (the voice agent's spoken name in the product is the one exception, decision 20)
- Company brand platform instance (project file): A2, A3, A4, B3, tagline candidate C, D1 voice examples, E1 agent names now internal, B2 IT audience row
- Website (all pages), including the hero: rebuild titles, metas and page architecture per [[AN27 — SEO and Keyword Map]]; the live home page still says "platform," "analytics" and "AI-first"
- AOS definitional page v1.1: demand in the definition, the referring-office liaison, the report loop, "seam" removed, nine evaluation questions
- `gravity-101` skill: positioning, "what NOT to say," integration, glossary, agent definitions, and the internal-only naming rule
- Demo script: three acts and three leaks, no persona names, then the foundations shown live
- Sales deck: see [[AN27 — Customer Pitch Deck Outline]]
- IT and security one-pager for the technical reviewer
- `alpha-nodus:brand-guidelines` and Gravity Design System, after palette lands
- Implementation Framework collateral
- Freshdesk KB and support macros
- Partner-facing materials (RamSoft, Infinitt), sequenced after decision 1
- Trust Center at security.alphanodus.com: remove the unsupported "SOC 2 Type I" badge; correct the PII field and subprocessor list

---

**Related:** [[AN27 — History and Research]] · [[AN27 — Messaging Package]] · [[AN27 — Customer Pitch Deck Outline]] · [[AOS — Definitional Page (publish-ready)]] · [[Knowledge Base Rules]] · [[Gravity]] · [[Go-to-Market Philosophy]] · [[Brand Guidelines]] · [[AN27 — Open Items Register]] · [[AN27 — SEO and Keyword Map]]
