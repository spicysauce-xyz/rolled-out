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
    const posts = await Database.select()
      .from(schema.post)
      .where(eq(schema.post.organizationId, organizationId))
      .leftJoin(schema.user, eq(schema.post.createdBy, schema.user.id))
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
      );

    return posts.map((entry) => ({
      ...entry.post,
      createdBy: entry.user,
    }));
  },
  updatePostById: async (id: string, data: Pick<typeof schema.post.$inferSelect, "content" | "title">) => {
    const [updatedPost] = await Database.update(schema.post)
      .set({
        title: data.title,
        content: data.content,
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
