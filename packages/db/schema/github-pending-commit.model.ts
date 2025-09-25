import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { githubIntegration } from "./github-integration.model";

export const githubPendingCommit = pgTable(
  "github_pending_commit",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    integrationId: uuid("integration_id")
      .notNull()
      .references(() => githubIntegration.id, { onDelete: "cascade" }),

    commitId: text("commit_id").notNull(),
    objectId: text("object_id").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.commitId, table.integrationId)]
);
