ALTER TABLE "post" ALTER COLUMN "published_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "updated_at" SET DEFAULT now();