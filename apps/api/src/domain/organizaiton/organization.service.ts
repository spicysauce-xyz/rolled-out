import type { Member, schema } from "@services/db";
import { Policy } from "@services/policy";
import { err, ok } from "neverthrow";
import { OrganizationRepository } from "./organization.repository";

export const OrganizationService = {
  getOrganizationById: (member: Member, id: string) => {
    const ability = Policy.defineAbilityForMember(member);

    return OrganizationRepository.getOrganizationById(id).andThrough(
      (organization) => ability.can("read", "organization", organization)
    );
  },
  createOrganization: (data: typeof schema.organization.$inferInsert) => {
    return OrganizationRepository.createOrganization(data);
  },
  updateOrganization: (
    member: Member,
    id: string,
    data: Pick<
      typeof schema.organization.$inferInsert,
      "name" | "slug" | "logo" | "websiteUrl"
    >
  ) => {
    const ability = Policy.defineAbilityForMember(member);

    return OrganizationRepository.getOrganizationById(id)
      .andThrough((organization) =>
        ability.can("update", "organization", organization)
      )
      .andThen((organization) =>
        OrganizationRepository.updateOrganization(organization.id, data)
      );
  },
  checkSlug: (slug: string) => {
    return OrganizationRepository.getOrganizationBySlug(slug)
      .map((organization) => ({
        available: !organization,
        slug,
      }))
      .orElse((error) => {
        if (error.message === "Organization not found") {
          return ok({
            available: true,
            slug,
          });
        }

        return err(error);
      });
  },
};
