import "dotenv/config";
import { db } from "../src/lib/db/client";
import {
  clearedCustomers,
  lanes,
  participants,
  storyBankEntries,
  targets,
  voiceProfiles,
} from "../src/lib/db/schema";
import { writeConfig } from "../src/lib/config/resolve";
import { CLIENT_STORIES, NAMEABLE_CLIENTS } from "../src/lib/knowledge/proof";

/**
 * Seeds the real program data from the handoff package:
 * 02-program-design/roster.md, lanes.md, governance.md, participants/*,
 * and the worked-example targets from queue/EXAMPLE-worked.md. Safe to
 * re-run — upserts by natural key (slug/email/name) rather than blindly
 * inserting duplicates.
 */
async function main() {
  console.log("Seeding lanes...");
  const laneRows = await db
    .insert(lanes)
    .values([
      {
        name: "Category education",
        slug: "category-education",
        targetsPersona: "Buyers new to the category",
        pillars: [
          "What order-to-payment automation means in one workflow",
          "The gap between how imaging ops is described and how it runs",
          "Interoperability and intake in plain language",
          "Category explainers as carousels",
        ],
        doRules: ["Own the weekly document/carousel — the best vehicle for teaching a category", "Explain, don't opine"],
        dontRules: ["Compete with the Industry POV lane", "Take specialist positions on RCM"],
        status: "claimed",
        isHighValue: false,
      },
      {
        name: "Industry POV",
        slug: "industry-pov",
        targetsPersona: "Owners / execs",
        pillars: [
          "The structural problem with order-to-payment in imaging",
          "Where independent centers get squeezed (payer behavior, consolidation, margin)",
          "Contrarian positions on AI in healthcare ops",
          "Milestones and hiring, sparingly",
        ],
        doRules: ["Take real positions", "Name hard tradeoffs", "Disagree with prevailing industry opinion where genuine"],
        dontRules: ["Product feature posts — that's the company page's job"],
        status: "claimed",
        isHighValue: false,
      },
      {
        name: "Revenue cycle",
        slug: "revenue-cycle",
        targetsPersona: "RCM leaders",
        pillars: ["Denials", "Prior auth", "Appeals", "Payer behavior", "Days in AR"],
        doRules: ["Only for someone who actually works in RCM"],
        dontRules: [],
        status: "open",
        isHighValue: true,
      },
      {
        name: "Patient access / scheduling",
        slug: "patient-access-scheduling",
        targetsPersona: "Ops / patient access leaders",
        pillars: ["Front-desk reality", "No-shows", "Missing order fields", "Scheduling under auth uncertainty"],
        doRules: ["Only for someone who actually schedules or manages scheduling"],
        dontRules: [],
        status: "open",
        isHighValue: true,
      },
      {
        name: "Buyer-side patterns",
        slug: "buyer-side-patterns",
        targetsPersona: "Anyone evaluating",
        pillars: ["What centers ask first", "How decisions get made", "Objections worth taking seriously"],
        doRules: ["Only for someone who sits in real customer conversations"],
        dontRules: [],
        status: "open",
        isHighValue: false,
      },
      {
        name: "Implementation reality",
        slug: "implementation-reality",
        targetsPersona: "Ops leaders, skeptical buyers",
        pillars: ["What going live actually looks like", "Honest tradeoffs", "Integration friction"],
        doRules: ["Only for someone who has run implementations"],
        dontRules: [],
        status: "open",
        isHighValue: false,
      },
      {
        name: "Interoperability / intake",
        slug: "interoperability-intake",
        targetsPersona: "Technical ops, IT",
        pillars: ["HL7", "Order intake", "Why systems don't talk", "The fax problem, structurally"],
        doRules: ["Only for someone who works on integrations"],
        dontRules: [],
        status: "open",
        isHighValue: false,
      },
    ])
    .onConflictDoNothing({ target: lanes.slug })
    .returning();

  const allLanes = laneRows.length > 0 ? laneRows : await db.select().from(lanes);
  const categoryEducation = allLanes.find((l) => l.slug === "category-education")!;
  const industryPov = allLanes.find((l) => l.slug === "industry-pov")!;

  console.log("Seeding governance: cleared customers (from the knowledge base)...");
  // Both quoted client stories and name-freely clients are safe to reference
  // in content per claims.ts's SAFE_WITH_LINK / SAFE_NAME_ONLY distinction --
  // the customer_name_mentioned governance flag still fires either way, so a
  // reviewer confirms which kind of reference is being made.
  const clearedNames = [...CLIENT_STORIES.map((c) => c.name), ...NAMEABLE_CLIENTS];
  for (const name of clearedNames) {
    await db.insert(clearedCustomers).values({ name }).onConflictDoNothing({ target: clearedCustomers.name });
  }

  console.log("Seeding participants...");
  const [tushant] = await db
    .insert(participants)
    .values({
      email: "tushant@alphanodus.com",
      fullName: "Tushant Suneja",
      jobTitle: "Marketing Manager",
      employment: "employee",
      appRoles: ["participant", "operator", "admin"],
      laneId: categoryEducation.id,
      timezone: "Asia/Kolkata",
      availableWindowStart: "17:30",
      availableWindowEnd: "23:30",
      reminderTime: "17:00",
      reviewTier: "self_approve",
      status: "active",
      consentAt: new Date(),
      consentVersion: "v1",
    })
    .onConflictDoUpdate({
      target: participants.email,
      set: { laneId: categoryEducation.id, status: "active" },
    })
    .returning();

  const [shamit] = await db
    .insert(participants)
    .values({
      email: "shamit@alphanodus.com",
      fullName: "Shamit Patel",
      jobTitle: "CEO & Founder",
      employment: "founder",
      appRoles: ["participant", "admin"],
      laneId: industryPov.id,
      timezone: "America/New_York",
      availableWindowStart: "08:00",
      availableWindowEnd: "18:00",
      reminderTime: "08:00",
      reviewTier: "self_approve",
      status: "active",
      consentAt: new Date(),
      consentVersion: "v1",
    })
    .onConflictDoUpdate({
      target: participants.email,
      set: { laneId: industryPov.id, status: "active" },
    })
    .returning();

  console.log("Seeding participant-scope cadence config...");
  await writeConfig({
    scope: "participant",
    scopeRef: tushant.id,
    settings: {
      cadence: { postsPerWeek: 3, commentsPerDay: 6, connectionInvitesPerDay: 4, pageFollowInvitesPerMonth: 20, pageResharesPerWeek: 1 },
      timing: { timezone: "Asia/Kolkata", queueDeliveryTime: "17:00", preferredPostingWindowStart: "17:30", preferredPostingWindowEnd: "23:30" },
    },
    changeNote: "Seed: Tushant's config from participants/tushant/config.md",
  });
  await writeConfig({
    scope: "participant",
    scopeRef: shamit.id,
    settings: {
      cadence: { postsPerWeek: 2, commentsPerDay: 4, connectionInvitesPerDay: 3, pageFollowInvitesPerMonth: 20, pageResharesPerWeek: 1 },
      timing: { timezone: "America/New_York" },
    },
    changeNote: "Seed: Shamit's config from participants/shamit/config.md",
  });

  console.log("Seeding voice profiles...");
  await db.insert(voiceProfiles).values([
    {
      participantId: tushant.id,
      version: 1,
      isCurrent: true,
      sliders: { formality: 45, sentenceLength: 55, hedging: 20, humor: 35, directness: 75, technicalDepth: 60 },
      freetextRules: ["Short sentences", "Explain, don't opine — teaching is the lane"],
      bannedPhrases: ["game-changer", "excited to announce"],
      emojiSetting: "never",
      source: "manual",
    },
    {
      participantId: shamit.id,
      version: 1,
      isCurrent: true,
      sliders: { formality: 40, sentenceLength: 50, hedging: 15, humor: 25, directness: 90, technicalDepth: 55 },
      freetextRules: ["Take real positions", "Name hard tradeoffs"],
      bannedPhrases: ["thrilled to share"],
      emojiSetting: "never",
      source: "manual",
    },
  ]);

  console.log("Seeding story bank entries...");
  await db.insert(storyBankEntries).values([
    {
      participantId: tushant.id,
      kind: "anecdote",
      content: "A billing manager who kept a denial log in a spiral notebook because her four systems didn't talk to each other.",
    },
    {
      participantId: tushant.id,
      kind: "number",
      content: "Roughly a dozen handoffs happen between an imaging order arriving and the claim being paid.",
    },
    {
      participantId: shamit.id,
      kind: "position",
      content: "Independent centers aren't losing on clinical quality — they're losing on administrative load per study, which scales with payer complexity, not patient count.",
    },
  ]);

  console.log("Seeding targets (from queue/EXAMPLE-worked.md)...");
  await db.insert(targets).values([
    {
      ownerParticipantId: tushant.id,
      name: "Marcus Webb",
      title: "Director of Operations",
      center: "Coastal Imaging Partners (4 sites)",
      linkedinUrl: "https://linkedin.com/in/marcuswebb-ops",
      stage: "recognized",
      stageHistory: [
        { stage: "follow", at: new Date(Date.now() - 20 * 86_400_000).toISOString(), evidence: "Added to roster, followed" },
        { stage: "warm_up", at: new Date(Date.now() - 15 * 86_400_000).toISOString(), evidence: "Commented on 2 posts" },
        { stage: "recognized", at: new Date(Date.now() - 9 * 86_400_000).toISOString(), evidence: "replied to your comment twice — Sep 12 and today" },
      ],
      lastTouchAt: new Date(Date.now() - 9 * 86_400_000),
    },
    {
      ownerParticipantId: tushant.id,
      name: "Priya Raman",
      title: "Practice Administrator",
      center: "Summit Diagnostic",
      linkedinUrl: "https://linkedin.com/in/priyaraman",
      stage: "warm_up",
      stageHistory: [
        { stage: "follow", at: new Date(Date.now() - 5 * 86_400_000).toISOString(), evidence: "Added to roster, followed" },
      ],
      lastTouchAt: new Date(Date.now() - 1 * 86_400_000),
    },
    {
      ownerParticipantId: tushant.id,
      name: "Dana Olsen",
      title: "RCM Manager",
      center: "Riverbend Imaging",
      linkedinUrl: "https://linkedin.com/in/danaolsen-rcm",
      stage: "cold",
      stageHistory: [],
    },
    {
      ownerParticipantId: tushant.id,
      name: "James Ferraro",
      title: "Practice Owner",
      center: "Ferraro Diagnostic",
      linkedinUrl: "https://linkedin.com/in/jferraro",
      stage: "cold",
      stageHistory: [],
    },
    {
      ownerParticipantId: shamit.id,
      name: "Dr. Anita Shah",
      title: "Radiologist",
      center: "Independent practice",
      linkedinUrl: "https://linkedin.com/in/dranitashah",
      stage: "warm_up",
      stageHistory: [
        { stage: "follow", at: new Date(Date.now() - 12 * 86_400_000).toISOString(), evidence: "Added to roster, followed" },
      ],
      lastTouchAt: new Date(Date.now() - 3 * 86_400_000),
    },
  ]);

  console.log("\nSeed complete.");
  console.log(`  Tushant: ${tushant.email} (id ${tushant.id})`);
  console.log(`  Shamit:  ${shamit.email} (id ${shamit.id})`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
