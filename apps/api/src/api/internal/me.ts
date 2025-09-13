import type { AuthMiddleware } from "@api/middleware/auth";
import { Emitter } from "@services/events";
import { notOk, ok } from "@utils/network";
import { Hono } from "hono";
import { UserAcceptedInvitationEvent } from "../../domain/user/user.events";
import { UserService } from "../../domain/user/user.service";

type Variables = AuthMiddleware<true>["Variables"];

export const MeRouter = new Hono<{ Variables: Variables }>()
  .get("/organizations", (c) => {
    const user = c.get("user");

    return UserService.findOrganizations(user).match(
      (organizations) => ok(c, organizations),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })
  .put("/organizations/:organizationId/leave", (c) => {
    const user = c.get("user");
    const organizationId = c.req.param("organizationId");

    return UserService.leaveOrganization(user, organizationId).match(
      (organization) => ok(c, organization),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })
  .get("/invitations", (c) => {
    const user = c.get("user");

    return UserService.findPendingInvitations(user).match(
      (invitations) => ok(c, invitations),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })
  .put("/invitations/:invitationId/accept", (c) => {
    const user = c.get("user");
    const invitationId = c.req.param("invitationId");

    return UserService.acceptInvitation(user, invitationId)
      .andThrough((invitation) =>
        Emitter.emitAsync(
          UserAcceptedInvitationEvent.eventName,
          new UserAcceptedInvitationEvent(
            user.id,
            invitation.organizationId,
            invitation.role
          )
        )
      )
      .match(
        (invitation) => ok(c, invitation),
        (error) => notOk(c, { message: error.message }, 500)
      );
  })
  .put("/invitations/:invitationId/reject", (c) => {
    const user = c.get("user");
    const invitationId = c.req.param("invitationId");

    return UserService.rejectInvitation(user, invitationId).match(
      (invitation) => ok(c, invitation),
      (error) => notOk(c, { message: error.message }, 500)
    );
  });
