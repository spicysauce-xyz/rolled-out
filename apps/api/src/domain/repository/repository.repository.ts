import { Database, schema } from "@services/db";
import { eq } from "drizzle-orm";
import { err, ok, ResultAsync } from "neverthrow";

export const RepositoryRepository = {
  getGithubIntegrationByOrganizationId: (organizationId: string) => {
    return ResultAsync.fromPromise(
      Database.query.githubIntegration.findFirst({
        where: eq(schema.githubIntegration.organizationId, organizationId),
      }),
      () => new Error("Failed to get github integration by organization id")
    ).andThen((integration) => {
      if (!integration) {
        return err(new Error("GitHub integration not found"));
      }
      return ok(integration);
    });
  },
  getGithubRepositoryById: (repositoryId: string) => {
    return ResultAsync.fromPromise(
      Database.query.githubRepository.findFirst({
        where: eq(schema.githubRepository.id, repositoryId),
      }),
      () => new Error("Failed to get github repository by id")
    ).andThen((repository) => {
      if (!repository) {
        return err(new Error("GitHub repository not found"));
      }
      return ok(repository);
    });
  },
  getRepositoriesByIntegrationId: (integrationId: string) => {
    return ResultAsync.fromPromise(
      Database.query.githubRepository.findMany({
        where: eq(schema.githubRepository.integrationId, integrationId),
        columns: {
          id: true,
          name: true,
          owner: true,
          mainBranch: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      () => new Error("Failed to get repositories by integration id")
    );
  },
};
