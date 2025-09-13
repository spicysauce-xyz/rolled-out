import type { InvitationInsert, Member } from "@services/db";
import { Policy } from "@services/policy";
import { InvitationRepository } from "./invitation.repository";

export const InvitationService = {
  findInvitationsByOrganizationId: (member: Member, organizationId: string) => {
    const ability = Policy.defineAbilityForMember(member);

    return InvitationRepository.findInvitationsByOrganizationId(
      organizationId
    ).map((invitations) => {
      return invitations.filter((invitation) => {
        return ability.can("read", "invitation", invitation).isOk();
      });
    });
  },
  createInvitation: (
    member: Member,
    data: Pick<InvitationInsert, "email" | "organizationId" | "inviterId"> & {
      role: "member" | "admin" | "owner";
    }
  ) => {
    const ability = Policy.defineAbilityForMember(member);

    return ability
      .can("create", "invitation", data)
      .asyncAndThen(() => InvitationRepository.createInvitation(data));
  },
  deleteInvitation: (member: Member, id: string) => {
    const ability = Policy.defineAbilityForMember(member);

    return InvitationRepository.findInvitationById(id)
      .andThrough((invitation) =>
        ability.can("delete", "invitation", invitation)
      )
      .andThen((invitation) =>
        InvitationRepository.deleteInvitation(invitation.id)
      );
  },
};
