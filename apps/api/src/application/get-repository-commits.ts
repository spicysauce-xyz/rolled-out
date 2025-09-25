import { GithubIntegrationService } from "@domain/github-integration";
import { GithubRepositoryService } from "@domain/github-repository";
import type { Member } from "@services/db";
import { err, ok, ResultAsync } from "neverthrow";

export const getRepositoryCommits = (
  member: Member,
  repositoryId: string,
  cursor?: string
) => {
  return ResultAsync.combine([
    GithubIntegrationService.getByMember(member).andThen((integration) => {
      if (!integration) {
        return err(new Error("GitHub integration not found"));
      }
      return ok(integration);
    }),
    GithubRepositoryService.getById(repositoryId),
  ]).andThen(([githubIntegration]) =>
    GithubRepositoryService.getCommits(
      Number(githubIntegration.installationId),
      repositoryId,
      cursor
    )
  );
};
