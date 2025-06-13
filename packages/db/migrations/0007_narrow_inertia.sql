ALTER TABLE "post" DROP CONSTRAINT "post_published_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "published_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "post" DROP COLUMN "published_by";