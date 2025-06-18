CREATE TABLE "editor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "editor_post_id_user_id_unique" UNIQUE("post_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "post_created_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "editor" ADD CONSTRAINT "editor_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "editor" ADD CONSTRAINT "editor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" DROP COLUMN "content";--> statement-breakpoint
ALTER TABLE "post" DROP COLUMN "created_by";