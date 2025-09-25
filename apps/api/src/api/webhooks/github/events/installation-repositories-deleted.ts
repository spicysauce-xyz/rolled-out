import { GithubIntegrationService } from "@domain/github-integration";
import { GithubRepositoryService } from "@domain/github-repository";
import type { InstallationRepositoriesRemovedEvent } from "@octokit/webhooks-types";
import { err, ok } from "neverthrow";

export const handleInstallationRepositoriesRemoved = (
  payload: InstallationRepositoriesRemovedEvent
) => {
  const installationId = payload.installation.id;
  const repositories = (payload.repositories_removed || []).map(
    (repository) => ({
      id: repository.id,
    })
  );

  return GithubIntegrationService.getByInstallationId(installationId)
    .andThen((integration) => {
      if (!integration) {
        return err(new Error("GitHub integration not found"));
      }
      return ok(integration);
    })
    .andThen((integration) =>
      GithubRepositoryService.deleteMultiple(integration.id, repositories)
    );
};
