ALTER TABLE "invitation" DROP CONSTRAINT "invitation_inviter_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_member_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."member"("id") ON DELETE cascade ON UPDATE no action;