import { Database, schema } from "@database";
import { count, eq, sql } from "drizzle-orm";
import { PostsRepository } from "./post.repository";

export const PostsService = {
  createPost: async (data: Omit<typeof schema.post.$inferInsert, "order">) => {
    const [{ count: currentCount }] = await Database.select({ count: count() })
      .from(schema.post)
      .where(eq(schema.post.organizationId, data.organizationId));

    const [newPost] = await PostsRepository.create({
      ...data,
      order: currentCount + 1,
    });

    return newPost;
  },
  getPostById: async (id: string) => {
    const post = await PostsRepository.getById(id);

    return post;
  },
  getPostsByOrganizationId: async (organizationId: string) => {
    const posts = await Database.select({
      id: schema.post.id,
      order: schema.post.order,
      title: schema.post.title,
      status: schema.post.status,
      createdAt: schema.post.createdAt,
      updatedAt: schema.post.updatedAt,
      publishedAt: schema.post.publishedAt,
      editors: sql`
        coalesce(
          jsonb_agg(
            jsonb_build_object(
              'id',         ${schema.user.id},
              'name',       ${schema.user.name},
              'image',  ${schema.user.image}
            )
          ) filter (where ${schema.user.id} is not null),
          '[]'::jsonb
        )
      `.as<Pick<typeof schema.user.$inferSelect, "id" | "name" | "image">[]>("editors"),
    })
      .from(schema.post)
      .where(eq(schema.post.organizationId, organizationId))
      .leftJoin(schema.editor, eq(schema.editor.postId, schema.post.id))
      .leftJoin(schema.user, eq(schema.editor.userId, schema.user.id))
      .orderBy(
        sql`CASE
          WHEN ${schema.post.status} = 'draft' THEN 1
          WHEN ${schema.post.status} = 'scheduled' THEN 2
          WHEN ${schema.post.status} = 'published' THEN 3
        END`,
        sql`CASE
          WHEN ${schema.post.status} = 'draft' THEN ${schema.post.createdAt}
          WHEN ${schema.post.status} = 'scheduled' THEN ${schema.post.updatedAt}
          WHEN ${schema.post.status} = 'published' THEN ${schema.post.updatedAt}
        END DESC`,
      )
      .groupBy(schema.post.id);

    return posts;
  },
  updatePostById: async (id: string, data: Pick<typeof schema.post.$inferSelect, "title">) => {
    const [updatedPost] = await Database.update(schema.post)
      .set({
        title: data.title,
        updatedAt: new Date(),
      })
      .where(eq(schema.post.id, id))
      .returning();

    return updatedPost;
  },
  publishPostById: async (id: string) => {
    const [updatedPost] = await Database.update(schema.post)
      .set({ status: "published", publishedAt: new Date() })
      .where(eq(schema.post.id, id))
      .returning();

    return updatedPost;
  },
};
