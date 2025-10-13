import { Database, schema } from "@services/db";
import { eq } from "drizzle-orm";
import { err, ok, ResultAsync } from "neverthrow";

export const OrganizationRepository = {
  getOrganizationById: (id: string) => {
    return ResultAsync.fromPromise(
      Database.query.organization.findFirst({
        where: eq(schema.organization.id, id),
      }),
      () => new Error("Failed to get organization by id")
    ).andThen((organization) => {
      if (!organization) {
        return err(new Error("Organization not found"));
      }
      return ok(organization);
    });
  },
  getOrganizationBySlug: (slug: string) => {
    return ResultAsync.fromPromise(
      Database.query.organization.findFirst({
        where: eq(schema.organization.slug, slug),
      }),
      () => new Error("Failed to get organization by slug")
    ).andThen((organization) => {
      if (!organization) {
        return err(new Error("Organization not found"));
      }
      return ok(organization);
    });
  },
  createOrganization: (data: typeof schema.organization.$inferInsert) => {
    return ResultAsync.fromPromise(
      Database.insert(schema.organization).values(data).returning(),
      () => new Error("Failed to create organization")
    ).map(([organization]) => organization);
  },
  updateOrganization: (
    id: string,
    data: Pick<
      typeof schema.organization.$inferInsert,
      "name" | "slug" | "logo" | "websiteUrl"
    >
  ) => {
    return ResultAsync.fromPromise(
      Database.update(schema.organization)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(schema.organization.id, id))
        .returning(),
      () => new Error("Failed to update organization")
    ).map(([organization]) => organization);
  },
};
