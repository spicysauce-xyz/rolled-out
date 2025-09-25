import { GithubIntegrationService } from "@domain/github-integration";
import { GithubRepositoryService } from "@domain/github-repository";
import type { InstallationCreatedEvent } from "@octokit/webhooks-types";
import { err, ok } from "neverthrow";

export const handleInstallationCreated = (
  payload: InstallationCreatedEvent
) => {
  const installationId = payload.installation.id;
  const repositories = (payload.repositories || []).map((repository) => ({
    id: repository.id,
    name: repository.name,
    owner: payload.installation.account.login,
  }));

  return GithubIntegrationService.getByInstallationId(installationId)
    .andThen((integration) => {
      if (!integration) {
        return err(new Error("GitHub integration not found"));
      }
      return ok(integration);
    })
    .andThen((integration) =>
      GithubRepositoryService.createMultiple(
        integration.id,
        installationId,
        repositories
      )
    );
};
