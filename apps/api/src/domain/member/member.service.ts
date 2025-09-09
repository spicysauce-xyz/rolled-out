import type { schema } from "@services/db";
import { MemberRepository } from "./member.repository";

export const MemberService = {
  findMemberById: (id: string) => {
    return MemberRepository.findMemberById(id);
  },
  findMembersByOrganizationId: (organizationId: string) => {
    return MemberRepository.findMembersByOrganizationId(organizationId);
  },
  createMember: (data: typeof schema.member.$inferInsert) => {
    return MemberRepository.createMember(data);
  },
  deleteMemberById: (id: string) => {
    return MemberRepository.deleteMemberById(id);
  },
  updateMemberById: (
    id: string,
    data: Pick<typeof schema.member.$inferInsert, "role">
  ) => {
    return MemberRepository.updateMemberById(id, data);
  },
};
