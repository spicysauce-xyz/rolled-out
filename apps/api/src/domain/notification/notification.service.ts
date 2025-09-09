import { Database, schema } from "@services/db";
import { eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import { NotificationRepository } from "./notification.repository";

export const NotificationService = {
  getNotificationsForMember: (
    member: { id: string },
    { limit, offset }: { limit: number; offset: number }
  ) => {
    return NotificationRepository.getNotificationsForMember(member, {
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
        },
      }),
      () => new Error("Failed to get all organization members")
    );
  },
  getNotificationsStatusForMember: (member: { id: string }) => {
    return NotificationRepository.getLastReadAtForMember(member)
      .andThen((lastReadAt) => {
        return ResultAsync.combine([
          NotificationRepository.countNotificationsForMember(member),
          NotificationRepository.countUnreadNotificationsForMember(
            member,
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
  markNotificationsAsReadForMember: (member: { id: string }) => {
    return NotificationRepository.markNotificationsAsReadForMember(member);
  },
};
