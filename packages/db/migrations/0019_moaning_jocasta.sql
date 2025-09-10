ALTER TABLE "editor" DROP CONSTRAINT "editor_post_id_user_id_unique";--> statement-breakpoint
ALTER TABLE "editor" DROP CONSTRAINT "editor_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "invitation" ALTER COLUMN "role" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "invitation" ALTER COLUMN "role" SET DEFAULT 'member';--> statement-breakpoint
ALTER TABLE "invitation" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "editor" ADD COLUMN "member_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "editor" ADD COLUMN "role" varchar DEFAULT 'editor' NOT NULL;--> statement-breakpoint
ALTER TABLE "editor" ADD CONSTRAINT "editor_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "editor" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "editor" ADD CONSTRAINT "editor_post_id_member_id_unique" UNIQUE("post_id","member_id");