import { OrganizationCreatedEvent } from "@domain/organizaiton/organization.events";
import { UserAcceptedInvitationEvent } from "@domain/user";
import { Emitter } from "@services/events";
import { MemberRepository } from "./member.repository";

const registerMemberSubscriptions = () => {
  Emitter.on<OrganizationCreatedEvent>(
    OrganizationCreatedEvent.eventName,
    (event) => {
      return MemberRepository.createMember({
        userId: event.user.id,
        organizationId: event.organization.id,
        role: "owner",
      });
    }
  );

  Emitter.on<UserAcceptedInvitationEvent>(
    UserAcceptedInvitationEvent.eventName,
    (event) => {
      return MemberRepository.createMember({
        userId: event.userId,
        organizationId: event.organizationId,
        role: event.role,
      });
    }
  );
};

export { registerMemberSubscriptions };
