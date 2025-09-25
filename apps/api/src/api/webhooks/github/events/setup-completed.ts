import { GithubIntegrationService } from "@domain/github-integration";
import { okAsync } from "neverthrow";

export const handleSetupCompleted = (
  organizationId: string,
  installationId: number
) => {
  return GithubIntegrationService.getByOrganizationId(
    organizationId
  ).andThrough((integration) => {
    if (!integration) {
      return GithubIntegrationService.create(organizationId, installationId);
    }
    return okAsync(integration);
  });
};
