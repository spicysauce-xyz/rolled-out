import { Database, schema } from "@services/db";
import { eq } from "drizzle-orm";
import { err, ok, ResultAsync } from "neverthrow";

export const GithubRepositoryRepository = {
  create: (data: typeof schema.githubRepository.$inferInsert) => {
    return ResultAsync.fromPromise(
      Database.insert(schema.githubRepository)
        .values(data)
        .returning()
        .onConflictDoNothing(),
      () => new Error("Failed to create github repository")
    );
  },
  getById: (repositoryId: string) => {
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
  getByIntegrationId: (integrationId: string) => {
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
