# Gravity & the Imaging Workflow, Start to Finish

**What this is:** one patient's scan followed from the first fax to the final payment. Every step explains what happens, who does it, what Gravity does, and which words people use for it. The terms are defined where they first appear. A full A–Z glossary is in Part 6.

**Sources:**
- 🟦 **Guide** = your domain mastery guide.
- 🟧 **Screenshot** = the Service and Diagnosis card you shared.
- 🟨 **General industry knowledge** = standard healthcare practice that the guide doesn't state. These items are marked, so you know which ones to confirm with the team.

**Freshness caveat (from the guide):** Gravity-specific mechanics come from internal documentation last modified 14 May 2026. Confirm anything you plan to publish with engineering.

---

## Part 1. The big picture (read this first)

### 1.1 The one-sentence idea
An imaging center (MRI, CT, mammography and so on) loses money because **the scanner sits idle about 35% of the time while patients wait 2–4 weeks**. The delay comes from the **front-office work before the scan**: reading faxes, phoning patients, checking insurance, getting insurer approval. **Gravity replaces that human front-office labor with AI workers.**

### 1.2 Key numbers to remember
| Fact | Number |
|---|---|
| Real utilization of imaging centers (measured by Alpha Nodus's sensors in 2018–19) | **60–65%** |
| What they assumed (semiconductor fab efficiency) | 95–99% |
| Hotels/airlines | ~85% |
| Patient wait time at those same centers | 2–4 weeks |
| Fixed costs of a center | ~70% (rent, scanner lease, salaries) |
| Variable costs | ~30% |
| Effect of going from 65% to 70% utilization | ~+5% revenue vs ~+1.5% cost, so almost all of it is margin |
| Handwritten orders | ~30% of orders |
| Manual prior auth cost (CAQH Index) | $12.88 and 24 min |
| Electronic prior auth cost | $5.38 |
| Physician/staff time on prior auth (AMA 2025) | 13 hrs/week |
| Practices with a dedicated prior-auth employee | 40% |
| Denials from missing/inaccurate data (Experian Health) | 50% |
| Denials from incomplete/inaccurate registration | 32% |
| CMS estimated savings from CMS-0057-F | ~$15B over 10 years |

### 1.3 The mental model: Uber, not a software upgrade
**Uber** owns order-taking, routing and payment. The restaurant only cooks. **Gravity** owns document intake, scheduling, eligibility, prior authorization and payment prep. The imaging center only scans.

Alpha Nodus calls this category an **AOS (Agentic Operations System)**. Their line: *"A RIS is a system of orders. An RCM is a system of claims. An AOS is a system of work."*

### 1.4 What Gravity never does
- It never stores or reads images (that's PACS and the radiologists).
- It never replaces the RIS or the EMR.
- It never does post-service claims submission or collections (that's RCM territory; Gravity integrates with RCM systems).

### 1.5 The four "Centers" (the main sections of the Gravity app)
| Center | Job | Where it sits in the journey |
|---|---|---|
| **Document Center** | Reads faxes and referrals and turns them into structured orders | Step 1–3 |
| **Booking Center** | AI voice, SMS and chat scheduling (the voice agent is called **Sandra**) | Step 8–9 |
| **Revenue Center** | Eligibility, benefits, prior auth, patient estimate (the prior-auth agent is **Susan**, inside **GravityAuth**) | Step 4–7 |
| **Flow Center** | Recalls and referring-physician outreach | Step 14 and ongoing |

### 1.6 The three operating modes
1. **Manual.** A human does everything. This is the starting state at about 95%+ of centers.
2. **Sidekick / assistive.** The AI does the work and a human reviews it before it ships. One scheduler goes from about 10 orders/hour to about 50/hour (5x). Almost every customer starts here.
3. **Fully agentic / autonomous.** The AI handles 80–95% of volume and humans handle only exceptions. A 50-person scheduling team becomes about 10 people, paid more, handling the hardest 5–20% of cases. The honest framing is "one person operating AI does the work of five."

---

## Part 2. Decoding your screenshot (a real order card)

🟧 This is a Gravity order page. The card is titled **"Service and Diagnosis."** Here is every element.

### 2.1 The left block: what was ordered
| Field | Value | Meaning |
|---|---|---|
| **Service** | `77067 MA SCREENING BILATERAL TOMO W/CAD` | **77067** is the **CPT** code, the procedure code. "MA" is likely the center's modality/department abbreviation for mammography, but this is an assumption. It is a **screening mammogram, both breasts, using tomosynthesis (3D mammography, "tomo") with CAD (Computer-Aided Detection software)**. |
| **Service Category** | `MG` | Mammography, the imaging category. (Likely short for "mammogram", which is an inference.) |
| **Diagnosis** | `Z12.31` | The **ICD-10** code, the "why." Z12.31 is the code for a routine screening mammogram, meaning no symptoms and routine cancer screening. 🟨 |
| **Location** | River City Imaging Center Oak Sprawl | The **Facility/Location** where the scan will happen. |
| **Date / Time** | Oct 08, 2026, 8:00 am | The appointment **Slot**. It is the same as today, so this patient has just arrived. |
| **Priority** | Routine | Not **STAT** (urgent/immediate). Routine means normal scheduling. |
| `RCI883325` | italic ID | An order or accession-style reference number. The guide doesn't define it, so **ask your team what it is**. |

**Why this combination matters.** CPT (what) plus ICD-10 (why) is the pair the insurer uses to judge **medical necessity**. Screening mammograms are generally covered preventive care. 🟨 That is why the **Estimate shows $0** and **Authorized is skipped** in the timeline.

### 2.2 The top right
- **Study Status: Tech Start.** The scan itself is underway. The technologist has started the exam. 🟨 Not in the guide, so confirm the full status list with the team.
- **"…" menu.** Row-level actions (🟨 assumption).
- The **tag icon** is a label/flag for the order (🟨 assumption).

### 2.3 The timeline across the middle (the order's lifecycle)
| Stage | In your screenshot | Meaning |
|---|---|---|
| **Created** | 17 days ago, by a staff member | The **Order** record was made. (Either a human keyed it, or Auto Order Creation did.) |
| **Booked** | 16 days ago, by **System** | An **Appointment/Booking** was set on a **Resource** (a room/scanner). "by System" means automation, likely Sandra or an integration. 🟨 inferred |
| **Estimate** | **$0**, 3 days ago, by a staff member | The **patient cost estimate** (Good Faith Estimate). The patient owes $0. |
| **Authorized** | (grey, empty) | **Prior authorization**. It is greyed out because it wasn't needed or wasn't done. A screening mammogram usually has no PA requirement. 🟨 |
| **Checked In** | 3 minutes ago, by System | The patient arrived and was checked in (🟨 likely via kiosk or integration). |
| **Complet…** | (cut off, grey) | The study is **Complete**, with more stages to the right that are cropped off. |

The stages do not have to be strictly sequential (Estimate came *after* Booked, and Authorized was skipped).

### 2.4 The tabs at the bottom (where each workflow lives)
**Booking · Estimate · Prior Authorization · Documents · Check-In · Reports · Charges · Timeline**

- **Booking:** appointment details and screening answers.
- **Estimate:** the patient's cost calculation.
- **Prior Authorization:** the PA submission and result.
- **Documents:** the original referral/fax and attachments.
- **Check-In:** arrival and registration.
- **Reports:** the radiologist's result.
- **Charges:** what gets billed after service. 🟨
- **Timeline:** the full audit log of every action.
- **Comment:** staff notes.

---

## Part 3. The full journey: every step from start to finish

**Overview diagram**

```
Patient has a problem or routine need
        │
  [1] Referring doctor writes ORDER (fax / e-referral / handwritten)
        │
  [2] DOCUMENT arrives at the imaging center  ─── Gravity: Document Center
        │
  [3] Extract data → match patient → create ORDER   ─── Auto Order Creation
        │
  [4] Match to HEALTHCARE SERVICE (Compendium)
        │
  [5] ELIGIBILITY check (is insurance active?)   ─── Revenue Center
        │
  [6] BENEFITS check (what does it pay?)
        │
  [7] AUTH RULE → PRIOR AUTH needed?  ──yes──► GravityAuth / Susan submits to payer or RBM
        │ no                                          │ approved / denied / P2P
        ▼◄───────────────────────────────────────────┘
  [8] ESTIMATE to patient (No Surprises Act)
        │
  [9] BOOKING (screening questions, slot)   ─── Booking Center / Sandra
        │
 [10] Pre-visit reminders
        │
 [11] CHECK-IN
        │
 [12] SCAN (technologist) — Study Status: Tech Start → … → Complete
        │
 [13] REPORT by radiologist (PACS)  → ORU message back
        │
 [14] CLAIM → payer → ADJUDICATION → paid / DENIAL → appeal / write-off  (RCM)
        │
 [15] RECALL & referrer engagement   ─── Flow Center
```

---

### STEP 0: Who is involved? (cast of characters)
| Role | What they do | Selling note |
|---|---|---|
| **Patient** | Needs the scan | |
| **PCP (primary care physician)** | Writes most referrals | |
| **Specialist** | Cardiologist, orthopedist and others also refer | |
| **Referring / ordering provider** | The doctor who sent the patient. Imaging centers don't create their own demand, referring doctors do. | Key to Flow Center |
| **Radiologist** | Reads the images (usually remote, often at multiple centers) | **Not your buyer** |
| **Technologist / tech / rad tech** | Operates the scanner | |
| **Sonographer** | Ultrasound tech | |
| **Scheduler** | Books appointments | |
| **PA specialist / VOB specialist** | Gets prior auths and verifies insurance | |
| **Practice administrator / manager** | **Typical buyer** | |
| **COO / Director of Operations** | Strong internal champion | |
| **RCM Director / Billing Manager** | Owns denials, days in A/R, PA cycle time | |
| **IT / IS Director** | Integration, security and uptime gatekeeper | |
| **Payer / payor** | The insurance company (both spellings are used, so pick one per document) | |
| **RBM** | A company the insurer delegates imaging approvals to (eviCore, Carelon, and others) | **Never a competitor** |

---

### STEP 1: The referring doctor creates the order

**What happens.** The patient sees a doctor. The doctor decides imaging is needed and writes an **Order** (also called a **script** or **referral**). It contains:
- the patient's identity
- the exam wanted
- the diagnosis (ICD-10)
- priority
- insurance information
- clinical notes

**How it arrives:**
- **Fax** (still very common; HIPAA explicitly authorizes fax)
- e-referral from an **EMR/EHR**
- phone call
- handwritten script (**~30% of orders are handwritten**)

**Terms**
- **Order / script / referral:** the request for a clinical service. In Gravity, **Order is the single most important record.** Scheduling, clinical work and every financial step hang off it.
- **Progress notes:** the referring doctor's documentation. They can run 20+ pages.
- **Clinical notes / "clinicals":** progress notes used to prove medical necessity. Chasing these from doctors is one of the most painful parts of the job. Gravity automates the fax request.
- **EMR / EHR:** the doctor's electronic chart system (Epic, Cerner, athenahealth, ModMed). Gravity is not one of these.
- **PHI (Protected Health Information):** any patient-identifying health data. It must never go in an ad platform, pixel, spreadsheet or prompt.

---

### STEP 2: The document hits the imaging center (Document Center)

**The manual way.** A staff member reads the fax, works out what it is, finds or creates the patient in the **RIS**, and types everything in. This takes hours a day.

**The problem.** Conventional **OCR** (Optical Character Recognition) returns raw text and fails on handwriting. The common objection is "we already have OCR." Gravity's answer: OCR gives raw text, not structured fields attached to the right patient.

**What Gravity's Document Center does:**
1. **Classifies** the incoming document (referral? clinical note? something else?).
2. **Extracts structured fields:**
   - patient name
   - DOB
   - referring physician
   - **CPT** (what procedure)
   - **ICD-10** (why)
   - payer
   - subscriber ID

   It uses computer vision, OCR and an **LLM** (large language model) on both printed and handwritten content.
3. **Matches** the document to the right patient chart, or creates a new one.
4. **Learns** from every human correction.

**Terms**
- **RIS (Radiology Information System):** the day-to-day operating system of an imaging center. It covers scheduling, worklists, reporting and billing hooks. **Gravity sits on top of it and never replaces it.**
- **Worklist:** a filtered list of orders a user works through. Filters saved in Gravity can be selected inside the GravityAuth extension.
- **Snooze:** hide an order, account or document from a worklist until a chosen date.

---

### STEP 3: Order creation (Auto Order Creation)

**What happens.** **Auto Order Creation** builds a live Order automatically, but only if it can confidently resolve **all three** of:
1. the **patient**
2. the **referring provider**
3. the **exam**

If any one is uncertain, it **routes to a human** instead of creating a wrong or partial order.

**Related settings and modes**
- **Auto Patient Creation:** a separate, pairable setting. If the patient doesn't exist and this is on, Gravity creates them. If it is off, the case goes to a human.
- **Draft order workflow:** the lower-risk starting mode. A human validates Gravity's patient, provider and service picks before an order is created. **It is the recommended first step before turning on Auto Order Creation.**
- **Activation:** converts a newly auto-created "shell" record into a usable one. Identifiers are confirmed and mappings applied.

**The data chain behind an order (all Gravity "Record Types")**
```
Patient → Referring provider → Order → Healthcare Service (from Compendium)
→ Coverage → Eligibility & Benefits → Auth Rule → Prior Authorization
→ Appointment/Booking (on a Resource) → Report/Result → Claim → Paid or Denial
```

**Record Types (full list):** Patient · Order · Booking/Appointment · Report/Result · Providers · Facilities · Location · Healthcare Services · Resources · Insurance · Patient Insurance Coverage · Estimates · Prior Authorization · Availability · Fee Schedule.

---

### STEP 4: Match the exam to the center's catalogue

- **Healthcare Service:** Gravity's record for a bookable/orderable exam (e.g., "MRI Brain with and without contrast"). In your screenshot it is "77067 MA SCREENING BILATERAL TOMO W/CAD."
- **Compendium:** the center's full catalogue of Healthcare Services. Auto Order Creation matches the incoming exam description against it. **Keeping it clean, with no near-duplicate names, is what makes matching work.**
- **CPT (Current Procedural Terminology):** the procedure code, owned by the AMA.
  - 70553 = MRI brain with and without contrast
  - 74177 = CT abdomen/pelvis with contrast
  - 77067 = screening mammogram (your screenshot)
- **HCPCS:** extends CPT to drugs, supplies and non-physician services.
- **Modifier:** a two-character code that adjusts a CPT (e.g., -26 professional read vs. -TC technical component). **A wrong modifier means a denied claim.**
- **ICD-10:** the diagnosis code (why the service was done).
- **Protocol:** the specific scan sequence (e.g., "brain MRI with contrast").
- **Modality:** the broad imaging type. See Part 6.

---

### STEP 5: Verify eligibility (Revenue Center), "Is the insurance active?"

**What happens.** Before anything financial, the center checks that the patient's policy is active right now. Mechanically it is like a credit-card authorization check.

**Terms**
- **Eligibility / VOB (Verification of Benefits):** checking that insurance is active and what it covers. **Step one of everything financial.**
- **Coverage:** *this patient's* specific policy (subscriber ID, group, effective dates). It is **not** the same as **Insurance**, which is the payer/plan directory.
- **Subscriber:** the person who holds the policy (often but not always the patient, e.g., a child on a parent's plan).
- **Subscriber ID / Member ID:** the number on the insurance card.
- **Subscriber prefix:** the first three characters of the ID. It often encodes the plan variant and is used for auth-rule matching.
- **Group number / name:** the employer plan the coverage came from.
- **COB (Coordination of Benefits):** the rules for which insurer pays first when a patient has more than one. Gravity labels them **P** (primary), **S** (secondary), **T** (tertiary).
- **270/271:** the EDI pair for eligibility. **270 = the question** ("is this patient covered?"), **271 = the answer.**
- **EDI (Electronic Data Interchange):** the older standardized format for insurance transactions.
- **Clearinghouse:** a middleman that routes claims and eligibility requests between providers and hundreds of payers. **Availity** is the one Gravity uses.
- **EDI mapping:** the Availity payer ID that routes a request to a specific insurer. Without it, coverage shows **"Payor Not Activated"** and checks can't run.
- **Sync Lock:** a padlock on a coverage row. It means a subscriber ID was manually edited and is protected from being overwritten by an automated feed.
- **Payer mix:** the proportion of patients by insurance type. A heavy Medicare Advantage mix is a buying signal for prior-auth pain.
- **Medicare vs. Medicaid vs. Medicare Advantage (MA):**
  - **Medicare:** federal, mainly 65+.
  - **Medicare Advantage:** the privately run version. It prior-auths far more aggressively.
  - **Medicaid:** state-run, low-income, rules vary by state.

---

### STEP 6: Benefits check, "What will it actually pay?"

- **Benefits:** what the plan actually pays.
- **Copay:** a flat per-visit fee.
- **Coinsurance:** a percentage the patient pays *after* the deductible.
- **Deductible:** what the patient pays out of pocket before insurance starts paying. It is commonly $5,000–$15,000 now.
- **Out-of-pocket maximum:** the annual ceiling. After it is hit, insurance covers the rest of the year.
- **In-network vs. out-of-network:** whether the center has a contract with that insurer. Out-of-network costs the patient far more.
- **Allowed amount:** the contracted price the insurer recognizes (not the sticker price). Patient responsibility is calculated from it.
- **Fee Schedule:** contracted prices per service, per payer. It feeds estimates.

---

### STEP 7: Prior authorization (the headline feature)

#### 7a. Does this exam need prior auth?
- **Prior Authorization (PA / prior auth / pre-auth / pre-cert):** the insurer's mandatory pre-approval before it will pay for a scan. Advanced imaging (MRI, CT, PET) is one of the most heavily prior-authed categories in US healthcare. **This is Gravity's wedge.** Say "prior auth," not "pre-cert."
- **Auth Rule:** a record saying whether PA is required for a **payer + group + plan-type + service** combination. Values: **Auth Required / No Auth Required / Unknown.**
- **Global rule vs. local rule:**
  - **Global rules:** pre-loaded and maintained by Gravity for common plans.
  - **Local rules:** created by the customer and take **precedence** over global. Customers can't edit global rules.
- **Wildcard:** a blank field in an auth rule that matches *any* value. A rule with only a payer name and service category applies across every group number and subscriber prefix.
- **Honest claim:** "pre-loaded rules cover common plans, and your team can add rules for anything specific to you." Do not claim "we know exactly when your patients need PA."

In your screenshot the **Authorized** stage is grey. The auth rule probably said no auth was required for this payer and screening mammogram. 🟨 (confirm)

#### 7b. If yes, who approves?
- **RBM (Radiology Benefit Manager):** a company an insurer hires to decide imaging approvals. **Your customers submit PA requests TO them. They are never competitors.**
  - **eviCore** (Evernorth/Cigna, the biggest, say "EV-ee-core")
  - **Carelon Medical Benefits Management** (formerly AIM Specialty Health, under Elevance)
  - **NIA / RadMD** (Evolent)
  - **HealthHelp**
  - **Cohere Health** (AI-driven, has a supported GravityAuth portal, so closer to a partner surface)

#### 7c. How Gravity submits it
- **GravityAuth:** a Chrome browser extension. Its AI agent **Susan** opens a real browser, logs into the payer's actual portal, finds the patient, fills in the form, submits and screenshots each step.
- **Susan:** the AI assistant inside GravityAuth. She can read the patient's progress notes and visit details and answer questions mid-workflow.
- **Why browser automation?** Most payer portals have no usable **API**, or charge per lookup. Automation clicks and types like a human. It identifies elements *semantically*, not by fixed screen position, so it tolerates portal redesigns.
- **API:** a structured way for two systems to talk directly in real time without a human clicking a screen.
- **278:** the EDI standard for **electronic** prior-auth submission. "Are you 278-enabled?" asks whether PA can be sent electronically instead of through a portal.

#### 7d. What can come back
- **Authorization number:** issued when PA is approved. **It does not guarantee payment.**
- **Medical necessity:** the insurer's test for whether a scan is justified. A common denial reason is missing **conservative-care documentation** (payers usually want 4–6 weeks of physical therapy or other treatment documented before approving an MRI).
- **Denial → P2P (Peer-to-Peer):** the ordering physician must personally call the insurer's reviewing doctor and argue. It is expensive in physician time and disliked.
- **ABN (Advance Beneficiary Notice):** the Medicare form warning a patient they may have to pay, because Medicare probably won't cover the service.
- **ACR Appropriateness Criteria:** ACR's guidelines, used in medical-necessity decisions.

**Cost of doing it manually:** $12.88 and 24 minutes each (CAQH), against $5.38 electronic. Staff spend about 13 hours a week on PA (AMA).

---

### STEP 8: Patient cost estimate

- **Estimate:** the pre-service cost calculation. Its output is **Patient responsibility** (what the patient owes).
- **Good Faith Estimate (GFE):** the pre-service estimate required under the **No Surprises Act (2022)**.
- **Surprise bill:** an unexpected patient balance, regulated by that Act.
- **How it's calculated:** Fee Schedule + Benefits (deductible remaining, copay, coinsurance, allowed amount).
- In your screenshot the **Estimate = $0** (green), created 3 days ago.

---

### STEP 9: Booking (Booking Center)

**The problem.** Most booking is still by phone, because MRI screening questions are a decision tree too complex for a static web form. The screening covers metal in the body, pacemaker, claustrophobia, contrast allergy, recent surgery and pregnancy.

**What Gravity does.** **Sandra**, an AI voice agent, answers 24/7. She authenticates the patient, runs the screening questions, matches an open slot, books it and confirms by text. Booking is also available over SMS and web chat. A human takes over with full context whenever the patient asks or the AI's confidence drops. Latency (the pause between turns) is an ongoing engineering focus.

**Terms**
- **Appointment / Booking:** the scheduled exam.
- **Slot:** a reservable time on a specific machine and tech.
- **Resource:** a capacity object (room, scanner, staff pool). It prevents capacity conflicts.
- **Availability:** open-slot data. **It is real-time via API only.** If a prospect's RIS can't expose availability over an API, that capability is harder to deliver well.
- **Contrast:** an injected imaging enhancer. It needs allergy and kidney screening.
- **No-show / Cancellation / Waitlist:** filling slots from the waitlist after cancellations is the highest-leverage and most badly done scheduling task.
- **Facility / Location:** the physical site.
- **POS (Place of Service):** a code for where care was delivered. It affects reimbursement.

---

### STEP 10: Pre-visit (reminders and prep)
🟨 General practice, not detailed in the guide. Reminders go out by text, call or email. The patient is told about prep (e.g., no deodorant for mammograms, fasting for some CTs) and what to bring. Flow Center's outreach engine (voice, text, email, fax, channel switching on no-response) covers this kind of contact.

---

### STEP 11: Check-in
The patient arrives, identity and insurance are confirmed, and forms are signed. In your screenshot: **Checked In, 3 minutes ago, by System**. The **Check-In** tab holds these details. 🟨 The tab contents are not described in the guide.

---

### STEP 12: The scan (clinical work, outside Gravity)
- The **technologist** performs the exam following the **protocol**.
- Your card shows **Study Status: Tech Start.**
- **Study:** a complete exam.
- **Series:** a sequence of images in a study (e.g., an MRI's T1/T2/FLAIR/diffusion).
- **Encounter:** a single visit.
- **DICOM:** the protocol scanners and PACS use to exchange images.
- **Gravity does not touch the images.**

**Imaging modalities**
| Modality | What it is |
|---|---|
| X-ray / radiograph | 2D, cheapest |
| CT | 3D X-ray, fast, good for bone/trauma |
| MRI | Magnetic field + radio waves, high soft-tissue detail, almost always needs PA |
| Ultrasound / sonography | Sound waves, no radiation, cheap |
| DEXA | Bone density |
| PET | Radioactive tracer, cancer staging |
| PET/CT | Combined, very expensive |
| Nuclear medicine | General radioactive-tracer category |
| Fluoroscopy | Real-time X-ray video for guided procedures |
| Mammography | Screening or diagnostic breast X-ray (your screenshot) |
| Interventional radiology (IR) | Image-guided minimally invasive procedures (a specialty, not just a modality) |

---

### STEP 13: Reading and reporting
- The images go to **PACS** (Picture Archiving and Communication System), where the **radiologist** reads them.
- A **Report/Result** is produced and returns to the RIS and Gravity via an **ORU** message.
- **TAT (Turnaround Time):** scan completion to report delivery.
- **MRN (Medical Record Number):** the internal patient ID, unique within one organization only.
- The **Reports** tab in your screenshot shows this.

---

### STEP 14: Billing, claims and getting paid (RCM territory)
Gravity does the front end. The back end belongs to RCM systems, which Gravity integrates with.

- **RCM (Revenue Cycle Management):** everything from scheduling through getting paid. Your buyer often has "revenue cycle" in their title.
- **Claim:** the bill sent to the insurer after service (**CMS-1500** professional, **UB-04** facility).
- **Adjudication:** the payer's processing of the claim (approve, partial or deny).
- **EOB (Explanation of Benefits):** the payer's document explaining what was paid and why.
- **ERA (Electronic Remittance Advice):** the electronic EOB, fed into the RCM system.
- **Denial:** the insurer refusing to pay. **The core problem Alpha Nodus sells against.**
- **Write-off:** revenue given up because a denial couldn't be overturned. Pure loss.
- **NPI (National Provider Identifier):** a unique 10-digit ID. **Type 1 = individual, Type 2 = organization.**
- **Taxonomy code:** the classification of a provider's specialty, attached to their NPI.
- **KPIs**
  - **Days in A/R:** average days from billing to payment.
  - **Denial rate:** % of claims denied on first pass.
  - **Clean claim rate:** % accepted on first submission without rework.

**Why denials trace back to the front desk.** 50% of denials come from missing or inaccurate data, and 32% from incomplete or inaccurate registration (Experian Health survey). The usual causes are a wrong ICD-10/CPT pairing, a wrong subscriber ID or a wrong COB at intake. So fixing intake data (Document Center) reduces the biggest denial category.

The **Charges** tab in your screenshot is where this begins.

---

### STEP 15: Recall and referrer engagement (Flow Center)
- **Recall:** a follow-up exam due at a set interval (e.g., a 6-month oncology surveillance MRI, or an annual screening mammogram like your screenshot's patient).
- Flow Center triggers outreach by voice, text, email and fax at the right interval. It escalates or switches channel on no-response, prioritizes whichever channel has worked for that patient, and lets the patient book straight from the message.
- **Referrer retention** is a key metric. Referring doctors drive demand.

---

## Part 4. How the systems talk to each other (integration)

### 4.1 HL7 message types
| Type | Stands for | Carries | Becomes in Gravity |
|---|---|---|---|
| **ADT** | Admit, Discharge, Transfer | Patient demographics, insurance | Patient, Coverage |
| **ORM** | Order message | Orders (optionally coverage) | Orders |
| **SIU** | Scheduling Information Unsolicited | Appointments | Bookings |
| **ORU** | Observation Result Unsolicited | Results | Reports/Results |

- **HL7 (Health Level Seven):** the decades-old, pipe-delimited messaging standard (say "H-L-seven").
- **FHIR:** the modern REST/JSON successor (say "fire"). It is what **CMS-0057-F** mandates payers expose.
- **CDA:** a structured document format for clinical summaries.
- **Mirth:** an interface engine (middleware) that receives, transforms and routes HL7 messages. It is part of Alpha Nodus's stack.
- **Saying "we do HL7 and FHIR"** means we speak the old language every legacy RIS uses, and the new one payers are being forced onto.

### 4.2 Sync modes (defined per record type, not per integration)
Always ask, "which record type?"

| Mode | Name | Rule | Risk |
|---|---|---|---|
| **1** | Read-only (one-way) | One writer, one listener | Lowest |
| **2** | Read + update | One system creates; the second can update but never create | Medium |
| **3** | Full bi-directional | Both create and update | Highest; needs a stable ID or crosswalk, or you get duplicates |

- **Stable unique ID:** permanent, never changes, and the only reliable cross-system match.
- **Fingerprint:** a match by name, DOB, phone or address. These can change or collide. Full bi-directional sync on fingerprints alone is **not advisable** (it "becomes an identity governance project").
- **ID crosswalk:** a stored mapping permanently linking a record in one system to its twin in another.
- **Seeding:** the one-time bulk load that populates a record type before ongoing sync.
- **Sync Profile:** the document describing, record type by record type, what each connected system may do, how records are matched and how data moves.
- **Practical rule:** never promise an implementation timeline (like "days, not months") without knowing whether the prospect's RIS has stable IDs.

### 4.3 Other systems in the ecosystem
- **PACS:** images and radiologist reading.
- **PM (Practice Management):** the RIS-equivalent for non-radiology specialties.
- **LIS (Laboratory Information System):** the RIS-equivalent for labs.
- **PIS (Pharmacy Information System):** the RIS-equivalent for pharmacy.
- **HIS (Hospital Information System):** a catch-all for hospital-wide IT.
- **RIS vendors:** **RamSoft** (PowerServer/OmegaAI, 750+ sites, already integrated, **the biggest untapped channel**), **ADS** (MedicsRIS, integrated, powers Bright Light Imaging), eRAD, Merge and Epic Radiant.

---

## Part 5. Market, competition and regulation

### 5.1 Why nobody else does this
- **RIS vendors** are scheduling-software companies without an AI-workforce story.
- **RCM vendors** focus on post-service claims, so pre-service work is a bolt-on.
- **PACS vendors** serve radiologist workflow, and the front office isn't their domain.
- **AI voice/document startups** lack imaging workflow knowledge and RIS integrations.

### 5.2 Competitors: internal use only
| Group | Who |
|---|---|
| Incumbent imaging prior auth | **Infinx** (software + services) |
| Billing with native PA | **ImagineSoftware** |
| AI-native entrants | Honey Health, Flexbone, Coral, Nakod |
| Broader RCM automation | Waystar, MD Clarity |
| Outsourced RCM firms | e.g., Healthcare Administrative Partners (**the alternative Gravity loses to most often**) |
| Availity | Two roles: Gravity's eligibility clearinghouse **and** a competitor in broader RCM automation |

**Counter-message for outsourcing:** outsourcing moves the cost to someone else's staff, while automation removes it.

**Register rule.** To a prospect, say: "zero companies attack this from the patient-journey angle." Internally, name competitors accurately.

### 5.3 Regulation and forces
| Item | What it is | Why it matters |
|---|---|---|
| **HIPAA (1996)** | Federal law protecting PHI (one P, two As) | A "HIPPA" typo is the biggest tell of an outsider |
| **OCR (Office for Civil Rights)** | HHS agency enforcing HIPAA (also the abbreviation for Optical Character Recognition, so context decides) | |
| **BAA** | Business Associate Agreement, required before a vendor handles PHI | |
| **SOC 2 Type II** | Audited security certification (controls tested over a period). Alpha Nodus holds it. | Never mention it in outbound copy (route to Shamit) |
| **CMS-0057-F** | 2024 Interoperability and Prior Authorization Final Rule. Payers must run **four FHIR APIs** (Patient Access, Provider Access, Payer-to-Payer, Prior Authorization) by **1 Jan 2027**. Ops requirements began 1 Jan 2026. Payers publish PA metrics from 31 Mar 2026. | Best "why now" hook; ~$15B savings over 10 years |
| **CMS** | Centers for Medicare & Medicaid Services, the federal agency setting rules | |
| **MPFS** | Medicare Physician Fee Schedule, annual pay update, flat-to-down in real terms | Why margin compression is permanent |
| **No Surprises Act (2022)** | Limits surprise out-of-network billing; requires Good Faith Estimates | Reason Gravity Estimate exists |
| **MQSA** | Mammography Quality Standards Act, requires facility certification; the FDA database is a source for mammography prospect lists | |
| **Stark Law (1989)** | Bans physician self-referral for financial gain | |
| **AKS** | Anti-Kickback Statute, bans healthcare kickbacks, with criminal penalties | |
| **ACA (2010)** | Mandated coverage, banned pre-existing-condition denials, indirectly drove the deductible/PA explosion | |
| **HITECH (2009)** | Drove EMR adoption via Meaningful Use incentives | |

---

## Part 6. Master glossary (A–Z within category)

### A. Gravity vocabulary
| Term | Meaning |
|---|---|
| **Activation** | Turning a newly auto-created shell record into a usable one |
| **AOS** | Agentic Operations System, Alpha Nodus's category name ("a system of work"). Spell it out on first external use. |
| **Auth Rule** | Whether PA is required for a payer + group + plan + service |
| **Auto Order Creation** | Builds an Order from a document; needs patient, referring provider and exam resolved, else routes to a human |
| **Auto Patient Creation** | Separate setting that creates new patients automatically or routes to a human |
| **Booking Center / Document Center / Flow Center / Revenue Center** | The four sections of the app |
| **Center** | A major section of the app |
| **Compendium** | The customer's catalogue of Healthcare Services |
| **Coverage** | This patient's specific policy |
| **Draft order workflow** | Human validates picks before order creation |
| **EDI mapping** | Availity payer ID for routing; absent means "Payor Not Activated" |
| **Fee Schedule** | Contracted price per service per payer |
| **Global / local rule** | Pre-loaded vs customer-created; local wins |
| **GravityAuth** | Chrome extension that automates PA |
| **Healthcare Service** | A bookable/orderable exam record |
| **Order** | The core request-for-service record |
| **Record Type** | A structured information category Gravity runs on |
| **Resource** | A room, scanner or staff pool |
| **Sandra** | The AI voice booking agent |
| **Seeding** | One-time bulk load |
| **Snooze** | Hide an item from a worklist until a date |
| **Susan** | The AI assistant inside GravityAuth |
| **Sync Lock** | Protects a manually edited subscriber ID |
| **Sync Profile** | Per-record-type sync rules document |
| **Tenant** | One customer organization (multi-tenant platform; "tenant-scoped" is limited to one customer) |
| **Wildcard** | Blank auth-rule field matching any value |
| **Worklist** | A filtered list of orders to work through |

### B. Integration and data
**HL7** · **ADT / ORM / SIU / ORU** · **FHIR** · **CDA** · **DICOM** · **Mirth** · **API** · **Sync modes 1/2/3** · **Stable ID vs fingerprint** · **ID crosswalk** · **MRN** · **278** · **270/271** · **EDI** · **Clearinghouse** (all defined in Part 3 and Part 4).

### C. Coding and billing
| Term | Meaning |
|---|---|
| **CPT** | Procedure code (what was done) |
| **ICD-10** | Diagnosis code (why) |
| **HCPCS** | Extends CPT to drugs and supplies |
| **Modifier** | 2-character CPT adjuster (-26, -TC) |
| **NPI** | 10-digit provider ID; Type 1 individual, Type 2 organization |
| **Taxonomy code** | Provider specialty classification |
| **POS** | Place of Service code |

### D. Insurance and revenue cycle
| Term | Meaning |
|---|---|
| **Payer / Payor** | The insurance company |
| **Provider** | A person (doctor) *or* an organization (center); context decides |
| **Referring / ordering provider** | The doctor who sent the patient |
| **Subscriber / ID / prefix / group** | Policyholder / card number / first 3 chars / employer plan |
| **COB (P/S/T)** | Which insurer pays first |
| **Eligibility (VOB)** | Is the insurance active and what does it cover |
| **Benefits** | What the plan pays |
| **Copay / coinsurance / deductible / OOP max** | Flat fee / % after deductible / pay-first amount / annual cap |
| **In-network / out-of-network** | Contracted or not |
| **Allowed amount** | Contracted recognized price |
| **Patient responsibility** | What the patient owes |
| **Claim** | Bill to the insurer (CMS-1500 / UB-04) |
| **Denial** | Refusal to pay |
| **Adjudication** | Payer's claim processing |
| **EOB / ERA** | Payment explanation (paper / electronic) |
| **Write-off** | Revenue lost after an unwinnable denial |
| **Surprise bill / GFE** | Unexpected balance / required pre-service estimate |
| **RCM** | Revenue Cycle Management |
| **Prior Authorization** | Insurer pre-approval |
| **Authorization number** | Issued on approval, no payment guarantee |
| **Medical necessity** | Is the scan justified |
| **Clinical notes / clinicals** | Documentation proving necessity |
| **P2P** | Doctor-to-doctor appeal call |
| **ABN** | Medicare "you may have to pay" form |
| **Days in A/R, Denial rate, Clean claim rate** | RCM KPIs |
| **Payer mix** | Patient insurance-type breakdown |

### E. Compliance
**HIPAA · PHI · BAA · SOC 2 Type II · Stark Law · AKS · ACA · HITECH · No Surprises Act · CMS-0057-F · MPFS · MQSA · OCR · CMS · Medicare/Medicaid/MA**: see Part 5.3.

### F. Software and players
**RIS · PACS · RCM · EMR/EHR · PM · LIS · PIS · HIS · RBM**, plus the RIS vendors, RBMs and competitors in Parts 4 and 5.

### G. Roles
PCP · Specialist · Referring/ordering physician · Radiologist · Technologist (tech, rad tech) · Sonographer · Scheduler · PA/VOB specialist · Practice administrator/manager · COO/Director of Operations · RCM Director/Billing Manager · IT/IS Director. See Step 0.

### H. Workflow terms
Order/Script/Referral · Progress notes · Encounter · Study · Series · Modality · Slot · Protocol · Contrast · No-show · Cancellation · Waitlist · Recall · STAT (urgent) · Priority (Routine/STAT).

### I. Business metrics
| Term | Meaning |
|---|---|
| **Utilization rate** | Imaging 60–65% vs hotels/airlines ~85%, fabs 95–99% |
| **TAT** | Turnaround time |
| **Referrer retention** | Keeping referring doctors sending patients |
| **Patient no-show rate** | |
| **CAC** | Customer acquisition cost |
| **ACV** | Annual contract value |
| **LTV** | Lifetime value |
| **NRR** | Net revenue retention |

### J. Industry bodies
| Body | What |
|---|---|
| **RSNA** | Biggest conference, Chicago, late November |
| **RBMA** | Radiology Business Management Association (operations/business, buyer-heavy) |
| **ACR** | American College of Radiology; publishes Appropriateness Criteria |
| **AHRA** | Association for Medical Imaging Management |
| **HIMSS** | Broader healthcare IT conference |
| **CAQH** | Nonprofit alliance; publishes the CAQH Index of PA costs |
| **AMA** | American Medical Association; owns CPT, publishes the admin-burden survey |

---

## Part 7. Speak like an insider

### 7.1 Pronunciation
| Written | Say |
|---|---|
| FHIR | "fire" |
| PACS | "packs" |
| HIPAA | "HIP-ah" |
| eviCore | "EV-ee-core" |
| Availity | "a-VAIL-ity" |
| HL7 | "H-L-seven" |
| CPT, NPI | Spell the letters |

### 7.2 Five traps
1. **HIPAA** has one P and two As.
2. Say **"prior auth"**, not "pre-cert."
3. **Never** say Gravity "replaces" the RIS or EMR. It sits on top.
4. **Radiologists are not the buyer.** Administrators and revenue-cycle directors are.
5. RBMs (eviCore, Carelon, NIA, HealthHelp, Cohere) are **never competitors.**

### 7.3 Sentences you can use in a meeting
- "Where does the order enter, by fax, e-referral or handwritten? And what's the RIS?"
- "Is this a Mode 1, 2 or 3 sync, and for which record type?"
- "Does their RIS have stable unique IDs, or are we matching on fingerprints?"
- "Do they auto-create orders, or are they on the draft order workflow?"
- "What's their payer mix? A heavy Medicare Advantage share means a worse PA queue."
- "Is the payer 278-enabled, or does it need GravityAuth through the portal?"
- "Is the denial from front-end data (ICD-10/CPT pairing, subscriber ID, COB) or from medical necessity?"
- "Do local auth rules override the global ones for this payer?"
- "Is eligibility showing 'Payor Not Activated', meaning the EDI mapping is missing?"
- "Which state is the study in, and has the Estimate been generated?"

### 7.4 Reading your screenshot aloud
> "This is a routine screening mammogram, CPT 77067, diagnosis Z12.31. Order created 17 days ago, booked 16 days ago by the system, a $0 estimate generated 3 days ago. No prior auth on the timeline, which fits for screening. The patient checked in 3 minutes ago and the study status is Tech Start, so the tech has begun the exam."

---

## Part 8. Open questions for your team (things I could not confirm)

1. What does **RCI883325** represent (order number, accession number, other)?
2. What is the **full list of Study Status values**, and which stage comes after "Tech Start"?
3. Is the **"MA"** in "77067 MA" the department or modality code, and is "MG" the Service Category value for mammography?
4. Is "by System" on **Booked** and **Checked In** Sandra, a kiosk, or an HL7 feed?
5. What do the **cropped timeline stages** to the right of "Complete" show?
6. What does the **tag icon** and the **"…" menu** do on the card?
7. Are **screening mammograms** configured with "No Auth Required" in the auth rules by default?
8. What is in the **Check-In** and **Charges** tabs?
9. Which of the Part 3 mechanics (automation percentages, rule behavior, product names) are still current as of today?

---

*Built from your domain mastery guide, with your screenshot decoded in Part 2. 🟨 items are general industry knowledge, not from the guide.*
