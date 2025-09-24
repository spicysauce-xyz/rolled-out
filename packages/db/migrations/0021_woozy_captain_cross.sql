CREATE TABLE "github_integration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"installation_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "github_integration_installation_id_unique" UNIQUE("installation_id"),
	CONSTRAINT "unique_installation_id" UNIQUE("installation_id","organization_id")
);
--> statement-breakpoint
CREATE TABLE "github_repository" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"integration_id" uuid NOT NULL,
	"repository_id" text NOT NULL,
	"name" text NOT NULL,
	"owner" text NOT NULL,
	"main_branch" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "github_repository_repository_id_integration_id_unique" UNIQUE("repository_id","integration_id")
);
--> statement-breakpoint
ALTER TABLE "github_integration" ADD CONSTRAINT "github_integration_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "github_repository" ADD CONSTRAINT "github_repository_integration_id_github_integration_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."github_integration"("id") ON DELETE cascade ON UPDATE no action;