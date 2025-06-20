import { Database, schema } from "@database";
import { and, count, eq, sql } from "drizzle-orm";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

export const PostsService = {
  createPost: async (
    member: { organizationId: string; userId: string },
    data?: Omit<typeof schema.post.$inferInsert, "order" | "title" | "organizationId">,
  ) => {
    const countResult = await ResultAsync.fromPromise(
      Database.select({ count: count() })
        .from(schema.post)
        .where(eq(schema.post.organizationId, member.organizationId)),
      (error) => new Error("Failed to get posts count", { cause: error }),
    );

    if (countResult.isErr()) {
      return errAsync(countResult.error);
    }

    const insertResult = await ResultAsync.fromPromise(
      Database.insert(schema.post)
        .values({
          ...(data ?? {}),
          title: "Untitled Update",
          order: countResult.value[0].count + 1,
          organizationId: member.organizationId,
        })
        .returning(),
      (error) => new Error("Failed to create post", { cause: error }),
    );

    if (insertResult.isErr()) {
      return errAsync(insertResult.error);
    }

    const editorResult = await ResultAsync.fromPromise(
      Database.insert(schema.editor).values({
        postId: insertResult.value[0].id,
        userId: member.userId,
      }),
      (error) => new Error("Failed to create editor for post", { cause: error }),
    );

    if (editorResult.isErr()) {
      return errAsync(editorResult.error);
    }

    return okAsync(insertResult.value[0]);
  },
  getPostById: async (member: { organizationId: string }, id: string) => {
    const result = await ResultAsync.fromPromise(
      Database.query.post.findFirst({
        where: and(eq(schema.post.id, id), eq(schema.post.organizationId, member.organizationId)),
      }),
      (error) => new Error("Failed to get post by id", { cause: error }),
    );

    if (result.isErr()) {
      return errAsync(result.error);
    }

    const post = result.value;

    if (!post) {
      return errAsync(new Error("Post not found"));
    }

    return okAsync(post);
  },
  // TODO: do something
  getPostsFromOrganization: async (member: { organizationId: string }) => {
    const posts = await Database.select({
      id: schema.post.id,
      order: schema.post.order,
      title: schema.post.title,
      status: schema.post.status,
      editors: sql<Pick<typeof schema.user.$inferSelect, "id" | "name" | "image">[]>`
        coalesce(
          jsonb_agg(
            DISTINCT jsonb_build_object(
              'id',         ${schema.user.id},
              'name',       ${schema.user.name},
              'image',  ${schema.user.image}
            )
          ) filter (where ${schema.user.id} is not null),
          '[]'::jsonb
        )
      `.as("editors"),
      tags: sql<Pick<typeof schema.tag.$inferSelect, "id" | "label">[]>`
        coalesce(
          jsonb_agg(
            DISTINCT jsonb_build_object(
              'id',         ${schema.tag.id},
              'label',       ${schema.tag.label}
            )
          ) filter (where ${schema.tag.id} is not null),
          '[]'::jsonb
        )
      `.as("tags"),
      createdAt: schema.post.createdAt,
      updatedAt: schema.post.updatedAt,
      publishedAt: schema.post.publishedAt,
    })
      .from(schema.post)
      .where(eq(schema.post.organizationId, member.organizationId))
      .leftJoin(schema.editor, eq(schema.editor.postId, schema.post.id))
      .leftJoin(schema.user, eq(schema.editor.userId, schema.user.id))
      .leftJoin(schema.postTag, eq(schema.post.id, schema.postTag.postId))
      .leftJoin(schema.tag, eq(schema.postTag.tagId, schema.tag.id))
      .orderBy(
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
      )
      .groupBy(schema.post.id);

    return posts;
  },
  updatePostStatusById: async (
    member: { organizationId: string },
    id: string,
    status: "published" | "archived" | "draft",
  ) => {
    const postResult = await ResultAsync.fromPromise(
      Database.query.post.findFirst({
        where: and(eq(schema.post.id, id), eq(schema.post.organizationId, member.organizationId)),
      }),
      (error) => new Error("Failed to get post by id", { cause: error }),
    );

    if (postResult.isErr()) {
      return errAsync(postResult.error);
    }

    const post = postResult.value;

    if (!post) {
      return errAsync(new Error("Post not found"));
    }

    if (post.status === status) {
      return okAsync(post);
    }

    const updatedPostResult = await ResultAsync.fromPromise(
      Database.update(schema.post)
        .set({
          status,
          ...(status === "published" ? { status, publishedAt: new Date() } : {}),
          ...(status === "archived" ? { status, archivedAt: new Date() } : {}),
          ...(status === "draft" ? { status, publishedAt: null, archivedAt: null } : {}),
        })
        .where(and(eq(schema.post.id, id), eq(schema.post.organizationId, member.organizationId)))
        .returning(),
      (error) => new Error("Failed to update post status", { cause: error }),
    );

    if (updatedPostResult.isErr()) {
      return errAsync(updatedPostResult.error);
    }

    return okAsync(updatedPostResult.value[0]);
  },
};
