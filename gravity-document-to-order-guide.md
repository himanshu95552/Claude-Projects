# From Document to Order in Gravity: Step by Step

**Companion to:** `gravity-process-walkthrough.md` (the full journey from referral to payment). This guide zooms into **the first third of that journey**, the part where a fax, photo or upload arrives and becomes an **Order**. It also decodes every screen you shared.

**Source tags**
- 🟦 **Guide**: your domain mastery guide.
- 🟩 **Screen**: read directly from your screenshots or the PDF printout.
- 🟨 **Inferred**: my best reading of how it works. Confirm with your team before repeating it externally.

**A note on the sample data.** The screens come from the tenant "River City Imaging Centers - New", which looks like a test or demo tenant. I describe fields, not people. Never paste real patient details into a prompt, spreadsheet or ad platform (that is PHI, see the glossary).

---

## Part 1. The three things you shared, and how they fit together

| What you shared | What it is | Where it sits in the journey |
|---|---|---|
| **Documents list** (with filters) | The inbox. Every fax, photo and upload lands here. | Step 1–3 below |
| **Document review screen** (fax on the left, form on the right) | The workbench where a document is checked and turned into an order (or linked to one). | Step 4–10 below |
| **Orders list** and the **printed order summary PDF** | The result. An order that is scheduled, checked in, scanned and waiting to be read. | After Step 10 |

```
 Fax / upload / sync arrives
          │
   DOCUMENTS list  ──►  classify  ──►  extract  ──►  link patient
          │                                              │
          ▼                                              ▼
   DOCUMENT REVIEW screen:  Patient + Insurance + Provider + Service + Priority
          │
   "Matching orders found" ──► Link & Complete   (attach to an order that already exists)
          │                 └─► Create & Complete (make a new order)
          ▼
   ORDERS list  ──►  estimate / prior auth / booking  ──►  check-in  ──►  scan  ──►  read
```

---

## Part 2. The Documents list, field by field

