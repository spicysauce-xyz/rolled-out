import type { Member, schema } from "@services/db";
import { Policy } from "@services/policy";
import { errAsync } from "neverthrow";
import { MemberRepository } from "./member.repository";

export const MemberService = {
  findMembersByOrganizationId: (member: Member, organizationId: string) => {
    const ability = Policy.defineAbilityForMember(member);

    return MemberRepository.findMembersByOrganizationId(organizationId).map(
      (members) => {
        return members.filter((entity) => {
          return ability.can("read", "member", entity).isOk();
        });
      }
    );
  },

  deleteMemberById: (member: Member, id: string) => {
    const ability = Policy.defineAbilityForMember(member);

    return MemberRepository.findMemberById(id)
      .andThrough((entity) => ability.can("delete", "member", entity))
      .andThen((entity) => MemberRepository.deleteMemberById(entity.id));
  },

  updateMemberById: (
    currentMember: Member,
    id: string,
    data: Pick<typeof schema.member.$inferInsert, "role">
  ) => {
    const ability = Policy.defineAbilityForMember(currentMember);

    const rolesOrder = ["member", "admin", "owner"];
    const currentRoleIndex = rolesOrder.indexOf(currentMember.role);
    const targetRoleIndex = rolesOrder.indexOf(data.role);

    if (currentRoleIndex < targetRoleIndex) {
      return errAsync(
        new Error(
          "You cannot update member to a higher role than your own role"
        )
      );
    }

    return MemberRepository.findMemberById(id)
      .andThrough((entity) => ability.can("update", "member", entity))
      .andThen((entity) => MemberRepository.updateMemberById(entity.id, data));
  },
};
