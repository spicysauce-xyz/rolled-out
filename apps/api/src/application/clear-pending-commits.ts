import { GithubIntegrationService } from "@domain/github-integration";
import { GithubPendingCommitService } from "@domain/github-pending-commit";
import type { Member } from "@services/db";
import { err, ok } from "neverthrow";

export const clearPendingCommits = (member: Member) => {
  return GithubIntegrationService.getByMember(member)
    .andThen((integration) => {
      if (!integration) {
        return err(new Error("GitHub integration not found"));
      }
      return ok(integration);
    })
    .andThen((integration) =>
      GithubPendingCommitService.deleteByIntegrationId(integration.id)
    );
};
