import { okAsync } from "neverthrow";
import { GithubIntegrationService } from "../domain/github-integration";
import { GithubPendingCommitService } from "../domain/github-pending-commit";
import type { Member } from "../services/db";

export const getPendingCommits = (member: Member) => {
  return GithubIntegrationService.getByMember(member).andThen((integration) => {
    if (!integration) {
      return okAsync([]);
    }

    return GithubPendingCommitService.getByIntegrationId(integration.id);
  });
};
