import type { Member, schema } from "@services/db";
import { Policy } from "@services/policy";
import { Queue } from "@services/queue";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { SchedulePostPublishJobs } from "./post.jobs";
import { PostsRepository } from "./post.repository";
import { applyTitleToDocumentState, isPostScheduled } from "./post.utils";

export const PostService = {
  createPost: (member: typeof schema.member.$inferSelect) => {
    const postData = {
      title: "Untitled Update",
      organizationId: member.organizationId,
    };

    const ability = Policy.defineAbilityForMember(member);

    return ability
      .can("create", "post", postData, {
        notAllowedErrorMessage: "You are not allowed to create a draft.",
      })
      .asyncAndThen(() => PostsRepository.getPostsCount(member.organizationId))
      .andThen((count) =>
        PostsRepository.createPost({
          ...postData,
          order: count + 1,
        })
      );
  },

  deletePostById: (member: Member, id: string) => {
    const ability = Policy.defineAbilityForMember(member);

    return PostsRepository.findPostById(id, member.organizationId)
      .andThrough((post) =>
        ability.can("delete", "post", post, {
          notAllowedErrorMessage: "You are not allowed to delete this post.",
        })
      )
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
    ]).andThen(([post, count]) => {
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
