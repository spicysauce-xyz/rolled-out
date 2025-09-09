import type { schema } from "@services/db";
import { OrganizationRepository } from "./organization.repository";

export const OrganizationService = {
  getOrganizationById: (id: string) => {
    return OrganizationRepository.getOrganizationById(id);
  },
  createOrganization: (data: typeof schema.organization.$inferInsert) => {
    return OrganizationRepository.createOrganization(data);
  },
  updateOrganization: (
    id: string,
    data: Pick<
      typeof schema.organization.$inferInsert,
      "name" | "slug" | "logo"
    >
  ) => {
    return OrganizationRepository.updateOrganization(id, data);
  },
  checkSlug: (slug: string) => {
    return OrganizationRepository.getOrganizationBySlug(slug).map(
      (organization) => ({
        available: !organization,
        slug,
      })
    );
  },
};
