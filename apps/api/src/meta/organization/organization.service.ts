import { Database, type schema } from "@database";
import { MemberRepository } from "@meta/member";
import { OrganizationRepository } from "./organization.repository";

export const OrganizationService = {
  createOrganization: async (userId: string, data: typeof schema.organization.$inferInsert) => {
    const { organization, member } = await Database.transaction(async (tx) => {
      const [organization] = await OrganizationRepository.create(data, tx);

      if (!organization) {
        throw new Error("Failed to create organization");
      }

      const member = await MemberRepository.create(
        {
          organizationId: organization.id,
          userId,
          role: "owner",
        },

        tx,
      );

      return { organization, member };
    });

    return { organization, member };
  },
};
