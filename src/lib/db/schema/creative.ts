import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { creativeFormatEnum, platformEnum } from "./enums";
import { queueItems } from "./queue";

export type CreativeSlide = {
  heading: string;
  subheading?: string;
  bodyText?: string;
};

/**
 * A brand-guided visual companion to a publish item — the "banner" the
 * user asked for. This is a structured CREATIVE BRIEF (headline copy,
 * format, platform-correct dimensions, brand-token references), not a
 * rendered image: no image-generation API is wired into this build (see
 * docs/ARCHITECTURE.md known gaps), so the deliverable is everything a
 * designer or an image-gen pipeline needs to produce the actual asset
 * without re-deriving brand rules or platform specs from scratch.
 */
export const creativeBriefs = pgTable("creative_briefs", {
  id: uuid("id").primaryKey().defaultRandom(),
  queueItemId: uuid("queue_item_id")
    .notNull()
    .references(() => queueItems.id, { onDelete: "cascade" }),

  platform: platformEnum("platform").notNull(),
  format: creativeFormatEnum("format").notNull(),

  widthPx: integer("width_px").notNull(),
  heightPx: integer("height_px").notNull(),
  aspectRatio: text("aspect_ratio").notNull(), // e.g. "4:5"

  slides: jsonb("slides").$type<CreativeSlide[]>().notNull(), // length 1 for static/trending, N for carousel
  cta: text("cta"),

  brandComplianceNotes: jsonb("brand_compliance_notes").$type<string[]>().notNull().default([]),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type CreativeBrief = typeof creativeBriefs.$inferSelect;
export type NewCreativeBrief = typeof creativeBriefs.$inferInsert;
