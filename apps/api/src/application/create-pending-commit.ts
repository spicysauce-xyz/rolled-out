import { GithubIntegrationService } from "@domain/github-integration";
import { GithubPendingCommitService } from "@domain/github-pending-commit";
import { Github } from "@services/github";
import { err, ok, okAsync, ResultAsync } from "neverthrow";

export const createPendingCommit = (
  commitId: string,
  installationId: number,
  owner: string,
  repo: string
) => {
  return GithubIntegrationService.getByInstallationId(installationId)
    .andThen((integration) => {
      if (!integration) {
        return err(new Error("GitHub integration not found"));
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
