import { Github } from "@services/github";
import { err, ok, ResultAsync } from "neverthrow";
import { GithubRepositoryRepository } from "./github-repository.repository";

export const GithubRepositoryService = {
  getById: (repositoryId: string) => {
    return GithubRepositoryRepository.getById(repositoryId);
  },
  getByIntegrationId: (integrationId: string) => {
    return GithubRepositoryRepository.getByIntegrationId(integrationId);
  },
  create: (data: {
    integrationId: string;
    repositoryId: string;
    name: string;
    owner: string;
    mainBranch: string;
  }) => {
    return GithubRepositoryRepository.create({
      integrationId: data.integrationId,
      repositoryId: data.repositoryId,
      name: data.name,
      owner: data.owner,
      mainBranch: data.mainBranch,
    });
  },
  createMultiple: (
    integrationId: string,
    installationId: number,
    repositories: {
      id: number;
      name: string;
      owner: string;
    }[]
  ) => {
    return ResultAsync.combine(
      repositories.map((repository) => {
        return Github.getRepositoryBaseBranch(
          installationId,
          repository.owner,
          repository.name
        ).andThen((baseBranch) =>
          GithubRepositoryRepository.create({
            integrationId,
            repositoryId: String(repository.id),
            name: repository.name,
            owner: repository.owner,
            mainBranch: baseBranch,
          })
        );
      })
    );
  },
  getCommits: (
    installationId: number,
    repositoryId: string,
    cursor?: string
  ) => {
    return GithubRepositoryRepository.getById(repositoryId)
      .andThen((githubRepository) => {
        if (!githubRepository.mainBranch) {
          return err(new Error("GitHub repository main branch not found"));
        }
        return ok(githubRepository);
      })
      .andThen((githubRepository) =>
        Github.getCommitsFromRepository(
          installationId,
          githubRepository.owner,
          githubRepository.name,
          githubRepository.mainBranch as string,
          { cursor }
        )
      );
  },
};
