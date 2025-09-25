import { GithubIntegrationService } from "@domain/github-integration";
import type { InstallationDeletedEvent } from "@octokit/webhooks-types";

export const handleInstallationDeleted = (
  payload: InstallationDeletedEvent
) => {
  const installationId = payload.installation.id;

  return GithubIntegrationService.deleteByInstallationId(installationId);
};
