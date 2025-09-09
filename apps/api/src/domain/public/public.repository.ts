import { Database, schema } from "@services/db";
import { and, desc, eq } from "drizzle-orm";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

export const PublicRepository = {
  getOrganizationBySlug: (slug: string) => {
    return ResultAsync.fromPromise(
      Database.query.organization.findFirst({
        where: eq(schema.organization.slug, slug),
      }),
      (error) =>
        new Error("Failed to get organization by slug", { cause: error })
    ).andThen((organization) => {
      if (!organization) {
        return errAsync(new Error("Organization not found"));
      }
      return okAsync(organization);
    });
  },

  getPublishedPostsFromOrganization: (organization: { id: string }) => {
    return ResultAsync.fromPromise(
      Database.query.post.findMany({
        where: and(
          eq(schema.post.organizationId, organization.id),
          eq(schema.post.status, "published")
        ),
        with: {
          editors: {
            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          tags: {
            with: {
              tag: {
                columns: {
                  id: true,
                  label: true,
                },
              },
            },
          },
        },
        orderBy: [desc(schema.post.publishedAt)],
      }),
      (error) =>
        new Error("Failed to get published posts by organization slug", {
          cause: error,
        })
    );
  },
};
