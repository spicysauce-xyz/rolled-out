import type { schema } from "@database";
import { errAsync, okAsync } from "neverthrow";
import { PostsRepository } from "./post.repository";

export const PostsService = {
  createPost: async (
    member: { organizationId: string; userId: string },
    data?: Omit<typeof schema.post.$inferInsert, "order" | "title" | "organizationId">,
  ) => {
    const countResult = await PostsRepository.getPostsCount(member.organizationId);

    if (countResult.isErr()) {
      return errAsync(countResult.error);
    }

    const insertResult = await PostsRepository.createPost({
      ...(data ?? {}),
      title: "Untitled Update",
      order: countResult.value[0].count + 1,
      organizationId: member.organizationId,
    });

    if (insertResult.isErr()) {
      return errAsync(insertResult.error);
    }

    const editorResult = await PostsRepository.createEditor(insertResult.value[0].id, member.userId);

    if (editorResult.isErr()) {
      return errAsync(editorResult.error);
    }

    return okAsync(insertResult.value[0]);
  },

  getPostById: async (member: { organizationId: string }, id: string) => {
    const result = await PostsRepository.findPostById(id, member.organizationId);

    if (result.isErr()) {
      return errAsync(result.error);
    }

    const post = result.value;

    if (!post) {
      return errAsync(new Error("Post not found"));
    }

    return okAsync(post);
  },

  getPostsFromOrganization: async (member: { organizationId: string }) => {
    return PostsRepository.findPostsByOrganization(member.organizationId);
  },

  updatePostStatusById: async (
    member: { organizationId: string },
    id: string,
    status: "published" | "archived" | "draft",
  ) => {
    const postResult = await PostsRepository.findPostById(id, member.organizationId);

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

    const updatedPostResult = await PostsRepository.updatePostStatus(id, member.organizationId, status);

    if (updatedPostResult.isErr()) {
      return errAsync(updatedPostResult.error);
    }

    return okAsync(updatedPostResult.value[0]);
  },
};
