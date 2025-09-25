import { GithubIntegrationService } from "@domain/github-integration";

export const deleteGithubIntegration = (installationId: number) => {
  return GithubIntegrationService.deleteByInstallationId(installationId);
};
