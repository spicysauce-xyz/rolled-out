import type { Member } from "@services/db";
import { ResultAsync } from "neverthrow";
import { NotificationRepository } from "./notification.repository";

export const NotificationService = {
  getNotifications: (
    member: Member,
    { limit, offset }: { limit: number; offset: number }
  ) => {
    return NotificationRepository.getNotificationsForMember(member, {
      limit,
      offset,
    });
  },

  getNotificationsStatus: (member: Member) => {
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

  markNotificationsAsRead: (member: Member) => {
    return NotificationRepository.markNotificationsAsReadForMember(member);
  },
};
