import { Database, schema } from "@services/db";
import { eq } from "drizzle-orm";
import { ResultAsync } from "neverthrow";

export const GithubIntegrationRepository = {
  create: (data: typeof schema.githubIntegration.$inferInsert) => {
    return ResultAsync.fromPromise(
      Database.insert(schema.githubIntegration)
        .values(data)
        .returning()
        .onConflictDoNothing(),
      () => new Error("Failed to create github integration")
    );
  },
  getByOrganizationId: (organizationId: string) => {
    return ResultAsync.fromPromise(
      Database.query.githubIntegration.findFirst({
        where: eq(schema.githubIntegration.organizationId, organizationId),
      }),
      () => new Error("Failed to get github integration by organization id")
    );
  },
  getByInstallationId: (installationId: number) => {
    return ResultAsync.fromPromise(
      Database.query.githubIntegration.findFirst({
        where: eq(
          schema.githubIntegration.installationId,
          installationId.toString()
        ),
      }),
      () => new Error("Failed to get github integration by installation id")
    );
  },
  deleteByInstallationId: (installationId: number) => {
    return ResultAsync.fromPromise(
      Database.delete(schema.githubIntegration)
        .where(
          eq(schema.githubIntegration.installationId, installationId.toString())
        )
        .returning(),
      () => new Error("Failed to delete github integration by installation id")
    );
  },
};
