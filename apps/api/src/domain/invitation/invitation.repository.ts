import { Database, type InvitationInsert, schema } from "@services/db";
import { and, eq, gte } from "drizzle-orm";
import { err, ok, ResultAsync } from "neverthrow";

export const InvitationRepository = {
  findInvitationById: (id: string) => {
    return ResultAsync.fromPromise(
      Database.query.invitation.findFirst({
        where: eq(schema.invitation.id, id),
      }),
      () => new Error("Failed to find invitation")
    ).andThen((invitation) => {
      if (!invitation) {
        return err(new Error("Invitation not found"));
      }

      return ok(invitation);
    });
  },
  findInvitationsByOrganizationId: (organizationId: string) => {
    return ResultAsync.fromPromise(
      Database.query.invitation.findMany({
        where: and(
          eq(schema.invitation.organizationId, organizationId),
          eq(schema.invitation.status, "pending"),
          gte(schema.invitation.expiresAt, new Date())
        ),
        columns: {
          id: true,
          organizationId: true,
          email: true,
          role: true,
          expiresAt: true,
          createdAt: true,
          updatedAt: true,
          status: true,
        },
        with: {
          inviter: {
            columns: {
              id: true,
              role: true,
            },
            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      () => new Error("Failed to fetch invitations")
    );
  },
  createInvitation: (
    data: Pick<
      InvitationInsert,
      "email" | "organizationId" | "inviterId" | "role"
    >
  ) => {
    return ResultAsync.fromPromise(
      Database.insert(schema.invitation)
        .values({
          email: data.email,
          organizationId: data.organizationId,
          inviterId: data.inviterId,
          role: data.role as "member" | "admin" | "owner",
          status: "pending",
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
        })
        .returning(),
      () => new Error("Failed to create invitation")
    ).map(([invitation]) => {
      return invitation;
    });
  },
  deleteInvitation: (id: string) => {
    return ResultAsync.fromPromise(
      Database.delete(schema.invitation)
        .where(eq(schema.invitation.id, id))
        .returning(),
      () => new Error("Failed to delete invitation")
    ).andThen(([invitation]) => {
      if (!invitation) {
        return err(new Error("Invitation not found"));
      }

      return ok(invitation);
    });
  },
};
