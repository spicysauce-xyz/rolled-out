import { Database, schema } from "@database";
import { and, count, desc, eq, gte } from "drizzle-orm";
import { ResultAsync } from "neverthrow";

export const NotificationRepository = {
  create: (data: typeof schema.notification.$inferInsert) => {
    return ResultAsync.fromPromise(
      Database.insert(schema.notification).values(data),
      () => new Error("Failed to create notification")
    );
  },
  getNotificationsForUser: (
    user: { id: string },
    { limit, offset }: { limit: number; offset: number }
  ) => {
    return ResultAsync.fromPromise(
      Database.query.notification.findMany({
        where: eq(schema.notification.recipientId, user.id),
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
        },
        orderBy: desc(schema.notification.createdAt),
        limit,
        offset,
      }),
      () => new Error("Failed to get notifications for user")
    );
  },
  getLastReadAtForUser: (user: { id: string }) => {
    return ResultAsync.fromPromise(
      Database.select({ lastReadAt: schema.user.notificationsReadAt })
        .from(schema.user)
        .where(eq(schema.user.id, user.id)),
      (error) => {
        console.error(error);
        return new Error("Failed to get user");
      }
    ).map((result) => result?.[0]?.lastReadAt ?? null);
  },
  countUnreadNotificationsForUser: (
    user: { id: string },
    lastReadAt: Date | null
  ) => {
    return ResultAsync.fromPromise(
      Database.select({ count: count() })
        .from(schema.notification)
        .where(
          and(
            eq(schema.notification.recipientId, user.id),
            lastReadAt
              ? gte(schema.notification.createdAt, lastReadAt)
              : undefined
          )
        ),
      () => new Error("Failed to count unread notifications for user")
    ).map((result) => ({
      unreadCount: result?.[0]?.count ?? 0,
      lastReadAt,
    }));
  },
  countNotificationsForUser: (user: { id: string }) => {
    return ResultAsync.fromPromise(
      Database.select({ count: count() })
        .from(schema.notification)
        .where(and(eq(schema.notification.recipientId, user.id))),
      () => new Error("Failed to count notifications for user")
    ).map((result) => ({ count: result?.[0]?.count ?? 0 }));
  },
  markNotificationsAsReadForUser: (user: { id: string }) => {
    return ResultAsync.fromPromise(
      Database.update(schema.user)
        .set({ notificationsReadAt: new Date() })
        .where(eq(schema.user.id, user.id)),
      () => new Error("Failed to mark notifications as read for user")
    );
  },
};
