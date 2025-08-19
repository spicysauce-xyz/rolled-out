ALTER TABLE "notification" DROP CONSTRAINT "notification_recipient_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "notification" DROP CONSTRAINT "notification_sender_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "notifications_read_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "notification" ADD COLUMN "recipient_member_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "notification" ADD COLUMN "sender_member_id" uuid;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_recipient_member_id_member_id_fk" FOREIGN KEY ("recipient_member_id") REFERENCES "public"."member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_sender_member_id_member_id_fk" FOREIGN KEY ("sender_member_id") REFERENCES "public"."member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" DROP COLUMN "recipient_id";--> statement-breakpoint
ALTER TABLE "notification" DROP COLUMN "sender_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "notifications_read_at";