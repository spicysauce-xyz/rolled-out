import { Database, schema } from "@services/db";
import { and, count, desc, eq, sql } from "drizzle-orm";
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

  deletePost: (id: string, organizationId: string) => {
    return ResultAsync.fromPromise(
      Database.delete(schema.post)
        .where(
          and(
            eq(schema.post.id, id),
            eq(schema.post.organizationId, organizationId)
          )
        )
        .returning(),
      (error) => new Error("Failed to delete post", { cause: error })
    ).andThen(([post]) => {
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
          scheduledAt: true,
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
      END`,
          desc(schema.post.createdAt),
        ],
      }),
      (error) =>
        new Error("Failed to get posts from organization", { cause: error })
    );
  },

  publishPost: (id: string, organizationId: string) => {
    return ResultAsync.fromPromise(
      Database.update(schema.post)
        .set({
          status: "published",
          publishedAt: new Date(),
          scheduledAt: null,
        })
        .where(
          and(
            eq(schema.post.id, id),
            eq(schema.post.organizationId, organizationId)
          )
        )
        .returning(),
      (error) => new Error("Failed to publish post", { cause: error })
    ).andThen(([post]) => {
      if (!post) {
        return err(new Error("Post not found"));
      }

      return ok(post);
    });
  },

  unpublishPost: (id: string, organizationId: string) => {
    return ResultAsync.fromPromise(
      Database.update(schema.post)
        .set({
          status: "draft",
          publishedAt: null,
        })
        .where(
          and(
            eq(schema.post.id, id),
            eq(schema.post.organizationId, organizationId)
          )
        )
        .returning(),
      (error) => new Error("Failed to unpublish post", { cause: error })
    ).andThen(([post]) => {
      if (!post) {
        return err(new Error("Post not found"));
      }

      return ok(post);
    });
  },

  schedulePost: (id: string, organizationId: string, scheduledAt: Date) => {
    return ResultAsync.fromPromise(
      Database.update(schema.post)
        .set({
          status: "scheduled",
          scheduledAt,
        })
        .where(
          and(
            eq(schema.post.id, id),
            eq(schema.post.organizationId, organizationId)
          )
        )
        .returning(),
      (error) => new Error("Failed to schedule post", { cause: error })
    ).andThen(([post]) => {
      if (!post) {
        return err(new Error("Post not found"));
      }

      return ok(post);
    });
  },

  unschedulePost: (id: string, organizationId: string) => {
    return ResultAsync.fromPromise(
      Database.update(schema.post)
        .set({
          status: "draft",
          scheduledAt: null,
        })
        .where(
          and(
            eq(schema.post.id, id),
            eq(schema.post.organizationId, organizationId)
          )
        )
        .returning(),
      (error) => new Error("Failed to unschedule post", { cause: error })
    ).andThen(([post]) => {
      if (!post) {
        return err(new Error("Post not found"));
      }

      return ok(post);
    });
  },
};
