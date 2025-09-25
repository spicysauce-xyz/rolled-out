import { GithubIntegrationService } from "@domain/github-integration";
import { GithubRepositoryService } from "@domain/github-repository";
import { err, ok } from "neverthrow";

export const addRepositoriesToIntegration = (
  installationId: number,
  repositories: {
    id: number;
    name: string;
    owner: string;
  }[]
) => {
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
