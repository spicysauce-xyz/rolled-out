import { Database, schema } from "@database";
import { eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import { NotificationRepository } from "./notification.repository";

export const NotificationService = {
  getNotificationsForUser: (
    user: { id: string },
    { limit, offset }: { limit: number; offset: number }
  ) => {
    return NotificationRepository.getNotificationsForUser(user, {
      limit,
      offset,
    });
  },

  getAllOrganizationMembers: (organizationId: string) => {
    return ResultAsync.fromPromise(
      Database.query.member.findMany({
        where: eq(schema.member.organizationId, organizationId),
        columns: {
          id: true,
          userId: true,
        },
      }),
      () => new Error("Failed to get all organization members")
    );
  },
  createOrganizationCreatedNotification: (organizationId: string) => {
    return NotificationService.getAllOrganizationMembers(
      organizationId
    ).andThen((members) => {
      return ResultAsync.combine(
        members.map((member) => {
          return NotificationRepository.create({
            type: "organization_created",
            organizationId,
            recipientId: member.userId,
          });
        })
      );
    });
  },
  getNotificationsStatusForUser: (user: { id: string }) => {
    return NotificationRepository.getLastReadAtForUser(user)
      .andThen((lastReadAt) => {
        return ResultAsync.combine([
          NotificationRepository.countNotificationsForUser(user),
          NotificationRepository.countUnreadNotificationsForUser(
            user,
            lastReadAt
          ),
        ]);
      })
      .map(([count, unreadCount]) => ({
        count: count.count,
        unreadCount: unreadCount.unreadCount,
        lastReadAt: unreadCount.lastReadAt,
      }));
  },
  markNotificationsAsReadForUser: (user: { id: string }) => {
    return NotificationRepository.markNotificationsAsReadForUser(user);
  },
};
