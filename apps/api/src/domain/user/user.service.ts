import { UserRepository } from "./user.repository";

export const UserService = {
  findOrganizations: (userId: string) => {
    return UserRepository.findOrganizations(userId);
  },
  leaveOrganization: (userId: string, organizationId: string) => {
    return UserRepository.leaveOrganization(userId, organizationId);
  },
  findPendingInvitations: (email: string) => {
    return UserRepository.findPendingInvitations(email);
  },
  acceptInvitation: (email: string, invitationId: string) => {
    return UserRepository.acceptInvitationById(email, invitationId);
  },
  rejectInvitation: (email: string, invitationId: string) => {
    return UserRepository.rejectInvitationById(email, invitationId);
  },
};
