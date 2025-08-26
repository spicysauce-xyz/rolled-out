import { OrganizationCreatedEvent } from "@domain/auth";
import { ScheduledPostPublishedEvent } from "@domain/post";
import { Emitter } from "@events";
import { ResultAsync } from "neverthrow";
import { NotificationRepository } from "./notification.repository";
import { NotificationService } from "./notification.service";

Emitter.on<OrganizationCreatedEvent>(
  OrganizationCreatedEvent.eventName,
  (payload) => {
    return NotificationService.getAllOrganizationMembers(
      payload.organization.id
    ).andThen((members) => {
      return ResultAsync.combine(
        members.map((member) => {
          return NotificationRepository.create({
            type: "organization_created",
            organizationId: payload.organization.id,
            recipientId: member.id,
          });
        })
      );
    });
  }
);

Emitter.on<ScheduledPostPublishedEvent>(
  ScheduledPostPublishedEvent.eventName,
  (payload) => {
    return NotificationService.getAllOrganizationMembers(
      payload.organizationId
    ).andThen((members) => {
      return ResultAsync.combine(
        members.map((member) => {
          return NotificationRepository.create({
            type: "scheduled_post_published",
            organizationId: payload.organizationId,
            recipientId: member.id,
            postId: payload.post.id,
          });
        })
      );
    });
  }
);
