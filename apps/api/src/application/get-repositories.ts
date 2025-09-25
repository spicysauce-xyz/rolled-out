import { err, ok } from "neverthrow";
import { GithubIntegrationService } from "../domain/github-integration";
import { GithubRepositoryService } from "../domain/github-repository";
import type { Member } from "../services/db";

export const getRepositories = (member: Member) => {
  return GithubIntegrationService.getByMember(member)
    .andThen((integration) => {
      if (!integration) {
        return err(new Error("GitHub integration not found"));
      }
      return ok(integration);
    })
    .andThen((integration) =>
      GithubRepositoryService.getByIntegrationId(integration.id)
    );
};
