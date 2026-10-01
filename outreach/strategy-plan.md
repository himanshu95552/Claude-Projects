# Strategy behind the Gravity cold emails

Honest framing first: none of this has been tested on real replies yet. The plan combines your research dossier, Shamit's sample and general cold-email benchmarks (mostly vendor-published, so directional). The first send is a learning round.

## 1. Goal
Get a reply from the right person at an independent imaging center, with the least risk to the sending domain and to Alpha Nodus's credibility. A reply, not a click, is the success metric (open rates are unreliable since Apple Mail Privacy Protection).

## 2. Inputs and how each was used
| Input | What it decided |
|---|---|
| Research dossier | Approved facts and numbers, which clients can be named, which claims to avoid (SOC 2, "order to payment", RIS replacement, unsourced stats), benchmarks, legal limits |
| Shamit's forwarded email | The tone to aim for (short, playful, personal, honest closing line) and the "name on an object" idea |
| Lead sheet (38 rows) | Who to email, in what seat, and who to hold (verification status, role tag, domain) |
| Demo page | The "try it yourself" offer. I could not open it, so its details are assumed from the dossier |
| AN27 knowledge base | Not available. Role angles were derived from the dossier instead |
| Web searches | Prospect facts (flagged to verify) and current cold-email practice |

## 3. The strategy in eight moves
1. **Gate the list before writing.** Only Hunter-verified addresses in the independent-center profile go first. Catch-all domains, shared mailboxes, enterprise domains (radnet.com) and non-imaging organizations are held. This protects deliverability, which matters more than any copy.
2. **Cap contacts per organization at two, four days apart, different angles.** Emailing six people at one site looks like a blast and raises complaints.
3. **Pick the seat before the message.** Operators and finance reply 2 to 3 times more than physicians (dossier benchmark), then owners. Radiologists get a different, later message. IT gets an integration message. Marketing gets a routing question only.
4. **One formula per seat, one idea per email.**
   - Finance: a timed experiment ("can you beat 90 seconds?"). It sets a challenge with an approved number.
   - Operators and owners: the "3:15 on a Tuesday" scene, which makes the cost of an empty slot visible and ties to the Reel.
   - IT: HL7 and FHIR fit, "it does not replace your RIS" (removes the top objection).
   - Clinical: one AMA 2025 figure on prior-auth delays, then "who owns this?".
   - Marketing: "not a pitch, can you point me to the right person?".
5. **Casual, specific, short.** Under 80 words, lowercase subjects of 4 to 6 words anchored to a workflow they own, a first-name open, one soft interest CTA ("want the link, or is that too forward?"), no "hope you're well". This follows Shamit's sample and the benchmarks (interest CTAs beat hard asks at the cold stage).
6. **Proof from the strongest allowed source.** Approved product numbers first (80%, under 2% denials, 99.8%, about 90 seconds, 83M documents). Then public customers (Atlantic Medical Imaging, Bright Light, Iowa Radiology). Partnership proof (RamSoft, ADS) is reserved for RIS-matched prospects. Nothing the dossier says to avoid.
7. **Personalise with facts I could source, and flag the rest.** First name, role, organization name, and for three prospects one researched fact (e-Rad, five locations, owner's day-to-day). Anything from a search snippet is marked "verify before sending". No patient data, ever.
8. **Plain text first, banners later.** Touch 1 has no link, image, pixel or attachment, because the benchmarks and Microsoft Defender gateways punish them. The personalised banner (name on the object, like Shamit's coffee cup) joins from touch 2, and the demo link from touch 3, unless you choose the upfront-link test cell.

## 4. Sequence (about 40 days, same thread)
Day 1 observation and soft CTA. Day 4 different angle with peer proof. Day 10 first links (demo plus one press release) and the banner. Day 18 role-specific industry stat with its year label. Day 28 to 40 break-up note ("still empty at 3:15?"). Second contacts at an organization start on day 5.

## 5. Guardrails (legal and brand)
- CAN-SPAM: truthful subject, postal address, reply-to-stop line honoured.
- TCPA: no cold texts, no cold calls from the Sandra agent.
- HIPAA: no patient details in emails; tell prospects to use a test order in the demo.
- Brand: approved claims only, no em dashes, no emoji, "system" not "platform", no guarantees, no certifications.
- Deliverability: SPF, DKIM and DMARC alignment (the sample header shows DKIM on Google's default key and DMARC at p=none), a warmed custom domain, 10 to 12 sends per mailbox per day, no shorteners or tracking links.

## 6. How we will know it works
Reply rate and hard-bounce rate per test cell: link-free, plain-text demo URL upfront, and link-free plus banner. Wave 1 is about 8 sends, so read every reply and change one thing at a time. Pause if hard bounces pass about 2% or any spam complaint arrives. Benchmarks to aim for with a tight list: 2 to 4% average, 5%+ good.

## 7. What I was unsure about
- The AN27 role sheet was missing, so the role angles are inferred.
- Prospect research came from search snippets only (their sites were blocked).
- The benchmark numbers come from sending-software vendors and are directional.
- "Casual" copy and the personalised image are untested for this audience; Shamit's own experience is one data point.
- The claims, sender name and demo data rules need your sign-off (see the README).
