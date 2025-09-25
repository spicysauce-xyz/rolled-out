import type { Organization } from "@services/db";
import { Github } from "@services/github";
import { err, ok, ResultAsync } from "neverthrow";
import { RepositoryRepository } from "./repository.repository";

export const RepositoryService = {
  getRepositories: (organization: Organization) => {
    return RepositoryRepository.getGithubIntegrationByOrganizationId(
      organization.id
    )
      .map((integration) => integration.id)
      .andThen((integrationId) =>
        RepositoryRepository.getRepositoriesByIntegrationId(integrationId)
      );
  },
  getCommits: (
    organization: Organization,
    repositoryId: string,
    cursor?: string
  ) => {
    return ResultAsync.combine([
      RepositoryRepository.getGithubIntegrationByOrganizationId(
        organization.id
      ),
      RepositoryRepository.getGithubRepositoryById(repositoryId),
    ])
      .andThen(([githubIntegration, githubRepository]) => {
        if (!githubRepository.mainBranch) {
          return err(new Error("GitHub repository main branch not found"));
        }
        return ok([githubIntegration, githubRepository] as const);
      })
      .andThen(([githubIntegration, githubRepository]) =>
        Github.getCommitsFromRepository(
          Number(githubIntegration.installationId),
          githubRepository.owner,
          githubRepository.name,
          githubRepository.mainBranch as string,
          { cursor }
        )
      );
  },

  createPendingCommit: (data: {
    commitId: string;
    integrationId: string;
    objectId: string;
  }) => {
    return RepositoryRepository.createPendingCommit({
      commitId: data.commitId,
      integrationId: data.integrationId,
      objectId: data.objectId,
    });
  },

  deletePendingCommitsByIntegrationId: (integrationId: string) => {
    return RepositoryRepository.deletePendingCommitsByIntegrationId(
      integrationId
    );
  },
};
