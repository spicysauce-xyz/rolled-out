import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { githubIntegration } from "./github-integration.model";

export const githubRepository = pgTable(
  "github_repository",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    integrationId: uuid("integration_id")
      .notNull()
      .references(() => githubIntegration.id, { onDelete: "cascade" }),

    repositoryId: text("repository_id").notNull(),
    name: text("name").notNull(),
    owner: text("owner").notNull(),
    mainBranch: text("main_branch"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.repositoryId, table.integrationId)]
);
