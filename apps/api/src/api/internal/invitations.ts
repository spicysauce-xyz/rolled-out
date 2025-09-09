import type { AuthMiddleware } from "@api/middleware/auth";
import type { OrganizationMiddleware } from "@api/middleware/organization";
import { Email } from "@email";
import { validator } from "@services/validator";
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
      member.organizationId
    ).match(
      (invitations) => ok(c, invitations),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })
  .post(
    "/",
    validator("json", z.object({ email: z.string(), role: z.string() })),
    (c) => {
      const member = c.get("member");
      const user = c.get("user");
      const organization = c.get("organization");
      const data = c.req.valid("json");

      return InvitationService.createInvitation({
        email: data.email,
        role: data.role,
        organizationId: member.organizationId,
        inviterId: member.userId,
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
    return InvitationService.deleteInvitation(
      c.req.param("invitationId")
    ).match(
      (invitation) => ok(c, invitation),
      (error) => notOk(c, { message: error.message }, 500)
    );
  });
