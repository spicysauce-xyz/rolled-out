import { AI } from "@services/ai";
import { Database, type Member, schema } from "@services/db";
import { Github } from "@services/github";
import { Policy } from "@services/policy";
import { Queue } from "@services/queue";
import { eq } from "drizzle-orm";
import { err, ok, okAsync, ResultAsync } from "neverthrow";
import { SchedulePostPublishJobs } from "./post.jobs";
import { PostsRepository } from "./post.repository";
import {
  applyTitleToDocumentState,
  createYJSDocumentFromSchema,
  isPostScheduled,
} from "./post.utils";

export const PostService = {
  createBlankPost(member: Member) {
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

  createPostFromGithubCommit(member: Member, ids: string[]) {
    const postData = {
      title: "Untitled Update",
      organizationId: member.organizationId,
    };

    const ability = Policy.defineAbilityForMember(member);

    return ability
      .can("create", "post", postData)
      .asyncAndThen(() =>
        ResultAsync.fromPromise(
          Database.query.githubIntegration.findFirst({
            where: eq(
              schema.githubIntegration.organizationId,
              member.organizationId
            ),
          }),
          (error) =>
            new Error("Failed to get github integration", { cause: error })
        )
      )
      .andThen((integration) => {
        if (!integration) {
          return err(new Error("GitHub integration not found"));
        }

        return ok(integration);
      })
      .andThen((integration) =>
        ResultAsync.combine([
          PostsRepository.getPostsCount(member.organizationId),
          Github.getCommitsContentByIds(
            Number(integration.installationId),
            ids
          ).andThen((commits) =>
            AI.generatePostContentFromGithubCommits(commits)
          ),
        ])
      )
      .andThen(([count, content]) => {
        return PostsRepository.createPost({
          ...postData,
          order: count + 1,
          byteContent: createYJSDocumentFromSchema(content),
          title: content.title,
        });
      });
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
