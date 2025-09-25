import { GithubIntegrationService } from "@domain/github-integration";
import type { Member } from "@services/db";
import { okAsync } from "neverthrow";

export const setupGithubIntegration = (
  member: Member,
  installationId: number
) => {
  return GithubIntegrationService.getByMember(member).andThrough(
    (integration) => {
      if (!integration) {
        return GithubIntegrationService.create(member, installationId);
      }
      return okAsync(integration);
    }
  );
};
