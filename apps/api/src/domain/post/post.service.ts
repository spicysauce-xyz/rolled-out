import type { Member, PostInsert } from "@services/db";
import { Policy } from "@services/policy";
import { Queue } from "@services/queue";
import { okAsync } from "neverthrow";
import { SchedulePostPublishJobs } from "./post.jobs";
import { PostsRepository } from "./post.repository";
import { isPostScheduled } from "./post.utils";

export const PostService = {
  findPostById(member: Member, id: string) {
    const ability = Policy.defineAbilityForMember(member);

    return PostsRepository.findPostById(id).andThrough((post) =>
      ability.can("read", "post", post)
    );
  },

  findPostsByOrganization(member: Member) {
    const ability = Policy.defineAbilityForMember(member);

    return PostsRepository.findPostsByOrganization(member.organizationId).map(
      (posts) => {
        return posts.filter((post) => {
          return ability.can("read", "post", post).isOk();
        });
      }
    );
  },

  create(member: Member, data: PostInsert) {
    const ability = Policy.defineAbilityForMember(member);

    return ability
      .can("create", "post", data)
      .asyncAndThen(() => PostsRepository.getPostsCount(member.organizationId))
      .andThen((count) =>
        PostsRepository.createPost({
          ...data,
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
          return Queue.remove(
            SchedulePostPublishJobs.queue,
            SchedulePostPublishJobs.id(post)
          );
        }

        return okAsync(post);
      })
      .andThen((post) => PostsRepository.deletePost(post.id));
  },

  publishPostById(member: Member, id: string) {
    const ability = Policy.defineAbilityForMember(member);

    return PostsRepository.findPostById(id)
      .andThrough((post) => ability.can("publish", "post", post))
      .andThrough((post) => {
        if (isPostScheduled(post)) {
          return Queue.remove(
            SchedulePostPublishJobs.queue,
            SchedulePostPublishJobs.id(post)
          );
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
          return Queue.remove(
            SchedulePostPublishJobs.queue,
            SchedulePostPublishJobs.id(post)
          );
        }

        return okAsync(post);
      })
      .andThen((post) => PostsRepository.schedulePost(post.id, scheduledAt))
      .andThrough((post) => {
        if (isPostScheduled(post)) {
          return Queue.add(
            SchedulePostPublishJobs.queue,
            new SchedulePostPublishJobs(post, member)
          );
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
          return Queue.remove(
            SchedulePostPublishJobs.queue,
            SchedulePostPublishJobs.id(post)
          );
        }

        return okAsync(post);
      })
      .andThen((post) => PostsRepository.unschedulePost(post.id));
  },
};
