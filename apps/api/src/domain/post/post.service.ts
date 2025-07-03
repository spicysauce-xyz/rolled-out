import type { schema } from "@database";
import { EditorRepository } from "@domain/editor";
import { okAsync } from "neverthrow";
import { PostsRepository } from "./post.repository";

export const PostsService = {
  createPost: (
    member: { organizationId: string; userId: string },
    data?: Omit<
      typeof schema.post.$inferInsert,
      "order" | "title" | "organizationId"
    >
  ) => {
    return PostsRepository.getPostsCount(member.organizationId)
      .andThen(([{ count }]) =>
        PostsRepository.createPost({
          ...(data ?? {}),
          title: "Untitled Update",
          order: count + 1,
          organizationId: member.organizationId,
        })
      )
      .andThrough((post) =>
        EditorRepository.createEditor(post.id, member.userId)
      );
  },

  getPostById: (member: { organizationId: string }, id: string) => {
    return PostsRepository.findPostById(id, member.organizationId);
  },

  getPostsFromOrganization: (member: { organizationId: string }) => {
    return PostsRepository.findPostsByOrganization(member.organizationId);
  },

  updatePostStatusById: (
    member: { organizationId: string },
    id: string,
    status: "published" | "archived" | "draft"
  ) => {
    return PostsRepository.findPostById(id, member.organizationId).andThen(
      (post) => {
        if (post?.status === status) {
          return okAsync(post);
        }

        return PostsRepository.updatePostStatus(
          id,
          member.organizationId,
          status
        );
      }
    );
  },
};
