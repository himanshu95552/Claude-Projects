ALTER TABLE "queue_items" DROP CONSTRAINT "queue_items_target_id_targets_id_fk";
--> statement-breakpoint
ALTER TABLE "queue_items" ADD CONSTRAINT "queue_items_target_id_targets_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."targets"("id") ON DELETE set null ON UPDATE no action;