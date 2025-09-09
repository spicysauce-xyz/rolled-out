import type { schema } from "@services/db";
import { Queue } from "@services/queue";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { SchedulePostPublishJobs } from "./post.jobs";
import { PostsRepository } from "./post.repository";
import { applyTitleToDocumentState, isPostScheduled } from "./post.utils";

export const PostService = {
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
    return PostsRepository.findPostById(id, member.organizationId)
      .andThrough((post) => {
        if (isPostScheduled(post)) {
          return Queue.remove(new SchedulePostPublishJobs(post));
        }

        return okAsync(post);
      })
      .andThen(() => PostsRepository.deletePost(id, member.organizationId));
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
        if (isPostScheduled(post)) {
          return Queue.remove(new SchedulePostPublishJobs(post));
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
        if (isPostScheduled(post)) {
          return Queue.remove(new SchedulePostPublishJobs(post));
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
        if (isPostScheduled(post)) {
          return Queue.add(new SchedulePostPublishJobs(post));
        }

        return errAsync(new Error("Post is not scheduled"));
      });
  },

  unschedulePostById: (member: { organizationId: string }, id: string) => {
    return PostsRepository.findPostById(id, member.organizationId)
      .andThrough((post) => {
        if (isPostScheduled(post)) {
          return Queue.remove(new SchedulePostPublishJobs(post));
        }

        return okAsync(post);
      })
      .andThen(() => {
        return PostsRepository.unschedulePost(id, member.organizationId);
      });
  },

  duplicatePostById: (member: { organizationId: string }, id: string) => {
    return ResultAsync.combine([
      PostsRepository.findPostById(id, member.organizationId),
      PostsRepository.getPostsCount(member.organizationId),
    ]).andThen(([post, [{ count }]]) => {
      const title = `Copy of ${post.title}`;

      return PostsRepository.createPost({
        byteContent: applyTitleToDocumentState(post.byteContent, title),
        title,
        order: count + 1,
        organizationId: member.organizationId,
      });
    });
  },
};
