import { Database, type GithubPendingCommitInsert, schema } from "@services/db";
import { eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";
import { DatabaseError } from "pg";

export const GithubPendingCommitRepository = {
  create: (data: GithubPendingCommitInsert) => {
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
  getByIntegrationId: (integrationId: string) => {
    return ResultAsync.fromPromise(
      Database.query.githubPendingCommit.findMany({
        where: eq(schema.githubPendingCommit.integrationId, integrationId),
      }),
      () => new Error("Failed to get github pending commits by integration id")
    );
  },
  deleteByIntegrationId: (integrationId: string) => {
    return ResultAsync.fromPromise(
      Database.delete(schema.githubPendingCommit)
        .where(eq(schema.githubPendingCommit.integrationId, integrationId))
        .returning(),
      () => new Error("Failed to delete pending commits by integration id")
    );
  },
};
