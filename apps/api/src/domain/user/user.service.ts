import type { User } from "@services/db";
import { UserRepository } from "./user.repository";

export const UserService = {
  findOrganizations: (user: User) => {
    return UserRepository.findOrganizations(user.id);
  },
  leaveOrganization: (user: User, organizationId: string) => {
    return UserRepository.leaveOrganization(user.id, organizationId);
  },
  findPendingInvitations: (user: User) => {
    return UserRepository.findPendingInvitations(user.email);
  },
  acceptInvitation: (user: User, invitationId: string) => {
    return UserRepository.acceptInvitationById(user.email, invitationId);
  },
  rejectInvitation: (user: User, invitationId: string) => {
    return UserRepository.rejectInvitationById(user.email, invitationId);
  },
};
