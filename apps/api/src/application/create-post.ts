import { err, ok, okAsync, ResultAsync } from "neverthrow";
import { EditorService } from "../domain/editor";
import { GithubIntegrationService } from "../domain/github-integration";
import { GithubPendingCommitService } from "../domain/github-pending-commit";
import { PostService } from "../domain/post";
import { createYJSDocumentFromSchema } from "../domain/post/post.utils";
import { AI } from "../services/ai";
import type { Member, PostInsert } from "../services/db";
import { Github } from "../services/github";

const createByteContentFromGithubIds = (
  member: Member,
  githubIds: string[]
) => {
  return GithubIntegrationService.getByMember(member)
    .andThen((integration) => {
      if (!integration) {
        return err(new Error("GitHub integration not found"));
      }

      return ok(integration);
    })
    .andThen((integration) =>
      Github.getCommitsContentByIds(
        Number(integration.installationId),
        githubIds
      )
    )
    .andThen((commits) => AI.generatePostContentFromGithubCommits(commits))
    .map((content) => createYJSDocumentFromSchema(content));
};

const deletePendingCommits = (member: Member) => {
  return GithubIntegrationService.getByMember(member)
    .andThen((integration) => {
      if (!integration) {
        return err(new Error("GitHub integration not found"));
      }
      return ok(integration);
    })
    .andThen((integration) =>
      GithubPendingCommitService.deleteByIntegrationId(integration.id)
    );
};

export const createPost = (member: Member, githubIds?: string[]) => {
  const postData: PostInsert = {
    title: "Untitled Update",
    organizationId: member.organizationId,
    byteContent: null,
  };

  const isFromGithub = githubIds && githubIds.length > 0;

  const postDataResult = isFromGithub
    ? createByteContentFromGithubIds(member, githubIds).map((byteContent) => {
        const postDataWithByteContent: PostInsert = {
          ...postData,
          byteContent,
        };

        return postDataWithByteContent;
      })
    : okAsync(postData);

  return postDataResult
    .andThen((data) => PostService.create(member, data))
    .andThrough((post) =>
      ResultAsync.combine([
        EditorService.createEditor(post.id, member.id, "creator"),
        deletePendingCommits(member),
      ])
    );
};
