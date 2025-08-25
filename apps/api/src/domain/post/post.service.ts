import type { schema } from "@database";
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

  findPostById: (member: { organizationId: string }, id: string) => {
    return PostsRepository.findPostById(id, member.organizationId);
  },

  findPostsByOrganization: (member: { organizationId: string }) => {
    return PostsRepository.findPostsByOrganization(member.organizationId);
  },

  publishPostById: (member: { organizationId: string }, id: string) => {
    return PostsRepository.findPostById(id, member.organizationId).andThen(
      () => {
        return PostsRepository.publishPost(id, member.organizationId);
      }
    );
  },

  unpublishPostById: (member: { organizationId: string }, id: string) => {
    return PostsRepository.findPostById(id, member.organizationId).andThen(
      () => {
        return PostsRepository.unpublishPost(id, member.organizationId);
      }
    );
  },

  schedulePostById: (
    member: { organizationId: string },
    id: string,
    scheduledAt: Date
  ) => {
    return PostsRepository.findPostById(id, member.organizationId).andThen(
      () => {
        return PostsRepository.schedulePost(
          id,
          member.organizationId,
          scheduledAt
        );
      }
    );
  },
};
