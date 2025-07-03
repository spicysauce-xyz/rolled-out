import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { organization } from "./organization.model";

export const tag = pgTable(
  "tag",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .references(() => organization.id, { onDelete: "cascade" })
      .notNull(),

    label: text("label").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [unique().on(table.organizationId, table.label)]
);
