CREATE TYPE "public"."creative_format" AS ENUM('static', 'carousel', 'trending');--> statement-breakpoint
CREATE TYPE "public"."revision_source" AS ENUM('original', 'edited', 'regenerated');--> statement-breakpoint
ALTER TYPE "public"."platform" ADD VALUE 'x';--> statement-breakpoint
CREATE TABLE "creative_briefs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"queue_item_id" uuid NOT NULL,
	"platform" "platform" NOT NULL,
	"format" "creative_format" NOT NULL,
	"width_px" integer NOT NULL,
	"height_px" integer NOT NULL,
	"aspect_ratio" text NOT NULL,
	"slides" jsonb NOT NULL,
	"cta" text,
	"brand_compliance_notes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "queue_item_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"queue_item_id" uuid NOT NULL,
	"content" text NOT NULL,
	"source" "revision_source" NOT NULL,
	"reason" text,
	"created_by_participant_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "metric_snapshots" ADD COLUMN "queue_item_id" uuid;--> statement-breakpoint
ALTER TABLE "metric_snapshots" ADD COLUMN "saves" integer;--> statement-breakpoint
ALTER TABLE "metric_snapshots" ADD COLUMN "clicks" integer;--> statement-breakpoint
ALTER TABLE "metric_snapshots" ADD COLUMN "video_views" integer;--> statement-breakpoint
ALTER TABLE "metric_snapshots" ADD COLUMN "video_completion_pct" integer;--> statement-breakpoint
ALTER TABLE "creative_briefs" ADD CONSTRAINT "creative_briefs_queue_item_id_queue_items_id_fk" FOREIGN KEY ("queue_item_id") REFERENCES "public"."queue_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queue_item_revisions" ADD CONSTRAINT "queue_item_revisions_queue_item_id_queue_items_id_fk" FOREIGN KEY ("queue_item_id") REFERENCES "public"."queue_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queue_item_revisions" ADD CONSTRAINT "queue_item_revisions_created_by_participant_id_participants_id_fk" FOREIGN KEY ("created_by_participant_id") REFERENCES "public"."participants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric_snapshots" ADD CONSTRAINT "metric_snapshots_queue_item_id_queue_items_id_fk" FOREIGN KEY ("queue_item_id") REFERENCES "public"."queue_items"("id") ON DELETE cascade ON UPDATE no action;