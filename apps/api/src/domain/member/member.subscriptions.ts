import { OrganizationCreatedEvent } from "@domain/organizaiton/organization.events";
import { UserAcceptedInvitationEvent } from "@domain/user";
import { Emitter } from "@services/events";
import { MemberService } from "./member.service";

const registerMemberSubscriptions = () => {
  Emitter.on<OrganizationCreatedEvent>(
    OrganizationCreatedEvent.eventName,
    (event) => {
      return MemberService.createMember({
        userId: event.user.id,
        organizationId: event.organization.id,
        role: "owner",
      });
    }
  );

  Emitter.on<UserAcceptedInvitationEvent>(
    UserAcceptedInvitationEvent.eventName,
    (event) => {
      return MemberService.createMember({
        userId: event.userId,
        organizationId: event.organizationId,
        role: event.role,
      });
    }
  );
};

export { registerMemberSubscriptions };
