import { GithubPendingCommitRepository } from "./github-pending-commit.repository";

export const GithubPendingCommitService = {
  create: (data: {
    commitId: string;
    integrationId: string;
    objectId: string;
  }) => {
    return GithubPendingCommitRepository.create({
      commitId: data.commitId,
      integrationId: data.integrationId,
      objectId: data.objectId,
    });
  },
  getByIntegrationId: (integrationId: string) => {
    return GithubPendingCommitRepository.getByIntegrationId(integrationId);
  },
  deleteByIntegrationId: (integrationId: string) => {
    return GithubPendingCommitRepository.deleteByIntegrationId(integrationId);
  },
};
