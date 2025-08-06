import { OrganizationCreatedEvent } from "@domain/auth";
import { Emitter } from "@events";
import { NotificationService } from "./notification.service";

Emitter.on<OrganizationCreatedEvent>(
  OrganizationCreatedEvent.eventName,
  (event) => {
    return NotificationService.createOrganizationCreatedNotification(
      event.organization.id
    );
  }
);
