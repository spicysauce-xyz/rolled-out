// biome-ignore lint/performance/noNamespaceImport: i might fix this later
import * as dbSchema from "@mono/db";
import { Config } from "@services/config";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { drizzle, type NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";

export const schema = dbSchema;

export const Database = drizzle({
  connection: Config.database.url,
  schema,
});

export type DatabaseTransaction = PgTransaction<
  NodePgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

export type Post = typeof schema.post.$inferSelect;
export type PostInsert = typeof schema.post.$inferInsert;

export type Editor = typeof schema.editor.$inferSelect;
export type EditorInsert = typeof schema.editor.$inferInsert;

export type Member = typeof schema.member.$inferSelect;
export type MemberInsert = typeof schema.member.$inferInsert;

export type User = typeof schema.user.$inferSelect;
export type UserInsert = typeof schema.user.$inferInsert;

export type Invitation = typeof schema.invitation.$inferSelect;
export type InvitationInsert = typeof schema.invitation.$inferInsert;

export type Organization = typeof schema.organization.$inferSelect;
export type OrganizationInsert = typeof schema.organization.$inferInsert;

export type GithubPendingCommit =
  typeof schema.githubPendingCommit.$inferSelect;
export type GithubPendingCommitInsert =
  typeof schema.githubPendingCommit.$inferInsert;
