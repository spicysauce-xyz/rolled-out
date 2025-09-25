CREATE TABLE "github_pending_commit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"integration_id" uuid NOT NULL,
	"commit_id" text NOT NULL,
	"object_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "github_pending_commit_commit_id_integration_id_unique" UNIQUE("commit_id","integration_id")
);
--> statement-breakpoint
ALTER TABLE "github_pending_commit" ADD CONSTRAINT "github_pending_commit_integration_id_github_integration_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."github_integration"("id") ON DELETE cascade ON UPDATE no action;