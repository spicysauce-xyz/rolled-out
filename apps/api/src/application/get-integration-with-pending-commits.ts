import { err, ok } from "neverthrow";
import { GithubIntegrationService } from "../domain/github-integration";
import { GithubPendingCommitService } from "../domain/github-pending-commit";
import type { Member } from "../services/db";

export const getIntegrationWithPendingCommits = (member: Member) => {
  return GithubIntegrationService.getByMember(member)
    .andThen((integration) => {
      if (!integration) {
        return err(new Error("GitHub integration not found"));
      }
      return ok(integration);
    })
    .andThen((integration) => {
      return GithubPendingCommitService.getByIntegrationId(integration.id).map(
        (pendingCommits) => ({
          integration,
          pendingCommits,
        })
      );
    });
};
