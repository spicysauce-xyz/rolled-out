import { Database, schema } from "@services/db";
import { and, asc, eq, gte } from "drizzle-orm";
import { ResultAsync } from "neverthrow";

export const UserRepository = {
  findOrganizations: (userId: string) => {
    return ResultAsync.fromPromise(
      Database.query.member.findMany({
        where: eq(schema.member.userId, userId),
        orderBy: [asc(schema.member.createdAt)],
        columns: {
          role: true,
        },
        with: {
          organization: {
            columns: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      }),
      () => new Error("Failed to fetch organizations")
    ).map((memberships) => {
      return memberships.map((membership) => ({
        id: membership.organization.id,
        name: membership.organization.name,
        slug: membership.organization.slug ?? "",
        logo: membership.organization.logo,
        role: membership.role,
        createdAt: membership.organization.createdAt,
        updatedAt: membership.organization.updatedAt,
      }));
    });
  },
  leaveOrganization: (userId: string, organizationId: string) => {
    return ResultAsync.fromPromise(
      Database.delete(schema.member)
        .where(
          and(
            eq(schema.member.userId, userId),
            eq(schema.member.organizationId, organizationId)
          )
        )
        .returning(),
      () => new Error("Failed to leave organization")
    ).map(([member]) => {
      return member;
    });
  },
  findPendingInvitations: (email: string) => {
    return ResultAsync.fromPromise(
      Database.query.invitation.findMany({
        where: and(
          eq(schema.invitation.email, email),
          eq(schema.invitation.status, "pending"),
          gte(schema.invitation.expiresAt, new Date())
        ),
        with: {
          inviter: {
            columns: {
              id: true,
            },
            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          organization: {
            columns: {
              id: true,
              name: true,
              slug: true,
              logo: true,
            },
          },
        },
      }),
      () => new Error("Failed to find pending invitations")
    );
  },
  acceptInvitationById: (email: string, invitationId: string) => {
    return ResultAsync.fromPromise(
      Database.update(schema.invitation)
        .set({ status: "accepted" })
        .where(
          and(
            eq(schema.invitation.email, email),
            eq(schema.invitation.id, invitationId)
          )
        )
        .returning(),
      () => new Error("Failed to accept invitation")
    ).map(([invitation]) => {
      return invitation;
    });
  },
  rejectInvitationById: (email: string, invitationId: string) => {
    return ResultAsync.fromPromise(
      Database.update(schema.invitation)
        .set({ status: "rejected" })
        .where(
          and(
            eq(schema.invitation.id, invitationId),
            eq(schema.invitation.email, email)
          )
        ),
      () => new Error("Failed to reject invitation")
    );
  },
};
