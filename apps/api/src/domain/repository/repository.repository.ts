import { Database, type GithubPendingCommitInsert, schema } from "@services/db";
import { eq } from "drizzle-orm";
import { err, ok, ResultAsync } from "neverthrow";
import { DatabaseError } from "pg";

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
  createPendingCommit: (data: GithubPendingCommitInsert) => {
    return ResultAsync.fromPromise(
      Database.insert(schema.githubPendingCommit).values(data).returning(),
      (error) => {
        if (
          error instanceof DatabaseError &&
          error.constraint ===
            "github_pending_commit_commit_id_integration_id_unique"
        ) {
          return new Error("Pending commit already exists", { cause: error });
        }
        return new Error("Failed to create pending commit", { cause: error });
      }
    );
  },
  deletePendingCommitsByIntegrationId: (integrationId: string) => {
    return ResultAsync.fromPromise(
      Database.delete(schema.githubPendingCommit).where(
        eq(schema.githubPendingCommit.integrationId, integrationId)
      ),
      () => new Error("Failed to delete pending commits by integration id")
    );
  },
};
