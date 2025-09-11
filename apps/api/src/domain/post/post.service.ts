import type { Member } from "@services/db";
import { Policy } from "@services/policy";
import { Queue } from "@services/queue";
import { okAsync, ResultAsync } from "neverthrow";
import { SchedulePostPublishJobs } from "./post.jobs";
import { PostsRepository } from "./post.repository";
import { applyTitleToDocumentState, isPostScheduled } from "./post.utils";

export const PostService = {
  createPost(member: Member) {
    const postData = {
      title: "Untitled Update",
      organizationId: member.organizationId,
    };

    const ability = Policy.defineAbilityForMember(member);

    return ability
      .can("create", "post", postData)
      .asyncAndThen(() => PostsRepository.getPostsCount(member.organizationId))
      .andThen((count) =>
        PostsRepository.createPost({
          ...postData,
          order: count + 1,
        })
      );
  },

  deletePostById(member: Member, id: string) {
    const ability = Policy.defineAbilityForMember(member);

    return PostsRepository.findPostById(id)
      .andThrough((post) => ability.can("delete", "post", post))
      .andThrough((post) => {
        if (isPostScheduled(post)) {
          return Queue.remove(new SchedulePostPublishJobs(post, member));
        }

        return okAsync(post);
      })
      .andThen((post) => PostsRepository.deletePost(post.id));
  },

  findPostById(member: Member, id: string) {
    const ability = Policy.defineAbilityForMember(member);

    return PostsRepository.findPostById(id).andThrough((post) =>
      ability.can("read", "post", post)
    );
  },

  findPostsByOrganization(member: Member) {
    return PostsRepository.findPostsByOrganization(member.organizationId);
  },

  publishPostById(member: Member, id: string) {
    const ability = Policy.defineAbilityForMember(member);

    return PostsRepository.findPostById(id)
      .andThrough((post) => ability.can("publish", "post", post))
      .andThrough((post) => {
        if (isPostScheduled(post)) {
          return Queue.remove(new SchedulePostPublishJobs(post, member));
        }

        return okAsync(post);
      })
      .andThen((post) => PostsRepository.publishPost(post.id));
  },

  unpublishPostById(member: Member, id: string) {
    const ability = Policy.defineAbilityForMember(member);

    return PostsRepository.findPostById(id)
      .andThrough((post) => ability.can("unpublish", "post", post))
      .andThen((post) => PostsRepository.unpublishPost(post.id));
  },

  schedulePostById(member: Member, id: string, scheduledAt: Date) {
    const ability = Policy.defineAbilityForMember(member);

    return PostsRepository.findPostById(id)
      .andThrough((post) => ability.can("schedule", "post", post))
      .andThrough((post) => {
        if (isPostScheduled(post)) {
          return Queue.remove(new SchedulePostPublishJobs(post, member));
        }

        return okAsync(post);
      })
      .andThen((post) => PostsRepository.schedulePost(post.id, scheduledAt))
      .andThrough((post) => {
        if (isPostScheduled(post)) {
          return Queue.add(new SchedulePostPublishJobs(post, member));
        }

        return okAsync(post);
      });
  },

  unschedulePostById(member: Member, id: string) {
    const ability = Policy.defineAbilityForMember(member);

    return PostsRepository.findPostById(id)
      .andThrough((post) => ability.can("unschedule", "post", post))
      .andThrough((post) => {
        if (isPostScheduled(post)) {
          return Queue.remove(new SchedulePostPublishJobs(post, member));
        }

        return okAsync(post);
      })
      .andThen((post) => PostsRepository.unschedulePost(post.id));
  },

  duplicatePostById(member: Member, id: string) {
    const ability = Policy.defineAbilityForMember(member);

    return ResultAsync.combine([
      PostsRepository.findPostById(id),
      PostsRepository.getPostsCount(member.organizationId),
    ])
      .andThrough(([post]) => ability.can("duplicate", "post", post))
      .andThen(([post, count]) => {
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
