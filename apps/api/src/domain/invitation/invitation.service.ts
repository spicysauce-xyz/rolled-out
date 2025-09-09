import { InvitationRepository } from "./invitation.repository";

export const InvitationService = {
  findInvitationsByOrganizationId: (organizationId: string) => {
    return InvitationRepository.findInvitationsByOrganizationId(organizationId);
  },
  createInvitation: (data: {
    email: string;
    role: string;
    organizationId: string;
    inviterId: string;
  }) => {
    return InvitationRepository.createInvitation(data);
  },
  deleteInvitation: (id: string) => {
    return InvitationRepository.deleteInvitation(id);
  },
};
