import type { AuthMiddleware } from "@api/middleware/auth";
import type { OrganizationMiddleware } from "@api/middleware/organization";
import { validate } from "@api/middleware/validate";
import { Email } from "@email";
import { notOk, ok } from "@utils/network";
import { Hono } from "hono";
import { z } from "zod";
import { InvitationService } from "../../domain/invitation/invitation.service";

type Variables = OrganizationMiddleware["Variables"] &
  AuthMiddleware<true>["Variables"];

export const InvitationsRouter = new Hono<{ Variables: Variables }>()

  .get("/", (c) => {
    const member = c.get("member");

    return InvitationService.findInvitationsByOrganizationId(
      member,
      member.organizationId
    ).match(
      (invitations) => ok(c, invitations),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })
  .post(
    "/",
    validate(
      "json",
      z.object({
        email: z.string(),
        role: z.enum(["member", "admin", "owner"]),
      })
    ),
    (c) => {
      const member = c.get("member");
      const user = c.get("user");
      const organization = c.get("organization");
      const data = c.req.valid("json");

      return InvitationService.createInvitation(member, {
        email: data.email,
        role: data.role,
        organizationId: member.organizationId,
        inviterId: member.id,
      })
        .andThrough(() =>
          Email.sendMemberInviteEmail({
            to: data.email,
            props: {
              organizationName: organization.name,
              inviterName: user.name,
            },
          })
        )
        .match(
          (invitation) => ok(c, invitation),
          (error) => notOk(c, { message: error.message }, 500)
        );
    }
  )
  .delete("/:invitationId", (c) => {
    const member = c.get("member");
    const id = c.req.param("invitationId");

    return InvitationService.deleteInvitation(member, id).match(
      (invitation) => ok(c, invitation),
      (error) => notOk(c, { message: error.message }, 500)
    );
  });
