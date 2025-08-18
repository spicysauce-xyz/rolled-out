import { OrganizationCreatedEvent } from "@domain/auth";
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
