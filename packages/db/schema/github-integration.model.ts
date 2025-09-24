import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { organization } from "./organization.model";

export const githubIntegration = pgTable(
  "github_integration",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),

    installationId: text("installation_id").notNull().unique(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("unique_installation_id").on(
      table.installationId,
      table.organizationId
    ),
  ]
);
