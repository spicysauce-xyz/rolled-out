import type { schema } from "@database";
import { errAsync, okAsync } from "neverthrow";
import { SchedulePostPublishJobs } from "./post.jobs";
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

  deletePostById: (member: { organizationId: string }, id: string) => {
    return PostsRepository.findPostById(id, member.organizationId).andThen(
      () => {
        return PostsRepository.deletePost(id, member.organizationId);
      }
    );
  },

  findPostById: (member: { organizationId: string }, id: string) => {
    return PostsRepository.findPostById(id, member.organizationId);
  },

  findPostsByOrganization: (member: { organizationId: string }) => {
    return PostsRepository.findPostsByOrganization(member.organizationId);
  },

  publishPostById: (member: { organizationId: string }, id: string) => {
    return PostsRepository.findPostById(id, member.organizationId)
      .andThrough((post) => {
        if (post.status === "scheduled" && post.scheduledAt) {
          return new SchedulePostPublishJobs().remove(post.id);
        }

        return okAsync(post);
      })
      .andThen(() => PostsRepository.publishPost(id, member.organizationId));
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
    return PostsRepository.findPostById(id, member.organizationId)
      .andThrough((post) => {
        if (post.status === "scheduled" && post.scheduledAt) {
          return new SchedulePostPublishJobs().remove(post.id);
        }

        return okAsync(post);
      })
      .andThen(() => {
        return PostsRepository.schedulePost(
          id,
          member.organizationId,
          scheduledAt
        );
      })
      .andThrough((post) => {
        if (post.status === "scheduled" && post.scheduledAt) {
          return new SchedulePostPublishJobs().add(
            post.id,
            post.organizationId,
            post.scheduledAt
          );
        }

        return errAsync(new Error("Post is not scheduled"));
      });
  },
};
