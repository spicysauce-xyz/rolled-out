import { GithubIntegrationService } from "@domain/github-integration";
import { GithubPendingCommitService } from "@domain/github-pending-commit";
import { GithubRepositoryService } from "@domain/github-repository";
import type { PushEvent } from "@octokit/webhooks-types";
import { Github } from "@services/github";
import { err, ok, okAsync, ResultAsync } from "neverthrow";

export const handlePush = (payload: PushEvent) => {
  const installation = payload.installation;
  const headCommit = payload.head_commit;

  if (!(headCommit && installation)) {
    return err(new Error("Head commit or installation not found"));
  }

  const commitId = headCommit.id;
  const installationId = installation.id;
  const owner = payload.repository.owner.login;
  const repo = payload.repository.name;
  const ref = payload.ref;

  return ResultAsync.combine([
    GithubIntegrationService.getByInstallationId(installationId),
    GithubRepositoryService.getByOwnerAndName(owner, repo),
  ])
    .andThen(([integration, repository]) => {
      if (!integration) {
        return err(new Error("GitHub integration not found"));
      }

      if (!repository) {
        return err(new Error("Repository not found"));
      }

      if (`refs/heads/${repository.mainBranch}` !== ref) {
        return err(new Error("Repository main branch does not match ref"));
      }

      return ok(integration);
    })
    .andThen((integration) =>
      ResultAsync.combine([
        Github.getCommitById(installationId, commitId, owner, repo),
        okAsync(integration),
      ])
    )
    .andThen(([commit, integration]) => {
      if (!commit) {
        return err(new Error("Commit not found"));
      }
      return ok([commit, integration] as const);
    })
    .andThen(([commit, integration]) => {
      const id = "commitId" in commit ? commit.commitId : commit.prId;

      return GithubPendingCommitService.create({
        commitId,
        integrationId: integration.id,
        objectId: id as string,
      });
    })
    .andThen((pendingCommit) => {
      if (!pendingCommit) {
        return err(new Error("Failed to create pending commit"));
      }
      return okAsync(pendingCommit);
    });
};
