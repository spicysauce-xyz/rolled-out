import { Database, schema } from "@services/db";
import { and, count, desc, eq, gte } from "drizzle-orm";
import { ResultAsync } from "neverthrow";

export const NotificationRepository = {
  create: (data: typeof schema.notification.$inferInsert) => {
    return ResultAsync.fromPromise(
      Database.insert(schema.notification).values(data),
      () => new Error("Failed to create notification")
    );
  },
  getNotificationsForMember: (
    member: { id: string },
    { limit, offset }: { limit: number; offset: number }
  ) => {
    return ResultAsync.fromPromise(
      Database.query.notification.findMany({
        where: eq(schema.notification.recipientId, member.id),
        columns: {
          id: true,
          type: true,
          createdAt: true,
        },
        with: {
          organization: {
            columns: {
              id: true,
              name: true,
            },
          },
          post: {
            columns: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: desc(schema.notification.createdAt),
        limit,
        offset,
      }),
      () => new Error("Failed to get notifications for member")
    );
  },
  getLastReadAtForMember: (member: { id: string }) => {
    return ResultAsync.fromPromise(
      Database.select({ lastReadAt: schema.member.notificationsReadAt })
        .from(schema.member)
        .where(eq(schema.member.id, member.id)),
      () => new Error("Failed to get last read at for member")
    ).map((result) => result?.[0]?.lastReadAt ?? null);
  },
  countUnreadNotificationsForMember: (
    member: { id: string },
    lastReadAt: Date | null
  ) => {
    return ResultAsync.fromPromise(
      Database.select({ count: count() })
        .from(schema.notification)
        .where(
          and(
            eq(schema.notification.recipientId, member.id),
            lastReadAt
              ? gte(schema.notification.createdAt, lastReadAt)
              : undefined
          )
        ),
      () => new Error("Failed to count unread notifications for member")
    ).map((result) => ({
      unreadCount: result?.[0]?.count ?? 0,
      lastReadAt,
    }));
  },
  countNotificationsForMember: (member: { id: string }) => {
    return ResultAsync.fromPromise(
      Database.select({ count: count() })
        .from(schema.notification)
        .where(and(eq(schema.notification.recipientId, member.id))),
      () => new Error("Failed to count notifications for member")
    ).map((result) => ({ count: result?.[0]?.count ?? 0 }));
  },
  markNotificationsAsReadForMember: (member: { id: string }) => {
    return ResultAsync.fromPromise(
      Database.update(schema.member)
        .set({ notificationsReadAt: new Date() })
        .where(eq(schema.member.id, member.id)),
      () => new Error("Failed to mark notifications as read for member")
    );
  },

  getAllOrganizationMembers: (organizationId: string) => {
    return ResultAsync.fromPromise(
      Database.query.member.findMany({
        where: eq(schema.member.organizationId, organizationId),
      }),
      () => new Error("Failed to get all organization members")
    );
  },
};
