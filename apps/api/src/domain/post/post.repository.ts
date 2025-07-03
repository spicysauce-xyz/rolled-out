import { Database, schema } from "@database";
import { and, count, eq, sql } from "drizzle-orm";
import { err, ok, ResultAsync } from "neverthrow";

export const PostsRepository = {
  getPostsCount: (organizationId: string) => {
    return ResultAsync.fromPromise(
      Database.select({ count: count() })
        .from(schema.post)
        .where(eq(schema.post.organizationId, organizationId)),
      (error) => new Error("Failed to get posts count", { cause: error })
    );
  },

  createPost: (data: typeof schema.post.$inferInsert) => {
    return ResultAsync.fromPromise(
      Database.insert(schema.post).values(data).returning(),
      (error) => new Error("Failed to create post", { cause: error })
    ).andThen(([post]) => {
      if (!post) {
        return err(new Error("Post not created"));
      }

      return ok(post);
    });
  },

  findPostById: (id: string, organizationId: string) => {
    return ResultAsync.fromPromise(
      Database.query.post.findFirst({
        where: and(
          eq(schema.post.id, id),
          eq(schema.post.organizationId, organizationId)
        ),
      }),
      (error) => new Error("Failed to get post by id", { cause: error })
    ).andThen((post) => {
      if (!post) {
        return err(new Error("Post not found"));
      }

      return ok(post);
    });
  },

  findPostsByOrganization: (organizationId: string) => {
    return ResultAsync.fromPromise(
      Database.query.post.findMany({
        columns: {
          id: true,
          title: true,
          status: true,
          order: true,
          createdAt: true,
          updatedAt: true,
          publishedAt: true,
          archivedAt: true,
        },
        where: eq(schema.post.organizationId, organizationId),
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
        orderBy: [
          sql`CASE
        WHEN ${schema.post.status} = 'draft' THEN 1
        WHEN ${schema.post.status} = 'scheduled' THEN 2
        WHEN ${schema.post.status} = 'published' THEN 3
        WHEN ${schema.post.status} = 'archived' THEN 4
      END`,
          sql`CASE
        WHEN ${schema.post.status} = 'draft' THEN ${schema.post.createdAt}
        WHEN ${schema.post.status} = 'scheduled' THEN ${schema.post.updatedAt}
        WHEN ${schema.post.status} = 'published' THEN ${schema.post.updatedAt}
        WHEN ${schema.post.status} = 'archived' THEN ${schema.post.archivedAt}
        END DESC`,
        ],
      }),
      (error) =>
        new Error("Failed to get posts from organization", { cause: error })
    );
  },

  updatePostStatus: (
    id: string,
    organizationId: string,
    status: "published" | "archived" | "draft"
  ) => {
    return ResultAsync.fromPromise(
      Database.update(schema.post)
        .set({
          status,
          ...(status === "published"
            ? { status, publishedAt: new Date() }
            : {}),
          ...(status === "archived" ? { status, archivedAt: new Date() } : {}),
          ...(status === "draft"
            ? { status, publishedAt: null, archivedAt: null }
            : {}),
        })
        .where(
          and(
            eq(schema.post.id, id),
            eq(schema.post.organizationId, organizationId)
          )
        )
        .returning(),
      (error) => new Error("Failed to update post status", { cause: error })
    ).andThen(([post]) => {
      if (!post) {
        return err(new Error("Post not found"));
      }

      return ok(post);
    });
  },
};
