import type { schema } from "@database";
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
    return PostsRepository.getPostsCount(member.organizationId).andThen(
      ([{ count }]) =>
        PostsRepository.createPost({
          ...(data ?? {}),
          title: "Untitled Update",
          order: count + 1,
          organizationId: member.organizationId,
        })
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
    status: "published" | "draft" | "scheduled"
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

  schedulePost: (
    member: { organizationId: string },
    id: string,
    scheduledAt: Date
  ) => {
    return PostsRepository.findPostById(id, member.organizationId).andThen(
      (post) => {
        if (post?.status === "scheduled" && post?.scheduledAt?.getTime() === scheduledAt.getTime()) {
          return okAsync(post);
        }

        return PostsRepository.schedulePost(
          id,
          member.organizationId,
          scheduledAt
        );
      }
    );
  },
};
