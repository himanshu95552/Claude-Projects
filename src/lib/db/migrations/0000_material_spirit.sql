CREATE TYPE "public"."app_role" AS ENUM('participant', 'operator', 'admin');--> statement-breakpoint
CREATE TYPE "public"."config_scope" AS ENUM('global', 'lane', 'participant');--> statement-breakpoint
CREATE TYPE "public"."emoji_setting" AS ENUM('never', 'rare', 'normal');--> statement-breakpoint
CREATE TYPE "public"."employment" AS ENUM('employee', 'contractor', 'advisor', 'founder');--> statement-breakpoint
CREATE TYPE "public"."fulfillment" AS ENUM('api_publish', 'manual_link');--> statement-breakpoint
CREATE TYPE "public"."generation_job_status" AS ENUM('queued', 'running', 'succeeded', 'failed');--> statement-breakpoint
CREATE TYPE "public"."lane_status" AS ENUM('open', 'claimed');--> statement-breakpoint
CREATE TYPE "public"."metric_source" AS ENUM('manual', 'api');--> statement-breakpoint
CREATE TYPE "public"."participant_status" AS ENUM('invited', 'onboarding', 'active', 'paused', 'exited');--> statement-breakpoint
CREATE TYPE "public"."platform_account_status" AS ENUM('connected', 'expiring_soon', 'expired', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."platform" AS ENUM('linkedin', 'instagram', 'facebook');--> statement-breakpoint
CREATE TYPE "public"."queue_item_status" AS ENUM('pending', 'done', 'skipped', 'failed');--> statement-breakpoint
CREATE TYPE "public"."queue_item_type" AS ENUM('publish', 'first_hour_comment', 'general_comment', 'reply', 'follow', 'connect', 'amplify_reshare', 'amplify_follow_invite');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('not_required', 'pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."review_tier" AS ENUM('self_approve', 'standard');--> statement-breakpoint
CREATE TYPE "public"."story_kind" AS ENUM('number', 'turning_point', 'position', 'anecdote');--> statement-breakpoint
CREATE TYPE "public"."target_stage" AS ENUM('cold', 'follow', 'warm_up', 'recognized', 'connect', 'conversation', 'handoff', 'retired');--> statement-breakpoint
CREATE TYPE "public"."voice_profile_source" AS ENUM('interview', 'writing_samples', 'edit_diffs', 'manual');--> statement-breakpoint
CREATE TABLE "lanes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"targets_persona" text NOT NULL,
	"pillars" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"do_rules" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"dont_rules" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" "lane_status" DEFAULT 'open' NOT NULL,
	"held_by_participant_id" uuid,
	"is_high_value" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lanes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"job_title" text NOT NULL,
	"employment" "employment" DEFAULT 'employee' NOT NULL,
	"app_roles" jsonb DEFAULT '["participant"]'::jsonb NOT NULL,
	"lane_id" uuid,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"available_window_start" text,
	"available_window_end" text,
	"reminder_time" text,
	"weekly_summary_day" text DEFAULT 'sunday' NOT NULL,
	"days_off" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"review_tier" "review_tier" DEFAULT 'standard' NOT NULL,
	"special_checks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"consent_at" timestamp with time zone,
	"consent_version" text,
	"status" "participant_status" DEFAULT 'invited' NOT NULL,
	"streak_days" integer DEFAULT 0 NOT NULL,
	"last_queue_cleared_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "participants_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "platform_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"participant_id" uuid NOT NULL,
	"platform" "platform" NOT NULL,
	"handle" text,
	"platform_user_id" text,
	"encrypted_access_token" text,
	"encrypted_refresh_token" text,
	"scopes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"expires_at" timestamp with time zone,
	"refresh_expires_at" timestamp with time zone,
	"status" "platform_account_status" DEFAULT 'connected' NOT NULL,
	"connected_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_refreshed_at" timestamp with time zone,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "story_bank_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"participant_id" uuid NOT NULL,
	"kind" "story_kind" NOT NULL,
	"content" text NOT NULL,
	"used_in_post_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "voice_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"participant_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"is_current" boolean DEFAULT true NOT NULL,
	"sliders" jsonb NOT NULL,
	"freetext_rules" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"banned_phrases" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"emoji_setting" "emoji_setting" DEFAULT 'never' NOT NULL,
	"source" "voice_profile_source" DEFAULT 'manual' NOT NULL,
	"source_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "targets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_participant_id" uuid NOT NULL,
	"name" text NOT NULL,
	"title" text,
	"center" text,
	"center_size" integer,
	"linkedin_url" text NOT NULL,
	"stage" "target_stage" DEFAULT 'cold' NOT NULL,
	"stage_history" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_collaboration_candidate" boolean DEFAULT false NOT NULL,
	"notes" text,
	"last_touch_at" timestamp with time zone,
	"retire_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "queue_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"queue_id" uuid NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"type" "queue_item_type" NOT NULL,
	"fulfillment" "fulfillment" NOT NULL,
	"content" text NOT NULL,
	"edited_content" text,
	"variants" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"explain" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"target_id" uuid,
	"source_post_url" text,
	"status" "queue_item_status" DEFAULT 'pending' NOT NULL,
	"skip_reason" text,
	"acted_at" timestamp with time zone,
	"platform_post_id" text,
	"review_status" "review_status" DEFAULT 'not_required' NOT NULL,
	"review_flags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"review_sla_due_at" timestamp with time zone,
	"reviewed_by_participant_id" uuid,
	"reviewed_at" timestamp with time zone,
	"review_note" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "queues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"participant_id" uuid NOT NULL,
	"for_date" date NOT NULL,
	"window_start" text,
	"window_end" text,
	"estimated_minutes" integer,
	"generated_at" timestamp with time zone,
	"generation_job_id" uuid,
	"completed_count" integer DEFAULT 0 NOT NULL,
	"total_count" integer DEFAULT 0 NOT NULL,
	"cleared_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scope" "config_scope" NOT NULL,
	"scope_ref" uuid,
	"settings" jsonb NOT NULL,
	"version" integer NOT NULL,
	"is_current" boolean DEFAULT true NOT NULL,
	"changed_by_participant_id" uuid,
	"change_note" text,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metric_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"participant_id" uuid,
	"platform" "platform",
	"impressions" integer,
	"reactions" integer,
	"comments" integer,
	"shares" integer,
	"profile_views" integer,
	"followers" integer,
	"source" "metric_source" DEFAULT 'manual' NOT NULL,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cleared_customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cleared_customers_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "magic_link_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "magic_link_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"participant_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	CONSTRAINT "sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "push_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"participant_id" uuid NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "push_subscriptions_endpoint_unique" UNIQUE("endpoint")
);
--> statement-breakpoint
CREATE TABLE "api_usage_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"generation_job_id" uuid,
	"model" text NOT NULL,
	"job_type" text NOT NULL,
	"input_tokens" integer NOT NULL,
	"output_tokens" integer NOT NULL,
	"cached_input_tokens" integer DEFAULT 0 NOT NULL,
	"cost_usd" numeric(10, 4) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generation_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "generation_job_status" DEFAULT 'queued' NOT NULL,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"participants_processed" integer DEFAULT 0 NOT NULL,
	"items_generated" integer DEFAULT 0 NOT NULL,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weekly_summaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"participant_id" uuid NOT NULL,
	"week_start" date NOT NULL,
	"posts_shipped" integer DEFAULT 0 NOT NULL,
	"posts_planned" integer DEFAULT 0 NOT NULL,
	"queue_completion_pct" integer DEFAULT 0 NOT NULL,
	"top_post_id" uuid,
	"top_post_summary" text,
	"what_changed" text,
	"participation_nudge_sent" boolean DEFAULT false NOT NULL,
	"detail" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"generated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_lane_id_lanes_id_fk" FOREIGN KEY ("lane_id") REFERENCES "public"."lanes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_accounts" ADD CONSTRAINT "platform_accounts_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_bank_entries" ADD CONSTRAINT "story_bank_entries_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_profiles" ADD CONSTRAINT "voice_profiles_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "targets" ADD CONSTRAINT "targets_owner_participant_id_participants_id_fk" FOREIGN KEY ("owner_participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queue_items" ADD CONSTRAINT "queue_items_queue_id_queues_id_fk" FOREIGN KEY ("queue_id") REFERENCES "public"."queues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queue_items" ADD CONSTRAINT "queue_items_target_id_targets_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."targets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queue_items" ADD CONSTRAINT "queue_items_reviewed_by_participant_id_participants_id_fk" FOREIGN KEY ("reviewed_by_participant_id") REFERENCES "public"."participants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queues" ADD CONSTRAINT "queues_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "configs" ADD CONSTRAINT "configs_changed_by_participant_id_participants_id_fk" FOREIGN KEY ("changed_by_participant_id") REFERENCES "public"."participants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric_snapshots" ADD CONSTRAINT "metric_snapshots_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_usage_log" ADD CONSTRAINT "api_usage_log_generation_job_id_generation_jobs_id_fk" FOREIGN KEY ("generation_job_id") REFERENCES "public"."generation_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_summaries" ADD CONSTRAINT "weekly_summaries_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;