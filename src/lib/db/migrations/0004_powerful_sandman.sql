ALTER TABLE "queue_item_revisions" DROP CONSTRAINT "queue_item_revisions_created_by_participant_id_participants_id_fk";
--> statement-breakpoint
ALTER TABLE "queue_item_revisions" ADD CONSTRAINT "queue_item_revisions_created_by_participant_id_participants_id_fk" FOREIGN KEY ("created_by_participant_id") REFERENCES "public"."participants"("id") ON DELETE set null ON UPDATE no action;