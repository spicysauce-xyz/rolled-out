import type { schema } from "@database";
import { QueueService } from "@lib/queue";
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
      async (post) => {
        if (post?.status === status) {
          return okAsync(post);
        }

        try {
          // If the post is being manually published or changed to draft, 
          // and it has a scheduled job, cancel that job
          if ((status === "published" || status === "draft") && post?.scheduleJobId) {
            await QueueService.removeScheduledJob(post.scheduleJobId);
          }

          const updatedPost = await PostsRepository.updatePostStatus(
            id,
            member.organizationId,
            status
          );

          // Clear schedule data if status is changed to published or draft
          if ((status === "published" || status === "draft") && post?.scheduleJobId) {
            await PostsRepository.clearScheduleData(id, member.organizationId);
          }

          return updatedPost;
        } catch (error) {
          throw new Error(`Failed to update post status: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );
  },

  schedulePost: (
    member: { organizationId: string },
    id: string,
    scheduledAt: Date
  ) => {
    return PostsRepository.findPostById(id, member.organizationId).andThen(
      async (post) => {
        if (post?.status === "scheduled" && post?.scheduledAt?.getTime() === scheduledAt.getTime()) {
          return okAsync(post);
        }

        try {
          // If there's an existing job, remove it
          if (post?.scheduleJobId) {
            await QueueService.removeScheduledJob(post.scheduleJobId);
          }

          // Create new scheduled job
          const jobId = await QueueService.schedulePost(
            id,
            member.organizationId,
            scheduledAt
          );

          // Update post with schedule data and job ID
          return PostsRepository.schedulePost(
            id,
            member.organizationId,
            scheduledAt,
            jobId
          );
        } catch (error) {
          throw new Error(`Failed to schedule post: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    );
  },
};
