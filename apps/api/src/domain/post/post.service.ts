import { Database, schema } from "@database";
import { eq } from "drizzle-orm";
import { PostsRepository } from "./post.repository";

export const PostsService = {
  createPost: async (data: typeof schema.post.$inferInsert) => {
    const [newPost] = await PostsRepository.create(data);

    return newPost;
  },
  getPostById: async (id: string) => {
    const post = await PostsRepository.getById(id);

    return post;
  },
  getPostsByOrganizationId: async (organizationId: string) => {
    const posts = await PostsRepository.getByOrganizationId(organizationId);

    return posts;
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
};