### 2.1 Top navigation (on every screen) 🟩
| Item | Meaning |
|---|---|
| **Documents** | Inbox of incoming files (this guide's focus) |
| **Orders** | All orders (requests for exams) |
| **Patients** | Patient records |
| **Bookings** | Appointments (the Booking Center, Sandra's area) |
| **Charges** | The billing side after the service |
| **Analytics** | Reports and dashboards |
| **"···"** | More menu (hidden items on a narrow screen) |
| **"River City Imaging Centers - New" dropdown** | **Tenant switcher.** A tenant is one customer organization; Gravity is multi-tenant, so each customer's data is isolated. The URL also carries `?tenant=…`, which is why a link opens one customer's data only. 🟦 |
| Flask icon, bug icon | 🟨 Probably "labs / beta features" and "report an issue" |
| User name and green dot | Who is logged in (green means online) |
| **"Powered by AlphaNodus"** | The footer branding |

### 2.2 Tabs and tools above the table 🟩
| Item | Meaning |
|---|---|
| **All** | Every document |
| **Daily Practice (110) ★** | A **saved filter / worklist**. The number is how many documents match right now. The star means it is a favourite. 🟦 *"Filters saved in Gravity become selectable inside GravityAuth."* |
| **Search Documents** | Free-text search (patient name and so on) |
| **Filters** | Opens the filter panel (see 2.4) |
| **Last 90 Days** | Date range for the list |
| **+ Upload document** | A person manually adds a file (this becomes the **Web Upload** source) |
| **Refresh icon** | Reloads the list |
| **"1 new document" blue pill** | New documents arrived since you loaded the page. Click to load them. Documents arrive continuously. |
| **Displaying 1–20 of 26,616 records, 1331 pages, 20 / page** | Total volume in the last 90 days for this tenant. This shows how big the inbox is. |

### 2.3 The columns 🟩
| Column | What it shows | Why it matters |
|---|---|---|
| **Checkbox** | Select rows for bulk actions 🟨 | |
| **Patient Name** (underlined link) | The patient the document was matched to | If there is a **chain-link icon** beside the name, the document is **linked** to a patient chart. A name with no link icon is not yet linked. |
| **Visit** | A visit ID such as `GV…` (blank on unlinked rows) | Ties the document to an encounter 🟨 |
| **Birth Date** | DOB extracted from the document | Used to match the patient |
| **Source** | How the document got in | See the list of sources below |
| **File Type** | `application/pdf` or `image/jpeg` | PDFs are usually faxes; JPEGs are usually phone photos |
| **Tags** | Free labels on the document | Used for filtering |
| **Category** | What kind of document the AI thinks it is (blue "Order" pill on the first row) | Decides what happens next |
| **Assignees** | The staff member responsible | Empty means nobody owns it yet |
| **Created** | How long ago it arrived ("a minute ago") | Fax-to-order speed starts here |
| **Action: Process button** | A person opens the document to work it | 🟨 The manual route |
| **Action: orange sparkle button** | The **AI** action (the sparkle icon is Gravity's AI marker) | 🟨 Likely runs or re-runs AI processing on that document |

The four JPEG rows in your screenshot are the same patient and the same visit ID, uploaded from a phone within the same minute. 🟨 This is most likely a patient or staff member photographing several pages (an insurance card front and back, ID and so on).

### 2.4 The Filters panel (every filter explained) 🟩
| Filter | Options seen | Meaning |
|---|---|---|
| **Saved filters** | "Select filter", **Clear** | Reuse or reset a stored combination of filters |
| **Assignee** | dropdown | Show only one person's work |
| **Tags** | dropdown | Filter by label |
| **Source** | **Document Sync · Gravity User Portal · Inbound Fax · Mobile Upload · Prior Auth · System · Web Upload** (each with **Include / Exclude**) | See the source table below |
| **File type** | dropdown | PDF, JPEG and so on |
| **Category** | **None · Identification · Insurance Card · Lab Report · Letter Of Protection · Order · Prior Auth · Progress Note** (list may continue) | What the document is |
| **Category Status** | **Assigned · Auto Assigned · Human Review · In Progress** (list may continue) | How the category was decided or where it is in handling |
| **Status** | "Select status" | Processing state of the document |
| **Order created** | **Yes / No / All** | Has this document already produced an order? Choose **No** to see work still waiting. |
| **Patient Linking** | **Yes / No / All** | Has the document been tied to a patient chart? Choose **No** to see documents the system could not match. |
| **Hide Snoozed** | **Yes / No** (Yes is on by default in your screenshot) | Hides documents someone has snoozed until a later date |
| **Filter name / Cancel / Update Filter** | | Save this combination under a name |

**Include vs Exclude** (toggle at the top of the Source, Category and Category Status lists): *Include* means "show only these". *Exclude* means "show everything except these".

### 2.5 The seven document sources 🟩 (meanings 🟨 unless noted)
| Source | Plain meaning |
|---|---|
| **Inbound Fax** | A fax received by the center's fax number. Still the most common way referrals arrive. 🟦 HIPAA explicitly authorizes fax. |
| **Mobile Upload** | A photo taken on a phone and uploaded (insurance card, ID, paper script) |
| **Web Upload** | A person clicked **Upload document** in the web app |
| **Gravity User Portal** | Uploaded through a Gravity portal login 🟨 (possibly a referrer or patient portal) |
| **Document Sync** | Pulled in automatically from another system (RIS, EMR or a file drop). This is the integration route. |
| **Prior Auth** | A document created by the prior-authorization workflow (approval letters, payer replies, screenshots) |
| **System** | A document generated by Gravity itself |

### 2.6 The eight document categories 🟩 (meanings 🟨 unless noted)
| Category | What it is | What usually happens next |
|---|---|---|
| **Order** | A request for an exam (a script or referral) | Becomes an **Order** record. This is the main path of this guide. |
| **Progress Note** | The referring doctor's clinical notes. 🟦 It can run 20+ pages. | Attached to the order as proof of **medical necessity** (needed for prior auth) |
| **Insurance Card** | Photo of the card | Used to create or update the patient's **Coverage** |
| **Identification** | Driver's licence or other ID | Used to confirm patient identity |
| **Prior Auth** | A prior-authorization document | Attached to the authorization |
| **Letter Of Protection** | A contract used in injury or accident cases, where an attorney guarantees the provider will be paid from a settlement 🟨 | Changes who pays (not the insurer) |
| **Lab Report** | Lab results, sometimes needed to justify a scan | Attached to the order |
| **None** | Not classified | Goes to a human |

### 2.7 Category Status values (my reading) 🟨
| Status | Likely meaning |
|---|---|
| **Auto Assigned** | The AI categorized the document on its own, confidently |
| **Human Review** | The AI was not confident, so a person must decide (this matches the guide's rule that low-confidence cases go to a human) |
| **Assigned** | The document has been given to a specific staff member |
| **In Progress** | Someone is working on it now |

---

## Part 3. The Document Review screen: where a document becomes an order

### 3.1 Layout 🟩
**Left side: the document viewer.**
- Page thumbnails (the "1" badge means one page).
- Buttons for rotate, fit-to-width and fit-to-height, flip or rotate pages, zoom out, zoom in, and previous / next document.
- The fax itself, with the machine-printed header ("Oct/8/2026 7:45:26 AM" and the sender's fax label).

**Right side: the work form.**
- Top icons (left to right): comment, AI sparkle, download, copy, history, share, tag, assign to a person, timeline. 🟨 (Most of these are standard; confirm the exact functions.)
- **Five tabs: Order · Progress Note · ID · Insurance · More.** Each tab lets staff handle a different kind of information from the same document. The **Order** tab is the one in your screenshots.

### 3.2 "Matching orders found: 7" 🟩
A blue badge says **7 matching orders were found.** Gravity searched for orders that might already match this document (same patient, similar exam or dates) so staff do not create duplicates.

Two buttons sit beside it, both greyed out until the form is complete:
| Button | What it does |
|---|---|
| **Link & Complete** | Attach this document to an order that **already exists**, then mark the document finished |
| **Create & Complete** | Create a **new order** from this document, then mark the document finished |

Why this matters: duplicates are expensive (double bookings, double authorizations). Linking is the safe choice when the order already exists. 🟨

### 3.3 The form sections, top to bottom 🟩

**1. Patient** (green check means resolved)
| Field | Meaning |
|---|---|
| Name and gender symbol | The matched patient |
| DOB and age | Used for identity matching |
| ID (e.g., a short code) | The patient's ID in the system 🟨 (likely the MRN or the RIS patient ID) |
| Phone, address | Contact details |
| **Edit** / **✕** | Correct the match or remove it |

**2. Select Insurance** (a list of the patient's coverages with checkboxes)
| Field | Meaning |
|---|---|
| Payer name (e.g., a health plan) | The insurance company |
| Number on the right | Member / policy ID (or a price for self-pay) |
| **"PATIENT PAID IN FULL AT TOS"** with an amount | A **self-pay plan**. 🟨 *TOS = Time Of Service.* The patient pays the listed price (here 99.00) when they come in. Self-pay or cash is treated like an insurer in the list. |
| Address line | The payer's mailing address |
| **Last Checked: N/A** | **Eligibility has never been verified** for this coverage |
| **Click to Verify** | Starts the **eligibility check** (270/271 through the clearinghouse, 🟦 Availity) |
| **Payor Name / Policy Number / Add** | Add another coverage manually |
| Checkbox | Choose which coverage attaches to this order |

**3. Provider** (the ordering doctor)
- **Provider** search by name, or **Search NPI** (the 10-digit ID).
- **New** creates a provider that does not exist yet.

**4. Ordered Services**
- **Service**: search a **Healthcare Service** from the center's **Compendium** (🟦 the catalogue of bookable exams).

**5. Priority**
- A toggle, currently **Routine** (the alternative is STAT, meaning urgent).

**6. Red warning line.** *"Please fill all required fields to create an order: Patient, Provider and Service."*
**Provider** and **Service** are shown in red. 🟦 This is exactly the rule from the guide: an order is only created when **patient, referring provider and exam** are all resolved. Until then, the Create button stays greyed.

### 3.4 What this particular fax is 🟩 (an important teaching example)
The fax in your screenshot is a **"Request for Release or Transfer of Images and Reports"** from a mammography company. It is **not** an exam order. It asks the imaging center to send a patient's *previous* images to another facility, with the sender's own facility details hand-written in.

What this teaches:
1. **The AI's Category says "Order", but the real meaning is a records-release request.** Categories are a first guess. This is why **Human Review** exists.
2. **That is why Provider and Service stay empty.** There is no ordering doctor and no new exam on the page. The correct next action is probably not "Create & Complete", but linking it to the patient and routing it to whoever handles **release of information (ROI)**. 🟨
3. **Why would a facility want prior images?** In mammography a radiologist compares today's images with earlier ones. 🟨 That is why a new facility asks the old one to send them.
4. **Handwriting matters.** The facility name, phone and fax on the form are hand-written. 🟦 Roughly 30% of orders arrive handwritten, which breaks conventional OCR. A reviewer should check hand-written digits against the extracted fields (a handwritten 6 and 8 are easy to confuse).
5. **PowerShare** is mentioned on the form as the electronic image-sharing route. 🟨 It is an image-sharing network, outside Gravity's scope. Remember: **Gravity never stores or reads images.**

---

## Part 4. The process, step by step (document to order)

Each step lists what happens, who or what does it, what the screen shows and which terms apply.

### Step 1. A document arrives
- **Who:** the sender (referring office, patient, staff, another system).
- **How:** one of the seven **sources** (Part 2.5).
- **Screen:** a new row appears in **Documents**, and the **"1 new document"** pill shows.
- **Terms:** *Inbound Fax, Mobile Upload, Web Upload, Document Sync, Source.*
- 🟦 **Manual world:** a person watches the fax queue, prints or opens each fax and works out what it is.

### Step 2. A document record is created
- **What:** Gravity stores the file (PDF or image) and a record with **Created** time, **Source** and **File Type**.
- **Screen:** columns *Source, File Type, Created*.
- **Terms:** *Document, File type.*

### Step 3. The AI classifies it (Category)
- **Who:** Document Center AI. 🟦 *"Classifies incoming documents."*
- **Screen:** the **Category** column fills in (e.g., the blue **Order** pill). Category Status becomes **Auto Assigned**, or **Human Review** if confidence is low. 🟨
- **Terms:** *Category, Category Status, Auto Assigned, Human Review.*

### Step 4. The AI extracts the details
- **Who:** AI using computer vision, OCR and an **LLM**. 🟦
- **What it reads:** patient name, DOB, referring physician, **CPT** (what exam), **ICD-10** (why), payer, subscriber ID. It works on both printed and handwritten text.
- **Screen:** the **Patient Name** and **Birth Date** columns fill in; the review form pre-fills.
- **Terms:** *OCR, LLM, CPT, ICD-10, subscriber ID, structured fields.*
- **Why not just OCR?** 🟦 Plain OCR returns raw text and fails on handwriting. Gravity returns *structured fields attached to the correct patient*.

### Step 5. Patient linking
- **What:** the extracted name and DOB are matched to an existing patient chart. If none exists, a new patient is created, or a human decides.
- **Screen:** a **chain-link icon** appears next to the patient name. The filter **Patient Linking = No** lists documents not yet matched. In the review screen, the **Patient** card shows a **green check**.
- **Settings:** 🟦 **Auto Patient Creation** (on means new patients are created automatically; off means a human decides).
- **Terms:** *Patient linking, patient chart, MRN, stable ID vs fingerprint.* 🟦 Matching by name, DOB and phone is "fingerprint" matching and can collide. A stable ID is safer.

### Step 6. Insurance is attached and checked
- **What:** the coverage on the document, or already on the patient, is selected. Staff (or automation) can **Click to Verify** to run **eligibility**.
- **Screen:** the **Select Insurance** list with **Last Checked** and **Click to Verify**.
- **Result later:** a green **Active Coverage** badge (seen on the printed order, Part 5).
- **Terms:** *Coverage, Eligibility (VOB), 270/271, clearinghouse, Availity, subscriber ID, COB (primary / secondary), self-pay, TOS.*

### Step 7. The ordering provider is resolved
- **What:** the doctor's name or **NPI** is matched to a provider record. If missing, use **New**.
- **Screen:** the **Provider** section (name search and NPI search).
- **Terms:** *Referring / ordering provider, NPI (Type 1 = individual, Type 2 = organization), taxonomy code (specialty).*
- **Why it matters:** referring doctors generate the center's demand, and payers require the NPI on the order and the claim.

### Step 8. The exam is matched to the catalogue
- **What:** the requested exam text (or CPT code) is matched to a **Healthcare Service** in the **Compendium**.
- **Screen:** the **Ordered Services** section.
- **Terms:** *Healthcare Service, Compendium, CPT, modifier, protocol.* 🟦 Keeping the Compendium free of near-duplicate names is what makes this matching work.

### Step 9. Priority is set
- **What:** **Routine** or **STAT**.
- **Screen:** the **Priority** toggle.

### Step 10. Duplicate check, then Link or Create
- **What:** Gravity shows **Matching orders found (N)**. A person (or Auto Order Creation) chooses:
  - **Link & Complete** if the order already exists, or
  - **Create & Complete** if it is new.
- **Rule:** 🟦 **Auto Order Creation** only fires when patient, provider and exam are all confidently resolved. Otherwise the document goes to a human.
- **Recommended start:** 🟦 the **draft order workflow**, where a human confirms Gravity's picks before an order is created. Customers move to Auto Order Creation after trusting the output.
- **Terms:** *Auto Order Creation, draft order workflow, activation (a newly auto-created "shell" record becomes usable once identifiers are confirmed).*

### Step 11. The Order exists
- **What:** a record with patient, provider, service, priority, coverage and status.
- **Screen:** the document row now counts as **Order created = Yes**, and the order appears in **Orders**.
- **Why it is "the most important record":** 🟦 scheduling, clinical work and every financial step hang off it.

### Step 12. Everything after the order
These are covered in the walkthrough. Your printout shows them (Part 5):
**Estimate → (Prior authorization if required) → Booking → Check-in → Scan → Completed → Unread (waiting for the radiologist) → Report → Charges → Claim.**

---

## Part 5. The printed order summary (PDF), explained

The PDF is a one-page **order summary / face sheet** with the same data as the order page.

### 5.1 Header 🟩
| Item | Meaning |
|---|---|
| **River City Imaging Centers - New** | The facility (tenant) |
| Phone, fax, **NPI** | The center's contact details and its **organization NPI** (Type 2) |
| **QR code** and the code beneath it (`GV…`) | A scannable code that opens the order. 🟨 This `GV…` value is the **visit ID** (the same format appears in the Documents list **Visit** column) |

### 5.2 Patient card 🟩
| Field | Meaning |
|---|---|
| **ID** | Patient ID in the system |
| **Birthdate / age** | For identity checks |
| **Height / Weight** | 🟨 Used by the technologist (scanner weight and table limits, dose and contrast planning) |
| **Language** ("No Language: Add") | Whether an interpreter is needed |
| **Phone / Home / Email / Address** | Contact details. 🟦 The Flow Center and reminders depend on these. |
| Small icons (copy, link) | Copy the value; open a link |
| Bug icon at the top of the card | 🟨 Report a data issue |

### 5.3 Ordering Provider card 🟩
| Field | Meaning |
|---|---|
| Name | The doctor who ordered the exam |
| **NPI** | Their individual 10-digit ID (Type 1) |
| **Organization / Location** | Their practice (empty here: "No Organization") |
| **Address, Fax, Phone** | Where reports and requests are sent. 🟦 Fax is still the common return path. |
| **Speciality / Credentials** | Empty here ("Add"). 🟦 The taxonomy code classifies specialty. |
| Tag icon | Label the provider |

### 5.4 Coverage card 🟩
| Field | Meaning |
|---|---|
| **"P"** | **Primary** coverage. 🟦 COB labels are **P / S / T** (primary, secondary, tertiary). |
| Payer name | The insurance company |
| ID | Subscriber / member ID |
| **Active Coverage** (green badge) | **Eligibility came back active.** The 271 answer was positive. |
| Address | The payer's claims mailing address |
| Pencil icon | Edit |

### 5.5 Service and Diagnosis card 🟩
Same as the first walkthrough (Part 2 there). New details:
- **Study Status: Unread** (earlier screenshot said **Tech Start**). 🟨 So the sequence so far is **Tech Start → (exam finished) → Unread**. **Unread means the images exist but a radiologist has not read them yet.**
- Timeline now includes **Completed, 7 minutes ago, by System**. 🟨 "By System" most likely means an integration message from the scanner or RIS marked the exam done, since nobody clicked it in Gravity.
- **Authorized** is still grey, consistent with a screening mammogram that needs no prior auth.

### 5.6 The Booking tab: "Please contact Support to unlock this service" 🟩
A padlock message. The **Booking** module is **not enabled** for this order or tenant. 🟨 This suggests this customer has not turned on the Booking Center (Sandra), and **"Booked by System"** therefore likely came from the **RIS** through an **SIU** scheduling message instead. Confirm with your team.

### 5.7 The answer to an earlier open question 🟩
**RCI883325 is the Appointment ID.** The Orders list has a column named exactly that, and the first row shows the same value. 🟨 The "RCI" prefix probably identifies the center's RIS.

---

## Part 6. The Orders list, decoded

### 6.1 Toolbar 🟩
| Item | Meaning |
|---|---|
| **All** tab | Every order |
| **Search Order** | Free-text search |
| **Filters** | Same pattern as Documents filters |
| **Appointment Date: Today** | Date filter (here showing today's appointments) |
| **+ Create Order** | Make an order by hand (without a document) |
| Refresh, gear, list icon | Reload; column settings; list view. A calendar view is greyed out. 🟨 |
| **Displaying 1–10 of 128**, 10 / page, 13 pages | 128 orders match |

### 6.2 Columns 🟩
| Column | Meaning |
|---|---|
| **Patient Name** (link icon) | Linked patient |
| **Appointment ID** (`RCI…`) | The RIS appointment identifier |
| **Service** | The **CPT** code |
| **Service Category** | Modality group: **MG** mammography, **US** ultrasound |
| **Appointment Start Date** | Date and time of the slot |
| **Appointment Status** | **Completed, Booked, Checked In, Canceled** (colour-coded: grey outline, blue, green, red). The clock icon beside it is 🟨 likely a status history. A red clock on a *Booked* row may flag something overdue (🟨 unconfirmed). |
| **Priority** | Routine or STAT |
| **Insurance** | Payer(s) and member ID. **Numbers 1 and 2** next to payers mean **primary and secondary coverage (COB)**. |
| **Tags, Assignees** | Labels and owners |

### 6.3 What the four sample rows teach 🟩🟨
| Row | Service | Status | Teaching point |
|---|---|---|---|
| 1 | 77067, MG | **Completed** | A normal screening mammogram, the same order as your first screenshot (RCI883325) |
| 2 | 76700, US | **Booked** | CPT 76700 is a complete abdominal ultrasound 🟨. A health plan with a red clock: scheduled but not yet arrived. |
| 3 | 77067, MG | **Checked In** | **Two payers numbered 1 and 2:** a Medicare plan as primary and a second insurer as secondary. That is **coordination of benefits (COB)**. 🟨 |
| 4 | 38505, US | **Canceled** | CPT 38505 is a lymph-node needle biopsy 🟨. A canceled appointment is a freed slot (🟦 waitlist backfill is the highest-leverage scheduling task). The payer is a **Medicare Advantage** plan 🟨, which prior-auths more aggressively (🟦 payer mix). |

---

## Part 7. Who does what: human, AI, or the other systems

| Stage | Manual center (95%+ today) 🟦 | Sidekick mode 🟦 | Autonomous mode 🟦 |
|---|---|---|---|
| Receive document | Person watches fax queue | Gravity ingests every source | Same |
| Classify | Person reads and sorts | AI proposes category | AI decides; human only on **Human Review** |
| Extract | Person types into the RIS | AI fills the form; person checks | AI fills and accepts |
| Link patient | Person searches the RIS | AI proposes match; person confirms | Auto when confident |
| Create order | Person keys the order | Draft order workflow: person approves | **Auto Order Creation** |
| Throughput | ~10 orders/hour per scheduler | ~50/hour | 80–95% of volume with no human |

Where the other systems sit:
- **RIS:** the system of record for appointments and the worklist. Gravity sits on top and exchanges **HL7** messages (ADT for patients and coverage, ORM for orders, SIU for appointments, ORU for results).
- **PACS:** images and the radiologist's reading. Gravity never touches images.
- **EMR:** the doctor's chart. The source of e-referrals.
- **Clearinghouse (Availity):** carries the eligibility check behind **Click to Verify**.

---

## Part 8. Terms introduced by these screens (A–Z)

| Term | Meaning |
|---|---|
| **Active Coverage** | Badge showing the eligibility check found the policy active |
| **Appointment ID** | The RIS identifier of the booked exam (e.g., `RCI…`) |
| **Appointment Status** | Booked, Checked In, Completed, Canceled |
| **Assignee** | The staff member responsible for a document or order |
| **Auto Assigned** | 🟨 The AI set the document category itself |
| **Canceled** | Appointment cancelled; the slot becomes available |
| **Category / Category Status** | The kind of document, and how that was decided or handled |
| **Chain-link icon** | The record is linked to a patient |
| **Checked In** | The patient arrived |
| **Click to Verify** | Starts an eligibility check |
| **Completed** | The exam is finished (scan done) |
| **Create & Complete** | Create a new order from the document, then close the document |
| **Document Sync** | Automatic document import from another system |
| **Face sheet / order summary** | A one-page printout of an order's key data |
| **Hide Snoozed** | Hide items someone has postponed |
| **Human Review** | A person must check because the AI was unsure |
| **Include / Exclude** | Filter toggle: show only these / show all but these |
| **Last Checked** | When eligibility was last verified ("N/A" means never) |
| **Letter of Protection (LOP)** | 🟨 An attorney's guarantee of payment in injury cases |
| **Link & Complete** | Attach the document to an existing order, then close it |
| **Matching orders found** | Existing orders that may already fit this document |
| **P / S / T** | Primary, secondary, tertiary coverage |
| **PowerShare** | 🟨 An electronic image-sharing network (outside Gravity) |
| **Priority** | Routine or STAT |
| **Process** | Open a document to work on it |
| **Release of information (ROI)** | 🟨 A request to send a patient's records or images elsewhere |
| **Saved filter / Daily Practice** | A stored worklist view with a count |
| **Self-pay / TOS** | 🟨 The patient pays directly at the time of service |
| **Sparkle icon** | The AI action or AI marker |
| **Study Status** | Where the exam is clinically: Tech Start, then Unread (a radiologist has yet to read it), and so on |
| **Tenant switcher** | Choose which customer organization's data to view |
| **Unread** | Images done, awaiting the radiologist's report |
| **Visit ID (`GV…`)** | 🟨 Identifier of the encounter, also printed as the QR caption |

For everything else (CPT, ICD-10, eligibility, prior auth, COB, Compendium, Auth Rule, HL7 and so on), see the glossary in `gravity-process-walkthrough.md` (Part 6).

**Where your team's glossary connects to this stage.** The data points from your team glossary (**ordering provider**, **NPI**, **payer**, **subscriber ID**, **ICD-10**, **CPT**) are the exact fields the review screen asks for in Steps 4 to 8. If one is empty or wrong at this stage, the later **PASQ** (check for an existing auth) and **APAS** (assisted submission) cannot succeed. Full mapping of each term to its screen: `gravity-process-walkthrough.md`, Part 9.

---

## Part 9. Talking like an insider about this stage

- "Where do your documents come from, mostly **inbound fax**, **Document Sync**, or uploads?"
- "What share of documents land in **Human Review** versus **Auto Assigned**?"
- "Are you on the **draft order workflow** or **Auto Order Creation**?"
- "What do you see when **patient linking** is **No**? Is it a new patient or a mismatch?"
- "Is your **Compendium** clean? Near-duplicate exam names break matching."
- "Do you auto-verify **eligibility**, or does staff **Click to Verify**?"
- "How do you handle documents that aren't orders, like **release-of-information** requests?"
- "What does your **Daily Practice** worklist look like, and how many are waiting?"
- "Is **Booking** switched on for this tenant, or does the RIS create bookings through **SIU** messages?"

Reading the document screen aloud:
> "This is an inbound fax that the AI categorized as an Order. Patient is linked and the insurance is selected, but eligibility was never checked. Provider and service are empty, so Create & Complete is disabled. Seven possible matching orders exist, so we have to check before creating a duplicate. It's actually a records-release request, so it needs to go to Human Review instead."

---

## Part 10. Open questions for your team (updated)

Answered by this batch:
- ✅ **What is RCI883325?** The **Appointment ID**.
- ✅ **What follows Tech Start?** **Completed**, then **Unread** (waiting for the radiologist).

Still open:
1. What is the **full list** of Category Status, Status and Study Status values? (The dropdowns were cut off.)
2. What exactly do the **sparkle button** and **Process** button do (and which one runs the AI)?
3. Does the **"7 matching orders"** match by patient, date, service, or all three?
4. Is **"Completed by System"** driven by an HL7 message from the RIS or scanner?
5. What does the **red clock** on a Booked order mean?
6. What are the **flask** and **bug** icons?
7. When a records-release fax is categorized as **Order**, what is the correct handling (ROI team, tag, snooze)?
8. Who owns the **Gravity User Portal** source and who uses it?
9. What is the **Visit ID (`GV…`)** exactly, and how does it differ from the Appointment ID?

---
*Built from your screenshots and the printed order. 🟨 items are inferences, not documented facts. The Gravity mechanics are from the guide, whose source material is dated May 2026.*
